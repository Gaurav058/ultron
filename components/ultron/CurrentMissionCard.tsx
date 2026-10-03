"use client";

import React from "react";
import HoloPanel from "../common/HoloPanel";
import { Mission } from "../../core/types/mission";

interface CurrentMissionCardProps {
  mission?: Mission;
  onOpenMissionControl: () => void;
}

export default function CurrentMissionCard({
  mission,
  onOpenMissionControl,
}: CurrentMissionCardProps) {
  if (!mission) {
    return (
      <HoloPanel
        title="CURRENT MISSION"
        subtitle="AUTONOMOUS OBJECTIVE"
        status="nominal"
        variant="cyan"
      >
        <div className="text-zinc-500 font-mono text-xs py-3 text-center">
          NO ACTIVE MISSION IN PROGRESS. TRANSMIT AN INTENT BELOW.
        </div>
      </HoloPanel>
    );
  }

  const completedCount = mission.tasks.filter((t) => t.status === "COMPLETED").length;
  const progressPercent = Math.round((completedCount / Math.max(1, mission.tasks.length)) * 100);

  return (
    <HoloPanel
      title="CURRENT MISSION"
      subtitle={`ID: ${mission.id.slice(0, 14)}`}
      badge={`RISK: ${mission.priority}`}
      status={mission.status === "RUNNING" ? "active" : mission.status === "AWAITING_APPROVAL" ? "warning" : "nominal"}
      variant={mission.status === "AWAITING_APPROVAL" ? "amber" : "cyan"}
      headerAction={
        <button
          onClick={onOpenMissionControl}
          className="text-[10px] font-mono font-bold text-[#00d9ff] hover:text-[#88f5ff] transition-colors"
        >
          [INSPECT DAG ↗]
        </button>
      }
    >
      <div className="space-y-3 font-mono">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-100 font-['Rajdhani',sans-serif] tracking-wide">
              {mission.title}
            </h2>
            <p className="text-[11px] text-[#8493b2] line-clamp-1 mt-0.5">
              {mission.objective}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-lg font-bold text-[#00d9ff]">{progressPercent}%</span>
            <div className="text-[9px] text-[#8493b2] uppercase tracking-widest">
              PROGRESS
            </div>
          </div>
        </div>

        {/* Progress Bar with Cyan/Violet Luminous Glow */}
        <div className="w-full bg-[#050817] rounded-full h-2 overflow-hidden border border-white/[0.08] p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6d4aff] via-[#00d9ff] to-[#88f5ff] transition-all duration-700 shadow-[0_0_12px_#00d9ff]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-white/[0.06] text-[10px]">
          <div>
            <span className="text-[#8493b2] block text-[9px] uppercase">STATUS</span>
            <span className={mission.status === "RUNNING" ? "text-[#00d9ff] font-bold" : "text-amber-400 font-bold"}>
              {mission.status}
            </span>
          </div>

          <div>
            <span className="text-[#8493b2] block text-[9px] uppercase">ACTIVE AGENTS</span>
            <span className="text-zinc-200 font-bold">
              {mission.activeAgents.length > 0 ? mission.activeAgents.join(", ") : "ORCHESTRATING"}
            </span>
          </div>

          <div>
            <span className="text-[#8493b2] block text-[9px] uppercase">TASK NODES</span>
            <span className="text-zinc-200 font-bold">
              {completedCount}/{mission.tasks.length} Completed
            </span>
          </div>

          <div>
            <span className="text-[#8493b2] block text-[9px] uppercase">TOKEN SPEND</span>
            <span className="text-emerald-400 font-bold">
              ${mission.budget.estimatedCostUsd.toFixed(3)} USD
            </span>
          </div>
        </div>
      </div>
    </HoloPanel>
  );
}
