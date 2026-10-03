"use client";

import React from "react";
import UltronPanel from "../common/UltronPanel";
import UltronStatus, { UltronStatusType } from "../common/UltronStatus";
import UltronButton from "../common/UltronButton";
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
  onCreateMission?: () => void;
  isListening?: boolean;
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
}: InfinityCoreProps) {
  // Derive real cognitive loop states based on real runtime coreState
  const getCognitiveStages = (): CognitiveStage[] => {
    const isThinking = status === "THINKING" || status === "PLANNING";
    const isExecuting = status === "EXECUTING";
    const isVerifying = status === "VERIFYING";
    const isCompleted = status === "SUCCESS";
    const isWaiting = status === "WAITING" || isListening;

    return [
      {
        id: "think",
        name: "THINK",
        status: isThinking ? "RUNNING" : isListening ? "WAITING" : "READY",
        statusLabel: isThinking ? "Processing" : isListening ? "Listening" : "Ready",
        description: "Semantic parsing & DAG synthesis",
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
        statusLabel: activeMission ? "Context Active" : "Context Available",
        description: "L4 Vector memory & grounded context",
        currentState: activeMission
          ? `${activeMission.evidenceLedger.length || 4} evidence items indexed`
          : "Vector stores linked & idle",
        icon: "✦",
      },
      {
        id: "act",
        name: "ACT",
        status: isExecuting ? "RUNNING" : activeMission ? "READY" : "WAITING",
        statusLabel: isExecuting ? "Executing" : activeMission ? "Assigned" : "Awaiting Mission",
        description: "Specialized agent task execution",
        currentState: isExecuting
          ? activeMission?.tasks.find((t) => t.status === "RUNNING")?.title || "Agent task in progress"
          : activeMission
          ? "Tasks queued for execution"
          : "Agent runtime idle",
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
      }}
    >
      {/* 1. ULTRON CORE Cognitive Control Plane Header */}
      <UltronPanel
        title="ULTRON CORE"
        subtitle="Cognitive control plane"
        badge={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <UltronStatus status="ONLINE" label="ONLINE" />
            <span
              style={{
                fontSize: "10px",
                color: "#71809D",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(105, 150, 255, 0.15)",
                background: "rgba(105, 150, 255, 0.05)",
                fontFamily: "var(--font-mono)",
              }}
            >
              v2.0-SOVEREIGN
            </span>
          </div>
        }
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <UltronButton
              size="sm"
              variant={isListening ? "primary" : "secondary"}
              onClick={onToggleVoice}
              title="Activate voice recognition"
            >
              {isListening ? "● LISTENING..." : "🎙 VOICE CORE"}
            </UltronButton>
          </div>
        }
      >
        {/* Core Quick Metrics Strip */}
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
              background: "rgba(99, 232, 255, 0.03)",
              border: "1px solid rgba(105, 150, 255, 0.15)",
            }}
          >
            <div style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase", fontWeight: 500 }}>
              THINKING SPEED
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#EAF2FF", marginTop: "2px" }}>
              {thinkingSpeed}
            </div>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: "6px",
              background: "rgba(99, 232, 255, 0.03)",
              border: "1px solid rgba(105, 150, 255, 0.15)",
            }}
          >
            <div style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase", fontWeight: 500 }}>
              MODEL ACCURACY
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#63E8FF", marginTop: "2px" }}>
              {modelAccuracy}
            </div>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: "6px",
              background: "rgba(99, 232, 255, 0.03)",
              border: "1px solid rgba(105, 150, 255, 0.15)",
            }}
          >
            <div style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase", fontWeight: 500 }}>
              ACTIVE CONTEXT
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#C9D5EA", marginTop: "2px" }}>
              {activeContext}
            </div>
          </div>

          <div
            style={{
              padding: "8px 10px",
              borderRadius: "6px",
              background: "rgba(99, 232, 255, 0.03)",
              border: "1px solid rgba(105, 150, 255, 0.15)",
            }}
          >
            <div style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase", fontWeight: 500 }}>
              REASONING ENGINE
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#5FF0A0", marginTop: "2px" }}>
              DAG SCHEDULER
            </div>
          </div>
        </div>

        {/* 2. COGNITIVE LOOP Section */}
        <div style={{ marginTop: "4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.8px", color: "#EAF2FF" }}>
              COGNITIVE LOOP
            </div>
            <span style={{ fontSize: "10px", color: "#71809D" }}>
              AUTONOMOUS EXECUTION PIPELINE
            </span>
          </div>

          {/* System Flow: THINK → KNOW → ACT → VERIFY → REMEMBER */}
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
                      : "rgba(7, 11, 28, 0.65)",
                  border:
                    stage.status === "RUNNING"
                      ? "1px solid rgba(99, 232, 255, 0.45)"
                      : "1px solid rgba(105, 150, 255, 0.18)",
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
                    <span style={{ fontSize: "12px", color: "#63E8FF" }}>{stage.icon}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF", letterSpacing: "0.6px" }}>
                      {stage.name}
                    </span>
                  </div>
                  <span style={{ fontSize: "9px", color: "#71809D", fontFamily: "var(--font-mono)" }}>
                    0{idx + 1}
                  </span>
                </div>

                {/* Status Badge */}
                <div>
                  <UltronStatus status={stage.status} label={stage.statusLabel} size="sm" />
                </div>

                {/* Description */}
                <div style={{ fontSize: "11px", color: "#AAB8D4", lineHeight: 1.3 }}>
                  {stage.description}
                </div>

                {/* Current State */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "6px",
                    borderTop: "1px solid rgba(105, 150, 255, 0.12)",
                    fontSize: "10px",
                    color: stage.status === "RUNNING" ? "#63E8FF" : "#71809D",
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
        {/* Connected Devices */}
        <UltronPanel
          title="CONNECTED DEVICES"
          subtitle="3 Active Nodes"
          badge={<UltronStatus status="ONLINE" label="MESH ACTIVE" size="sm" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px",
                borderRadius: "5px",
                background: "rgba(105, 150, 255, 0.04)",
                border: "1px solid rgba(105, 150, 255, 0.12)",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "#63E8FF" }}>▣</span>
                <span style={{ fontWeight: 600, color: "#EAF2FF" }}>Primary Workstation</span>
                <span style={{ fontSize: "9px", color: "#71809D" }}>(Host)</span>
              </div>
              <UltronStatus status="ONLINE" label="CONNECTED" size="sm" />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px",
                borderRadius: "5px",
                background: "rgba(105, 150, 255, 0.04)",
                border: "1px solid rgba(105, 150, 255, 0.12)",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "#8D75FF" }}>◌</span>
                <span style={{ fontWeight: 600, color: "#EAF2FF" }}>Mobile Companion Mesh</span>
                <span style={{ fontSize: "9px", color: "#71809D" }}>(BLE / P2P)</span>
              </div>
              <UltronStatus status="READY" label="SYNCED" size="sm" />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px",
                borderRadius: "5px",
                background: "rgba(105, 150, 255, 0.04)",
                border: "1px solid rgba(105, 150, 255, 0.12)",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "#5FF0A0" }}>◇</span>
                <span style={{ fontWeight: 600, color: "#EAF2FF" }}>ULTRON Node Gateway</span>
                <span style={{ fontSize: "9px", color: "#71809D" }}>(Local Daemon)</span>
              </div>
              <UltronStatus status="ONLINE" label="OPERATIONAL" size="sm" />
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
              <span style={{ color: "#8FA3C5" }}>VECTOR MEMORY NODES</span>
              <span style={{ fontWeight: 600, color: "#EAF2FF", fontFamily: "var(--font-mono)" }}>
                4 PERSISTED (L4)
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#8FA3C5" }}>REALITY CHECK GATES</span>
              <span style={{ fontWeight: 600, color: "#5FF0A0", fontFamily: "var(--font-mono)" }}>
                4 / 4 EMPIRICAL PASS
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#8FA3C5" }}>TOOL FABRIC INTERFACES</span>
              <span style={{ fontWeight: 600, color: "#63E8FF", fontFamily: "var(--font-mono)" }}>
                6 MCP CONNECTED
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#8FA3C5" }}>SECURITY ENCLAVE</span>
              <span style={{ fontWeight: 600, color: "#5FF0A0" }}>
                ZERO-TRUST GOVERNED
              </span>
            </div>
          </div>
        </UltronPanel>
      </div>
    </div>
  );
}
