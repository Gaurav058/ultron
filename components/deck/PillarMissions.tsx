"use client";

import React, { useState } from "react";
import { Mission, MissionTask } from "../../core/types/mission";
import { MissionManager } from "../../core/missions/missionManager";

interface PillarMissionsProps {
  missions: Mission[];
  activeMission?: Mission;
  onSelectMission: (missionId: string) => void;
  onOpenApproval: () => void;
}

export default function PillarMissions({
  missions,
  activeMission,
  onSelectMission,
  onOpenApproval,
}: PillarMissionsProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const mission = activeMission || missions[0];

  const handleAdvanceTask = (taskId: string) => {
    if (!mission) return;
    MissionManager.completeTask(mission.id, taskId);
  };

  const getStatusColor = (status: MissionTask["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "RUNNING":
        return "bg-[#ffaa30]/20 text-[#ffcc66] border-[#ffaa30]/60 animate-pulse";
      case "AWAITING_APPROVAL":
        return "bg-amber-500/20 text-amber-300 border-amber-500/60";
      case "FAILED":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-zinc-800/40 text-zinc-400 border-zinc-700/50";
    }
  };

  if (!mission) {
    return (
      <div className="w-full h-[calc(100vh-60px)] mt-[60px] flex items-center justify-center font-mono text-zinc-500">
        NO MISSIONS CREATED YET. TRANSMIT AN INTENT FROM 01 CORE.
      </div>
    );
  }

  const completedTasks = mission.tasks.filter((t) => t.status === "COMPLETED");
  const percentComplete = Math.round((completedTasks.length / Math.max(1, mission.tasks.length)) * 100);

  return (
    <div className="w-full min-h-[calc(100vh-60px)] mt-[60px] p-6 font-mono text-xs text-zinc-200 bg-[#050302] overflow-y-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_24px_rgba(255,170,48,0.1)] mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffaa30]/20 text-[#ffcc66] font-bold">
              MISSION ID: {mission.id}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              mission.status === "COMPLETED"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : mission.status === "AWAITING_APPROVAL"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
            }`}>
              STATUS: {mission.status}
            </span>
            <span className="text-[10px] text-zinc-400">PRIORITY: {mission.priority}</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-zinc-100">{mission.title}</h1>
          <p className="text-zinc-400 text-[11px] mt-1 line-clamp-2">{mission.objective}</p>
        </div>

        {/* Progress & Quick Stats */}
        <div className="flex items-center gap-6 border-l border-zinc-800 pl-6">
          <div>
            <div className="text-[10px] text-zinc-500">DAG PROGRESS</div>
            <div className="text-xl font-bold text-[#ffcc66]">{percentComplete}%</div>
            <div className="text-[10px] text-zinc-400">
              {completedTasks.length}/{mission.tasks.length} Nodes
            </div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">TOKEN SPEND</div>
            <div className="text-sm font-semibold text-zinc-300">{mission.budget.tokenSpend.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400">${mission.budget.estimatedCostUsd.toFixed(3)} USD</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: DAG Task Graph Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#ffaa30]">
              DIRECTED ACYCLIC GRAPH (DAG) EXECUTION TREE
            </h2>
            <span className="text-[11px] text-zinc-500">TOPOLOGICAL EXECUTION ORDER</span>
          </div>

          <div className="space-y-3">
            {mission.tasks.map((task, idx) => {
              const isSelected = selectedTaskId === task.id;
              const isBlocked = task.dependencies.some((depId) => {
                const dep = mission.tasks.find((d) => d.id === depId);
                return !dep || dep.status !== "COMPLETED";
              });

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#ffaa30] bg-[#ffaa30]/10 shadow-[0_0_16px_rgba(255,170,48,0.2)]"
                      : "border-zinc-800/80 bg-black/40 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-zinc-400">#{idx + 1}</span>
                      <span className="text-zinc-100 font-semibold">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {task.assignedAgent}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">{task.description}</p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <span>DEPENDS ON:</span>
                      {task.dependencies.length > 0 ? (
                        task.dependencies.map((d) => (
                          <span key={d} className="px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">
                            {d.slice(-2)}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-600">NONE (ROOT NODE)</span>
                      )}
                    </div>

                    {task.status === "RUNNING" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdvanceTask(task.id);
                        }}
                        className="px-3 py-1 bg-[#ffd166]/15 hover:bg-[#ffd166]/25 border border-[#ffd166]/40 text-[#ffd166] font-bold rounded shadow-[0_0_10px_rgba(255,209,102,0.2)] transition-all"
                      >
                        [EXECUTE STEP]
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Evidence Ledger & Reality Checker */}
        <div className="space-y-6">
          {/* Reality Checker Verification Card */}
          <div className="p-4 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_16px_rgba(255,170,48,0.1)]">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <h3 className="font-bold text-[#ffaa30] uppercase text-xs">REALITY CHECKER AUDIT</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                mission.verificationReport?.overallStatus === "VERIFIED"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-zinc-800 text-zinc-400"
              }`}>
                {mission.verificationReport?.overallStatus || "STANDBY"}
              </span>
            </div>

            {mission.verificationReport ? (
              <div className="space-y-3">
                <p className="text-[11px] text-zinc-300 leading-relaxed bg-black/40 p-2.5 rounded border border-zinc-800">
                  {mission.verificationReport.realityCheckerSummary}
                </p>
                <div className="space-y-1.5">
                  {mission.verificationReport.assertions.map((a) => (
                    <div
                      key={a.gate}
                      className="flex items-center justify-between text-[10px] p-1.5 rounded bg-zinc-900/60"
                    >
                      <span className="text-zinc-400">{a.gate}</span>
                      <span className={a.status === "PASSED" ? "text-emerald-400 font-bold" : "text-amber-400"}>
                        {a.status} ({Math.round(a.score * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-zinc-500">
                Reality audit will initiate automatically once all DAG task nodes reach completion.
              </div>
            )}
          </div>

          {/* Evidence Ledger */}
          <div className="p-4 rounded-lg border border-zinc-800 bg-black/60">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <h3 className="font-bold text-zinc-200 uppercase text-xs">EVIDENCE & CITATION LEDGER</h3>
              <span className="text-[10px] text-[#00f0ff] font-bold">
                {mission.evidenceLedger.length} NODES
              </span>
            </div>

            <div className="space-y-2.5">
              {mission.evidenceLedger.map((ev) => (
                <div key={ev.id} className="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-[11px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-zinc-100 truncate">{ev.title}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                      {ev.claimType}
                    </span>
                  </div>
                  <p className="text-zinc-400 line-clamp-2 text-[10px]">{ev.snippet}</p>
                  <a
                    href={ev.sourceUri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00f0ff] text-[9px] hover:underline block truncate mt-1"
                  >
                    🔗 {ev.sourceUri}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
