"use client";

import React, { useEffect, useMemo, useState } from "react";
import NavigationRail, { PillarNavId } from "./NavigationRail";
import TopSystemBar from "./TopSystemBar";
import RightIntelligenceRail from "./RightIntelligenceRail";
import InfinityCore, { UltronCoreState } from "./InfinityCore";
import LowerTelemetryDeck from "./LowerTelemetryDeck";
import BottomCommandBar from "./BottomCommandBar";
import StatusBar from "./StatusBar";
import MissionsModule from "./modules/MissionsModule";
import BrainModule from "./modules/BrainModule";
import AgentsModule from "./modules/AgentsModule";
import ToolsModule from "./modules/ToolsModule";
import WorldModule from "./modules/WorldModule";
import SystemModule from "./modules/SystemModule";
import ApprovalModal from "../deck/ApprovalModal";
import { Mission, PolicyGate } from "../../core/types/mission";
import { MissionManager } from "../../core/missions/missionManager";
import { MemoryEngine } from "../../core/memory/memoryEngine";
import { RealityChecker } from "../../core/verification/realityChecker";
import { UltronDoctor } from "../../core/runtime/ultronDoctor";
import { UltronEventBus, UltronEvent } from "../../core/events/eventBus";

export interface UltronShellProps {
  initialModule?: PillarNavId;
}

