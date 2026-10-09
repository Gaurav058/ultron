"use client";

import React from "react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  details?: string;
}

export default function ErrorState({
  title = "Telemetry Acquisition Error",
  message,
  onRetry,
  details,
}: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        background: "rgba(255, 77, 103, 0.08)",
        border: "1px solid rgba(255, 77, 103, 0.3)",
        color: "var(--ultron-text-secondary)",
        fontSize: "11px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--ultron-error)", fontWeight: 700 }}>
          <span>⚠</span>
          <span>{title}</span>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              background: "rgba(255, 77, 103, 0.15)",
              border: "1px solid var(--ultron-error)",
              color: "var(--ultron-error)",
              borderRadius: "var(--radius-xs)",
              padding: "2px 8px",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        )}
      </div>

      <div style={{ lineHeight: 1.4 }}>{message}</div>

      {details && (
        <div
          style={{
            fontSize: "10px",
            color: "var(--ultron-text-muted)",
            fontFamily: "var(--ultron-font-mono)",
            marginTop: "2px",
          }}
        >
          {details}
        </div>
      )}
    </div>
  );
}
