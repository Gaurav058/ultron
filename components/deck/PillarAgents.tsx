"use client";

import React, { useState } from "react";
import { CORE_AGENT_ROSTER } from "../../core/conductor/agentRoster";
import { AgentDefinition } from "../../core/types/agent";

export default function PillarAgents() {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition>(CORE_AGENT_ROSTER[0]);

  return (
    <div className="w-full min-h-[calc(100vh-60px)] mt-[60px] p-6 font-mono text-xs text-zinc-200 bg-[#050302] overflow-y-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_24px_rgba(255,170,48,0.1)] mb-6">
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#ffaa30] flex items-center gap-2">
            <span>ACTIVE SPECIALIST AGENT FLEET</span>
            <span className="text-zinc-500 font-normal">| HIERARCHICAL SUPERVISOR TOPOLOGY</span>
          </h1>
          <p className="text-zinc-400 text-[11px] mt-1">
            Zero chaotic peer-to-peer swarms. Every agent possesses explicit bounded roles, allowed tools, and verification contracts.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800">
            <span className="text-zinc-400">REGISTERED: </span>
            <span className="text-[#ffcc66] font-bold">{CORE_AGENT_ROSTER.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800">
            <span className="text-zinc-400">ACTIVE: </span>
            <span className="text-emerald-400 font-bold">
              {CORE_AGENT_ROSTER.filter((a) => a.status !== "IDLE").length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agent Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {CORE_AGENT_ROSTER.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#ffaa30] bg-[#ffaa30]/10 shadow-[0_0_20px_rgba(255,170,48,0.2)]"
                    : "border-zinc-800/80 bg-black/50 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: agent.avatarColor }}
                    />
                    <span className="font-bold text-zinc-100 text-xs">{agent.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    agent.status === "EXECUTING" || agent.status === "THINKING"
                      ? "bg-[#ffaa30]/20 text-[#ffcc66] border border-[#ffaa30]/40 animate-pulse"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <div className="text-[10px] text-zinc-400 mb-2 uppercase">{agent.domain}</div>
                <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2 mb-3">
                  {agent.description}
                </p>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/60 text-[10px]">
                  <div>
                    <span className="text-zinc-500 block">TASKS</span>
                    <span className="text-zinc-200 font-bold">{agent.metrics.totalTasksCompleted}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">SUCCESS</span>
                    <span className="text-emerald-400 font-bold">
                      {Math.round(agent.metrics.successRate * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">COST</span>
                    <span className="text-[#00f0ff] font-bold">${agent.metrics.totalCostUsd.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Inspector Card */}
        <div className="p-5 rounded-lg border border-[#ffaa30]/30 bg-black/70 shadow-[0_0_20px_rgba(255,170,48,0.1)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-bold text-zinc-100">{selectedAgent.name}</h2>
              <span className="text-[10px] text-[#ffcc66] uppercase">{selectedAgent.role}</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
              selectedAgent.riskLevel === "HIGH"
                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                : "bg-zinc-800 text-zinc-300"
            }`}>
              RISK: {selectedAgent.riskLevel}
            </span>
          </div>

          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">SYSTEM PROMPT CONTRACT</div>
            <p className="text-zinc-300 text-[11px] leading-relaxed bg-black/50 p-2.5 rounded border border-zinc-800 italic">
              &quot;{selectedAgent.systemPrompt}&quot;
            </p>
          </div>

          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">CAPABILITIES</div>
            <div className="flex flex-wrap gap-1">
              {selectedAgent.capabilities.map((cap) => (
                <span key={cap} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]">
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">ALLOWED MCP TOOLS</div>
            <div className="flex flex-wrap gap-1">
              {selectedAgent.allowedTools.map((tool) => (
                <span key={tool} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                  ✓ {tool}
                </span>
              ))}
            </div>
          </div>

          {selectedAgent.prohibitedTools.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">PROHIBITED TOOLS (LEAST PRIVILEGE)</div>
              <div className="flex flex-wrap gap-1">
                {selectedAgent.prohibitedTools.map((tool) => (
                  <span key={tool} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[10px]">
                    ✕ {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-[10px] text-zinc-400">
            <div className="flex justify-between">
              <span>LIFETIME TOKENS CONSUMED:</span>
              <span className="text-zinc-200 font-bold">{selectedAgent.metrics.totalTokensUsed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>VERIFICATION PASS RATE:</span>
              <span className="text-emerald-400 font-bold">{Math.round(selectedAgent.metrics.verificationPassRate * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span>AVG STEP DURATION:</span>
              <span className="text-zinc-200 font-bold">{selectedAgent.metrics.avgDurationSec}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
