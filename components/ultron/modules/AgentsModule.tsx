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
  const runningAgents = agents.filter((a) => a.id === activeTaskAgentId || a.status === "RUNNING");

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
      {/* Agents Header (Section 9) */}
      <UltronPanel
        title="AGENT WORKFORCE"
        subtitle="10 Canonical Cognitive Specialists"
        badge={<UltronStatus status={runningAgents.length > 0 ? "RUNNING" : "ONLINE"} label={`${agents.length} AGENTS REGISTERED`} size="sm" />}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)", maxWidth: "650px" }}>
            Autonomous multi-agent orchestration architecture. Each specialist operates under least-privilege permissions, verified sandboxes, and policy-gated tool execution.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--ultron-text-muted)" }}>
              ACTIVE RUNTIMES: <strong style={{ color: runningAgents.length > 0 ? "var(--ultron-cyan)" : "var(--ultron-success)" }}>{runningAgents.length}</strong>
            </span>
          </div>
        </div>
      </UltronPanel>

      {/* Main Grid: Agent Registry List + Detailed Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Agent Registry Cards */}
        <UltronPanel title="AGENT FLEET" subtitle="Select agent to view capabilities & permissions">
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
              const isRunning = agent.id === activeTaskAgentId || agent.status === "RUNNING";
              const status: UltronStatusType = isRunning ? "RUNNING" : agent.status === "READY" ? "READY" : "ONLINE";

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: isSelected ? "rgba(99, 232, 255, 0.08)" : "var(--ultron-panel)",
                    border: isSelected ? "1px solid var(--ultron-border-active)" : "1px solid var(--ultron-border)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "var(--ultron-cyan)" : "var(--ultron-text-primary)" }}>
                        {agent.name.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)" }}>
                        {agent.role}
                      </div>
                    </div>
                    <UltronStatus status={status} label={isRunning ? "RUNNING" : agent.status} size="sm" />
                  </div>

                  <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)", lineHeight: 1.3 }}>
                    {agent.description}
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "6px",
                      borderTop: "1px solid var(--ultron-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      color: "var(--ultron-text-muted)",
                    }}
                  >
                    <span>ID: {agent.id}</span>
                    <span style={{ color: "var(--ultron-cyan)" }}>{agent.tools?.length || 0} Tools</span>
                  </div>
                </div>
              );
            })}
          </div>
        </UltronPanel>

        {/* Selected Agent Inspector (Section 9: Name, Role, Description, Status, Current task, Last activity, Capabilities, Tools, Permissions) */}
        <UltronPanel
          title={selectedAgent.name.toUpperCase()}
          subtitle="Specialist Contract & Invariants"
          badge={<UltronStatus status="ONLINE" label={selectedAgent.status} size="sm" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", maxHeight: "100%", paddingRight: "4px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>ROLE & DOMAIN</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ultron-text-primary)" }}>
                {selectedAgent.role} — {selectedAgent.domain || "Specialist"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>DESCRIPTION</span>
              <span style={{ fontSize: "12px", color: "var(--ultron-text-secondary)", lineHeight: 1.4 }}>
                {selectedAgent.description}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>STATUS</span>
              <div>
                <UltronStatus
                  status={selectedAgent.status === "RUNNING" ? "RUNNING" : "READY"}
                  label={selectedAgent.status}
                  size="sm"
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>CURRENT TASK</span>
              <span style={{ fontSize: "11px", color: "var(--ultron-cyan)", fontFamily: "var(--ultron-font-mono)" }}>
                {selectedAgent.currentTask || "Standing by for mission DAG scheduling"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>LAST ACTIVITY</span>
              <span style={{ fontSize: "11px", color: "var(--ultron-text-secondary)", fontFamily: "var(--ultron-font-mono)" }}>
                {selectedAgent.lastActivity || "Initialized during system bootstrap"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>CAPABILITIES</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selectedAgent.capabilities.map((cap, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(99, 232, 255, 0.1)",
                      color: "var(--ultron-cyan)",
                      border: "1px solid rgba(99, 232, 255, 0.25)",
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>ASSIGNED TOOLS</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selectedAgent.tools.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(141, 117, 255, 0.12)",
                      color: "var(--ultron-violet)",
                      border: "1px solid rgba(141, 117, 255, 0.25)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>PERMISSIONS</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selectedAgent.permissions.map((p, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(95, 240, 160, 0.1)",
                      color: "var(--ultron-success)",
                      border: "1px solid rgba(95, 240, 160, 0.25)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </UltronPanel>
      </div>
    </div>
  );
}
