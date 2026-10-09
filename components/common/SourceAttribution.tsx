"use client";

import React from "react";

export interface SourceAttributionProps {
  sourceName: string;
  sourceUrl?: string;
  verified?: boolean;
  publishedAt?: string;
  license?: string;
  geographicalScope?: string;
}

export default function SourceAttribution({
  sourceName,
  sourceUrl,
  verified = false,
  publishedAt,
  license,
  geographicalScope,
}: SourceAttributionProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        padding: "6px 8px",
        background: "rgba(3, 13, 31, 0.7)",
        border: "1px solid rgba(11, 42, 80, 0.6)",
        borderRadius: "var(--radius-sm)",
        fontSize: "10px",
        color: "var(--ultron-text-muted)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontWeight: 600, color: "var(--ultron-text-secondary)" }}>
          {sourceName}
        </span>
        {verified && (
          <span
            style={{
              padding: "1px 4px",
              borderRadius: "var(--radius-xs)",
              background: "rgba(0, 230, 168, 0.15)",
              color: "var(--ultron-success)",
              fontWeight: 700,
              fontSize: "9px",
            }}
          >
            ✓ VERIFIED
          </span>
        )}
        {geographicalScope && <span>• {geographicalScope}</span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {publishedAt && <span>{publishedAt}</span>}
        {license && <span style={{ opacity: 0.7 }}>({license})</span>}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--ultron-primary)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Source ↗
          </a>
        )}
      </div>
    </div>
  );
}
