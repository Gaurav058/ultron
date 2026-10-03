"use client";

import React, { useEffect, useRef, useState } from "react";
import { createOrbScene, OrbSceneApi } from "../../lib/orbScene";
import { HandTracker, TrackerStatus } from "../../lib/handTracker";
import { Mission } from "../../core/types/mission";

export type UltronCoreState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "PLANNING"
  | "EXECUTING"
  | "WAITING"
  | "VERIFYING"
  | "SUCCESS"
  | "FAILED"
  | "OFFLINE";

interface InfinityCoreProps {
  status: UltronCoreState;
  activeMission?: Mission;
  modelAccuracy?: string;
  thinkingSpeed?: string;
  activeContext?: string;
  onToggleVoice?: () => void;
  onOpenMission?: () => void;
  isListening?: boolean;
}

/** 1. Core Artwork: Official ULTRON Humanoid & Cosmic Infinity Asset */
export function CoreArtwork() {
  return (
    <img
      className="ultron-core-art"
      src="/ultron-core-art.png"
      alt="ULTRON humanoid intelligence entity surrounded by cosmic infinity structures"
    />
  );
}

/** 2. Core Status: Top-Left HUD Card */
export function CoreStatus({
  status,
  thinkingSpeed = "184 TPS",
  modelAccuracy = "96%",
  activeContext = "84%",
}: {
  status: UltronCoreState;
  thinkingSpeed?: string;
  modelAccuracy?: string;
  activeContext?: string;
}) {
  return (
    <div className="core-status holo-panel">
      <div className="panel-title">
        ULTRON CORE <span className="status-dot">● {status}</span>
      </div>
      <div className="core-percent">100%</div>
      <div className="metric-row">
        <span>THINKING SPEED</span>
        <b>{thinkingSpeed}</b>
      </div>
      <div className="metric-row">
        <span>MODEL ACCURACY</span>
        <b>{modelAccuracy}</b>
      </div>
      <div className="metric-row">
        <span>ACTIVE CONTEXT</span>
        <b>{activeContext}</b>
      </div>
      <div className="metric-row">
        <span>LEARNING RATE</span>
        <b>ADAPTIVE</b>
      </div>
    </div>
  );
}

/** 3. Core State & Activity HUD Cards: Connected Devices & Active Mission */
export function CoreActivity({
  activeMission,
  onOpenMission,
}: {
  activeMission?: Mission;
  onOpenMission?: () => void;
}) {
  const missionProgressPct = (() => {
    if (!activeMission || !activeMission.tasks || activeMission.tasks.length === 0) return 72;
    const completed = activeMission.tasks.filter((t) => t.status === "COMPLETED").length;
    return Math.max(15, Math.round((completed / activeMission.tasks.length) * 100));
  })();

  return (
    <>
      {/* Connected Devices (Bottom-Left) */}
      <div className="connected holo-panel">
        <div className="panel-title">
          CONNECTED DEVICES <span>3 ACTIVE</span>
        </div>
        <div className="device">
          <span>◌</span>
          <b>iPhone 17 Pro Max</b>
          <em>100%</em>
        </div>
        <div className="device">
          <span>▣</span>
          <b>MacBook Air M3</b>
          <em>94%</em>
        </div>
        <div className="device">
          <span>◇</span>
          <b>ULTRON NODE</b>
          <em>ONLINE</em>
        </div>
      </div>

      {/* Current Mission Connection (Bottom-Right) */}
      <div
        className="mission-center holo-panel"
        onClick={onOpenMission}
        style={{ cursor: "pointer" }}
        title="Click to view full mission orchestration"
      >
        <div className="panel-title">
          CURRENT MISSION <span>{activeMission?.status || "PERFORMING"}</span>
        </div>
        <b className="mission-name">
          {activeMission?.title || "Build Aethora AI Platform"}
        </b>
        <div className="mission-progress">
          <span style={{ width: `${missionProgressPct}%` }} />
        </div>
        <div className="mission-meta">
          <span>
            TASKS: <b>{activeMission?.tasks?.length || 4}</b>
          </span>
          <span>
            PROGRESS <b>{missionProgressPct}%</b>
          </span>
        </div>
      </div>
    </>
  );
}

export default function InfinityCore({
  status,
  activeMission,
  modelAccuracy = "96%",
  thinkingSpeed = "184 TPS",
  activeContext = "84%",
  onToggleVoice,
  onOpenMission,
  isListening = false,
}: InfinityCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);

  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [gestureStatus, setGestureStatus] = useState<TrackerStatus>({ hands: 0, mode: "idle" });

  // WebGL Spatial Depth in Core backdrop
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

  // Modulate energy surge based on the 10 real states
  useEffect(() => {
    if (!sceneRef.current) return;
    const isSurging =
      status === "EXECUTING" ||
      status === "THINKING" ||
      status === "PLANNING" ||
      status === "VERIFYING";
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
    <div className="relative w-full h-full min-h-[440px] overflow-hidden flex items-center justify-center">
      {/* 1. Core Status HUD Card */}
      <CoreStatus
        status={status}
        thinkingSpeed={thinkingSpeed}
        modelAccuracy={modelAccuracy}
        activeContext={activeContext}
      />

      {/* 2. Central Living Infinity Core Arena */}
      <div className={`infinity-core ${stateClass}`}>
        {/* Subtle WebGL Particle Depth in background */}
        <div
          ref={containerRef}
          className="absolute inset-0 z-0 pointer-events-auto opacity-70 cursor-grab active:cursor-grabbing"
        />

        {/* Hidden video/canvas for gesture tracking */}
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={overlayRef} className="hidden" />

        {/* 4 Orbital Energy Rings */}
        <div className="orbit orbit-1" />
        <div className="orbit orbit-2" />
        <div className="orbit orbit-3" />
        <div className="orbit orbit-4" />

        {/* Planetary Bodies */}
        <div className="planet p1" />
        <div className="planet p2" />
        <div className="planet p3" />

        {/* Energy Rays */}
        <div className="energy energy-1" />
        <div className="energy energy-2" />

        {/* The Central ULTRON Humanoid + Cosmic Universe Artwork */}
        <CoreArtwork />

        {/* Luminous Central Core Sphere */}
        <div
          className="core-sphere"
          onClick={onToggleVoice}
          title="Click to activate ULTRON Voice Core"
          role="button"
          tabIndex={0}
        >
          <span />
        </div>

        {/* Core Caption */}
        <div className="core-caption">
          <b>INFINITY CORE</b>
          <small>{status}</small>
        </div>

        {/* Core Controls */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <button
            onClick={toggleGestures}
            type="button"
            title="Toggle Hand Gestures (MediaPipe)"
            className="text-[6px] tracking-wider px-1.5 py-0.5 rounded border border-[#00d9ff]/30 bg-[#060a1c]/80 text-[#8ba0cf] hover:text-[#00d9ff] cursor-pointer"
          >
            {gesturesEnabled ? `GESTURE: ${gestureStatus.mode.toUpperCase()}` : "GESTURE: OFF"}
          </button>
          <button
            onClick={() => sceneRef.current?.resetView()}
            type="button"
            title="Reset 3D Core View"
            className="text-[6px] tracking-wider px-1.5 py-0.5 rounded border border-[#00d9ff]/30 bg-[#060a1c]/80 text-[#8ba0cf] hover:text-[#00d9ff] cursor-pointer"
          >
            RESET
          </button>
        </div>
      </div>

      {/* 3. Core Activity (Connected Devices & Current Mission) */}
      <CoreActivity activeMission={activeMission} onOpenMission={onOpenMission} />
    </div>
  );
}
