"use client";

import React from "react";

export interface EmptyStateProps {
  title?: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function EmptyState({
  title = "No Data Available",
  description,
  icon,
  action,
  style,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "8px",
        padding: "32px 16px",
        color: "var(--ultron-text-muted)",
        border: "1px dashed rgba(11, 42, 80, 0.6)",
        borderRadius: "var(--radius-lg)",
        background: "rgba(6, 19, 41, 0.4)",
        ...style,
      }}
    >
      {icon || (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )}

      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ultron-text-secondary)" }}>
        {title}
      </div>

      <div style={{ fontSize: "11px", maxWidth: "420px", lineHeight: 1.4 }}>
        {description}
      </div>

      {action && <div style={{ marginTop: "6px" }}>{action}</div>}
    </div>
  );
}
