"use client";

import React from "react";
import InfinityCore, { UltronCoreState } from "../InfinityCore";
import { Mission, PolicyGate } from "../../../core/types/mission";
import { CORE_AGENT_ROSTER } from "../../../core/conductor/agentRoster";

interface CoreModuleProps {
  coreState: UltronCoreState;
  activeMission?: Mission;
  modelAccuracy?: string;
  thinkingSpeed?: string;
  activeContext?: string;
  onToggleVoice?: () => void;
  onOpenMission?: () => void;
  isListening?: boolean;
  activityFeed: { stamp: string; agent: string; event: string; state: string }[];
  pendingGates: PolicyGate[];
  onOpenApprovals: () => void;
  doctorHealth: string;
}

export default function CoreModule({
  coreState,
  activeMission,
  modelAccuracy = "96%",
  thinkingSpeed = "184 TPS",
  activeContext = "84%",
  onToggleVoice,
  onOpenMission,
  isListening = false,
  activityFeed,
  pendingGates,
  onOpenApprovals,
  doctorHealth,
}: CoreModuleProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Upper 2-column grid: Center Stage (InfinityCore) + Right Rail (Agents & Attention) */}
      <div className="command-center">
        {/* Center Stage: Infinity Core with ULTRON Artwork inside */}
        <section className="center-stage">
          <InfinityCore
            status={coreState}
            activeMission={activeMission}
            modelAccuracy={modelAccuracy}
            thinkingSpeed={thinkingSpeed}
            activeContext={activeContext}
            onToggleVoice={onToggleVoice}
            onOpenMission={onOpenMission}
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
                onClick={onOpenApprovals}
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
      </div>

      {/* Lower Telemetry Deck: World Intelligence + Live Activity + System Metrics */}
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
            {activityFeed.length === 0 ? (
              <div className="text-[7px] text-[#5d6985] py-4 text-center">NO RECENT ACTIVITY</div>
            ) : (
              activityFeed.map((item, idx) => (
                <div className="activity-row" key={`${item.stamp}-${idx}`}>
                  <time>{item.stamp}</time>
                  <b>{item.agent}</b>
                  <span>{item.event}</span>
                  <em>{item.state}</em>
                </div>
              ))
            )}
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
    </div>
  );
}
