"use client";

import React, { useState } from "react";
import { Mission, MissionTask } from "../../../core/types/mission";
import { MissionManager } from "../../../core/missions/missionManager";
import { RealityChecker } from "../../../core/verification/realityChecker";

type MissionFilter = "ALL" | "ACTIVE" | "QUEUED" | "COMPLETED" | "FAILED";

interface MissionsModuleProps {
  missions: Mission[];
  activeMission?: Mission;
  onSelectMission: (missionId: string) => void;
  onOpenApproval: () => void;
  onCreateMission?: (title: string) => void;
}

export default function MissionsModule({
  missions,
  activeMission,
  onSelectMission,
  onOpenApproval,
  onCreateMission,
}: MissionsModuleProps) {
  const [filter, setFilter] = useState<MissionFilter>("ALL");
  const [newMissionPrompt, setNewMissionPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"PLAN" | "VERIFICATION" | "EVIDENCE" | "AUDIT">("PLAN");

  const currentMission = activeMission || missions[0];

  const handleAdvanceTask = (taskId: string) => {
    if (!currentMission) return;
    MissionManager.completeTask(currentMission.id, taskId);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionPrompt.trim()) return;
    if (onCreateMission) {
      onCreateMission(newMissionPrompt.trim());
    } else {
      const created = MissionManager.createMission(newMissionPrompt.trim());
      onSelectMission(created.id);
    }
    setNewMissionPrompt("");
  };

  const filteredMissions = missions.filter((m) => {
    if (filter === "ACTIVE") return m.status === "RUNNING" || m.status === "AWAITING_APPROVAL" || m.status === "VERIFYING";
    if (filter === "QUEUED") return m.status === "CREATED" || m.status === "PLANNING";
    if (filter === "COMPLETED") return m.status === "COMPLETED";
    if (filter === "FAILED") return m.status === "FAILED";
    return true;
  });

  const completedTasks = currentMission?.tasks.filter((t) => t.status === "COMPLETED") || [];
  const percentComplete = currentMission
    ? Math.round((completedTasks.length / Math.max(1, currentMission.tasks.length)) * 100)
    : 0;

  const realityReport = currentMission ? RealityChecker.auditMission(currentMission) : null;

  return (
    <div className="flex-1 flex flex-col p-3 overflow-hidden select-none">
      {/* Subsystem Header */}
      <div className="holo-panel p-3 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#63e8ff] font-bold tracking-widest uppercase">
              MISSIONS COGNITIVE ORCHESTRATOR
            </span>
            <span className="text-[7px] px-1.5 py-0.2 rounded bg-[#8d75ff]/20 text-[#8d75ff] border border-[#8d75ff]/30 font-mono">
              DAG EXECUTION ENGINE
            </span>
          </div>
          <div className="text-[8px] text-[#8d9ab5]">
            Autonomous decomposition of user intent into bounded, verifiable, human-governed execution graphs.
          </div>
        </div>

        {/* Quick Stats & Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#02030a]/80 p-0.5 rounded border border-[#6e8cff]/20">
            {(["ALL", "ACTIVE", "QUEUED", "COMPLETED", "FAILED"] as MissionFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 text-[8px] rounded transition-colors ${
                  filter === f
                    ? "bg-[#63e8ff] text-[#02030a] font-bold shadow-[0_0_8px_rgba(99,232,255,0.4)]"
                    : "text-[#8d9ab5] hover:text-[#dce4f5]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="text-[8px] font-mono text-[#8d9ab5] hidden lg:block">
            TOTAL: <b className="text-[#63e8ff]">{missions.length}</b> | ACTIVE:{" "}
            <b className="text-[#5ff0a0]">
              {missions.filter((m) => m.status === "RUNNING" || m.status === "VERIFYING").length}
            </b>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Mission List (Left) + Mission Detail Inspector (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0 overflow-hidden">
        {/* Left Column (4 cols): Mission Cards & Creation Input */}
        <div className="lg:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
          {/* Quick Mission Creator */}
          <form onSubmit={handleCreateSubmit} className="holo-panel p-2 flex gap-1.5 shrink-0">
            <input
              type="text"
              value={newMissionPrompt}
              onChange={(e) => setNewMissionPrompt(e.target.value)}
              placeholder="Orchestrate new mission..."
              className="flex-1 bg-[#02030a]/90 border border-[#6e8cff]/25 px-2 py-1 text-[8px] text-[#dce4f5] rounded outline-none focus:border-[#63e8ff]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-[8px] font-bold rounded bg-[#63e8ff]/20 text-[#63e8ff] border border-[#63e8ff]/40 hover:bg-[#63e8ff]/30 cursor-pointer"
            >
              DISPATCH
            </button>
          </form>

          {/* Mission List */}
          <div className="holo-panel flex-1 p-2 overflow-y-auto space-y-1.5">
            <div className="panel-title mb-1">
              MISSION QUEUE <span>{filteredMissions.length} RECORDED</span>
            </div>

            {filteredMissions.length === 0 ? (
              <div className="text-[8px] text-[#5d6985] py-8 text-center font-mono">
                NO MISSIONS IN THIS CATEGORY
              </div>
            ) : (
              filteredMissions.map((m) => {
                const isSelected = currentMission?.id === m.id;
                const tasksDone = m.tasks.filter((t) => t.status === "COMPLETED").length;
                const pct = Math.round((tasksDone / Math.max(1, m.tasks.length)) * 100);

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMission(m.id)}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#63e8ff]/10 border-[#63e8ff] shadow-[0_0_12px_rgba(99,232,255,0.15)]"
                        : "bg-[#060918]/60 border-[#6e8cff]/15 hover:border-[#6e8cff]/35"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[7px] font-mono text-[#63e8ff] truncate">
                        ID: {m.id.slice(0, 16)}
                      </span>
                      <span
                        className={`text-[6px] px-1 py-0.2 rounded font-bold uppercase ${
                          m.status === "COMPLETED"
                            ? "bg-[#5ff0a0]/20 text-[#5ff0a0] border border-[#5ff0a0]/30"
                            : m.status === "RUNNING"
                            ? "bg-[#63e8ff]/20 text-[#63e8ff] border border-[#63e8ff]/30 animate-pulse"
                            : m.status === "AWAITING_APPROVAL"
                            ? "bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <b className="text-[9px] text-[#dce4f5] line-clamp-1 block mb-0.5">
                      {m.title}
                    </b>
                    <p className="text-[7px] text-[#8d9ab5] line-clamp-1 mb-1.5">
                      {m.objective}
                    </p>

                    <div className="mission-progress mb-1">
                      <span style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-[6px] text-[#5d6985] font-mono">
                      <span>TASKS: {tasksDone}/{m.tasks.length}</span>
                      <span>AGENTS: {m.activeAgents?.length || 0}</span>
                      <span>{pct}% COMPLETE</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (8 cols): Mission Detail Inspector */}
        <div className="lg:col-span-8 flex flex-col gap-2 min-h-0 overflow-hidden">
          {currentMission ? (
            <div className="holo-panel flex-1 p-3 flex flex-col min-h-0 overflow-hidden">
              {/* Mission Title Header */}
              <div className="border-b border-[#6e8cff]/15 pb-2 mb-2 flex items-start justify-between gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-[#63e8ff]/15 text-[#63e8ff] border border-[#63e8ff]/30">
                      ID: {currentMission.id}
                    </span>
                    <span className="text-[8px] font-mono text-[#8d9ab5]">
                      PRIORITY: <b className="text-[#ffd166]">{currentMission.priority}</b>
                    </span>
                    <span className="text-[8px] font-mono text-[#8d9ab5]">
                      STATUS: <b className="text-[#5ff0a0]">{currentMission.status}</b>
                    </span>
                  </div>
                  <h2 className="text-[12px] font-bold text-[#dce4f5] tracking-wide">
                    {currentMission.title}
                  </h2>
                  <p className="text-[8px] text-[#8d9ab5] mt-0.5">
                    {currentMission.objective}
                  </p>
                </div>

                {/* Spend & Progress HUD */}
                <div className="text-right shrink-0">
                  <div className="text-[7px] text-[#5d6985]">DAG COMPLETION</div>
                  <div className="text-[14px] font-bold text-[#63e8ff]">{percentComplete}%</div>
                  <div className="text-[7px] text-[#8d9ab5] font-mono">
                    TOKENS: {currentMission.budget.tokenSpend.toLocaleString()} | COST: ${currentMission.budget.estimatedCostUsd.toFixed(3)}
                  </div>
                </div>
              </div>

              {/* Inspector Tabs */}
              <div className="flex items-center gap-1 border-b border-[#6e8cff]/15 pb-1 mb-2 shrink-0">
                {(["PLAN", "VERIFICATION", "EVIDENCE", "AUDIT"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-0.5 text-[8px] rounded transition-colors ${
                      activeTab === tab
                        ? "bg-[#8d75ff]/20 text-[#8d75ff] border border-[#8d75ff]/40 font-bold"
                        : "text-[#8d9ab5] hover:text-[#dce4f5]"
                    }`}
                  >
                    {tab === "PLAN" ? "DAG PLAN & TASKS" : tab}
                  </button>
                ))}
                {currentMission.approvalQueue.some((g) => g.status === "PENDING") && (
                  <button
                    type="button"
                    onClick={onOpenApproval}
                    className="ml-auto px-2 py-0.5 text-[8px] font-bold rounded bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 animate-pulse"
                  >
                    ⚠ PENDING POLICY APPROVAL
                  </button>
                )}
              </div>

              {/* Inspector Content Body */}
              <div className="flex-1 overflow-y-auto pr-1">
                {activeTab === "PLAN" && (
                  <div className="space-y-2">
                    <div className="panel-title mb-1">
                      DIRECTED ACYCLIC GRAPH (DAG) TASKS <span>{currentMission.tasks.length} NODES</span>
                    </div>

                    {currentMission.tasks.map((task: MissionTask, idx) => {
                      const isComplete = task.status === "COMPLETED";
                      const isRunning = task.status === "RUNNING";
                      const isAwaiting = task.status === "AWAITING_APPROVAL";

                      return (
                        <div
                          key={task.id}
                          className="p-2 rounded border border-[#6e8cff]/15 bg-[#030615]/70 flex items-start justify-between gap-2"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#080d26] border border-[#6e8cff]/30 text-[7px] font-mono flex items-center justify-center text-[#63e8ff] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <b className="text-[9px] text-[#dce4f5]">{task.title}</b>
                                <span
                                  className={`text-[6px] px-1 py-0.1 rounded font-bold uppercase ${
                                    isComplete
                                      ? "bg-[#5ff0a0]/20 text-[#5ff0a0] border border-[#5ff0a0]/30"
                                      : isRunning
                                      ? "bg-[#63e8ff]/20 text-[#63e8ff] border border-[#63e8ff]/30 animate-pulse"
                                      : isAwaiting
                                      ? "bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30"
                                      : "bg-zinc-800 text-zinc-400"
                                  }`}
                                >
                                  {task.status}
                                </span>
                              </div>
                              <p className="text-[7px] text-[#8d9ab5]">{task.description}</p>
                              <div className="flex items-center gap-3 mt-1 text-[6px] text-[#5d6985] font-mono">
                                <span>AGENT: <b className="text-[#8d75ff]">{task.assignedAgent}</b></span>
                                <span>PROGRESS: {task.progress}%</span>
                                <span>DEPS: {task.dependencies.length ? task.dependencies.join(", ") : "NONE"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1">
                            {!isComplete && (
                              <button
                                type="button"
                                onClick={() => handleAdvanceTask(task.id)}
                                className="px-2 py-0.5 text-[7px] rounded bg-[#63e8ff]/15 text-[#63e8ff] border border-[#63e8ff]/30 hover:bg-[#63e8ff]/25 cursor-pointer"
                              >
                                EXECUTE
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === "VERIFICATION" && (
                  <div className="space-y-2">
                    <div className="panel-title mb-1">
                      REALITY CHECKER AUDIT REPORT <span>EMPIRICAL GATES</span>
                    </div>
                    {realityReport ? (
                      <div className="space-y-1.5">
                        <div className="p-2 rounded bg-[#030615] border border-[#6e8cff]/20 flex items-center justify-between">
                          <span className="text-[8px] text-[#8d9ab5]">OVERALL VERIFICATION STATUS:</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                            realityReport.overallStatus === "VERIFIED"
                              ? "bg-[#5ff0a0]/20 text-[#5ff0a0] border border-[#5ff0a0]/40"
                              : "bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40"
                          }`}>
                            {realityReport.overallStatus}
                          </span>
                        </div>
                        {realityReport.assertions.map((assertion, aIdx) => (
                          <div
                            key={aIdx}
                            className="p-2 rounded border border-[#6e8cff]/15 bg-[#030615]/60 flex items-start justify-between"
                          >
                            <div>
                              <div className="text-[8px] font-bold text-[#dce4f5]">{assertion.gate}: {assertion.details}</div>
                              <div className="text-[7px] text-[#8d9ab5] mt-0.5">SCORE: {(assertion.score * 100).toFixed(0)}% | STAMP: {assertion.timestamp}</div>
                            </div>
                            <span className={`text-[7px] font-bold px-1 py-0.2 rounded ${
                              assertion.status === "PASSED" ? "text-[#5ff0a0]" : "text-[#ffd166]"
                            }`}>
                              {assertion.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[8px] text-[#5d6985] py-4 text-center">NO AUDIT REPORT GENERATED</div>
                    )}
                  </div>
                )}

                {activeTab === "EVIDENCE" && (
                  <div className="space-y-2">
                    <div className="panel-title mb-1">
                      EVIDENCE LEDGER <span>{currentMission.evidenceLedger.length} ARTIFACTS</span>
                    </div>
                    {currentMission.evidenceLedger.length === 0 ? (
                      <div className="text-[8px] text-[#5d6985] py-4 text-center">NO EVIDENCE CLAIMS FILED</div>
                    ) : (
                      currentMission.evidenceLedger.map((ev, eIdx) => (
                        <div key={eIdx} className="p-2 rounded border border-[#6e8cff]/15 bg-[#030615]/60">
                          <div className="flex items-center justify-between text-[7px] text-[#63e8ff] font-mono mb-0.5">
                            <span>{ev.title || `CLAIM #${eIdx + 1}`}</span>
                            <span>TYPE: {ev.claimType} | CONF: {(ev.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <p className="text-[8px] text-[#dce4f5]">{ev.snippet}</p>
                          <div className="text-[6px] text-[#5d6985] mt-1 font-mono">
                            SOURCE: {ev.sourceUri} | EXTRACTED: {ev.extractedAt}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "AUDIT" && (
                  <div className="space-y-2">
                    <div className="panel-title mb-1">
                      POLICY APPROVAL QUEUE & AUDIT TRACE
                    </div>
                    {currentMission.approvalQueue.map((gate) => (
                      <div key={gate.id} className="p-2 rounded border border-[#6e8cff]/15 bg-[#030615]/60 flex items-center justify-between">
                        <div>
                          <div className="text-[8px] font-bold text-[#dce4f5]">{gate.riskLevel} GATE: {gate.action}</div>
                          <p className="text-[7px] text-[#8d9ab5]">{gate.reason}</p>
                        </div>
                        <span className={`text-[7px] font-bold px-1.5 py-0.2 rounded ${
                          gate.status === "PENDING"
                            ? "bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30"
                            : "bg-[#5ff0a0]/20 text-[#5ff0a0] border border-[#5ff0a0]/30"
                        }`}>
                          {gate.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="holo-panel flex-1 flex items-center justify-center text-[9px] text-[#5d6985] font-mono">
              SELECT A MISSION FROM THE QUEUE TO INSPECT
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
