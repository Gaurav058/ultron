"use client";

import React from "react";
import UltronPanel from "../common/UltronPanel";
import UltronStatus from "../common/UltronStatus";
import UltronButton from "../common/UltronButton";
import { PolicyGate } from "../../core/types/mission";

export interface AttentionPanelProps {
  pendingGates: PolicyGate[];
  onOpenApprovals: (gate?: PolicyGate) => void;
}

export default function AttentionPanel({
  pendingGates,
  onOpenApprovals,
}: AttentionPanelProps) {
  const hasBlockers = pendingGates.length > 0;

  return (
    <UltronPanel
      title="ATTENTION"
      subtitle={hasBlockers ? "Policy Gates" : "System Guardrails"}
      badge={
        <UltronStatus
          status={hasBlockers ? "WAITING" : "ONLINE"}
          label={hasBlockers ? "ACTION REQUIRED" : "NORMAL"}
          size="sm"
        />
      }
    >
      {!hasBlockers ? (
        <div
          style={{
            padding: "10px 8px",
            borderRadius: "6px",
            background: "rgba(95, 240, 160, 0.04)",
            border: "1px solid rgba(95, 240, 160, 0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF" }}>
            NO CRITICAL ATTENTION
          </div>
          <div style={{ fontSize: "10px", color: "#71809D", marginTop: "2px" }}>
            System operating normally.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {pendingGates.map((gate) => (
            <div
              key={gate.id}
              onClick={() => onOpenApprovals(gate)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                borderRadius: "5px",
                background: "rgba(255, 209, 102, 0.08)",
                border: "1px solid rgba(255, 209, 102, 0.35)",
                cursor: "pointer",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#FFD166" }}>
                  {gate.action.toUpperCase()}
                </div>
                <div style={{ fontSize: "10px", color: "#C9D5EA", marginTop: "1px" }}>
                  {gate.reason || gate.target}
                </div>
              </div>
              <UltronButton variant="primary" size="sm">
                REVIEW
              </UltronButton>
            </div>
          ))}
        </div>
      )}
    </UltronPanel>
  );
}
