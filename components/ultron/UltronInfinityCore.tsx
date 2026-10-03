"use client";

import React, { useEffect, useRef, useState } from "react";
import { createOrbScene, OrbSceneApi } from "../../lib/orbScene";
import { HandTracker, TrackerStatus } from "../../lib/handTracker";

interface UltronInfinityCoreProps {
  status: "IDLE" | "LISTENING" | "THINKING" | "EXECUTING" | "VERIFYING" | "WAITING" | "COMPLETED" | "ERROR";
  onToggleVoice?: () => void;
  isListening?: boolean;
}

export default function UltronInfinityCore({
  status,
  onToggleVoice,
  isListening = false,
}: UltronInfinityCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);

  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [gestureStatus, setGestureStatus] = useState<TrackerStatus>({ hands: 0, mode: "idle" });

  // Initialize background Three.js WebGL scene for cosmic particle depth
  useEffect(() => {
    if (!containerRef.current) return;
    try {
      const api = createOrbScene(containerRef.current);
      sceneRef.current = api;
      api.setTheme("ultron");
      return () => {
        api.dispose();
      };
    } catch (e) {
      console.error("Three.js initialization in Infinity Core:", e);
    }
  }, []);

  // Modulate energy surge based on cognitive status
  useEffect(() => {
    if (!sceneRef.current) return;
    const isSurging = status === "EXECUTING" || status === "THINKING" || status === "VERIFYING";
    sceneRef.current.setEnergySurge(isSurging);
  }, [status]);

  const toggleGestures = async () => {
    if (gesturesEnabled) {
      trackerRef.current?.stop();
      trackerRef.current = null;
      setGesturesEnabled(false);
      return;
    }

    if (!videoRef.current || !overlayRef.current || !sceneRef.current) return;
    try {
      const tracker = new HandTracker(videoRef.current, overlayRef.current, {
        onRotate: (dx, dy) => sceneRef.current?.rotateBy(dx, dy),
        onZoom: (factor) => sceneRef.current?.zoomBy(factor),
        onStatus: (st) => setGestureStatus(st),
        onGesture: (g) => console.log("Gesture detected:", g),
        onPointerMove: (x, y, active) => sceneRef.current?.setCursor(x, y, active),
      });

      await tracker.start();
      trackerRef.current = tracker;
      setGesturesEnabled(true);
    } catch (e) {
      console.warn("Hand tracking failed:", e);
      setGesturesEnabled(false);
    }
  };

  const stateClass = isListening
    ? "state-listening"
    : `state-${status.toLowerCase()}`;

  return (
    <div className={`infinity-core ${stateClass}`}>
      {/* Background Three.js WebGL Particle Sphere Canvas */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 pointer-events-auto opacity-75 cursor-grab active:cursor-grabbing"
      />

      {/* Hidden media elements for gesture tracking */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={overlayRef} className="hidden" />

      {/* 4 Orbital Energy Rings */}
      <div className="orbit orbit-1" />
      <div className="orbit orbit-2" />
      <div className="orbit orbit-3" />
      <div className="orbit orbit-4" />

      {/* Orbiting Planetary Bodies */}
      <div className="planet p1" />
      <div className="planet p2" />
      <div className="planet p3" />

      {/* Crossing Energy Beams */}
      <div className="energy energy-1" />
      <div className="energy energy-2" />

      {/* Sleek ULTRON Cybernetic Android Chassis / Embodiment Entity */}
      <div className="ultron">
        <div className="head">
          <span className="eye left" />
          <span className="eye right" />
        </div>
        <div className="neck" />
        <div className="torso">
          <div className="chest-core" />
        </div>
        <div className="arm arm-left" />
        <div className="arm arm-right" />
        <div className="leg leg-left" />
        <div className="leg leg-right" />
      </div>

      {/* Central Luminous Core Sphere with Pulsing Rings */}
      <div className="core-sphere" onClick={onToggleVoice}>
        <span />
      </div>

      {/* Core Telemetry Caption */}
      <div className="core-caption">
        <b>INFINITY CORE</b>
        <small>{status}</small>
      </div>

      {/* Subtle WebGL & Gesture Controls overlay in top-right corner of core stage */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <button
          onClick={toggleGestures}
          title="Toggle Hand Gestures (MediaPipe)"
          className="text-[6px] tracking-wider px-1.5 py-0.5 rounded border border-[#00d9ff]/30 bg-[#060a1c]/80 text-[#8ba0cf] hover:text-[#00d9ff]"
        >
          {gesturesEnabled ? `GESTURE: ${gestureStatus.mode.toUpperCase()}` : "GESTURE: OFF"}
        </button>
        <button
          onClick={() => sceneRef.current?.resetView()}
          title="Reset 3D Core View"
          className="text-[6px] tracking-wider px-1.5 py-0.5 rounded border border-[#00d9ff]/30 bg-[#060a1c]/80 text-[#8ba0cf] hover:text-[#00d9ff]"
        >
          RESET
        </button>
      </div>
    </div>
  );
}
