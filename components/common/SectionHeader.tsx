"use client";

import React from "react";

export interface SectionHeaderProps {
  title: string;
  badge?: React.ReactNode;
  count?: number;
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SectionHeader({
  title,
  badge,
  count,
  actions,
  style,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid rgba(11, 42, 80, 0.4)",
        marginBottom: "8px",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <h2
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ultron-text-primary)",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {count !== undefined && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: "var(--radius-full)",
              background: "rgba(0, 217, 255, 0.12)",
              color: "var(--ultron-primary)",
              border: "1px solid rgba(0, 217, 255, 0.25)",
            }}
          >
            {count}
          </span>
        )}
        {badge}
      </div>

      {actions && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>{actions}</div>}
    </div>
  );
}
