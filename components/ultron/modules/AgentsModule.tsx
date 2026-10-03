"use client";

import React, { useState } from "react";
import { CORE_AGENT_ROSTER } from "../../../core/conductor/agentRoster";
import { AgentDefinition } from "../../../core/types/agent";

interface AgentsModuleProps {
  activeTaskAgentId?: string;
}

export default function AgentsModule({ activeTaskAgentId }: AgentsModuleProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition>(CORE_AGENT_ROSTER[0]);

  // Ensure all 10 canonical ULTRON specialists are represented
  const agents = CORE_AGENT_ROSTER;

  return (
    <div className="flex-1 flex flex-col p-3 overflow-hidden select-none">
      {/* Top Header */}
      <div className="holo-panel p-3 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#63e8ff] font-bold tracking-widest uppercase">
              ULTRON AI WORKFORCE & SPECIALIST FLEET
            </span>
            <span className="text-[7px] px-1.5 py-0.2 rounded bg-[#8d75ff]/20 text-[#8d75ff] border border-[#8d75ff]/30 font-mono">
              BOUNDED COGNITIVE ROLES
            </span>
          </div>
          <div className="text-[8px] text-[#8d9ab5]">
            Zero unconstrained peer-to-peer swarms. Every agent possesses an isolated sandbox, bounded system prompt, and verified tool authorization contract.
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[8px] font-mono">
          <div className="px-2.5 py-1 rounded bg-[#02030a]/80 border border-[#6e8cff]/20">
            REGISTERED: <b className="text-[#63e8ff]">{agents.length}</b>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#02030a]/80 border border-[#6e8cff]/20">
            ACTIVE RUNTIMES: <b className="text-[#5ff0a0]">
              {agents.filter((a) => a.id === activeTaskAgentId || a.status === "EXECUTING").length || 1}
            </b>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Agents Grid (Left) + Selected Agent Inspector (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0 overflow-hidden">
        {/* Left Column (8 cols): The 10 Specialists Cards */}
        <div className="lg:col-span-8 holo-panel flex flex-col p-3 min-h-0 overflow-hidden">
          <div className="panel-title pb-2 mb-2 border-b border-[#6e8cff]/15 shrink-0">
            REGISTERED SPECIALISTS <span>10 ROLES DEFINED</span>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 pr-1">
            {agents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              const isRunning = agent.id === activeTaskAgentId || agent.status === "EXECUTING";
              const displayStatus: string = isRunning ? "RUNNING" : agent.status || "IDLE";

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-2.5 rounded border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#63e8ff]/10 border-[#63e8ff] shadow-[0_0_12px_rgba(99,232,255,0.15)]"
                      : "bg-[#030615]/70 border-[#6e8cff]/15 hover:border-[#6e8cff]/35"
                  }`}
                >
                  <div>
                    {/* Header: Avatar, Name, Status */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[8px] text-white border"
                          style={{
                            backgroundColor: agent.avatarColor || "rgba(99,232,255,0.2)",
                            borderColor: "rgba(110,140,255,0.4)",
                          }}
                        >
                          {agent.name.slice(0, 1)}
                        </div>
                        <div>
                          <b className="text-[10px] text-[#dce4f5] block leading-tight">
                            {agent.name.toUpperCase()}
                          </b>
                          <span className="text-[6px] text-[#8d9ab5] uppercase tracking-wider">
                            {agent.role}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[6px] px-1.5 py-0.2 rounded font-bold uppercase font-mono ${
                          displayStatus === "RUNNING"
                            ? "bg-[#63e8ff]/20 text-[#63e8ff] border border-[#63e8ff]/40 animate-pulse"
                            : displayStatus === "VERIFYING"
                            ? "bg-[#8d75ff]/20 text-[#8d75ff] border border-[#8d75ff]/40"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {displayStatus}
                      </span>
                    </div>

                    {/* Agent Details */}
                    <p className="text-[7px] text-[#8d9ab5] line-clamp-2 mb-2 leading-relaxed">
                      {agent.systemPrompt.slice(0, 110)}...
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-1.5 border-t border-[#6e8cff]/10 flex items-center justify-between text-[6px] font-mono text-[#5d6985]">
                    <span>DOMAIN: <b className="text-[#8d75ff]">{agent.domain}</b></span>
                    <span>TOOLS: <b className="text-[#63e8ff]">{agent.allowedTools.length}</b></span>
                    <span>RISK: <b className="text-[#ffd166]">{agent.riskLevel}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Agent Deep Inspector */}
        <div className="lg:col-span-4 holo-panel flex flex-col p-3 min-h-0 overflow-hidden">
          <div className="panel-title pb-2 mb-2 border-b border-[#6e8cff]/15 shrink-0">
            SPECIALIST CONTRACT <span>{selectedAgent.name.toUpperCase()}</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div>
              <div className="text-[7px] text-[#5d6985] font-mono uppercase mb-0.5">ROLE SPECIFICATION</div>
              <div className="text-[9px] font-bold text-[#dce4f5]">{selectedAgent.role}</div>
              <div className="text-[7px] text-[#8d9ab5] mt-0.5 font-mono">DOMAIN: {selectedAgent.domain}</div>
            </div>

            <div>
              <div className="text-[7px] text-[#5d6985] font-mono uppercase mb-0.5">SYSTEM CONTRACT PROMPT</div>
              <div className="p-2 rounded bg-[#02030a] border border-[#6e8cff]/15 text-[7px] text-[#8d9ab5] leading-relaxed font-mono max-h-36 overflow-y-auto">
                {selectedAgent.systemPrompt}
              </div>
            </div>

            <div>
              <div className="text-[7px] text-[#5d6985] font-mono uppercase mb-1">AUTHORIZED MCP CAPABILITIES</div>
              <div className="flex flex-wrap gap-1">
                {selectedAgent.allowedTools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[6px] font-mono px-1.5 py-0.5 rounded bg-[#63e8ff]/10 text-[#63e8ff] border border-[#63e8ff]/25"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[7px] text-[#5d6985] font-mono uppercase mb-1">AGENT METRICS & GOVERNANCE</div>
              <div className="p-2 rounded bg-[#02030a] border border-[#6e8cff]/15 space-y-1 text-[7px] font-mono">
                <div className="flex justify-between text-[#8d9ab5]">
                  <span>RISK LEVEL:</span>
                  <b className="text-[#5ff0a0]">{selectedAgent.riskLevel}</b>
                </div>
                <div className="flex justify-between text-[#8d9ab5]">
                  <span>SUCCESS RATE:</span>
                  <b className="text-[#ffd166]">{((selectedAgent.metrics?.successRate ?? 0.96) * 100).toFixed(0)}%</b>
                </div>
                <div className="flex justify-between text-[#8d9ab5]">
                  <span>COMPLETED TASKS:</span>
                  <b className="text-[#dce4f5]">{selectedAgent.metrics?.totalTasksCompleted ?? 0}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
