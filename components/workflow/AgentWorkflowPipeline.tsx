"use client";

import React, { useState } from "react";
import { WorkflowNode } from "@/types/workflow";

export interface AgentWorkflowPipelineProps {
  nodes?: WorkflowNode[];
  onNodeClick?: (node: WorkflowNode) => void;
  metrics?: {
    totalAgents: number;
    activeTasks: number;
    completedToday: number;
    systemLoad: string;
  };
}

export default function AgentWorkflowPipeline({
  nodes = [],
  onNodeClick,
  metrics = {
    totalAgents: 10,
    activeTasks: 3,
    completedToday: 12,
    systemLoad: "Normal",
  },
}: AgentWorkflowPipelineProps) {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const getNode = (id: string): WorkflowNode => {
    return (
      nodes.find((n) => n.id === id || n.agentId === id) || {
        id,
        agentId: id,
        name: id.toUpperCase(),
        status: "idle",
        progress: 0,
      }
    );
  };

  const userNode = getNode("node-user");
  const conductorNode = getNode("node-conductor");
  const researcherNode = getNode("node-researcher");
  const analystNode = getNode("node-analyst");
  const websearchNode = getNode("node-websearch");
  const verifierNode = getNode("node-verifier");
  const memoryNode = getNode("node-memory");
  const missionNode = getNode("node-mission");

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
    onNodeClick?.(node);
  };

  return (
    <div
      className="ultron-panel-base"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "14px 16px 12px 16px",
        gap: "12px",
        position: "relative",
      }}
    >
      {/* SECTION HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#EAF4FF",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              AGENT WORKFLOW PIPELINE
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "#7187A5", marginTop: "2px", display: "block" }}>
            Real-time task execution & agent coordination
          </span>
        </div>

        {/* Live Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(0, 230, 168, 0.08)",
            padding: "3px 8px",
            borderRadius: "6px",
            border: "1px solid rgba(0, 230, 168, 0.3)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#00E6A8",
              boxShadow: "0 0 6px #00E6A8",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#00E6A8",
              letterSpacing: "0.04em",
            }}
          >
            Live
          </span>
        </div>
      </div>

      {/* WORKFLOW EXECUTION GRAPH */}
      <div
        style={{
          width: "100%",
          minHeight: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          padding: "10px 8px",
          overflowX: "auto",
        }}
      >
        {/* Node 1: User Request */}
        <div
          onClick={() => handleNodeClick(userNode)}
          style={{
            width: "130px",
            minHeight: "78px",
            background: "rgba(6, 19, 41, 0.95)",
            border: "1px solid #1687FF",
            borderRadius: "8px",
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0 0 10px rgba(22, 135, 255, 0.15)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "rgba(22, 135, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1687FF",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
              User Request
            </span>
          </div>

          <span
            style={{
              fontSize: "9.5px",
              color: "#7187A5",
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            Research AI SaaS platforms in UAE
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "auto" }}>
            <span style={{ color: "#00E6A8", fontSize: "10px" }}>✓</span>
            <span style={{ fontSize: "9px", color: "#00E6A8", fontWeight: 600 }}>Active</span>
          </div>
        </div>

        {/* Connector 1 -> Conductor */}
        <div
          style={{
            height: "2px",
            flex: "0 0 20px",
            background: "linear-gradient(90deg, #1687FF, #7C4DFF)",
            position: "relative",
          }}
        />

        {/* Node 2: Conductor */}
        <div
          onClick={() => handleNodeClick(conductorNode)}
          style={{
            width: "125px",
            minHeight: "78px",
            background: "rgba(6, 19, 41, 0.95)",
            border: "1px solid #7C4DFF",
            borderRadius: "8px",
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0 0 10px rgba(124, 77, 255, 0.2)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "rgba(124, 77, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7C4DFF",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
              Conductor
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#7C4DFF",
                boxShadow: "0 0 5px #7C4DFF",
              }}
            />
            <span style={{ fontSize: "9.5px", color: "#7C4DFF", fontWeight: 600 }}>
              Planning
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "9px", color: "#7187A5", fontWeight: 600 }}>88%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "3px",
                background: "#08172D",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "88%",
                  height: "100%",
                  background: "linear-gradient(90deg, #7C4DFF, #00D9FF)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Branching SVG Connectors to 3 Parallel Nodes */}
        <div style={{ width: "32px", height: "150px", position: "relative", flexShrink: 0 }}>
          <svg width="32" height="150" viewBox="0 0 32 150" fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Top branch to Researcher */}
            <path d="M 0 75 C 16 75, 16 25, 32 25" stroke="#00D9FF" strokeWidth="1.5" fill="none" />
            {/* Middle branch to Analyst */}
            <path d="M 0 75 L 32 75" stroke="#7C4DFF" strokeWidth="1.5" fill="none" />
            {/* Bottom branch to Web Search */}
            <path d="M 0 75 C 16 75, 16 125, 32 125" stroke="#00E6A8" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* 3 Parallel Nodes Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", zIndex: 2 }}>
          {/* Researcher Node */}
          <div
            onClick={() => handleNodeClick(researcherNode)}
            style={{
              width: "150px",
              height: "46px",
              background: "rgba(6, 19, 41, 0.95)",
              border: "1px solid #00D9FF",
              borderRadius: "8px",
              padding: "5px 10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "3px",
              boxShadow: "0 0 12px rgba(0, 217, 255, 0.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00D9FF" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
                  Researcher
                </span>
              </div>
              <span style={{ fontSize: "9px", color: "#00D9FF", fontWeight: 600 }}>70%</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#00D9FF" }} />
                <span style={{ fontSize: "8.5px", color: "#00D9FF" }}>Running</span>
              </div>
              <div style={{ flex: 1, height: "3px", background: "#08172D", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: "70%", height: "100%", background: "#00D9FF" }} />
              </div>
            </div>
          </div>

          {/* Analyst Node */}
          <div
            onClick={() => handleNodeClick(analystNode)}
            style={{
              width: "150px",
              height: "46px",
              background: "rgba(6, 19, 41, 0.95)",
              border: "1px solid #7C4DFF",
              borderRadius: "8px",
              padding: "5px 10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "3px",
              boxShadow: "0 0 10px rgba(124, 77, 255, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7C4DFF" strokeWidth="2.5">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
                  Analyst
                </span>
              </div>
              <span style={{ fontSize: "9px", color: "#7C4DFF", fontWeight: 600 }}>50%</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#7C4DFF" }} />
                <span style={{ fontSize: "8.5px", color: "#7C4DFF" }}>Running</span>
              </div>
              <div style={{ flex: 1, height: "3px", background: "#08172D", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: "50%", height: "100%", background: "#7C4DFF" }} />
              </div>
            </div>
          </div>

          {/* Web Search Node */}
          <div
            onClick={() => handleNodeClick(websearchNode)}
            style={{
              width: "150px",
              height: "46px",
              background: "rgba(6, 19, 41, 0.95)",
              border: "1px solid #00E6A8",
              borderRadius: "8px",
              padding: "5px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 0 10px rgba(0, 230, 168, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00E6A8" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
                Web Search
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00E6A8" }} />
              <span style={{ fontSize: "9px", color: "#00E6A8", fontWeight: 600 }}>Completed</span>
            </div>
          </div>
        </div>

        {/* Converging SVG Connectors to Verifier */}
        <div style={{ width: "32px", height: "150px", position: "relative", flexShrink: 0 }}>
          <svg width="32" height="150" viewBox="0 0 32 150" fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Top branch from Researcher to Verifier */}
            <path d="M 0 25 C 16 25, 16 75, 32 75" stroke="#00D9FF" strokeWidth="1.5" fill="none" />
            {/* Middle branch from Analyst to Verifier */}
            <path d="M 0 75 L 32 75" stroke="#7C4DFF" strokeWidth="1.5" fill="none" />
            {/* Bottom branch from Web Search to Verifier */}
            <path d="M 0 125 C 16 125, 16 75, 32 75" stroke="#00E6A8" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Node 4: Verifier */}
        <div
          onClick={() => handleNodeClick(verifierNode)}
          style={{
            width: "110px",
            minHeight: "78px",
            background: "rgba(6, 19, 41, 0.95)",
            border: "1px solid #FFB020",
            borderRadius: "8px",
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0 0 10px rgba(255, 176, 32, 0.15)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "rgba(255, 176, 32, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFB020",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
              Verifier
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#FFB020",
              }}
            />
            <span style={{ fontSize: "9.5px", color: "#FFB020", fontWeight: 600 }}>
              Waiting
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <span style={{ fontSize: "9px", color: "#7187A5", fontWeight: 600 }}>0%</span>
          </div>
        </div>

        {/* Connector Verifier -> Memory */}
        <div
          style={{
            height: "2px",
            flex: "0 0 16px",
            background: "#1687FF",
            position: "relative",
          }}
        />

        {/* Node 5: Memory */}
        <div
          onClick={() => handleNodeClick(memoryNode)}
          style={{
            width: "105px",
            minHeight: "78px",
            background: "rgba(6, 19, 41, 0.95)",
            border: "1px solid #1687FF",
            borderRadius: "8px",
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0 0 10px rgba(22, 135, 255, 0.15)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "rgba(22, 135, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1687FF",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
              Memory
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#7187A5",
              }}
            />
            <span style={{ fontSize: "9.5px", color: "#7187A5", fontWeight: 600 }}>
              Pending
            </span>
          </div>
        </div>

        {/* Connector Memory -> Mission */}
        <div
          style={{
            height: "2px",
            flex: "0 0 16px",
            background: "linear-gradient(90deg, #1687FF, #00E6A8)",
            position: "relative",
          }}
        />

        {/* Node 6: Mission Complete / Outcome */}
        <div
          onClick={() => handleNodeClick(missionNode)}
          style={{
            width: "115px",
            minHeight: "78px",
            background: "rgba(6, 19, 41, 0.95)",
            border: "1px solid #00E6A8",
            borderRadius: "8px",
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0 0 12px rgba(0, 230, 168, 0.2)",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "rgba(0, 230, 168, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00E6A8",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF" }}>
              Mission
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#00E6A8",
              }}
            />
            <span style={{ fontSize: "9.5px", color: "#00E6A8", fontWeight: 600 }}>
              In Progress
            </span>
          </div>

          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "9px", color: "#00E6A8", fontWeight: 600 }}>68%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "3px",
                background: "#08172D",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "68%",
                  height: "100%",
                  background: "#00E6A8",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 SUMMARY METRIC TILES BELOW GRAPH */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          borderTop: "1px solid #0B2A50",
          paddingTop: "10px",
        }}
      >
        {/* Metric 1: Total Agents */}
        <div
          className="ultron-card-subtle"
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(22, 135, 255, 0.15)",
              border: "1px solid rgba(22, 135, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1687FF",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "9.5px", color: "#7187A5", fontWeight: 600 }}>Total Agents</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#EAF4FF" }}>
                {metrics.totalAgents}
              </span>
              <span style={{ fontSize: "9px", color: "#435873" }}>Configured</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Tasks */}
        <div
          className="ultron-card-subtle"
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(0, 217, 255, 0.15)",
              border: "1px solid rgba(0, 217, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00D9FF",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "9.5px", color: "#7187A5", fontWeight: 600 }}>Active Tasks</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#EAF4FF" }}>
                {metrics.activeTasks}
              </span>
              <span style={{ fontSize: "9px", color: "#00D9FF" }}>Running</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Completed Today */}
        <div
          className="ultron-card-subtle"
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(124, 77, 255, 0.15)",
              border: "1px solid rgba(124, 77, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7C4DFF",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "9.5px", color: "#7187A5", fontWeight: 600 }}>Completed Today</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#EAF4FF" }}>
                {metrics.completedToday}
              </span>
              <span style={{ fontSize: "9px", color: "#7187A5" }}>Tasks</span>
            </div>
          </div>
        </div>

        {/* Metric 4: System Load */}
        <div
          className="ultron-card-subtle"
          style={{
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(0, 230, 168, 0.15)",
              border: "1px solid rgba(0, 230, 168, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00E6A8",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "9.5px", color: "#7187A5", fontWeight: 600 }}>System Load</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#00E6A8" }}>
                {metrics.systemLoad}
              </span>
              <span style={{ fontSize: "8.5px", color: "#7187A5" }}>All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* NODE INSPECTOR POPOVER (Directive Section 10) */}
      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "20px",
            width: "280px",
            background: "#08172D",
            border: "1px solid #123F70",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 217, 255, 0.2)",
            padding: "12px 14px",
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#EAF4FF" }}>
                {selectedNode.name}
              </span>
              <span
                style={{
                  fontSize: "9px",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: "rgba(0, 217, 255, 0.15)",
                  color: "#00D9FF",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                {selectedNode.status}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#7187A5",
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          <div style={{ fontSize: "11px", color: "#C8D8EA" }}>
            <span style={{ color: "#7187A5", fontSize: "10px", display: "block" }}>TASK</span>
            {selectedNode.details?.task || "General autonomous workflow execution."}
          </div>

          {selectedNode.startedAt && (
            <div style={{ fontSize: "11px", color: "#C8D8EA" }}>
              <span style={{ color: "#7187A5", fontSize: "10px", display: "block" }}>STARTED</span>
              {selectedNode.startedAt}
            </div>
          )}

          {selectedNode.details?.tools && (
            <div>
              <span style={{ color: "#7187A5", fontSize: "10px", display: "block", marginBottom: "4px" }}>
                TOOLS
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {selectedNode.details.tools.map((tool) => (
                  <span
                    key={tool}
                    style={{
                      background: "rgba(11, 42, 80, 0.6)",
                      border: "1px solid #123F70",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "9.5px",
                      color: "#00D9FF",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
