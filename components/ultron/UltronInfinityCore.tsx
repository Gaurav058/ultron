"use client";

import React, { useEffect, useRef, useState } from "react";
import { createOrbScene, OrbSceneApi } from "../../lib/orbScene";
import { HandTracker, TrackerStatus } from "../../lib/handTracker";
import { UltronStatusState } from "../common/StatusIndicator";

interface UltronInfinityCoreProps {
  status: UltronStatusState;
  thinkingSpeed?: string;
  memoryLoad?: string;
  activeContext?: string;
}

export default function UltronInfinityCore({
  status,
  thinkingSpeed = "184 T/s",
  memoryLoad = "4.2 GB / 64%",
  activeContext = "128k Tokens",
}: UltronInfinityCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);

  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [gestureStatus, setGestureStatus] = useState<TrackerStatus>({ hands: 0, mode: "idle" });

  // Initialize Three.js WebGL scene
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
      console.error("Three.js initialization error in Infinity Core:", e);
    }
  }, []);

  // Update Three.js energy surge based on active system state
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
        onGesture: (g) => console.log("Detected gesture:", g),
        onPointerMove: (x, y, active) => sceneRef.current?.setCursor(x, y, active),
      });

      await tracker.start();
      trackerRef.current = tracker;
      setGesturesEnabled(true);
    } catch (e) {
      console.warn("Hand tracking initialization failed:", e);
      setGesturesEnabled(false);
    }
  };

  return (
    <div className="relative w-full h-[380px] lg:h-[440px] rounded-[6px] border border-[#00d9ff]/20 bg-gradient-to-b from-[#030614] via-[#02030a] to-[#04081c] overflow-hidden select-none shadow-[0_0_50px_rgba(0,217,255,0.08)]">
      {/* Layer 1: Deep Cosmic Space & Nebula Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(109,74,255,0.18)_0%,rgba(0,217,255,0.08)_35%,transparent_70%)] pointer-events-none" />

      {/* Layer 2: Three.js 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing z-10" />

      {/* Hidden Webcam & Canvas for MediaPipe */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={overlayRef} className="hidden" />

      {/* Layer 3: Central ULTRON Robotic Humanoid Entity Silhouette Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Orbital Concentric Hologram Rings (SVG) */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_40s_linear_infinite]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(0, 217, 255, 0.2)" strokeWidth="0.8" strokeDasharray="4 8" />
            <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(109, 74, 255, 0.25)" strokeWidth="0.8" strokeDasharray="16 12" />
            <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="1" strokeDasharray="3 6" />
          </svg>

          {/* Reverse Rotating Measurement Gyro Ring */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_25s_linear_infinite_reverse]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(216, 76, 255, 0.2)" strokeWidth="0.6" strokeDasharray="2 18" />
            <line x1="100" y1="6" x2="100" y2="12" stroke="#00d9ff" strokeWidth="1.2" />
            <line x1="100" y1="188" x2="100" y2="194" stroke="#00d9ff" strokeWidth="1.2" />
            <line x1="6" y1="100" x2="12" y2="100" stroke="#00d9ff" strokeWidth="1.2" />
            <line x1="188" y1="100" x2="194" y2="100" stroke="#00d9ff" strokeWidth="1.2" />
          </svg>

          {/* Sleek ULTRON Cybernetic Android Chassis Silhouette with Illuminated Optic Eyes & Chest Core */}
          <svg
            className={`w-44 h-44 drop-shadow-[0_0_25px_rgba(0,217,255,0.4)] transition-all duration-700 ${
              status === "EXECUTING" ? "scale-105 drop-shadow-[0_0_35px_#00d9ff]" : "scale-100"
            }`}
            viewBox="0 0 160 160"
            fill="none"
          >
            {/* Cybernetic Torso & Shoulder Plating */}
            <path
              d="M48 150 L52 110 L64 96 L96 96 L108 110 L112 150 Z"
              fill="#060914"
              stroke="#00d9ff"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Neck & Jawline */}
            <path
              d="M68 96 L70 82 L90 82 L92 96 Z"
              fill="#080d1e"
              stroke="#6d4aff"
              strokeWidth="0.7"
              strokeOpacity="0.6"
            />
            {/* Sculpted Android Cranium / Helmet */}
            <path
              d="M80 32 C60 32 54 46 54 62 C54 74 62 82 80 84 C98 82 106 74 106 62 C106 46 100 32 80 32 Z"
              fill="#04060e"
              stroke="#00d9ff"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />
            {/* Angular Facet Lines */}
            <path d="M62 48 L80 62 L98 48" stroke="rgba(0, 217, 255, 0.4)" strokeWidth="0.8" />
            <path d="M80 62 L80 82" stroke="rgba(109, 74, 255, 0.5)" strokeWidth="0.8" />

            {/* Glowing Violet/Cyan Optic Eyes */}
            <ellipse cx="71" cy="58" rx="5" ry="1.8" fill="#00d9ff" className="animate-pulse shadow-[0_0_12px_#00d9ff]" />
            <ellipse cx="89" cy="58" rx="5" ry="1.8" fill="#00d9ff" className="animate-pulse shadow-[0_0_12px_#00d9ff]" />

            {/* Central Infinity Core Chest Reactor */}
            <circle cx="80" cy="116" r="10" fill="#030510" stroke="#00d9ff" strokeWidth="1.5" />
            <circle cx="80" cy="116" r="6" fill="#6d4aff" className="animate-ping" opacity="0.6" />
            <circle cx="80" cy="116" r="4" fill="#00d9ff" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Top Left: Core Telemetry Card */}
      <div className="absolute top-3.5 left-3.5 z-30 p-2.5 rounded bg-[#030614]/85 border border-[#00d9ff]/25 backdrop-blur-md text-[10px] font-mono space-y-1">
        <div className="flex items-center justify-between gap-3 text-zinc-400">
          <span className="font-['Rajdhani',sans-serif] font-bold tracking-widest text-[#00d9ff] uppercase">
            ULTRON CORE
          </span>
          <span className="text-emerald-400 font-bold">100% READY</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-zinc-300">
          <span className="text-[#8493b2]">THINKING SPEED:</span>
          <span className="font-semibold text-zinc-100">{thinkingSpeed}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-zinc-300">
          <span className="text-[#8493b2]">MEMORY LOAD:</span>
          <span className="font-semibold text-[#8b5cff]">{memoryLoad}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-zinc-300">
          <span className="text-[#8493b2]">ACTIVE CONTEXT:</span>
          <span className="font-semibold text-[#00d9ff]">{activeContext}</span>
        </div>
      </div>

      {/* Top Right: Gesture & Orbit Control Buttons */}
      <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-2 text-xs font-mono">
        <button
          onClick={toggleGestures}
          className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider border transition-all ${
            gesturesEnabled
              ? "bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff] shadow-[0_0_15px_rgba(0,217,255,0.3)]"
              : "bg-black/60 text-[#8493b2] border-white/[0.1] hover:text-zinc-200"
          }`}
        >
          {gesturesEnabled ? `GESTURES: ${gestureStatus.mode.toUpperCase()}` : "GESTURES: OFF [G]"}
        </button>
        <button
          onClick={() => sceneRef.current?.resetView()}
          className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider bg-black/60 text-[#8493b2] border border-white/[0.1] hover:text-zinc-200"
        >
          RESET [R]
        </button>
      </div>

      {/* Bottom Center Indicator: Cognitive Loop */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 text-[9px] font-mono tracking-widest text-[#8493b2] uppercase">
        <span className="text-[#00d9ff] font-bold">THINK</span>
        <span>•</span>
        <span className="text-[#6d4aff] font-bold">KNOW</span>
        <span>•</span>
        <span className="text-[#d84cff] font-bold">ACT</span>
        <span>•</span>
        <span className="text-emerald-400 font-bold">VERIFY</span>
        <span>•</span>
        <span className="text-[#ffaa30] font-bold">REMEMBER</span>
      </div>
    </div>
  );
}
