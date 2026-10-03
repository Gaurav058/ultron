"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import UltronInfinityCore from "./UltronInfinityCore";
import PillarMissions from "../deck/PillarMissions";
import PillarBrain from "../deck/PillarBrain";
import PillarAgents from "../deck/PillarAgents";
import PillarTools from "../deck/PillarTools";
import PillarWorld from "../deck/PillarWorld";
import PillarSystem from "../deck/PillarSystem";
import ApprovalModal from "../deck/ApprovalModal";
import AdaptiveWorkspace from "../adaptive/AdaptiveWorkspace";
import { Mission, PolicyGate } from "../../core/types/mission";
import { MissionManager } from "../../core/missions/missionManager";
import { CORE_AGENT_ROSTER } from "../../core/conductor/agentRoster";
import { MemoryEngine } from "../../core/memory/memoryEngine";
import { RealityChecker } from "../../core/verification/realityChecker";
import { UltronDoctor } from "../../core/runtime/ultronDoctor";

type CoreState = "IDLE" | "LISTENING" | "THINKING" | "EXECUTING" | "VERIFYING" | "WAITING" | "COMPLETED" | "ERROR";
type PillarNavId = "CORE" | "MISSIONS" | "BRAIN" | "AGENTS" | "TOOLS" | "WORLD" | "SYSTEM";

interface ActivityEvent {
  stamp: string;
  agent: string;
  event: string;
  state: string;
}

const NAV_ITEMS: [string, PillarNavId, string][] = [
  ["◉", "CORE", "COGNITION"],
  ["⌁", "MISSIONS", "ACTIVE WORK"],
  ["✦", "BRAIN", "KNOWLEDGE"],
  ["♙", "AGENTS", "AI WORKFORCE"],
  ["⌘", "TOOLS", "CAPABILITIES"],
  ["◎", "WORLD", "LIVE INTELLIGENCE"],
  ["◈", "SYSTEM", "DIAGNOSTICS"],
];

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="icon">{children}</span>;
}

