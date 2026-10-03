"use client";

import React from "react";
import UltronPanel from "../common/UltronPanel";
import UltronStatus from "../common/UltronStatus";
import UltronButton from "../common/UltronButton";
import { Mission } from "../../core/types/mission";

export interface CurrentMissionCardProps {
  mission?: Mission;
  onOpenMissionControl?: () => void;
  onCreateMission?: () => void;
}

export default function CurrentMissionCard({
  mission,
  onOpenMissionControl,
  onCreateMission,
}: CurrentMissionCardProps) {
  if (!mission) {
    return (
      <UltronPanel title="CURRENT MISSION" subtitle="Autonomous Task Pipeline">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px 10px",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#EAF2FF", letterSpacing: "0.6px" }}>
            NO ACTIVE MISSION
          </div>
          <div style={{ fontSize: "12px", color: "#71809D", maxWidth: "260px", lineHeight: 1.4 }}>
            Waiting for operator instruction.
          </div>
          <div style={{ marginTop: "6px" }}>
            <UltronButton variant="primary" size="sm" onClick={onCreateMission}>
              CREATE MISSION
            </UltronButton>
          </div>
        </div>
      </UltronPanel>
    );
  }

  const completedCount = mission.tasks.filter((t) => t.status === "COMPLETED").length;
  const progressPercent = Math.round((completedCount / Math.max(1, mission.tasks.length)) * 100);
  const currentTask = mission.tasks.find((t) => t.status === "RUNNING") || mission.tasks[0];
  const lastEvent = mission.evidenceLedger[mission.evidenceLedger.length - 1]?.title || "Execution initialized";

  return (
    <UltronPanel
      title="CURRENT MISSION"
      subtitle={`ID: ${mission.id.slice(0, 10)}`}
      badge={<UltronStatus status={mission.status} size="sm" />}
      actions={
        onOpenMissionControl && (
          <UltronButton variant="ghost" size="sm" onClick={onOpenMissionControl}>
            VIEW DAG ➔
          </UltronButton>
        )
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Mission Title & Progress */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#EAF2FF", lineHeight: 1.3 }}>
              {mission.title}
            </div>
            <div style={{ fontSize: "11px", color: "#71809D", marginTop: "2px" }}>
              {mission.id}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#63E8FF", fontFamily: "var(--font-mono)" }}>
              {progressPercent}%
            </div>
            <div style={{ fontSize: "9px", color: "#8FA3C5", textTransform: "uppercase" }}>
              PROGRESS
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            borderRadius: "2px",
            background: "rgba(105, 150, 255, 0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #8D75FF, #63E8FF)",
              boxShadow: "0 0 10px #63E8FF",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {/* Mission Metadata Fields */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            fontSize: "11px",
            paddingTop: "6px",
            borderTop: "1px solid rgba(105, 150, 255, 0.12)",
          }}
        >
          <div>
            <div style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>CURRENT TASK</div>
            <div style={{ fontWeight: 600, color: "#EAF2FF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentTask?.title || "None"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>ASSIGNED AGENTS</div>
            <div style={{ fontWeight: 600, color: "#C9D5EA" }}>
              {mission.activeAgents.length > 0 ? mission.activeAgents.join(", ") : "CONDUCTOR"}
            </div>
          </div>
        </div>

        {/* Last Event */}
        <div
          style={{
            fontSize: "10px",
            padding: "5px 8px",
            borderRadius: "4px",
            background: "rgba(105, 150, 255, 0.05)",
            border: "1px solid rgba(105, 150, 255, 0.12)",
            color: "#AAB8D4",
          }}
        >
          <span style={{ color: "#63E8FF", fontWeight: 600, marginRight: "4px" }}>LAST EVENT:</span>
          <span>{lastEvent}</span>
        </div>
      </div>
    </UltronPanel>
  );
}
