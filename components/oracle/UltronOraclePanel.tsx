"use client";

import React from "react";
import { SystemInfoMetadata } from "@/types/system";

export interface UltronOraclePanelProps {
  quote?: string;
  author?: string;
  systemInfo?: SystemInfoMetadata;
  activeModel?: string;
}

export default function UltronOraclePanel({
  quote = "The future is not predicted, it's built by those who see it first.",
  author = "ULTRON",
  systemInfo = {
    model: "Gemini 1.5 Pro",
    contextWindow: "2M tokens",
    voiceModel: "Gemini Live",
    uptime: "99.8%",
    environment: "Production",
  },
  activeModel,
}: UltronOraclePanelProps) {
  const displayModel = activeModel || systemInfo.model;

  return (
    <div
      className="ultron-panel-base"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "12px 14px",
        gap: "10px",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#EAF4FF",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          ULTRON ORACLE
        </span>

        <span
          style={{
            background: "rgba(124, 77, 255, 0.15)",
            border: "1px solid rgba(124, 77, 255, 0.4)",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "8.5px",
            fontWeight: 700,
            color: "#7C4DFF",
            letterSpacing: "0.06em",
          }}
        >
          AI INSIGHTS
        </span>
      </div>

      {/* CENTER GLOWING PRISM / DIAMOND GLYPH & QUOTE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          background: "rgba(3, 13, 31, 0.7)",
          border: "1px solid #0B2A50",
          borderRadius: "8px",
          padding: "10px 12px",
        }}
      >
        {/* Glowing Crystal Glyph */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124, 77, 255, 0.25) 0%, rgba(6, 19, 41, 0.8) 70%)",
            border: "1px solid rgba(124, 77, 255, 0.5)",
            boxShadow: "0 0 16px rgba(124, 77, 255, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {/* Subtle outer orbital ring */}
          <div
            style={{
              position: "absolute",
              inset: "-3px",
              borderRadius: "50%",
              border: "1px dashed rgba(0, 217, 255, 0.3)",
              animation: "spin 20s linear infinite",
            }}
          />

          {/* Diamond / Crystal SVG */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <polygon
              points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"
              stroke="#00D9FF"
              strokeWidth="1.5"
              fill="rgba(22, 135, 255, 0.2)"
            />
            <line x1="12" y1="2" x2="12" y2="22" stroke="#7C4DFF" strokeWidth="1.2" />
            <polygon
              points="12,6 18,10 18,14 12,18 6,14 6,10"
              stroke="#EAF4FF"
              strokeWidth="1.2"
              fill="rgba(124, 77, 255, 0.4)"
            />
          </svg>
        </div>

        {/* Oracle Quote */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <p
            style={{
              fontSize: "10.5px",
              fontStyle: "italic",
              color: "#C8D8EA",
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            "{quote}"
          </p>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#00D9FF",
              letterSpacing: "0.06em",
            }}
          >
            — {author}
          </span>
        </div>
      </div>

      {/* SYSTEM INFORMATION SECTION (Directive Section 17) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 700,
            color: "#7187A5",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          SYSTEM INFORMATION
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            fontSize: "11px",
          }}
        >
          {/* Model */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Model</span>
            <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{displayModel}</span>
          </div>

          {/* Context Window */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Context Window</span>
            <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{systemInfo.contextWindow}</span>
          </div>

          {/* Voice Model */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Voice Model</span>
            <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{systemInfo.voiceModel}</span>
          </div>

          {/* Uptime */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Uptime</span>
            <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{systemInfo.uptime}</span>
          </div>

          {/* Environment */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Environment</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#00E6A8",
                  boxShadow: "0 0 6px #00E6A8",
                }}
              />
              <span style={{ color: "#00E6A8", fontWeight: 600 }}>{systemInfo.environment}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
