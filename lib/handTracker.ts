import {
  FilesetResolver,
  HandLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

const WASM_CDN =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

// Landmark indices (MediaPipe hand model)
const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const THUMB_IP = 3;
const INDEX_PIP = 6;
const MIDDLE_PIP = 10;
const RING_PIP = 14;
const PINKY_PIP = 18;
const PINKY_MCP = 17;

// Skeletal connection joints map
const CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm base connection perimeter
  [5, 9], [9, 13], [13, 17]
];

// Pinch hysteresis: thumb–index distance relative to hand size
const PINCH_ON = 0.32;
const PINCH_OFF = 0.45;

// How strongly hand movement rotates the orb (radians per normalized unit)
const ROTATE_SPEED = 5.0;
// Smoothing factor for grab-point tracking (0..1, higher = snappier)
const SMOOTHING = 0.4;

export type GestureType = "grab" | "open_palm" | "index_point" | "thumbs_up" | "peace" | "unknown";
export type GestureMode = "idle" | "spin" | "zoom";

export interface TrackerStatus {
  hands: number;
  mode: GestureMode;
}

export interface HandTrackerCallbacks {
  /** Called when a single pinched hand drags: deltas in mirrored normalized coords. */
  onRotate(deltaTheta: number, deltaPhi: number): void;
  /** Called when both hands pinch and spread/close: multiply camera distance by factor. */
  onZoom(factor: number): void;
  onStatus(status: TrackerStatus): void;
  /** Called when a full-hand gesture is detected with high stability confidence. */
  onGesture(gesture: GestureType, handLabel: string): void;
  /** Raycast laser targeting pointer callback. */
  onPointerMove(x: number, y: number, active: boolean): void;
}

interface Point {
  x: number;
  y: number;
}

interface HandState {
  pinching: boolean;
  grab: Point; // smoothed pinch midpoint, mirrored
  currentGesture: GestureType;
  gestureCounter: number;
  lastEmittedGesture: GestureType;
}

export class HandTracker {
  private video: HTMLVideoElement;
  private overlay: HTMLCanvasElement;
  private callbacks: HandTrackerCallbacks;
  private landmarker: HandLandmarker | null = null;
  private stream: MediaStream | null = null;
  private rafId = 0;
  private running = false;
  private lastVideoTime = -1;

  // keyed by handedness label so state survives re-ordering between frames
  private handStates = new Map<string, HandState>();
  private prevMode: GestureMode = "idle";
  private prevSpinGrab: Point | null = null;
  private prevZoomDist: number | null = null;
  private lastStatus: TrackerStatus = { hands: 0, mode: "idle" };

  // Theme support for the skeletal HUD overlay
  private activeThemeColor = "#ffaa30";
  private activeThemeColorLine = "rgba(255, 170, 48, 0.45)";

  constructor(
    video: HTMLVideoElement,
    overlay: HTMLCanvasElement,
    callbacks: HandTrackerCallbacks,
  ) {
    this.video = video;
    this.overlay = overlay;
    this.callbacks = callbacks;
  }

