"use client";

import React from "react";

export type FreshnessLevel = "LIVE" | "RECENT" | "PERIODIC" | "STALE" | "CACHED" | "OFFLINE";

export interface FreshnessIndicatorProps {
  level: FreshnessLevel;
  lastUpdated?: string;
  showText?: boolean;
}

export default function FreshnessIndicator({
  level,
  lastUpdated,
  showText = true,
}: FreshnessIndicatorProps) {
  const getConfig = () => {
    switch (level) {
      case "LIVE":
        return { color: "var(--ultron-success)", bg: "rgba(0, 230, 168, 0.12)", label: "LIVE STREAM", pulse: true };
      case "RECENT":
        return { color: "var(--ultron-primary)", bg: "rgba(0, 217, 255, 0.12)", label: "RECENT (<1H)", pulse: false };
      case "PERIODIC":
        return { color: "var(--ultron-blue)", bg: "rgba(22, 135, 255, 0.12)", label: "PERIODIC FEED", pulse: false };
      case "CACHED":
        return { color: "var(--ultron-warning)", bg: "rgba(255, 176, 32, 0.12)", label: "CACHED", pulse: false };
      case "STALE":
        return { color: "var(--ultron-warning)", bg: "rgba(255, 176, 32, 0.15)", label: "STALE TELEMETRY", pulse: false };
      case "OFFLINE":
      default:
        return { color: "var(--ultron-error)", bg: "rgba(255, 77, 103, 0.12)", label: "OFFLINE", pulse: false };
    }
  };

  const cfg = getConfig();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 6px",
        borderRadius: "var(--radius-sm)",
        background: cfg.bg,
        border: `1px solid ${cfg.color}40`,
        fontSize: "10px",
        fontWeight: 600,
        color: cfg.color,
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: cfg.color,
          boxShadow: cfg.pulse ? `0 0 8px ${cfg.color}` : "none",
        }}
      />
      {showText && <span>{cfg.label}</span>}
      {lastUpdated && (
        <span style={{ color: "var(--ultron-text-muted)", marginLeft: "2px" }}>
          • {lastUpdated}
        </span>
      )}
    </div>
  );
}