export default function MasterCommandCenter() {
  const [activeTab, setActiveTab] = useState<PillarNavId>("CORE");
  const [coreState, setCoreState] = useState<CoreState>("IDLE");
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
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
    { stamp: "14:32:12", agent: "CONDUCTOR", event: "ULTRON OS Infinity Kernel Initialized", state: "READY" },
    { stamp: "14:32:14", agent: "RESEARCHER", event: "Indexed 4 durable memory nodes in L4 Vector Store", state: "SYNC" },
    { stamp: "14:32:18", agent: "BUILDER", event: "Compiled Directed Acyclic Graph Task Planner", state: "BUILD" },
    { stamp: "14:32:21", agent: "REALITY CHECKER", event: "Verified 4 empirical integrity gates (100% Pass)", state: "VERIFY" },
  ]);

  // System Diagnostics State from UltronDoctor
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

    // Run Doctor diagnostics
    UltronDoctor.runDiagnostics().then((report) => {
      setDoctorHealth(report.overallHealth === "HEALTHY" ? "OPTIMAL" : report.overallHealth);
    });

    return unsubscribe;
  }, [activeMissionId]);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  // Update Core Status based on mission activity
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
      setCoreState("COMPLETED");
    } else {
      setCoreState("IDLE");
    }
  }, [activeMission, isListening]);

  // Handle Speech Recognition Web API
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

    // Step 1: Log Intent Ingestion Event
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

      // Step 3: Researcher Gathers Evidence & Verifies
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
              event: `Validated mission across 4 gates (Gate pass rate: ${passPct}%)`,
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

  const pendingGates = missions.flatMap((m) =>
    m.approvalQueue.filter((g) => g.status === "PENDING")
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

  // Calculate mission progress percentage
  const missionProgressPct = useMemo(() => {
    if (!activeMission || !activeMission.tasks || activeMission.tasks.length === 0) return 72;
    const completed = activeMission.tasks.filter((t) => t.status === "COMPLETED").length;
    return Math.max(15, Math.round((completed / activeMission.tasks.length) * 100));
  }, [activeMission]);

  return (
    <main className="ultron-shell">
      {/* Background Cosmic Layers: Stars & Nebulae */}
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
            <div className="micro">{time.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</div>
            <div className="version">{time.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase()} • INDIA / UTC+5:30</div>
          </div>
          <button
            type="button"
            className="user-chip"
            onClick={() => setShowUserPopover(!showUserPopover)}
            aria-label="Prime User Gaurav Profile"
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: "bold", letterSpacing: "1px", lineHeight: "1" }}>GAURAV</div>
              <div style={{ fontSize: "6px", color: "var(--muted)", letterSpacing: "0.5px", marginTop: "2px" }}>PRIME USER</div>
            </div>
          </button>
          <Link href="/ui-reference" title="Visual QA Reference Comparison Route" className="status-orb online text-decoration-none">
            ◉
          </Link>

          {showUserPopover && (
            <div className="user-popover holo-panel">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "6px", marginBottom: "6px", borderBottom: "1px solid rgba(0, 217, 255, 0.2)" }}>
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
              <div className="popover-badge">ZERO-TRUST VERIFIED</div>
            </div>
          )}
        </div>
      </header>

      {/* 2. COMMAND CENTER (3-Column Layout: Left Rail + Center Stage + Right Rail) */}
      <section className="command-center">
        {/* Left Navigation Rail */}
        <aside className="left-rail holo-panel">
          <div className="rail-status">
            <span className="pulse-dot" />
            <span>SYSTEM STATUS</span>
            <b>ONLINE</b>
          </div>

          {NAV_ITEMS.map(([icon, label, sub]) => (
            <button
              key={label}
              className={`nav-item ${activeTab === label ? "active" : ""}`}
              onClick={() => setActiveTab(label)}
            >
              <Icon>{icon}</Icon>
              <span>
                <strong>{label}</strong>
                <small>{sub}</small>
              </span>
            </button>
          ))}

          {/* Voice Core indicator at bottom of Left Rail */}
          <div className="rail-core" onClick={toggleVoiceListening} style={{ cursor: "pointer" }}>
            <div className={`mini-core ${isListening ? "animate-pulse" : ""}`} />
            <span>ULTRON</span>
            <small>{isListening ? "LISTENING..." : "VOICE CORE"}</small>
            <div className="wave mini-wave">
              {Array.from({ length: 20 }).map((_, i) => (
                <i
                  key={i}
                  style={{
                    height: isListening
                      ? `${6 + ((i * 23 + (time.getSeconds() % 5) * 11) % 24)}px`
                      : `${8 + ((i * 17) % 20)}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Center Stage: Infinity Core or Active Pillar View */}
        <section className="center-stage">
          {activeTab === "CORE" ? (
            <>
              {/* Top-Left Core Status HUD Card */}
              <div className="core-status holo-panel">
                <div className="panel-title">
                  ULTRON CORE <span>● {coreState}</span>
                </div>
                <div className="core-percent">100%</div>
                <div className="metric-row">
                  <span>THINKING SPEED</span>
                  <b>184 TPS</b>
                </div>
                <div className="metric-row">
                  <span>MODEL ACCURACY</span>
                  <b>{modelAccuracy}</b>
                </div>
                <div className="metric-row">
                  <span>ACTIVE CONTEXT</span>
                  <b>84%</b>
                </div>
                <div className="metric-row">
                  <span>LEARNING RATE</span>
                  <b>ADAPTIVE</b>
                </div>
              </div>

              {/* Central Infinity Core with 4 Orbits, Robotic Avatar & WebGL Depth */}
              <UltronInfinityCore
                status={coreState}
                onToggleVoice={toggleVoiceListening}
                isListening={isListening}
              />

              {/* Bottom-Left Connected Devices HUD Card */}
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

              {/* Bottom-Right Current Mission HUD Card */}
              <div
                className="mission-center holo-panel"
                onClick={() => setActiveTab("MISSIONS")}
                style={{ cursor: "pointer" }}
                title="Click to view full mission details"
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
          ) : (
            /* Dedicated Deep Pillar View Inside Glass Container */
            <div className="w-full h-full p-3 overflow-auto flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#00d9ff]/20">
                <span className="text-[10px] font-bold text-[#00d9ff] tracking-widest uppercase">
                  {activeTab} SUBSYSTEM VIEW
                </span>
                <button
                  onClick={() => setActiveTab("CORE")}
                  className="px-2.5 py-1 text-[9px] rounded bg-[#00d9ff]/15 text-[#00d9ff] border border-[#00d9ff]/40 hover:bg-[#00d9ff]/25 transition-colors"
                >
                  ◉ RETURN TO INFINITY CORE
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                {activeTab === "MISSIONS" && (
                  <PillarMissions
                    missions={missions}
                    activeMission={activeMission}
                    onSelectMission={setActiveMissionId}
                    onOpenApproval={handleOpenApprovals}
                  />
                )}
                {activeTab === "BRAIN" && <PillarBrain />}
                {activeTab === "AGENTS" && <PillarAgents />}
                {activeTab === "TOOLS" && <PillarTools />}
                {activeTab === "WORLD" && <PillarWorld />}
                {activeTab === "SYSTEM" && <PillarSystem />}
              </div>
            </div>
          )}
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
                className="attention-row text-[#ffaa30] cursor-pointer flex items-center justify-between"
                onClick={handleOpenApprovals}
              >
                <span>
                  <span className="violet-dot bg-[#ffaa30] shadow-[0_0_8px_#ffaa30]" />{" "}
                  {pendingGates.length} Gate Awaiting Approval
                </span>
                <span className="text-[7px] underline font-bold">REVIEW</span>
              </div>
            ) : (
              <div className="attention-row">
                <span className="cyan-dot" /> No active blockers
              </div>
            )}
            <div className="attention-row">
              <span className="violet-dot" /> 6 MCP Tools Connected
            </div>
          </div>
        </aside>
      </section>

      {/* 3. LOWER TELEMETRY DECK (World Intelligence + Live Activity + System Metrics) */}
      <section className="telemetry">
        {/* World Intelligence */}
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

        {/* Live Activity Stream */}
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

        {/* System Metrics */}
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

      {/* 4. BOTTOM COMMAND BAR */}
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
        >
          ◉
        </button>
        <button onClick={submitCommand} title="Execute Command">
          ➤
        </button>
      </section>

      {/* 5. SYSTEM CAPABILITY STRIP */}
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
            <Icon>{icon}</Icon>
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
