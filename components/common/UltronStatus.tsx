"use client";

import React from "react";

export type UltronStatusType =
  | "ONLINE"
  | "READY"
  | "RUNNING"
  | "WAITING"
  | "DEGRADED"
  | "OFFLINE"
  | "ERROR"
  | "UNKNOWN";

export const ULTRON_STATUS_COLORS: Record<UltronStatusType, string> = {
  ONLINE: "#5FF0A0",
  READY: "#63E8FF",
  RUNNING: "#63E8FF",
  WAITING: "#FFD166",
  DEGRADED: "#FFD166",
  OFFLINE: "#FF667A",
  ERROR: "#FF667A",
  UNKNOWN: "#71809D",
};

export interface UltronStatusProps {
  status: UltronStatusType | string;
  label?: string;
  showDot?: boolean;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export default function UltronStatus({
  status,
  label,
  showDot = true,
  pulse,
  size = "sm",
  className = "",
  style,
}: UltronStatusProps) {
  const normalizedStatus = (status.toUpperCase() as UltronStatusType) || "UNKNOWN";
  const color = ULTRON_STATUS_COLORS[normalizedStatus] || "#71809D";
  const displayLabel = label || normalizedStatus;
  const shouldPulse = pulse ?? (normalizedStatus === "ONLINE" || normalizedStatus === "RUNNING");

  const dotSize = size === "sm" ? "6px" : "8px";
  const fontSize = size === "sm" ? "10px" : "11px";

  return (
    <span
      className={`ultron-status-badge ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 6px",
        borderRadius: "4px",
        background: `rgba(${color === "#5FF0A0" ? "95, 240, 160" : color === "#63E8FF" ? "99, 232, 255" : color === "#FFD166" ? "255, 209, 102" : color === "#FF667A" ? "255, 102, 122" : "113, 128, 157"}, 0.10)`,
        border: `1px solid rgba(${color === "#5FF0A0" ? "95, 240, 160" : color === "#63E8FF" ? "99, 232, 255" : color === "#FFD166" ? "255, 209, 102" : color === "#FF667A" ? "255, 102, 122" : "113, 128, 157"}, 0.25)`,
        color,
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        fontFamily: "var(--ultron-font)",
        lineHeight: 1,
        ...style,
      }}
    >
      {showDot && (
        <span
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
            display: "inline-block",
            animation: shouldPulse ? "ultron-status-pulse 2s infinite ease-in-out" : "none",
          }}
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
}
