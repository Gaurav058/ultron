/**
 * ULTRON Voice Engine & Client Audio Controller (Sections 14, 16, 17)
 * Handles microphone capture, speech recognition, audio waveform analysis,
 * synthesis playback with interruption handling, and state transitions.
 */

import { UltronEventBus } from "@/core/events/eventBus";

export type VoiceState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "SPEAKING"
  | "EXECUTING"
  | "WAITING_FOR_APPROVAL"
  | "ERROR";

export interface VoiceEngineListeners {
  onStateChange?: (state: VoiceState) => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onResponse?: (text: string, actions?: any[]) => void;
  onWaveformData?: (data: Uint8Array) => void;
  onError?: (error: string) => void;
}

export class UltronVoiceEngine {
  private static instance: UltronVoiceEngine;
  private state: VoiceState = "IDLE";
  private recognition: any = null;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private listeners: VoiceEngineListeners = {};
  private sessionId = "ultron-voice-session-default";

  private constructor() {
    if (typeof window !== "undefined") {
      this.synth = window.speechSynthesis || null;
    }
  }

  public static getInstance(): UltronVoiceEngine {
    if (!this.instance) {
      this.instance = new UltronVoiceEngine();
    }
    return this.instance;
  }

  public setListeners(listeners: VoiceEngineListeners): void {
    this.listeners = listeners;
  }

  public getState(): VoiceState {
    return this.state;
  }

  private setState(newState: VoiceState): void {
    this.state = newState;
    UltronEventBus.publish("VOICE_STATE_CHANGED", "VOICE", `Voice state: ${newState}`, { state: newState });
    this.listeners.onStateChange?.(newState);
  }

  /**
   * Start listening for voice input
   */
  public async startListening(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    // Interrupt any ongoing speech output (Section 14: interruptions)
    this.interruptSpeech();

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // Start Audio Analyser for live subtle waveforms
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }

      if (navigator.mediaDevices && !this.micStream) {
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (this.audioCtx) {
          const source = this.audioCtx.createMediaStreamSource(this.micStream);
          this.analyser = this.audioCtx.createAnalyser();
          this.analyser.fftSize = 64;
          source.connect(this.analyser);
          this.startWaveformLoop();
        }
      }
    } catch (e) {
      console.warn("Microphone access or Web Audio not available for waveform:", e);
    }

    if (!SpeechRec) {
      this.setState("ERROR");
      this.listeners.onError?.("Web Speech API not supported in this browser. Please use text command bar.");
      return false;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      let finalTranscript = "";

      this.recognition.onstart = () => {
        this.setState("LISTENING");
      };

      this.recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }
        const currentText = finalTranscript || interim;
        this.listeners.onTranscript?.(currentText, Boolean(finalTranscript));
      };

      this.recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error);
        if (this.state === "LISTENING") {
          this.setState("IDLE");
        }
      };

      this.recognition.onend = () => {
        if (finalTranscript.trim()) {
          this.processVoiceCommand(finalTranscript.trim());
        } else if (this.state === "LISTENING") {
          this.setState("IDLE");
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.setState("ERROR");
      this.listeners.onError?.(err?.message || "Failed to start speech recognition.");
      return false;
    }
  }

  /**
   * Stop listening manually
   */
  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }
    if (this.state === "LISTENING") {
      this.setState("IDLE");
    }
  }

  /**
   * Toggle between IDLE and LISTENING
   */
  public toggleListening(): void {
    if (this.state === "LISTENING") {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  /**
   * Process recognized voice string through /api/voice/chat
   */
  public async processVoiceCommand(text: string): Promise<string | null> {
    if (!text.trim()) return null;

    this.setState("THINKING");

    try {
      const res = await fetch("/api/voice/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: this.sessionId }),
      });

      if (!res.ok) {
        throw new Error(`Voice API returned status ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.text || "Command processed.";

      if (data.actions && data.actions.length > 0) {
        this.setState("EXECUTING");
        // Give short visual indication of execution
        await new Promise((r) => setTimeout(r, 600));
      }

      this.listeners.onResponse?.(replyText, data.actions);

      // Speak response
      await this.speak(replyText);

      return replyText;
    } catch (error: any) {
      this.setState("ERROR");
      this.listeners.onError?.(error?.message || "Failed to communicate with ULTRON voice service.");
      setTimeout(() => this.setState("IDLE"), 2500);
      return null;
    }
  }

  /**
   * Synthesize audio response with calm, concise delivery
   */
  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || typeof window === "undefined") {
        this.setState("IDLE");
        resolve();
        return;
      }

      this.interruptSpeech();
      this.setState("SPEAKING");

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Select deep/technical robotic or neutral voice if available
      const voices = this.synth.getVoices();
      const preferred =
        voices.find((v) => v.name.includes("Google UK English Male") || v.name.includes("Natural") || v.name.includes("David")) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];

      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.pitch = 0.92; // Slightly deeper, calm tone
      utterance.rate = 1.05; // Efficient, precise pacing

      utterance.onend = () => {
        this.currentUtterance = null;
        this.setState("IDLE");
        resolve();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        this.setState("IDLE");
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  /**
   * Interrupt ongoing speech output immediately (Section 14: interruptions)
   */
  public interruptSpeech(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    this.currentUtterance = null;
    if (this.state === "SPEAKING") {
      this.setState("IDLE");
    }
  }

  private startWaveformLoop(): void {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      if (this.analyser && (this.state === "LISTENING" || this.state === "SPEAKING")) {
        this.analyser.getByteFrequencyData(dataArray);
        this.listeners.onWaveformData?.(dataArray);
      }
      this.animFrameId = requestAnimationFrame(update);
    };

    update();
  }

  public cleanup(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== "closed") {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    this.interruptSpeech();
  }
}
