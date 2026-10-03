"use client";

import React from "react";

interface StatusBarProps {
  systemHealth: string;
  connectedDevicesCount?: number;
  activeAgentsCount?: number;
  eventsCount?: number;
  memoryNodesCount?: number;
  securityMode?: string;
}

export default function StatusBar({
  systemHealth = "OPTIMAL",
  connectedDevicesCount = 1,
  activeAgentsCount = 10,
  eventsCount = 42,
  memoryNodesCount = 5,
  securityMode = "ZERO-TRUST LEAST PRIVILEGE",
}: StatusBarProps) {
  return (
    <footer
      id="ultron-status-bar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "26px",
        padding: "0 1.4vw",
        background: "var(--ultron-bg-secondary)",
        borderTop: "1px solid var(--ultron-border)",
        fontSize: "11px",
        fontFamily: "var(--ultron-font-mono)",
        color: "var(--ultron-text-secondary)",
        userSelect: "none",
        zIndex: 5,
      }}
    >
      {/* Left: Core Status & Health */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: systemHealth === "OPTIMAL" ? "var(--ultron-success)" : "var(--ultron-warning)",
              boxShadow: "0 0 6px var(--ultron-success)",
            }}
          />
          <strong style={{ color: "var(--ultron-text-primary)" }}>CORE:</strong> {systemHealth}
        </span>

        <span>
          <strong style={{ color: "var(--ultron-text-primary)" }}>AGENTS:</strong> {activeAgentsCount} ONLINE
        </span>

        <span>
          <strong style={{ color: "var(--ultron-text-primary)" }}>MEMORY:</strong> {memoryNodesCount} DURABLE FACTS
        </span>
      </div>

      {/* Center: Security Invariant Policy */}
      <div className="hidden md:block" style={{ color: "var(--ultron-text-muted)" }}>
        <span>POLICY: {securityMode}</span>
      </div>

      {/* Right: Enclave Telemetry & Devices */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span>
          <strong style={{ color: "var(--ultron-cyan)" }}>DEVICES:</strong> {connectedDevicesCount} ENCLAVE
        </span>

        <span>
          <strong style={{ color: "var(--ultron-cyan)" }}>STREAM:</strong> {eventsCount} EVENTS
        </span>

        <span style={{ color: "var(--ultron-cyan)" }}>
          PORT 3000 ● TLS VERIFIED
        </span>
      </div>
    </footer>
  );
}
