"use client";

import React from "react";

export interface StaleDataBannerProps {
  cachedAt: string;
  sourceName: string;
  onRefresh?: () => void;
}

export default function StaleDataBanner({
  cachedAt,
  sourceName,
  onRefresh,
}: StaleDataBannerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "6px 12px",
        background: "rgba(255, 176, 32, 0.08)",
        border: "1px solid rgba(255, 176, 32, 0.3)",
        borderRadius: "var(--radius-sm)",
        color: "var(--ultron-warning)",
        fontSize: "11px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span>⚡</span>
        <span>
          Displaying cached intelligence from <strong>{sourceName}</strong> (Retrieved: {cachedAt}).
        </span>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          style={{
            background: "rgba(255, 176, 32, 0.15)",
            border: "1px solid rgba(255, 176, 32, 0.4)",
            color: "var(--ultron-warning)",
            padding: "2px 8px",
            borderRadius: "var(--radius-xs)",
            fontSize: "10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Force Refresh
        </button>
      )}
    </div>
  );
}
