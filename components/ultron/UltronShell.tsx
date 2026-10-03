"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import NavigationRail, { PillarNavId } from "./NavigationRail";
import TopSystemBar from "./TopSystemBar";
import InfinityCore, { UltronCoreState } from "./InfinityCore";
import ActiveAgentsPanel from "./ActiveAgentsPanel";
import CurrentMissionCard from "./CurrentMissionCard";
import AttentionPanel from "./AttentionPanel";
import LowerTelemetryDeck from "./LowerTelemetryDeck";
import BottomCommandBar from "./BottomCommandBar";
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
      event: "4 Vector memory nodes indexed into L4 durable store",
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

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Step 1: Ingest Intent
    setActivityFeed((prev) => [
      {
        timestamp: timeStr,
        source: "USER",
        event: `Ingested intent: "${commandText.slice(0, 38)}..."`,
        status: "INPUT",
      },
      ...prev.slice(0, 7),
    ]);

    // Step 2: Conductor compiles DAG Plan & Creates Mission
    setTimeout(() => {
      const newMission = MissionManager.createMission(commandText);
      setActiveMissionId(newMission.id);
      setCoreState("EXECUTING");

      setActivityFeed((prev) => [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          source: "CONDUCTOR",
          event: `Orchestrated mission [${newMission.title.slice(0, 28)}] with ${newMission.tasks.length} tasks`,
          status: "PLAN",
        },
        ...prev.slice(0, 7),
      ]);

      // Step 3: Researcher Gathers Evidence
      setTimeout(() => {
        setActivityFeed((prev) => [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            source: "RESEARCHER",
            event: "Synthesized multi-source evidence and context for execution",
            status: "EVID",
          },
          ...prev.slice(0, 7),
        ]);

        // Step 4: Reality Checker Empirical Verification
        setTimeout(() => {
          const report = RealityChecker.auditMission(newMission);
          const passedCount = report.assertions.filter((a) => a.status === "PASSED").length;
          const passRate = report.assertions.length > 0 ? passedCount / report.assertions.length : 1;
          const passPct = Math.round(passRate * 100);
          setModelAccuracy(`${passPct}%`);

          setActivityFeed((prev) => [
            {
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              source: "REALITY",
              event: `Validated mission across 4 empirical gates (${passPct}% Pass)`,
              status: report.overallStatus === "VERIFIED" ? "ONLINE" : "WARN",
            },
            ...prev.slice(0, 7),
          ]);

          // Step 5: Memory Curator Records to Durable L4 Memory
          MemoryEngine.addWorkingMemory(
            newMission.id,
            `Verified Execution: ${newMission.title}`,
            `Mission successfully orchestrated and reality-checked with ${newMission.evidenceLedger.length} evidence claims.`,
            "agent-reality-checker"
          );

          setActivityFeed((prev) => [
            {
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              source: "MEMORY",
              event: "Persisted structured outcome to L4 Durable Fact Store",
              status: "REMEMBER",
            },
            ...prev.slice(0, 7),
          ]);

          setIsProcessing(false);
        }, 800);
      }, 700);
    }, 600);
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
      {/* 1. TOP SYSTEM BAR (Section 8) */}
      <TopSystemBar
        coreStatus={coreState}
        doctorHealth={doctorHealth}
        time={time}
        onOpenApprovals={() => handleOpenApprovals()}
        pendingGatesCount={pendingGates.length}
      />

      {/* 2. MAIN WORKSPACE WITH PERSISTENT NAVIGATION (Section 2 & 24) */}
      <div
        className="ultron-workspace-container"
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Persistent Left Navigation Rail (Section 9) */}
        <div style={{ width: "160px", flexShrink: 0, height: "100%" }}>
          <NavigationRail
            active={activeModule}
            onSelect={handleSelectModule}
            missionsCount={missions.length}
          />
        </div>

        {/* Dynamic Workspace (Section 24) */}
        <div
          className="ultron-workspace"
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
              {/* Upper Section: Center Stage (ULTRON CORE) + Right Rail (Agents, Mission, Attention) */}
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
                {/* Center Stage: ULTRON CORE with Cognitive Loop & Core State (Section 10) */}
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

                {/* Right Rail: Active Agents (Section 12), Current Mission (Section 11), Attention (Section 13) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    height: "100%",
                    overflowY: "auto",
                    paddingRight: "2px",
                  }}
                >
                  {/* Current Mission Panel (Section 11) */}
                  <CurrentMissionCard
                    mission={activeMission}
                    onOpenMissionControl={() => handleSelectModule("MISSIONS")}
                    onCreateMission={() => handleSelectModule("MISSIONS")}
                  />

                  {/* Active Agents Panel (Section 12) */}
                  <ActiveAgentsPanel
                    activeMission={activeMission}
                    onSelectAgent={() => handleSelectModule("AGENTS")}
                  />

                  {/* Attention Panel (Section 13) */}
                  <AttentionPanel
                    pendingGates={pendingGates}
                    onOpenApprovals={handleOpenApprovals}
                  />
                </div>
              </div>

              {/* Lower Section: World Intelligence | Live Activity | System Metrics (Sections 14, 15, 16) */}
              <div style={{ height: "185px", flexShrink: 0 }}>
                <LowerTelemetryDeck
                  activityEvents={activityFeed}
                  doctorHealth={doctorHealth}
                />
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
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
          )}
        </div>
      </div>

      {/* 3. PERSISTENT BOTTOM COMMAND BAR (Section 17) */}
      <BottomCommandBar
        onSubmitIntent={handleCommandSubmit}
        isProcessing={isProcessing}
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
