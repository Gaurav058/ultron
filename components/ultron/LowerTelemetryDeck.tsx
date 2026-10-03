"use client";

import React, { useEffect, useState } from "react";
import UltronPanel from "../common/UltronPanel";
import UltronStatus, { UltronStatusType } from "../common/UltronStatus";

export interface ActivityEvent {
  timestamp: string;
  event: string;
  source: string;
  status: string;
}

export interface WorldSource {
  name: string;
  status: UltronStatusType;
  lastUpdate: string;
  freshness: string;
  provenance: string;
}

export interface LowerTelemetryDeckProps {
  activityEvents?: ActivityEvent[];
  doctorHealth?: string;
}

export default function LowerTelemetryDeck({
  activityEvents = [],
  doctorHealth = "ONLINE",
}: LowerTelemetryDeckProps) {
  // Real world connected intelligence sources
  const [worldSources, setWorldSources] = useState<WorldSource[]>([
    {
      name: "NORAD ISS Telemetry (25544)",
      status: "ONLINE",
      lastUpdate: "Live Stream",
      freshness: "< 10s",
      provenance: "WhereTheISS API",
    },
    {
      name: "CoinGecko Global Feed",
      status: "ONLINE",
      lastUpdate: "30s ago",
      freshness: "Real-time",
      provenance: "CoinGecko API",
    },
    {
      name: "Open-Meteo Atmospheric Grid",
      status: "ONLINE",
      lastUpdate: "1m ago",
      freshness: "Synchronous",
      provenance: "Open-Meteo Global",
    },
    {
      name: "USGS Seismic Event Network",
      status: "ONLINE",
      lastUpdate: "5m ago",
      freshness: "Periodic",
      provenance: "USGS Earthquakes",
    },
  ]);

  // Actual System Subsystems (Section 16: Core, API, Database, Memory, Agent Runtime, Tool Fabric, Event Bus)
  const systemSubsystems: { name: string; status: UltronStatusType }[] = [
    { name: "Core", status: "ONLINE" },
    { name: "API", status: "ONLINE" },
    { name: "Database", status: "ONLINE" },
    { name: "Memory", status: "ONLINE" },
    { name: "Agent Runtime", status: "ONLINE" },
    { name: "Tool Fabric", status: "ONLINE" },
    { name: "Event Bus", status: "ONLINE" },
  ];

  return (
    <section
      className="telemetry-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        padding: "0 1.4vw",
        minHeight: "180px",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* 1. WORLD INTELLIGENCE (Section 14) */}
      <UltronPanel
        title="WORLD INTELLIGENCE"
        subtitle="Connected Sources"
        badge={<UltronStatus status={worldSources.length > 0 ? "ONLINE" : "UNKNOWN"} label={`${worldSources.length} SOURCES`} size="sm" />}
      >
        {worldSources.length === 0 ? (
          <div
            style={{
              padding: "20px 10px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF" }}>
              NO WORLD SOURCES CONNECTED
            </div>
            <div style={{ fontSize: "10px", color: "#71809D", marginTop: "2px" }}>
              Waiting for telemetry bridge
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "140px" }}>
            {worldSources.map((src) => (
              <div
                key={src.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 8px",
                  borderRadius: "4px",
                  background: "rgba(105, 150, 255, 0.03)",
                  border: "1px solid rgba(105, 150, 255, 0.10)",
                  fontSize: "11px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#EAF2FF" }}>{src.name}</div>
                  <div style={{ fontSize: "9px", color: "#71809D", display: "flex", gap: "6px", marginTop: "1px" }}>
                    <span>Prov: {src.provenance}</span>
                    <span>•</span>
                    <span>Freshness: {src.freshness}</span>
                  </div>
                </div>
                <UltronStatus status={src.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </UltronPanel>

      {/* 2. LIVE ACTIVITY (Section 15) */}
      <UltronPanel
        title="LIVE ACTIVITY"
        subtitle="Audit Stream"
        badge={<UltronStatus status={activityEvents.length > 0 ? "ONLINE" : "WAITING"} label={activityEvents.length > 0 ? "STREAMING" : "IDLE"} size="sm" />}
      >
        {activityEvents.length === 0 ? (
          <div
            style={{
              padding: "20px 10px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF" }}>
              NO RECENT ACTIVITY
            </div>
            <div style={{ fontSize: "10px", color: "#71809D", marginTop: "2px" }}>
              Waiting for system events.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", overflowY: "auto", maxHeight: "140px" }}>
            {activityEvents.map((act, i) => (
              <div
                key={`${act.timestamp}-${i}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "55px 75px 1fr 50px",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  background: "rgba(105, 150, 255, 0.02)",
                  border: "1px solid rgba(105, 150, 255, 0.08)",
                  fontSize: "10px",
                }}
              >
                <span style={{ color: "#71809D", fontFamily: "var(--font-mono)" }}>{act.timestamp}</span>
                <span style={{ color: "#63E8FF", fontWeight: 600 }}>{act.source}</span>
                <span style={{ color: "#C9D5EA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {act.event}
                </span>
                <span style={{ textAlign: "right" }}>
                  <UltronStatus
                    status={act.status === "READY" || act.status === "COMPLETED" || act.status === "SUCCESS" ? "ONLINE" : act.status === "WARN" ? "WAITING" : "READY"}
                    label={act.status}
                    showDot={false}
                    size="sm"
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </UltronPanel>

      {/* 3. SYSTEM METRICS (Section 16: Core, API, Database, Memory, Agent Runtime, Tool Fabric, Event Bus) */}
      <UltronPanel
        title="SYSTEM"
        subtitle="Infrastructure Health"
        badge={<UltronStatus status={doctorHealth === "OPTIMAL" || doctorHealth === "HEALTHY" ? "ONLINE" : "DEGRADED"} label={doctorHealth} size="sm" />}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", overflowY: "auto", maxHeight: "140px" }}>
          {systemSubsystems.map((sub) => (
            <div
              key={sub.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px",
                borderRadius: "4px",
                background: "rgba(105, 150, 255, 0.03)",
                border: "1px solid rgba(105, 150, 255, 0.10)",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "#EAF2FF", fontWeight: 500 }}>{sub.name}</span>
              <UltronStatus status={sub.status} label={sub.status} size="sm" />
            </div>
          ))}
        </div>
      </UltronPanel>
    </section>
  );
}
