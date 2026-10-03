"use client";

import React from "react";
import HoloPanel from "../common/HoloPanel";
import { CORE_AGENT_ROSTER } from "../../core/conductor/agentRoster";
import { AgentDefinition } from "../../core/types/agent";

interface ActiveAgentsPanelProps {
  onSelectAgent?: (agent: AgentDefinition) => void;
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
  onExecuteNextStep?: () => void;
}

export default function ActiveAgentsPanel({
  onSelectAgent,
  pendingApprovalsCount,
  onOpenApprovals,
  onExecuteNextStep,
}: ActiveAgentsPanelProps) {
  // Mock active progress percentage matching reference
  const agentProgress: Record<string, number> = {
    "agent-conductor": 100,
    "agent-researcher": 80,
    "agent-builder": 72,
    "agent-security": 92,
    "agent-designer": 62,
    "agent-reality-checker": 91,
    "agent-memory-curator": 100,
  };

  return (
    <div className="w-full lg:w-[280px] xl:w-[320px] flex flex-col gap-3 font-mono shrink-0 select-none">
      {/* Top: Orchestration Network Mini Visualizer */}
      <HoloPanel
        title="AGENT ORCHESTRATION"
        subtitle="HIERARCHICAL FLEET"
        variant="violet"
        cutCorner={false}
      >
        <div className="flex flex-col items-center py-1">
          {/* Conductor Node */}
          <div className="px-2.5 py-1 rounded bg-[#00d9ff]/20 border border-[#00d9ff]/50 text-[#00d9ff] text-[9px] font-bold tracking-widest shadow-[0_0_10px_rgba(0,217,255,0.3)]">
            CONDUCTOR (100%)
          </div>

          {/* Stem Line */}
          <div className="w-[1px] h-3 bg-[#00d9ff]/40" />

          {/* Branch Line */}
          <div className="w-36 h-[1px] bg-[#6d4aff]/40" />

          {/* Workers Level */}
          <div className="flex items-center justify-between w-40 pt-1 text-[8px] text-zinc-300">
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[#00d9ff]">RESEARCH</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[#22c55e]">BUILD</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[#ef4444]">SEC</span>
          </div>

          <div className="w-[1px] h-3 bg-[#6d4aff]/40 mt-1" />

          {/* Reality Checker & Memory Curator */}
          <div className="flex items-center gap-2 pt-1 text-[8px]">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
              REALITY CHECKER (91%)
            </span>
            <span>➔</span>
            <span className="px-1.5 py-0.5 rounded bg-[#6d4aff]/20 border border-[#6d4aff]/40 text-[#d84cff] font-bold">
              MEMORY CURATOR
            </span>
          </div>
        </div>
      </HoloPanel>

      {/* Active Agents Card Stack */}
      <HoloPanel
        title="ACTIVE AGENTS"
        subtitle={`${CORE_AGENT_ROSTER.length} SPECIALISTS`}
        badge="ONLINE"
        variant="cyan"
      >
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {CORE_AGENT_ROSTER.map((agent) => {
            const progress = agentProgress[agent.id] ?? 85;
            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent?.(agent)}
                className="p-2 rounded bg-black/40 border border-white/[0.06] hover:border-[#00d9ff]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shadow-[0_0_6px_currentColor]"
                      style={{ color: agent.avatarColor, backgroundColor: agent.avatarColor }}
                    />
                    <span className="font-['Rajdhani',sans-serif] text-xs font-bold text-zinc-200 group-hover:text-[#00d9ff] transition-colors">
                      {agent.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-[#00d9ff]">
                    {progress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6d4aff] to-[#00d9ff]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[8px] text-[#8493b2] pt-1 mt-0.5">
                  <span className="uppercase">{agent.role}</span>
                  <span className={agent.status === "EXECUTING" ? "text-[#00d9ff] font-bold animate-pulse" : "text-zinc-500"}>
                    {agent.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </HoloPanel>

      {/* Pending Approvals / Attention Gate Card */}
      {pendingApprovalsCount > 0 ? (
        <div
          onClick={onOpenApprovals}
          className="p-3 rounded border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.25)] space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-bold text-xs tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              HUMAN APPROVAL REQUIRED
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black">
              {pendingApprovalsCount}
            </span>
          </div>
          <p className="text-amber-200 text-[10px] leading-tight">
            High-risk operation awaiting authorization before sandbox execution.
          </p>
        </div>
      ) : (
        <div className="p-2.5 rounded border border-white/[0.06] bg-black/30 text-center text-[10px] text-[#8493b2]">
          ✓ ZERO PENDING BLOCKERS • ALL GATES CLEARED
        </div>
      )}
    </div>
  );
}
