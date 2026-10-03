"use client";

import React from "react";
import InfinityCore, { UltronCoreState } from "../InfinityCore";
import ActiveAgentsPanel from "../ActiveAgentsPanel";
import CurrentMissionCard from "../CurrentMissionCard";
import AttentionPanel from "../AttentionPanel";
import LowerTelemetryDeck from "../LowerTelemetryDeck";
import { Mission, PolicyGate } from "../../../core/types/mission";

export interface CoreModuleProps {
  coreState: UltronCoreState;
  activeMission?: Mission;
  modelAccuracy?: string;
  thinkingSpeed?: string;
  activeContext?: string;
  onToggleVoice?: () => void;
  onOpenMission?: () => void;
  onCreateMission?: () => void;
  isListening?: boolean;
  activityFeed: { timestamp: string; source: string; event: string; status: string }[];
  pendingGates: PolicyGate[];
  onOpenApprovals: () => void;
  doctorHealth: string;
}

export default function CoreModule({
  coreState,
  activeMission,
  modelAccuracy = "96%",
  thinkingSpeed = "184 TPS",
  activeContext = "84%",
  onToggleVoice,
  onOpenMission,
  onCreateMission,
  isListening = false,
  activityFeed,
  pendingGates,
  onOpenApprovals,
  doctorHealth,
}: CoreModuleProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        gap: "10px",
        padding: "8px 1.4vw 0",
      }}
    >
      {/* Upper Grid: Center Stage (ULTRON CORE) + Right Rail (Agents, Mission, Attention) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "10px",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Center Stage: Infinity Core with Cognitive Loop */}
        <div style={{ minWidth: 0, height: "100%", overflowY: "auto" }}>
          <InfinityCore
            status={coreState}
            activeMission={activeMission}
            modelAccuracy={modelAccuracy}
            thinkingSpeed={thinkingSpeed}
            activeContext={activeContext}
            onToggleVoice={onToggleVoice}
            onOpenMission={onOpenMission}
            onCreateMission={onCreateMission}
            isListening={isListening}
          />
        </div>

        {/* Right Rail: Active Agents, Current Mission, Attention */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            height: "100%",
            overflowY: "auto",
            paddingRight: "2px",
          }}
        >
          <CurrentMissionCard
            mission={activeMission}
            onOpenMissionControl={onOpenMission}
            onCreateMission={onCreateMission}
          />

          <ActiveAgentsPanel
            activeMission={activeMission}
          />

          <AttentionPanel
            pendingGates={pendingGates}
            onOpenApprovals={onOpenApprovals}
          />
        </div>
      </div>

      {/* Lower Telemetry Deck: World Intelligence | Live Activity | System Metrics */}
      <div style={{ height: "185px", flexShrink: 0 }}>
        <LowerTelemetryDeck
          activityEvents={activityFeed}
          doctorHealth={doctorHealth}
        />
      </div>
    </div>
  );
}
