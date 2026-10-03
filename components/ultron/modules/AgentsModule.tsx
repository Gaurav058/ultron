"use client";

import React, { useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus, { UltronStatusType } from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import { CORE_AGENT_ROSTER } from "../../../core/conductor/agentRoster";
import { AgentDefinition } from "../../../core/types/agent";

export interface AgentsModuleProps {
  activeTaskAgentId?: string;
}

export default function AgentsModule({ activeTaskAgentId }: AgentsModuleProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition>(CORE_AGENT_ROSTER[0]);

  const agents = CORE_AGENT_ROSTER;
  const runningAgents = agents.filter((a) => a.id === activeTaskAgentId || a.status === "EXECUTING");

  const getAgentPermissions = (agent: AgentDefinition) => {
    switch (agent.id) {
      case "agent-conductor":
        return "Level 5 (Sovereign Orchestration, Task DAG compilation)";
      case "agent-security":
        return "Level 5 (Security Interceptor, Policy Gate Enforcement)";
      case "agent-builder":
        return "Level 4 (Sandbox File Write, Code Generation)";
      case "agent-reality-checker":
        return "Level 4 (Empirical Assertion Verification, Test Runner)";
      case "agent-researcher":
        return "Level 3 (Multi-Source Web Search, Vector Retrieval)";
      case "agent-memory-curator":
        return "Level 4 (L4 Durable Vector Promotion, Fact Ledger)";
      default:
        return "Level 3 (Constrained Least-Privilege Execution)";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        padding: "10px 1.4vw",
        overflow: "hidden",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* Agents Header (Section 20: Title: AGENT RUNTIME) */}
      <UltronPanel
        title="AGENT RUNTIME"
        subtitle="Specialized AI Workforce Registry"
        badge={<UltronStatus status={runningAgents.length > 0 ? "RUNNING" : "ONLINE"} label={`${agents.length} AGENTS REGISTERED`} size="sm" />}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "11px", color: "#AAB8D4", maxWidth: "600px" }}>
            Isolated cognitive execution boundaries. Zero unconstrained swarms. Every agent possesses an isolated sandbox, bounded role contract, and verified permission scope.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "#71809D" }}>
              ACTIVE RUNTIMES: <strong style={{ color: runningAgents.length > 0 ? "#63E8FF" : "#5FF0A0" }}>{runningAgents.length}</strong>
            </span>
          </div>
        </div>
      </UltronPanel>

      {/* Active Runs Banner / Empty state */}
      {runningAgents.length === 0 ? (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            background: "rgba(105, 150, 255, 0.04)",
            border: "1px solid rgba(105, 150, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF" }}>NO ACTIVE RUNS</span>
            <span style={{ fontSize: "11px", color: "#71809D" }}>— Agent runtime is idle. Awaiting next mission dispatch.</span>
          </div>
          <UltronStatus status="READY" label="IDLE" size="sm" />
        </div>
      ) : (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            background: "rgba(99, 232, 255, 0.08)",
            border: "1px solid rgba(99, 232, 255, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#63E8FF" }}>ACTIVE DISPATCH IN PROGRESS</span>
            <span style={{ fontSize: "11px", color: "#C9D5EA" }}>
              Running: {runningAgents.map((a) => a.name).join(", ")}
            </span>
          </div>
          <UltronStatus status="RUNNING" size="sm" />
        </div>
      )}

      {/* Main Grid: Agent Registry List + Detailed Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Agent Registry Cards */}
        <UltronPanel title="AGENT REGISTRY" subtitle="All Verified Specialists">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "8px",
              overflowY: "auto",
              maxHeight: "100%",
              paddingRight: "4px",
            }}
          >
            {agents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              const isRunning = agent.id === activeTaskAgentId || agent.status === "EXECUTING";
              const status: UltronStatusType = isRunning ? "RUNNING" : "ONLINE";

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: isSelected ? "rgba(99, 232, 255, 0.08)" : "rgba(105, 150, 255, 0.03)",
                    border: isSelected ? "1px solid rgba(99, 232, 255, 0.40)" : "1px solid rgba(105, 150, 255, 0.12)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "#63E8FF" : "#EAF2FF" }}>
                        {agent.name.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "10px", color: "#71809D" }}>
                        {agent.role}
                      </div>
                    </div>
                    <UltronStatus status={status} label={isRunning ? "RUNNING" : "READY"} size="sm" />
                  </div>

                  <div style={{ fontSize: "10px", color: "#AAB8D4", lineHeight: 1.3 }}>
                    {agent.systemPrompt.slice(0, 75)}...
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "6px",
                      borderTop: "1px solid rgba(105, 150, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "9px",
                      color: "#71809D",
                    }}
                  >
                    <span>ID: {agent.id}</span>
                    <span style={{ color: "#63E8FF" }}>{agent.allowedTools?.length || 0} Tools</span>
                  </div>
                </div>
              );
            })}
          </div>
        </UltronPanel>

        {/* Selected Agent Inspector (Section 20: Name, Role, Status, Current task, Last run, Permissions) */}
        <UltronPanel
          title={selectedAgent.name.toUpperCase()}
          subtitle="Agent Specification"
          badge={<UltronStatus status="ONLINE" label="READY" size="sm" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>ROLE</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#EAF2FF" }}>{selectedAgent.role}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>STATUS</span>
              <div>
                <UltronStatus
                  status={selectedAgent.id === activeTaskAgentId ? "RUNNING" : "ONLINE"}
                  label={selectedAgent.id === activeTaskAgentId ? "RUNNING" : "STANDBY"}
                  size="sm"
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>CURRENT TASK</span>
              <span style={{ fontSize: "11px", color: selectedAgent.id === activeTaskAgentId ? "#63E8FF" : "#AAB8D4" }}>
                {selectedAgent.id === activeTaskAgentId ? "Active DAG execution node" : "None (Awaiting mission assignment)"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>LAST RUN</span>
              <span style={{ fontSize: "11px", color: "#C9D5EA", fontFamily: "var(--font-mono)" }}>
                Verified in session cycle
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>PERMISSIONS</span>
              <div
                style={{
                  fontSize: "11px",
                  color: "#5FF0A0",
                  padding: "6px 8px",
                  borderRadius: "4px",
                  background: "rgba(95, 240, 160, 0.05)",
                  border: "1px solid rgba(95, 240, 160, 0.15)",
                }}
              >
                {getAgentPermissions(selectedAgent)}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>BOUNDED PROMPT</span>
              <div
                style={{
                  fontSize: "10px",
                  color: "#AAB8D4",
                  padding: "8px",
                  borderRadius: "4px",
                  background: "rgba(4, 7, 18, 0.9)",
                  border: "1px solid rgba(105, 150, 255, 0.15)",
                  lineHeight: 1.4,
                  maxHeight: "140px",
                  overflowY: "auto",
                }}
              >
                {selectedAgent.systemPrompt}
              </div>
            </div>
          </div>
        </UltronPanel>
      </div>
    </div>
  );
}
