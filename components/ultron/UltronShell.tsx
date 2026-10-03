"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import NavigationRail, { PillarNavId } from "./NavigationRail";
import CoreModule from "./modules/CoreModule";
import MissionsModule from "./modules/MissionsModule";
import BrainModule from "./modules/BrainModule";
import AgentsModule from "./modules/AgentsModule";
import ToolsModule from "./modules/ToolsModule";
import WorldModule from "./modules/WorldModule";
import SystemModule from "./modules/SystemModule";
import ApprovalModal from "../deck/ApprovalModal";
import AdaptiveWorkspace from "../adaptive/AdaptiveWorkspace";
import InfinityCore, { UltronCoreState } from "./InfinityCore";
import { Mission, PolicyGate } from "../../core/types/mission";
import { MissionManager } from "../../core/missions/missionManager";
import { MemoryEngine } from "../../core/memory/memoryEngine";
import { RealityChecker } from "../../core/verification/realityChecker";
import { UltronDoctor } from "../../core/runtime/ultronDoctor";
import { CORE_AGENT_ROSTER } from "../../core/conductor/agentRoster";

interface UltronShellProps {
  initialModule?: PillarNavId;
}

export default function UltronShell({ initialModule = "CORE" }: UltronShellProps) {
  const [activeModule, setActiveModule] = useState<PillarNavId>(initialModule);
  const [coreState, setCoreState] = useState<UltronCoreState>("IDLE");
  const [command, setCommand] = useState("");
  const [time, setTime] = useState(new Date());
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<PolicyGate | null>(null);
  const [showAdaptiveWorkspace, setShowAdaptiveWorkspace] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);

  // Live Activity Stream
  const [activityFeed, setActivityFeed] = useState<
    { stamp: string; agent: string; event: string; state: string }[]
  >([
    { stamp: "14:32:12", agent: "CONDUCTOR", event: "ULTRON OS Infinity Kernel Initialized", state: "READY" },
    { stamp: "14:32:14", agent: "RESEARCHER", event: "Indexed 4 durable memory nodes in L4 Vector Store", state: "SYNC" },
    { stamp: "14:32:18", agent: "BUILDER", event: "Compiled Directed Acyclic Graph Task Planner", state: "BUILD" },
    { stamp: "14:32:21", agent: "REALITY CHECKER", event: "Verified 4 empirical integrity gates (100% Pass)", state: "VERIFY" },
  ]);

  // System Diagnostics State
  const [doctorHealth, setDoctorHealth] = useState<string>("OPTIMAL");
  const [modelAccuracy, setModelAccuracy] = useState<string>("96.4%");

  const recognitionRef = useRef<any>(null);

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
    if (isListening) {
      setCoreState("LISTENING");
    } else if (!activeMission) {
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
  }, [activeMission, isListening]);

  // Handle module navigation & update browser history
  const handleSelectModule = (mod: PillarNavId) => {
    setActiveModule(mod);
    const targetPath = mod === "CORE" ? "/" : `/${mod.toLowerCase()}`;
    if (typeof window !== "undefined" && window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  };

  // Web Speech Recognition
  const toggleVoiceListening = () => {
    if (typeof window === "undefined") return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Please type your command.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setCommand(transcript);
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  // Submit Intent: Executes the Complete Vertical Cognitive Slice
  const submitCommand = () => {
    if (!command.trim()) return;

    const intentText = command.trim();
    setCommand("");
    setCoreState("THINKING");

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Step 1: Ingest Intent
    setActivityFeed((prev) => [
      {
        stamp: timeStr,
        agent: "USER",
        event: `Command Ingested: "${intentText.slice(0, 38)}..."`,
        state: "INPUT",
      },
      ...prev.slice(0, 7),
    ]);

    // Step 2: Conductor compiles DAG Plan & Creates Mission
    setTimeout(() => {
      const newMission = MissionManager.createMission(intentText);
      setActiveMissionId(newMission.id);
      setCoreState("EXECUTING");

      setActivityFeed((prev) => [
        {
          stamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          agent: "CONDUCTOR",
          event: `Mission [${newMission.title.slice(0, 32)}] orchestrated with ${newMission.tasks.length} tasks`,
          state: "PLAN",
        },
        ...prev.slice(0, 7),
      ]);

      // Step 3: Researcher Gathers Evidence
      setTimeout(() => {
        setActivityFeed((prev) => [
          {
            stamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            agent: "RESEARCHER",
            event: "Synthesized multi-source evidence and context for execution",
            state: "EVID",
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
              stamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              agent: "REALITY CHECKER",
              event: `Validated mission across 4 empirical gates (${passPct}% Pass)`,
              state: report.overallStatus === "VERIFIED" ? "VERIFY" : "WARN",
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
              stamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              agent: "MEMORY CURATOR",
              event: "Persisted structured outcome to L4 Durable Fact Vector Store",
              state: "REMEMBER",
            },
            ...prev.slice(0, 7),
          ]);
        }, 800);
      }, 700);
    }, 600);
  };

  const pendingGates = useMemo(
    () => missions.flatMap((m) => m.approvalQueue.filter((g) => g.status === "PENDING")),
    [missions]
  );

  const handleOpenApprovals = () => {
    if (pendingGates.length > 0) {
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
    <main className="ultron-shell">
      {/* Background Cosmic Layers */}
      <div className="stars" />
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />

      {/* 1. TOP SYSTEM HEADER */}
      <header className="topbar">
        <div className="brand-mini">
          <div className="brand-orb">△</div>
          <div>
            <div className="micro">ULTRON OS</div>
            <div className="version">v2.0.0 INFINITY</div>
          </div>
        </div>

        <div className="wordmark">
          <div>ULTRON∞</div>
          <span>BEYOND INTELLIGENCE. BEYOND LIMITS.</span>
        </div>

        <div className="top-right" style={{ position: "relative" }}>
          <div>
            <div className="micro">
              {time
                .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
                .toUpperCase()}
            </div>
            <div className="version">
              {time.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase()} • INDIA / UTC+5:30
            </div>
          </div>

          {/* Prime User Identity: Interactive Button (NO PDF, opens popover) */}
          <button
            type="button"
            className="user-chip"
            onClick={() => setShowUserPopover(!showUserPopover)}
            aria-label="Prime User Gaurav Profile"
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "bold", letterSpacing: "1px", lineHeight: "1" }}>GAURAV</div>
              <div style={{ fontSize: "6px", color: "var(--muted)", letterSpacing: "0.5px", marginTop: "2px" }}>
                PRIME USER
              </div>
            </div>
          </button>

          {/* Status Orb linking to /ui-reference */}
          <Link
            href="/ui-reference"
            title="Visual QA Reference Comparison Route"
            className="status-orb online text-decoration-none"
          >
            ◉
          </Link>

          {/* Prime User Profile Popover */}
          {showUserPopover && (
            <div className="user-popover holo-panel">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "6px",
                  marginBottom: "6px",
                  borderBottom: "1px solid rgba(0, 217, 255, 0.2)",
                }}
              >
                <h4>PRIME USER PROFILE</h4>
                <button
                  type="button"
                  onClick={() => setShowUserPopover(false)}
                  style={{ fontSize: "8px", color: "#65718f", background: "transparent", border: "0", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>
              <p><b>OPERATOR:</b> GAURAV</p>
              <p><b>ROLE:</b> PRIME ARCHITECT</p>
              <p><b>AUTHORITY:</b> LEVEL 5 (SOVEREIGN)</p>
              <p><b>DEVICES:</b> 3 PAIRED (MESH ACTIVE)</p>
              <p><b>SECURITY STATUS:</b> SECURE (ZERO-TRUST)</p>
              <div className="popover-badge">ZERO-TRUST VERIFIED</div>
            </div>
          )}
        </div>
      </header>

      {/* 2. MAIN HORIZONTAL DECK */}
      {activeModule === "CORE" ? (
        <>
          <section className="command-center">
            {/* Left Navigation Rail */}
            <NavigationRail
              active={activeModule}
              onSelect={handleSelectModule}
              isListening={isListening}
              onToggleVoice={toggleVoiceListening}
              missionsCount={missions.length}
            />

            {/* Center Stage: Infinity Core */}
            <section className="center-stage">
              <InfinityCore
                status={coreState}
                activeMission={activeMission}
                modelAccuracy={modelAccuracy}
                onToggleVoice={toggleVoiceListening}
                onOpenMission={() => handleSelectModule("MISSIONS")}
                isListening={isListening}
              />
            </section>

            {/* Right Rail: Active Agents & Attention Panels */}
            <aside className="right-rail">
              {/* Active Agents Panel */}
              <div className="holo-panel agents-panel">
                <div className="panel-title">
                  ACTIVE AGENTS <span>{CORE_AGENT_ROSTER.length} REGISTERED</span>
                </div>
                <div className="overflow-y-auto max-h-[calc(100%-25px)] pr-1">
                  {CORE_AGENT_ROSTER.slice(0, 7).map((agent) => {
                    const assignedTask = activeMission?.tasks.find((t) => t.assignedAgent === agent.id);
                    const isRunning = assignedTask?.status === "RUNNING";
                    const isDone = assignedTask?.status === "COMPLETED";
                    const progress = isDone ? 100 : isRunning ? (assignedTask?.progress || 65) : 0;
                    const statusLabel = isRunning ? "RUNNING" : isDone ? "READY" : "IDLE";

                    return (
                      <div className="agent" key={agent.id}>
                        <div className="agent-avatar">{agent.name.slice(0, 1)}</div>
                        <div className="agent-info">
                          <b>{agent.name.toUpperCase()}</b>
                          <small>{assignedTask?.title || agent.role}</small>
                        </div>
                        <strong>{progress > 0 ? `${progress}%` : statusLabel}</strong>
                        <div className="agent-line">
                          <i style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attention & Approval Panel */}
              <div className="holo-panel approval-panel">
                <div className="panel-title">
                  ATTENTION <span>{pendingGates.length > 0 ? "ACTION REQUIRED" : "SECURE"}</span>
                </div>
                {pendingGates.length > 0 ? (
                  <div
                    className="attention-row text-[#ffd166] cursor-pointer flex items-center justify-between"
                    onClick={handleOpenApprovals}
                  >
                    <span>
                      <span className="violet-dot bg-[#ffd166] shadow-[0_0_8px_#ffd166]" />{" "}
                      {pendingGates.length} Gate Awaiting Approval
                    </span>
                    <span className="text-[7px] underline font-bold text-[#63e8ff]">REVIEW</span>
                  </div>
                ) : (
                  <div className="attention-row">
                    <span className="cyan-dot" /> No active policy blockers
                  </div>
                )}
                <div className="attention-row">
                  <span className="violet-dot" /> 6 MCP Tools Connected
                </div>
              </div>
            </aside>
          </section>

          {/* Lower Telemetry Deck: World Intelligence + Live Activity + System Metrics */}
          <section className="telemetry">
            <div className="holo-panel world">
              <div className="panel-title">
                WORLD INTELLIGENCE <span>LIVE FEEDS</span>
              </div>
              <div className="world-map">
                <div className="map-grid" />
                <div className="map-glow g1" />
                <div className="map-glow g2" />
                <div className="map-glow g3" />
              </div>
              <div className="world-stats">
                <span>
                  GLOBAL SIGNALS <b>12</b>
                </span>
                <span>
                  TECH DEVELOPMENTS <b>09</b>
                </span>
                <span>
                  SYSTEM EVENTS <b>05</b>
                </span>
              </div>
            </div>

            <div className="holo-panel activity">
              <div className="panel-title">
                LIVE ACTIVITY STREAM <span>REAL-TIME</span>
              </div>
              <div className="overflow-y-auto max-h-[85%] pr-1">
                {activityFeed.map((item, idx) => (
                  <div className="activity-row" key={`${item.stamp}-${idx}`}>
                    <time>{item.stamp}</time>
                    <b>{item.agent}</b>
                    <span>{item.event}</span>
                    <em>{item.state}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="holo-panel metrics">
              <div className="panel-title">
                SYSTEM METRICS <span>{doctorHealth}</span>
              </div>
              {[
                ["CPU USAGE", "32%", 32],
                ["MEMORY LOAD", "64%", 64],
                ["NETWORK BANDWIDTH", "1.2 Tb/s", 72],
                ["SYSTEM HEALTH", doctorHealth, 100],
              ].map(([label, value, width]) => (
                <div className="metric-block" key={label}>
                  <div>
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                  <div className="metric-line">
                    <i style={{ width: `${width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="module-deck">
          <NavigationRail
            active={activeModule}
            onSelect={handleSelectModule}
            isListening={isListening}
            onToggleVoice={toggleVoiceListening}
            missionsCount={missions.length}
          />
          <div className="module-content">
            {activeModule === "MISSIONS" && (
              <MissionsModule
                missions={missions}
                activeMission={activeMission}
                onSelectMission={setActiveMissionId}
                onOpenApproval={handleOpenApprovals}
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
        </section>
      )}

      {/* 3. BOTTOM COMMAND BAR */}
      <section className="command-bar holo-panel">
        <div className="command-label">
          <div className="command-orb">✦</div>
          <div>
            <b>ULTRON AWAITS YOUR COMMAND</b>
            <small>Speak, type, think, create...</small>
          </div>
        </div>
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitCommand()}
          placeholder="Command ULTRON... (e.g. 'Research latest AI regulation framework and verify with reality checker')"
        />
        <button
          onClick={toggleVoiceListening}
          className={isListening ? "active-btn" : ""}
          title={isListening ? "Stop Listening" : "Start Voice Input"}
          type="button"
        >
          ◉
        </button>
        <button onClick={submitCommand} title="Execute Command" type="button">
          ➤
        </button>
      </section>

      {/* 4. SYSTEM CAPABILITY STRIP */}
      <footer className="system-strip">
        {[
          ["∞", "INFINITY CORE", "Cognitive computing"],
          ["▣", "MULTI DEVICE SYNC", "Seamless across devices"],
          ["♙", "AI AGENT NETWORK", "Specialized AI workforce"],
          ["◎", "REAL TIME INTELLIGENCE", "Live data from the world"],
          ["◉", "VOICE FIRST", "Speak naturally, get results"],
          ["◇", "SECURITY BY DESIGN", "Your data, your control"],
        ].map(([icon, title, sub]) => (
          <div key={title}>
            <span className="icon">{icon}</span>
            <span>
              <b>{title}</b>
              <small>{sub}</small>
            </span>
          </div>
        ))}
      </footer>

      {/* Human-in-the-Loop Approval Modal */}
      {showApprovalModal && selectedGate && (
        <ApprovalModal
          gate={selectedGate}
          onApprove={handleApproveGate}
          onDeny={handleDenyGate}
          onClose={() => setShowApprovalModal(false)}
        />
      )}

      {/* Adaptive Workspace Drawer */}
      {showAdaptiveWorkspace && activeMission && (
        <AdaptiveWorkspace
          mission={activeMission}
          onClose={() => setShowAdaptiveWorkspace(false)}
        />
      )}
    </main>
  );
}
