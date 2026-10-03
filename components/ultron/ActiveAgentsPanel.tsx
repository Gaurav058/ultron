"use client";

import React from "react";
import UltronPanel from "../common/UltronPanel";
import UltronStatus, { UltronStatusType } from "../common/UltronStatus";
import { CORE_AGENT_ROSTER } from "../../core/conductor/agentRoster";
import { Mission } from "../../core/types/mission";

export interface ActiveAgentsPanelProps {
  activeMission?: Mission;
  onSelectAgent?: (agentId: string) => void;
}

export default function ActiveAgentsPanel({
  activeMission,
  onSelectAgent,
}: ActiveAgentsPanelProps) {
  // Check which agents actually have running or active tasks
  const runningTask = activeMission?.tasks.find((t) => t.status === "RUNNING");
  const runningAgentId = runningTask?.assignedAgent;

  const coreFiveAgents = [
    { id: "agent-conductor", name: "CONDUCTOR", role: "Orchestration & Planning" },
    { id: "agent-researcher", name: "RESEARCHER", role: "Context & Vector Retrieval" },
    { id: "agent-builder", name: "BUILDER", role: "Code & DAG Generation" },
    { id: "agent-reality-checker", name: "QA", role: "Empirical Verification" },
    { id: "agent-security", name: "SECURITY", role: "Policy & Sandboxing" },
  ];

  const anyRunning = Boolean(runningAgentId);

  return (
    <UltronPanel
      title="ACTIVE AGENTS"
      subtitle={`${coreFiveAgents.length} Core Specialists`}
      badge={<UltronStatus status={anyRunning ? "RUNNING" : "ONLINE"} size="sm" />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {!anyRunning && (
          <div
            style={{
              padding: "10px",
              borderRadius: "6px",
              background: "rgba(105, 150, 255, 0.04)",
              border: "1px solid rgba(105, 150, 255, 0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF" }}>
              NO ACTIVE AGENTS
            </div>
            <div style={{ fontSize: "10px", color: "#71809D", marginTop: "2px" }}>
              Agent runtime is idle.
            </div>
          </div>
        )}

        {/* Real Backend Data Roster */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {coreFiveAgents.map((agent) => {
            const isRunning = runningAgentId === agent.id;
            const isAssigned = activeMission?.tasks.some((t) => t.assignedAgent === agent.id);
            const status: UltronStatusType = isRunning ? "RUNNING" : isAssigned ? "READY" : "ONLINE";
            const statusLabel = isRunning ? "RUNNING" : isAssigned ? "READY" : "IDLE";

            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent?.(agent.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px",
                  borderRadius: "5px",
                  background: isRunning ? "rgba(99, 232, 255, 0.08)" : "rgba(105, 150, 255, 0.03)",
                  border: isRunning ? "1px solid rgba(99, 232, 255, 0.35)" : "1px solid rgba(105, 150, 255, 0.10)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF", letterSpacing: "0.5px" }}>
                    {agent.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#71809D" }}>
                    {isRunning ? runningTask?.title : agent.role}
                  </div>
                </div>

                <UltronStatus status={status} label={statusLabel} size="sm" />
              </div>
            );
          })}
        </div>
      </div>
    </UltronPanel>
  );
}
