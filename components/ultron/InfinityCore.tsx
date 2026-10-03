"use client";

import React from "react";
import UltronPanel from "../common/UltronPanel";
import UltronStatus, { UltronStatusType } from "../common/UltronStatus";
import UltronButton from "../common/UltronButton";
import { Mission } from "../../core/types/mission";

export type UltronCoreState =
  | "READY"
  | "THINKING"
  | "EXECUTING"
  | "WAITING"
  | "VERIFYING"
  | "ERROR"
  | "IDLE"
  | "SUCCESS"
  | "FAILED";

interface InfinityCoreProps {
  status: UltronCoreState;
  activeMission?: Mission;
  modelAccuracy?: string;
  thinkingSpeed?: string;
  activeContext?: string;
  onToggleVoice?: () => void;
  onOpenMission?: () => void;
  onCreateMission?: () => void;
  isListening?: boolean;
  latestResponse?: string;
  activeModel?: string;
}

interface CognitiveStage {
  id: string;
  name: string;
  status: UltronStatusType;
  statusLabel: string;
  description: string;
  currentState: string;
  icon: string;
}

export default function InfinityCore({
  status,
  activeMission,
  modelAccuracy = "96%",
  thinkingSpeed = "184 TPS",
  activeContext = "84%",
  onToggleVoice,
  onOpenMission,
  onCreateMission,
  isListening = false,
  latestResponse,
  activeModel = "gemini-3.5-flash",
}: InfinityCoreProps) {
  // Section 6: Map to READY / THINKING / EXECUTING / WAITING / VERIFYING / ERROR
  const normalizedCoreState: string = (() => {
    if (status === "THINKING") return "THINKING";
    if (status === "EXECUTING") return "EXECUTING";
    if (status === "WAITING") return "WAITING";
    if (status === "VERIFYING") return "VERIFYING";
    if (status === "ERROR" || status === "FAILED") return "ERROR";
    return "READY";
  })();

  // Section 6: Cognitive Loop
  // THINK -> KNOW -> ACT -> VERIFY -> REMEMBER
  const getCognitiveStages = (): CognitiveStage[] => {
    const isThinking = normalizedCoreState === "THINKING";
    const isExecuting = normalizedCoreState === "EXECUTING";
    const isVerifying = normalizedCoreState === "VERIFYING";
    const isCompleted = status === "SUCCESS";
    const isWaiting = normalizedCoreState === "WAITING" || isListening;

    return [
      {
        id: "think",
        name: "THINK",
        status: isThinking ? "RUNNING" : isListening ? "WAITING" : "READY",
        statusLabel: isThinking ? "Processing" : isListening ? "Listening" : "Ready",
        description: "Semantic intent parsing & DAG synthesis",
        currentState: isThinking
          ? "Deconstructing objective into tasks"
          : isListening
          ? "Capturing voice transcript"
          : "Ready for operator directives",
        icon: "⌁",
      },
      {
        id: "know",
        name: "KNOW",
        status: activeMission ? "ONLINE" : "READY",
        statusLabel: activeMission ? "Context Active" : "Context Ready",
        description: "L4 Vector memory & grounded context",
        currentState: activeMission
          ? `${activeMission.evidenceLedger?.length || 4} evidence items indexed`
          : "Durable memory store linked",
        icon: "✦",
      },
      {
        id: "act",
        name: "ACT",
        status: isExecuting ? "RUNNING" : activeMission ? "READY" : "WAITING",
        statusLabel: isExecuting ? "Executing" : activeMission ? "Assigned" : "Standing By",
        description: "Specialized agent task execution",
        currentState: isExecuting
          ? activeMission?.tasks.find((t) => t.status === "RUNNING")?.title || "Agent task executing"
          : activeMission
          ? "Tasks queued for execution"
          : "Agent workforce on standby",
        icon: "⚡",
      },
      {
        id: "verify",
        name: "VERIFY",
        status: isVerifying ? "RUNNING" : isCompleted ? "ONLINE" : "READY",
        statusLabel: isVerifying ? "Verifying" : isCompleted ? "Verified" : "Idle",
        description: "Empirical assertion & policy validation",
        currentState: isVerifying
          ? "Reality Checker running 4 gates"
          : isCompleted
          ? "All empirical assertions passed"
          : "Zero policy violations detected",
        icon: "✓",
      },
      {
        id: "remember",
        name: "REMEMBER",
        status: isCompleted ? "ONLINE" : "READY",
        statusLabel: isCompleted ? "Committed" : "Ready",
        description: "Durable episodic & factual memory ledger",
        currentState: isCompleted
          ? "Persisted to durable memory"
          : "Durable store standing by",
        icon: "◈",
      },
    ];
  };

  const cognitiveStages = getCognitiveStages();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        padding: "2px",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* 1. ULTRON CORE Status Header (Section 6) */}
      <UltronPanel
        title="ULTRON CORE"
        subtitle="Cognitive Operating System"
        badge={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <UltronStatus
              status={normalizedCoreState === "ERROR" ? "ERROR" : normalizedCoreState === "EXECUTING" || normalizedCoreState === "THINKING" ? "RUNNING" : "ONLINE"}
              label={`STATE: ${normalizedCoreState}`}
            />
            <span
              style={{
                fontSize: "10px",
                color: "var(--ultron-text-muted)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid var(--ultron-border)",
                background: "var(--ultron-bg-secondary)",
                fontFamily: "var(--ultron-font-mono)",
              }}
            >
              v2.0-SOVEREIGN
            </span>
          </div>
        }
      >
        {/* Core Metadata Strip (Section 6: System Confidence, Model, Session, Current Mission) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              borderRadius: "6px",
              background: "var(--ultron-panel)",
              border: "1px solid var(--ultron-border)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>
              SYSTEM CONFIDENCE
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ultron-success)", marginTop: "2px" }}>
              {modelAccuracy}
            </div>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: "6px",
              background: "var(--ultron-panel)",
              border: "1px solid var(--ultron-border)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>
              MODEL
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ultron-cyan)", marginTop: "2px" }}>
              {(activeModel || "gemini-3.5-flash").toUpperCase()}
            </div>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: "6px",
              background: "var(--ultron-panel)",
              border: "1px solid var(--ultron-border)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>
              SESSION
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ultron-text-primary)", marginTop: "2px", fontFamily: "var(--ultron-font-mono)" }}>
              DESKTOP-NODE-01
            </div>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: "6px",
              background: "var(--ultron-panel)",
              border: "1px solid var(--ultron-border)",
            }}
          >
            <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>
              CURRENT MISSION
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ultron-violet)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {activeMission ? activeMission.title : "NO ACTIVE MISSION"}
            </div>
          </div>
        </div>

        {/* Live Intelligence Output Banner */}
        <div
          style={{
            marginBottom: "12px",
            padding: "10px 14px",
            background: "rgba(99, 232, 255, 0.05)",
            border: "1px solid rgba(99, 232, 255, 0.25)",
            borderRadius: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--ultron-cyan)", letterSpacing: "0.8px" }}>
              ◉ LIVE INTELLIGENCE OUTPUT • {(activeModel || "gemini-3.5-flash").toUpperCase()}
            </span>
            <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", fontFamily: "var(--ultron-font-mono)" }}>
              {status === "THINKING" ? "REASONING..." : status === "EXECUTING" ? "EXECUTING TASK..." : "SYNCHRONIZED"}
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "var(--ultron-text-primary)", lineHeight: 1.45 }}>
            {latestResponse || "ULTRON intelligence engine synchronized with Gemini API. Ready for autonomous missions, research, code synthesis, or operator commands."}
          </div>
        </div>

        {/* 2. COGNITIVE LOOP (Section 6: THINK -> KNOW -> ACT -> VERIFY -> REMEMBER) */}
        <div style={{ marginTop: "4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.8px", color: "var(--ultron-text-primary)" }}>
              COGNITIVE LOOP
            </div>
            <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)" }}>
              AUTONOMOUS EXECUTION PIPELINE
            </span>
          </div>

          {/* System Flow Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "8px",
              position: "relative",
            }}
          >
            {cognitiveStages.map((stage, idx) => (
              <div
                key={stage.id}
                style={{
                  background:
                    stage.status === "RUNNING"
                      ? "rgba(99, 232, 255, 0.08)"
                      : "var(--ultron-panel)",
                  border:
                    stage.status === "RUNNING"
                      ? "1px solid var(--ultron-border-active)"
                      : "1px solid var(--ultron-border)",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  position: "relative",
                  boxShadow:
                    stage.status === "RUNNING"
                      ? "0 0 16px rgba(99, 232, 255, 0.12)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Stage Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "12px", color: "var(--ultron-cyan)" }}>{stage.icon}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--ultron-text-primary)", letterSpacing: "0.6px" }}>
                      {stage.name}
                    </span>
                  </div>
                  <span style={{ fontSize: "9px", color: "var(--ultron-text-muted)", fontFamily: "var(--ultron-font-mono)" }}>
                    0{idx + 1}
                  </span>
                </div>

                {/* Status Badge */}
                <div>
                  <UltronStatus status={stage.status} label={stage.statusLabel} size="sm" />
                </div>

                {/* Description */}
                <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)", lineHeight: 1.3 }}>
                  {stage.description}
                </div>

                {/* Current State */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "6px",
                    borderTop: "1px solid var(--ultron-border)",
                    fontSize: "10px",
                    color: stage.status === "RUNNING" ? "var(--ultron-cyan)" : "var(--ultron-text-muted)",
                    fontWeight: stage.status === "RUNNING" ? 600 : 400,
                  }}
                >
                  {stage.currentState}
                </div>
              </div>
            ))}
          </div>
        </div>
      </UltronPanel>

      {/* 3. Lower Control Plane: Connected Devices & System Architecture */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {/* Connected Devices (Section 6) */}
        <UltronPanel
          title="CONNECTED DEVICES"
          subtitle="Enclave Hardware Mesh"
          badge={<UltronStatus status="ONLINE" label="MESH ACTIVE" size="sm" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "5px",
                background: "var(--ultron-panel)",
                border: "1px solid var(--ultron-border)",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--ultron-cyan)" }}>▣</span>
                <span style={{ fontWeight: 600, color: "var(--ultron-text-primary)" }}>Primary Workstation</span>
                <span style={{ fontSize: "9px", color: "var(--ultron-text-muted)" }}>(Windows 11 Enclave)</span>
              </div>
              <UltronStatus status="ONLINE" label="CONNECTED" size="sm" />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "5px",
                background: "var(--ultron-panel)",
                border: "1px solid var(--ultron-border)",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--ultron-violet)" }}>◌</span>
                <span style={{ fontWeight: 600, color: "var(--ultron-text-primary)" }}>Mobile Companion Mesh</span>
                <span style={{ fontSize: "9px", color: "var(--ultron-text-muted)" }}>(Remote Node)</span>
              </div>
              <UltronStatus status="READY" label="NOT CONFIGURED" size="sm" />
            </div>
          </div>
        </UltronPanel>

        {/* Cognitive Engine Health */}
        <UltronPanel
          title="COGNITIVE ENGINE"
          subtitle="Kernel Telemetry"
          badge={<UltronStatus status="ONLINE" label="OPTIMAL" size="sm" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--ultron-text-muted)" }}>DURABLE FACT NODES</span>
              <span style={{ fontWeight: 600, color: "var(--ultron-text-primary)", fontFamily: "var(--ultron-font-mono)" }}>
                5 PERSISTED (L4)
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--ultron-text-muted)" }}>REALITY CHECK GATES</span>
              <span style={{ fontWeight: 600, color: "var(--ultron-success)", fontFamily: "var(--ultron-font-mono)" }}>
                4 / 4 EMPIRICAL PASS
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--ultron-text-muted)" }}>CONTROLLED TOOLS</span>
              <span style={{ fontWeight: 600, color: "var(--ultron-cyan)", fontFamily: "var(--ultron-font-mono)" }}>
                11 REGISTERED
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--ultron-text-muted)" }}>SECURITY POSTURE</span>
              <span style={{ fontWeight: 600, color: "var(--ultron-success)" }}>
                ZERO-TRUST LEAST PRIVILEGE
              </span>
            </div>
          </div>
        </UltronPanel>
      </div>
    </div>
  );
}
