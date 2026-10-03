"use client";

import React, { useEffect, useRef, useState } from "react";
import { createOrbScene, OrbSceneApi } from "../../lib/orbScene";
import { HandTracker, TrackerStatus } from "../../lib/handTracker";
import { Mission } from "../../core/types/mission";
import { parseIntent } from "../../core/cognition/intentParser";

interface PillarCoreProps {
  activeMission?: Mission;
  onSubmitIntent: (text: string) => void;
  onOpenApprovals: () => void;
  pendingApprovalsCount: number;
}

export default function PillarCore({
  activeMission,
  onSubmitIntent,
  onOpenApprovals,
  pendingApprovalsCount,
}: PillarCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);

  const [intentInput, setIntentInput] = useState("");
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [gestureStatus, setGestureStatus] = useState<TrackerStatus>({ hands: 0, mode: "idle" });
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [cognitiveState, setCognitiveState] = useState<"IDLE" | "THINKING" | "PLANNING" | "EXECUTING" | "VERIFYING">("IDLE");

  // Initialize 3D Orb Scene
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
      console.error("Three.js WebGL initialization error:", e);
    }
  }, []);

  // Update Orb dynamics based on mission state
  useEffect(() => {
    if (!sceneRef.current) return;
    if (!activeMission) {
      setCognitiveState("IDLE");
      sceneRef.current.setEnergySurge(false);
      return;
    }

    if (activeMission.status === "RUNNING") {
      setCognitiveState("EXECUTING");
      sceneRef.current.setEnergySurge(true);
    } else if (activeMission.status === "PLANNING") {
      setCognitiveState("PLANNING");
      sceneRef.current.setEnergySurge(true);
    } else if (activeMission.status === "VERIFYING") {
      setCognitiveState("VERIFYING");
      sceneRef.current.setEnergySurge(true);
    } else {
      setCognitiveState("IDLE");
      sceneRef.current.setEnergySurge(false);
    }
  }, [activeMission]);

  // Voice Interaction
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Browser speech recognition not available in this environment.");
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        setVoiceTranscript("Listening for intent...");
      };

      rec.onresult = (e: any) => {
        const trans = Array.from(e.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setVoiceTranscript(trans);
        setIntentInput(trans);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.start();
    } catch (e) {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
    }
  };

  // Toggle Hand Gestures
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
      console.warn("MediaPipe hand tracking failed to initialize:", e);
      alert("Webcam permission denied or MediaPipe failed to load.");
      setGesturesEnabled(false);
    }
  };

  const handleIntentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentInput.trim()) return;
    onSubmitIntent(intentInput.trim());
    setIntentInput("");
  };

  return (
    <div className="relative w-full h-[calc(100vh-60px)] mt-[60px] overflow-hidden bg-black font-mono select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Hidden Webcam & Canvas for MediaPipe */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={overlayRef} className="hidden" />

      {/* Top Left: Ambient Cognitive State Card */}
      <div className="absolute top-6 left-6 z-20 w-80 p-4 border border-[#ffaa30]/30 rounded-lg bg-[#080402]/80 backdrop-blur-md text-xs shadow-[0_0_24px_rgba(255,170,48,0.15)]">
        <div className="flex items-center justify-between pb-2 border-b border-[#ffaa30]/20 mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              cognitiveState === "EXECUTING" || cognitiveState === "VERIFYING"
                ? "bg-[#ffaa30] animate-ping"
                : "bg-emerald-400"
            }`} />
            <span className="font-bold text-[#ffaa30] tracking-wider">COGNITIVE KERNEL</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffaa30]/20 text-[#ffcc66]">
            {cognitiveState}
          </span>
        </div>

        {activeMission ? (
          <div className="space-y-2">
            <div className="text-[11px] text-zinc-400">ACTIVE MISSION:</div>
            <div className="text-zinc-100 font-semibold truncate text-xs">{activeMission.title}</div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span>PRIORITY: {activeMission.priority}</span>
              <span className="text-[#00f0ff]">
                TASKS: {activeMission.tasks.filter((t) => t.status === "COMPLETED").length}/{activeMission.tasks.length}
              </span>
            </div>
            {/* Task Progress Bar */}
            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-[#ffaa30] to-[#ffcc66] h-full transition-all duration-500"
                style={{
                  width: `${
                    (activeMission.tasks.filter((t) => t.status === "COMPLETED").length /
                      Math.max(1, activeMission.tasks.length)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-zinc-500 text-[11px]">Standing by for user directive or intent...</div>
        )}
      </div>

      {/* Top Right: Physical & Spatial Controls */}
      <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleGestures}
            className={`px-3 py-1.5 rounded border transition-all tracking-wider ${
              gesturesEnabled
                ? "bg-[#ffaa30]/30 text-[#ffcc66] border-[#ffaa30] shadow-[0_0_15px_rgba(255,170,48,0.4)]"
                : "bg-black/60 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {gesturesEnabled ? `GESTURES: ${gestureStatus.mode.toUpperCase()}` : "GESTURES: OFF [G]"}
          </button>
          <button
            onClick={() => sceneRef.current?.resetView()}
            className="px-3 py-1.5 rounded bg-black/60 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
          >
            RESET [R]
          </button>
        </div>

        {pendingApprovalsCount > 0 && (
          <button
            onClick={onOpenApprovals}
            className="px-4 py-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse font-bold tracking-wider"
          >
            ⚠ {pendingApprovalsCount} ACTION(S) AWAITING APPROVAL
          </button>
        )}
      </div>

      {/* Bottom Center: Omnipresent Intent Command Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
        <form onSubmit={handleIntentSubmit} className="relative">
          <div className="flex items-center border border-[#ffaa30]/50 rounded-lg bg-[#0a0502]/90 backdrop-blur-md shadow-[0_0_32px_rgba(255,170,48,0.25)] overflow-hidden">
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-3.5 transition-all ${
                isListening
                  ? "bg-red-500/30 text-red-400 animate-pulse"
                  : "text-[#ffaa30] hover:text-[#ffcc66] hover:bg-zinc-900/50"
              }`}
              title="Voice Intent Input"
            >
              🎙
            </button>
            <input
              type="text"
              value={intentInput}
              onChange={(e) => setIntentInput(e.target.value)}
              placeholder="Speak or type intent: 'Build API', 'Audit CVEs', 'Research CRM'..."
              className="w-full bg-transparent px-2 py-3.5 text-zinc-100 placeholder-zinc-500 text-xs md:text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3.5 bg-[#ffaa30] text-black font-bold text-xs tracking-wider hover:bg-[#ffcc66] transition-all"
            >
              TRANSMIT
            </button>
          </div>
          {isListening && (
            <div className="absolute -top-7 left-3 text-[11px] text-[#ffcc66] animate-pulse">
              ● Voice: {voiceTranscript || "Listening..."}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
