"use client";

import React from "react";
import { SystemStatus } from "@/types/system";

export interface SystemHealthPanelProps {
  status?: SystemStatus;
}

export default function SystemHealthPanel({
  status = {
    core: "online",
    api: "online",
    database: "online",
    memory: "online",
    agentRuntime: "online",
    toolFabric: "online",
    eventBus: "online",
    webSocket: "online",
  },
}: SystemHealthPanelProps) {
  const subsystems = [
    { key: "core", label: "Core", state: status.core || "online" },
    { key: "api", label: "API", state: status.api || "online" },
    { key: "database", label: "Database", state: status.database || "online" },
    { key: "memory", label: "Memory", state: status.memory || "online" },
    { key: "agentRuntime", label: "Agent Runtime", state: status.agentRuntime || "online" },
    { key: "toolFabric", label: "Tool Fabric", state: status.toolFabric || "online" },
    { key: "eventBus", label: "Event Bus", state: status.eventBus || "online" },
    { key: "webSocket", label: "WebSocket", state: status.webSocket || "online" },
  ];

  return (
    <div
      className="ultron-panel-base"
      style={{
        width: "170px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px 12px",
        flexShrink: 0,
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#EAF4FF",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          SYSTEM HEALTH
        </span>
      </div>

      {/* HEALTH CHECKLIST */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "4px",
        }}
      >
        {subsystems.map((sub) => {
          const isOnline = sub.state === "online";
          const isOffline = sub.state === "offline";
          return (
            <div
              key={sub.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "2px 0",
              }}
            >
              <span style={{ fontSize: "10.5px", color: "#C8D8EA" }}>{sub.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: isOnline ? "#00E6A8" : isOffline ? "#FF4D67" : "#FFB020",
                    boxShadow: isOnline ? "0 0 6px #00E6A8" : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 600,
                    color: isOnline ? "#00E6A8" : isOffline ? "#FF4D67" : "#FFB020",
                    textTransform: "capitalize",
                  }}
                >
                  {sub.state}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