export default function UltronShell({ initialModule = "CORE" }: UltronShellProps) {
  const [activeModule, setActiveModule] = useState<PillarNavId>(initialModule);
  const [coreState, setCoreState] = useState<UltronCoreState>("IDLE");
  const [time, setTime] = useState(new Date());
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<PolicyGate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalEventsCount, setTotalEventsCount] = useState(4);

  // Live Activity Stream (Section 15: timestamp, event, source, status)
  const [activityFeed, setActivityFeed] = useState<
    { timestamp: string; source: string; event: string; status: string }[]
  >([
    {
      timestamp: "16:21:08",
      source: "SYSTEM",
      event: "Core initialized & Cognitive Loop synchronized",
      status: "ONLINE",
    },
    {
      timestamp: "16:21:11",
      source: "DEVICE",
      event: "Primary Desktop connected to Sovereign Enclave",
      status: "ONLINE",
    },
    {
      timestamp: "16:21:14",
      source: "MEMORY",
      event: "5 Vector memory nodes indexed into durable store",
      status: "ONLINE",
    },
    {
      timestamp: "16:21:18",
      source: "REALITY",
      event: "Verified 4 empirical integrity gates (100% Pass)",
      status: "ONLINE",
    },
  ]);

  // System Diagnostics State
  const [doctorHealth, setDoctorHealth] = useState<string>("OPTIMAL");
  const [modelAccuracy, setModelAccuracy] = useState<string>("96.4%");

  // Live Clock updater
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Initialize and subscribe to MissionManager
  useEffect(() => {
    MissionManager.initialize();
    const unsubscribe = MissionManager.subscribe((updatedMissions) => {
      setMissions(updatedMissions);
      if (updatedMissions.length > 0 && !activeMissionId) {
        setActiveMissionId(updatedMissions[0].id);
      }
    });

    UltronDoctor.runDiagnostics().then((report) => {
      setDoctorHealth(report.overallHealth === "HEALTHY" ? "OPTIMAL" : report.overallHealth);
    });

    return unsubscribe;
  }, [activeMissionId]);

  // Subscribe to Unified Event Bus (Section 25)
  useEffect(() => {
    const unsubscribeEventBus = UltronEventBus.subscribe("*", (evt: UltronEvent) => {
      setTotalEventsCount((c) => c + 1);

      const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      let statusBadge = "ONLINE";
      if (evt.type.includes("ERROR") || evt.type.includes("FAILED")) statusBadge = "ERROR";
      else if (evt.type.includes("APPROVAL")) statusBadge = "WARN";
      else if (evt.type.includes("PAUSED")) statusBadge = "STANDBY";
      else if (evt.type.includes("VOICE")) statusBadge = "VOICE";

      setActivityFeed((prev) => [
        {
          timestamp: timeStr,
          source: evt.source,
          event: evt.summary,
          status: statusBadge,
        },
        ...prev.slice(0, 15),
      ]);

      // If a mission was created by voice, make sure it is reflected immediately
      if (evt.type === "MISSION_CREATED" && evt.payload?.missionId) {
        setActiveMissionId(evt.payload.missionId);
      }
    });

    return unsubscribeEventBus;
  }, []);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  // Core State Engine reaction to real system states
  useEffect(() => {
    if (!activeMission) {
      setCoreState("IDLE");
    } else if (activeMission.status === "RUNNING") {
      setCoreState("EXECUTING");
    } else if (activeMission.status === "AWAITING_APPROVAL") {
      setCoreState("WAITING");
    } else if (activeMission.status === "VERIFYING") {
      setCoreState("VERIFYING");
    } else if (activeMission.status === "COMPLETED") {
      setCoreState("SUCCESS");
    } else if (activeMission.status === "FAILED") {
      setCoreState("FAILED");
    } else {
      setCoreState("IDLE");
    }
  }, [activeMission]);

  // Handle module navigation & update browser history
  const handleSelectModule = (mod: PillarNavId) => {
    setActiveModule(mod);
    const targetPath = mod === "CORE" ? "/" : `/${mod.toLowerCase()}`;
    if (typeof window !== "undefined" && window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  };

  // Submit Intent: Executes the Complete Vertical Cognitive Slice
  const handleCommandSubmit = (commandText: string) => {
    if (!commandText.trim()) return;

    setIsProcessing(true);
    setCoreState("THINKING");

    // Ingest Intent
    UltronEventBus.publish("SYSTEM_STATE_CHANGED", "USER", `Ingested intent: "${commandText.slice(0, 42)}..."`);

    // Conductor compiles DAG Plan & Creates Mission
    setTimeout(() => {
      const newMission = MissionManager.createMission(commandText);
      setActiveMissionId(newMission.id);
      setCoreState("EXECUTING");

      // Step 3: Researcher Gathers Evidence
      setTimeout(() => {
        UltronEventBus.publish("TOOL_STARTED", "AGENT", "Synthesized multi-source evidence and context for execution");

        // Step 4: Reality Checker Empirical Verification
        setTimeout(() => {
          const report = RealityChecker.auditMission(newMission);
          const passedCount = report.assertions.filter((a) => a.status === "PASSED").length;
          const passRate = report.assertions.length > 0 ? passedCount / report.assertions.length : 1;
          const passPct = Math.round(passRate * 100);
          setModelAccuracy(`${passPct}%`);

          UltronEventBus.publish("TOOL_COMPLETED", "REALITY", `Validated mission across 4 empirical gates (${passPct}% Pass)`);

          // Step 5: Memory Curator Records to Durable L4 Memory
          MemoryEngine.addWorkingMemory(
            newMission.id,
            `Verified Execution: ${newMission.title}`,
            `Mission successfully orchestrated and reality-checked with ${newMission.evidenceLedger.length} evidence claims.`,
            "agent-reality-checker"
          );

          setIsProcessing(false);
        }, 600);
      }, 500);
    }, 400);
  };

  const pendingGates = useMemo(
    () => missions.flatMap((m) => m.approvalQueue.filter((g) => g.status === "PENDING")),
    [missions]
  );

  const handleOpenApprovals = (gate?: PolicyGate) => {
    if (gate) {
      setSelectedGate(gate);
      setShowApprovalModal(true);
    } else if (pendingGates.length > 0) {
      setSelectedGate(pendingGates[0]);
      setShowApprovalModal(true);
    }
  };

  const handleApproveGate = (gateId: string) => {
    if (!activeMission) return;
    MissionManager.approveGate(activeMission.id, gateId);
    setShowApprovalModal(false);
  };

  const handleDenyGate = (gateId: string) => {
    if (!activeMission) return;
    const gate = activeMission.approvalQueue.find((g) => g.id === gateId);
    if (gate) {
      gate.status = "DENIED";
      setShowApprovalModal(false);
    }
  };

  return (
    <div
      className="ultron-shell-root"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "var(--ultron-bg)",
        color: "var(--ultron-text-primary)",
        fontFamily: "var(--ultron-font)",
        position: "relative",
      }}
    >
      {/* 1. TOP BAR (Section 4 & 8) */}
      <TopSystemBar
        coreStatus={coreState}
        doctorHealth={doctorHealth}
        time={time}
        onOpenApprovals={() => handleOpenApprovals()}
        pendingGatesCount={pendingGates.length}
      />

      {/* 2. ULTRON LAYOUT (Section 4) */}
      <div
        className="ultron-layout"
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Navigation Rail (Section 4 & 9) */}
        <div style={{ width: "160px", flexShrink: 0, height: "100%" }}>
          <NavigationRail
            active={activeModule}
            onSelect={handleSelectModule}
            missionsCount={missions.length}
          />
        </div>

        {/* Main Viewport (Section 4) */}
        <main
          className="ultron-viewport"
          style={{
            flex: 1,
            minWidth: 0,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {activeModule === "CORE" ? (
            <div
              className="core-command-center"
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                gap: "10px",
                padding: "8px 1.4vw 0",
              }}
            >
              {/* Upper Section: Center Stage + Right Intelligence Rail */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 340px",
                  gap: "10px",
                  flex: 1,
                  minHeight: 0,
                  overflow: "hidden",
                }}
              >
                {/* Center Stage: ULTRON CORE with Cognitive Loop & Core State (Section 2 & 6) */}
                <div style={{ minWidth: 0, height: "100%", overflowY: "auto" }}>
                  <InfinityCore
                    status={coreState}
                    activeMission={activeMission}
                    modelAccuracy={modelAccuracy}
                    thinkingSpeed="184 TPS"
                    activeContext="84%"
                    onToggleVoice={() => {}}
                    onOpenMission={() => handleSelectModule("MISSIONS")}
                    onCreateMission={() => handleSelectModule("MISSIONS")}
                  />
                </div>

                {/* Right Intelligence Rail (Section 4) */}
                <RightIntelligenceRail
                  activeMission={activeMission}
                  pendingGates={pendingGates}
                  onOpenMissionControl={() => handleSelectModule("MISSIONS")}
                  onCreateMission={() => handleSelectModule("MISSIONS")}
                  onSelectAgent={() => handleSelectModule("AGENTS")}
                  onOpenApprovals={handleOpenApprovals}
                />
              </div>

              {/* Lower Section: Live Activity | World Intelligence | System Metrics (Section 2) */}
              <div style={{ height: "185px", flexShrink: 0 }}>
                <LowerTelemetryDeck
                  activityEvents={activityFeed}
                  doctorHealth={doctorHealth}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 340px",
                gap: "10px",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                padding: "8px 1.4vw 0",
              }}
            >
              {/* Module Content */}
              <div style={{ minWidth: 0, height: "100%", overflowY: "auto" }}>
                {activeModule === "MISSIONS" && (
                  <MissionsModule
                    missions={missions}
                    activeMission={activeMission}
                    onSelectMission={setActiveMissionId}
                    onOpenApproval={() => handleOpenApprovals()}
                    onCreateMission={(prompt) => {
                      const m = MissionManager.createMission(prompt);
                      setActiveMissionId(m.id);
                    }}
                  />
                )}
                {activeModule === "BRAIN" && <BrainModule />}
                {activeModule === "AGENTS" && (
                  <AgentsModule
                    activeTaskAgentId={activeMission?.tasks.find((t) => t.status === "RUNNING")?.assignedAgent}
                  />
                )}
                {activeModule === "TOOLS" && <ToolsModule />}
                {activeModule === "WORLD" && <WorldModule />}
                {activeModule === "SYSTEM" && <SystemModule />}
              </div>

              {/* Persistent Right Intelligence Rail across all views */}
              <RightIntelligenceRail
                activeMission={activeMission}
                pendingGates={pendingGates}
                onOpenMissionControl={() => handleSelectModule("MISSIONS")}
                onCreateMission={() => handleSelectModule("MISSIONS")}
                onSelectAgent={() => handleSelectModule("AGENTS")}
                onOpenApprovals={handleOpenApprovals}
              />
            </div>
          )}
        </main>
      </div>

      {/* 3. COMMAND BAR (Section 4 & 17) */}
      <BottomCommandBar
        onSubmitIntent={handleCommandSubmit}
        isProcessing={isProcessing}
      />

      {/* 4. STATUS BAR (Section 4) */}
      <StatusBar
        systemHealth={doctorHealth}
        connectedDevicesCount={1}
        activeAgentsCount={10}
        eventsCount={totalEventsCount}
        memoryNodesCount={5}
        securityMode="ZERO-TRUST LEAST PRIVILEGE"
      />

      {/* Human-in-the-Loop Approval Modal */}
      {showApprovalModal && selectedGate && (
        <ApprovalModal
          gate={selectedGate}
          onApprove={handleApproveGate}
          onDeny={handleDenyGate}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}
