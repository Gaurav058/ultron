"use client";

import React from "react";
import CurrentMissionCard from "./CurrentMissionCard";
import ActiveAgentsPanel from "./ActiveAgentsPanel";
import AttentionPanel from "./AttentionPanel";
import { Mission, PolicyGate } from "@/core/types/mission";

interface RightIntelligenceRailProps {
  activeMission?: Mission;
  pendingGates: PolicyGate[];
  onOpenMissionControl: () => void;
  onCreateMission: () => void;
  onSelectAgent: () => void;
  onOpenApprovals: (gate?: PolicyGate) => void;
}

export default function RightIntelligenceRail({
  activeMission,
  pendingGates,
  onOpenMissionControl,
  onCreateMission,
  onSelectAgent,
  onOpenApprovals,
}: RightIntelligenceRailProps) {
  return (
    <aside
      id="ultron-right-intelligence-rail"
      aria-label="Intelligence Rail"
      style={{
        width: "340px",
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        overflowY: "auto",
        paddingRight: "2px",
      }}
    >
      {/* Current Mission Panel (Section 11) */}
      <CurrentMissionCard
        mission={activeMission}
        onOpenMissionControl={onOpenMissionControl}
        onCreateMission={onCreateMission}
      />

      {/* Active Agents Panel (Section 12) */}
      <ActiveAgentsPanel
        activeMission={activeMission}
        onSelectAgent={onSelectAgent}
      />

      {/* Attention Required Panel (Section 13) */}
      <AttentionPanel
        pendingGates={pendingGates}
        onOpenApprovals={onOpenApprovals}
      />
    </aside>
  );
}
