"use client";

import React from "react";

export interface MetricValueProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export default function MetricValue({
  label,
  value,
  unit,
  trend,
  trendValue,
  color = "var(--ultron-primary)",
  size = "md",
}: MetricValueProps) {
  const valueFontSize = size === "lg" ? "20px" : size === "md" ? "16px" : "13px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        padding: "8px 12px",
        background: "rgba(6, 19, 41, 0.6)",
        border: "1px solid var(--ultron-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--ultron-text-muted)",
        }}
      >
        {label}
      </span>

      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span
          style={{
            fontSize: valueFontSize,
            fontWeight: 700,
            color,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)" }}>
            {unit}
          </span>
        )}

        {trend && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              marginLeft: "auto",
              color:
                trend === "up"
                  ? "var(--ultron-success)"
                  : trend === "down"
                  ? "var(--ultron-error)"
                  : "var(--ultron-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
