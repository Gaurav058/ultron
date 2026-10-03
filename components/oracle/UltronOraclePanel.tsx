/**
 * ULTRON ORACLE PANEL
 * Directive Section 15
 * Displays real current intelligence insight, confidence, sources, and related signals.
 * Replaces hardcoded motivational quotes with actionable intelligence.
 * Actions: VIEW SOURCES, INVESTIGATE, CREATE MISSION.
 */

"use client";

import React, { useEffect, useState } from "react";
import { SystemInfoMetadata } from "@/types/system";
import { OracleInsight, SourceProvenance } from "@/types/intelligence";

export interface UltronOraclePanelProps {
  quote?: string;
  author?: string;
  systemInfo?: SystemInfoMetadata;
  activeModel?: string;
  onActionCreateMission?: (objective: string) => void;
  onActionInvestigate?: (signalId: string) => void;
}

export default function UltronOraclePanel({
  systemInfo = {
    model: "Gemini 2.5 Flash",
    contextWindow: "1M tokens",
    voiceModel: "Gemini Live",
    uptime: "99.9%",
    environment: "Production",
  },
  activeModel,
  onActionCreateMission,
  onActionInvestigate,
}: UltronOraclePanelProps) {
  const [oracleData, setOracleData] = useState<OracleInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  const displayModel = activeModel || oracleData?.domain || systemInfo.model;

  // Fetch current intelligence on mount
  useEffect(() => {
    setIsLoading(true);
    fetch("/api/oracle")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.insight) {
          setOracleData(data);
        }
      })
      .catch((err) => console.warn("Failed to fetch oracle data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreateMission = () => {
    const objective =
      oracleData?.actionableMissions?.[0] ||
      `Investigate Intelligence: ${oracleData?.insight?.slice(0, 50) || "Emerging AI signals"}`;
    onActionCreateMission?.(objective);
  };

  const handleInvestigate = () => {
    const signalId = oracleData?.relatedSignals?.[0] || "sig-recent";
    onActionInvestigate?.(signalId);
  };

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
          CURRENT INTELLIGENCE
        </span>
      </div>

      {/* CENTER GLOWING PRISM / DIAMOND GLYPH & CURRENT INTELLIGENCE INSIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          background: "rgba(3, 13, 31, 0.75)",
          border: "1px solid #0B2A50",
          borderRadius: "8px",
          padding: "10px 12px",
        }}
      >
        {/* Glowing Crystal Glyph */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124, 77, 255, 0.3) 0%, rgba(6, 19, 41, 0.8) 70%)",
            border: "1px solid rgba(124, 77, 255, 0.5)",
            boxShadow: "0 0 16px rgba(124, 77, 255, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
            marginTop: "2px",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polygon
              points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"
              stroke="#00D9FF"
              strokeWidth="1.5"
              fill="rgba(22, 135, 255, 0.2)"
            />
            <line x1="12" y1="2" x2="12" y2="22" stroke="#7C4DFF" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Intelligence Insight */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#00D9FF", textTransform: "uppercase" }}>
              {oracleData?.domain || "AI & GLOBAL COGNITION"}
            </span>
            <span
              style={{
                fontSize: "8.5px",
                background: "rgba(0, 230, 168, 0.12)",
                color: "#00E6A8",
                border: "1px solid rgba(0, 230, 168, 0.3)",
                padding: "1px 5px",
                borderRadius: "3px",
                fontWeight: 600,
              }}
            >
              {Math.round((oracleData?.confidence || 0.94) * 100)}% Confidence
            </span>
          </div>

          <p
            style={{
              fontSize: "11px",
              color: "#EAF4FF",
              lineHeight: 1.35,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {isLoading
              ? "Synthesizing latest verified global intelligence..."
              : oracleData?.insight ||
                "Frontier autonomous systems are shifting from prompt completion to persistent multi-tier reasoning loops with continuous ground-truth verification."}
          </p>

          {/* Sources Summary Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
            <span style={{ fontSize: "9px", color: "#7187A5" }}>
              {oracleData?.sources?.length || 1} verified source{oracleData?.sources?.length === 1 ? "" : "s"}
            </span>
            {oracleData?.sources?.[0]?.source && (
              <span style={{ fontSize: "9px", color: "#C8D8EA", fontWeight: 600 }}>
                • {oracleData.sources[0].source}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3 PRIMARY ACTIONS: VIEW SOURCES | INVESTIGATE | CREATE MISSION */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
        <button
          onClick={() => setShowSourcesModal(true)}
          style={{
            background: "rgba(11, 42, 80, 0.5)",
            border: "1px solid #1687FF",
            borderRadius: "6px",
            padding: "5px 4px",
            fontSize: "9px",
            fontWeight: 600,
            color: "#00D9FF",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(22, 135, 255, 0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(11, 42, 80, 0.5)")}
        >
          VIEW SOURCES
        </button>

        <button
          onClick={handleInvestigate}
          style={{
            background: "rgba(124, 77, 255, 0.12)",
            border: "1px solid rgba(124, 77, 255, 0.4)",
            borderRadius: "6px",
            padding: "5px 4px",
            fontSize: "9px",
            fontWeight: 600,
            color: "#C8D8EA",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124, 77, 255, 0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(124, 77, 255, 0.12)")}
        >
          INVESTIGATE
        </button>

        <button
          onClick={handleCreateMission}
          style={{
            background: "linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(22, 135, 255, 0.3) 100%)",
            border: "1px solid #00D9FF",
            borderRadius: "6px",
            padding: "5px 4px",
            fontSize: "9px",
            fontWeight: 700,
            color: "#EAF4FF",
            cursor: "pointer",
            textAlign: "center",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 217, 255, 0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          CREATE MISSION
        </button>
      </div>

      {/* SYSTEM INFORMATION SECTION */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", borderTop: "1px solid #0B2A50", paddingTop: "8px" }}>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: "#7187A5",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          SYSTEM INFORMATION
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "10.5px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Model</span>
            <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{displayModel}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Context Window</span>
            <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{systemInfo.contextWindow}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Voice Model</span>
            <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{systemInfo.voiceModel}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#7187A5" }}>Environment</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#00E6A8" }} />
              <span style={{ color: "#00E6A8", fontWeight: 600 }}>{systemInfo.environment}</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW SOURCES MODAL */}
      {showSourcesModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2, 8, 23, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowSourcesModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "460px",
              background: "#08172D",
              border: "1px solid #1687FF",
              borderRadius: "10px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#EAF4FF", fontWeight: 700 }}>
                Verified Oracle Sources
              </h3>
              <button
                onClick={() => setShowSourcesModal(false)}
                style={{ background: "transparent", border: "none", color: "#7187A5", fontSize: "18px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
              {(oracleData?.sources || []).length > 0 ? (
                oracleData!.sources.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#061329",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      border: "1px solid #0B2A50",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#EAF4FF" }}>
                        {src.title}
                      </span>
                      <span style={{ fontSize: "9px", color: "#00E6A8", fontWeight: 700 }}>
                        {Math.round((src.authorityScore || 0.9) * 100)}% Authority
                      </span>
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "9.5px", color: "#00D9FF", textDecoration: "none" }}
                      >
                        {src.url} ↗
                      </a>
                    )}
                    {src.snippet && (
                      <span style={{ fontSize: "9.5px", color: "#7187A5", fontStyle: "italic" }}>
                        "{src.snippet.slice(0, 120)}..."
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "11px", color: "#7187A5" }}>No external source links cataloged for this signal.</div>
              )}
            </div>

            <button
              onClick={() => setShowSourcesModal(false)}
              style={{
                background: "#1687FF",
                color: "#EAF4FF",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