  setThemeColor(theme: "ultron" | "jarvis"): void {
    if (theme === "ultron") {
      this.activeThemeColor = "#ffaa30";
      this.activeThemeColorLine = "rgba(255, 170, 48, 0.45)";
    } else {
      this.activeThemeColor = "#00f0ff";
      this.activeThemeColorLine = "rgba(0, 240, 255, 0.45)";
    }
  }

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: "user" },
      audio: false,
    });
    this.video.srcObject = this.stream;
    await this.video.play();

    const fileset = await FilesetResolver.forVisionTasks(WASM_CDN);
    const options = {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" as const },
      runningMode: "VIDEO" as const,
      numHands: 2,
      minHandDetectionConfidence: 0.6,
      minHandPresenceConfidence: 0.6,
      minTrackingConfidence: 0.6,
    };
    try {
      this.landmarker = await HandLandmarker.createFromOptions(fileset, options);
    } catch {
      // Some browsers/GPUs reject the GPU delegate — fall back to CPU
      this.landmarker = await HandLandmarker.createFromOptions(fileset, {
        ...options,
        baseOptions: { ...options.baseOptions, delegate: "CPU" as const },
      });
    }

    this.running = true;
    this.loop();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.landmarker?.close();
    this.landmarker = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.video.srcObject = null;
    this.handStates.clear();
    this.prevMode = "idle";
    this.prevSpinGrab = null;
    this.prevZoomDist = null;
    const ctx = this.overlay.getContext("2d");
    ctx?.clearRect(0, 0, this.overlay.width, this.overlay.height);
    this.emitStatus({ hands: 0, mode: "idle" });
  }

  private loop = () => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.loop);

    if (!this.landmarker || this.video.readyState < 2) return;
    if (this.video.currentTime === this.lastVideoTime) return;
    this.lastVideoTime = this.video.currentTime;

    const result = this.landmarker.detectForVideo(this.video, performance.now());
    this.processHands(result.landmarks, result.handedness.map((h) => h[0]?.categoryName ?? "?"));
    this.drawOverlay(result.landmarks);
  };

  private processHands(
    landmarks: NormalizedLandmark[][],
    labels: string[],
  ): void {
    const pinchedGrabs: Point[] = [];
    const seen = new Set<string>();

    landmarks.forEach((lm, i) => {
      const label = labels[i];
      seen.add(label);

      const handScale = dist2d(lm[WRIST], lm[MIDDLE_MCP]);
      if (handScale < 1e-6) return;
      const pinchRatio = dist2d(lm[THUMB_TIP], lm[INDEX_TIP]) / handScale;

      // Mirrored so hand-right = screen-right from the user's perspective
      const raw: Point = {
        x: 1 - (lm[THUMB_TIP].x + lm[INDEX_TIP].x) / 2,
        y: (lm[THUMB_TIP].y + lm[INDEX_TIP].y) / 2,
      };

      let state = this.handStates.get(label);
      if (!state) {
        state = {
          pinching: false,
          grab: raw,
          currentGesture: "unknown",
          gestureCounter: 0,
          lastEmittedGesture: "unknown",
        };
        this.handStates.set(label, state);
      }

      // Hysteresis so the pinch doesn't flicker on/off at the threshold
      if (state.pinching && pinchRatio > PINCH_OFF) state.pinching = false;
      else if (!state.pinching && pinchRatio < PINCH_ON) state.pinching = true;

      state.grab = {
        x: state.grab.x + (raw.x - state.grab.x) * SMOOTHING,
        y: state.grab.y + (raw.y - state.grab.y) * SMOOTHING,
      };

      if (state.pinching) pinchedGrabs.push(state.grab);

      // Determine advanced skeletal gesture
      const indexExt = dist2d(lm[INDEX_TIP], lm[WRIST]) > dist2d(lm[INDEX_PIP], lm[WRIST]) * 1.05;
      const middleExt = dist2d(lm[12], lm[WRIST]) > dist2d(lm[MIDDLE_PIP], lm[WRIST]) * 1.05;
      const ringExt = dist2d(lm[16], lm[WRIST]) > dist2d(lm[RING_PIP], lm[WRIST]) * 1.05;
      const pinkyExt = dist2d(lm[20], lm[WRIST]) > dist2d(lm[PINKY_PIP], lm[WRIST]) * 1.05;
      const thumbExt = dist2d(lm[THUMB_TIP], lm[WRIST + 5]) > handScale * 0.55; // WRIST + 5 is 5 (index mcp)

      let gesture: GestureType = "unknown";
      if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
        if (thumbExt) {
          gesture = "thumbs_up";
        } else {
          gesture = "grab";
        }
      } else if (indexExt && middleExt && ringExt && pinkyExt && thumbExt) {
        gesture = "open_palm";
      } else if (indexExt && !middleExt && !ringExt && !pinkyExt) {
        gesture = "index_point";
      } else if (indexExt && middleExt && !ringExt && !pinkyExt) {
        gesture = "peace";
      }

      // Debounce gesture states with a counter of 5 frames
      if (gesture === state.currentGesture) {
        state.gestureCounter++;
        if (state.gestureCounter >= 5) {
          if (state.lastEmittedGesture !== gesture) {
            state.lastEmittedGesture = gesture;
            this.callbacks.onGesture(gesture, label);
          }
        }
      } else {
        state.currentGesture = gesture;
        state.gestureCounter = 0;
      }
    });

    // Drop state for hands that left the frame
    for (const key of this.handStates.keys()) {
      if (!seen.has(key)) this.handStates.delete(key);
    }

    // Default mode calculation based on pinch counts
    const mode: GestureMode =
      pinchedGrabs.length >= 2 ? "zoom" : pinchedGrabs.length === 1 ? "spin" : "idle";

    // Reset reference points on any mode change to avoid jumps
    if (mode !== this.prevMode) {
      this.prevSpinGrab = null;
      this.prevZoomDist = null;
      this.prevMode = mode;
    }

    if (mode === "spin") {
      const grab = pinchedGrabs[0];
      if (this.prevSpinGrab) {
        const dx = grab.x - this.prevSpinGrab.x;
        const dy = grab.y - this.prevSpinGrab.y;
        if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4) {
          this.callbacks.onRotate(dx * ROTATE_SPEED, dy * ROTATE_SPEED);
        }
      }
      this.prevSpinGrab = grab;
    } else if (mode === "zoom") {
      const d = Math.hypot(
        pinchedGrabs[0].x - pinchedGrabs[1].x,
        pinchedGrabs[0].y - pinchedGrabs[1].y,
      );
      if (this.prevZoomDist && d > 1e-4) {
        // Spread hands apart -> factor < 1 -> camera moves closer
        const factor = Math.min(1.18, Math.max(0.85, this.prevZoomDist / d));
        this.callbacks.onZoom(factor);
      }
      this.prevZoomDist = d;
    }

    // Process pointer laser targeting
    let anyPointerActive = false;
    let pointerX = 0;
    let pointerY = 0;

    for (const [label, state] of this.handStates.entries()) {
      if (state.lastEmittedGesture === "index_point") {
        anyPointerActive = true;
        break;
      }
    }

    if (anyPointerActive) {
      const activeHandLabel = Array.from(this.handStates.keys()).find(
        (k) => this.handStates.get(k)?.lastEmittedGesture === "index_point"
      );
      if (activeHandLabel) {
        const idx = labels.indexOf(activeHandLabel);
        if (idx !== -1 && landmarks[idx]) {
          const tip = landmarks[idx][INDEX_TIP];
          pointerX = 1 - tip.x;
          pointerY = tip.y;
        }
      }
    }

    this.callbacks.onPointerMove(pointerX, pointerY, anyPointerActive);
    this.emitStatus({ hands: landmarks.length, mode });
  }

  private emitStatus(status: TrackerStatus): void {
    if (
      status.hands !== this.lastStatus.hands ||
      status.mode !== this.lastStatus.mode
    ) {
      this.lastStatus = status;
      this.callbacks.onStatus(status);
    }
  }

  private drawOverlay(landmarks: NormalizedLandmark[][]): void {
    const ctx = this.overlay.getContext("2d");
    if (!ctx) return;
    const { width, height } = this.overlay;
    ctx.clearRect(0, 0, width, height);

    for (const lm of landmarks) {
      // Draw skeletal connection segments
      ctx.strokeStyle = this.activeThemeColorLine;
      ctx.lineWidth = 2;
      
      CONNECTIONS.forEach(([startIdx, endIdx]) => {
        const ptStart = lm[startIdx];
        const ptEnd = lm[endIdx];
        if (ptStart && ptEnd) {
          ctx.beginPath();
          ctx.moveTo((1 - ptStart.x) * width, ptStart.y * height);
          ctx.lineTo((1 - ptEnd.x) * width, ptEnd.y * height);
          ctx.stroke();
        }
      });

      // Draw glowing joint nodes
      ctx.fillStyle = this.activeThemeColor;
      for (const pt of lm) {
        ctx.beginPath();
        ctx.arc((1 - pt.x) * width, pt.y * height, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

function dist2d(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
