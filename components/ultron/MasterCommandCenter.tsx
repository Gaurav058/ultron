"use client";

import React, { useEffect, useState } from "react";
import TopSystemBar from "./TopSystemBar";
import LeftNavigationRail from "./LeftNavigationRail";
import UltronInfinityCore from "./UltronInfinityCore";
import CurrentMissionCard from "./CurrentMissionCard";
import ActiveAgentsPanel from "./ActiveAgentsPanel";
import LowerTelemetryDeck from "./LowerTelemetryDeck";
import BottomCommandBar from "./BottomCommandBar";
import SystemCapabilityStrip from "./SystemCapabilityStrip";
import MobileCompanionDeck from "./MobileCompanionDeck";
import PillarMissions from "../deck/PillarMissions";
import PillarBrain from "../deck/PillarBrain";
import PillarAgents from "../deck/PillarAgents";
import PillarTools from "../deck/PillarTools";
import PillarWorld from "../deck/PillarWorld";
import PillarSystem from "../deck/PillarSystem";
import ApprovalModal from "../deck/ApprovalModal";
import AdaptiveWorkspace from "../adaptive/AdaptiveWorkspace";
import { PillarId } from "../deck/CommandDeckNav";
import { Mission, PolicyGate } from "../../core/types/mission";
import { MissionManager } from "../../core/missions/missionManager";
import { UltronStatusState } from "../common/StatusIndicator";

export default function MasterCommandCenter() {
  const [activePillar, setActivePillar] = useState<PillarId>("core");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [coreStatus, setCoreStatus] = useState<UltronStatusState>("READY");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<PolicyGate | null>(null);
  const [showAdaptiveWorkspace, setShowAdaptiveWorkspace] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive mobile screen detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize and subscribe to MissionManager
  useEffect(() => {
    MissionManager.initialize();
    const unsubscribe = MissionManager.subscribe((updatedMissions) => {
      setMissions(updatedMissions);
      if (updatedMissions.length > 0 && !activeMissionId) {
        setActiveMissionId(updatedMissions[0].id);
      }
    });
    return unsubscribe;
  }, [activeMissionId]);

  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  // Update Core Status based on mission activity
  useEffect(() => {
    if (!activeMission) {
      setCoreStatus("READY");
    } else if (activeMission.status === "RUNNING") {
      setCoreStatus("EXECUTING");
    } else if (activeMission.status === "AWAITING_APPROVAL") {
      setCoreStatus("WAITING");
    } else if (activeMission.status === "VERIFYING") {
      setCoreStatus("VERIFYING");
    } else if (activeMission.status === "COMPLETED") {
      setCoreStatus("ONLINE");
    } else {
      setCoreStatus("READY");
    }
  }, [activeMission]);

  const pendingGates = missions.flatMap((m) =>
    m.approvalQueue.filter((g) => g.status === "PENDING")
  );

  const handleOpenApprovals = () => {
    if (pendingGates.length > 0) {
      setSelectedGate(pendingGates[0]);
      setShowApprovalModal(true);
    }
  };

  const handleApproveGate = (gateId: string) => {
    if (!activeMission) return;
    MissionManager.approveGate(activeMission.id, gateId);
  };

  const handleDenyGate = (gateId: string) => {
    if (!activeMission) return;
    const gate = activeMission.approvalQueue.find((g) => g.id === gateId);
    if (gate) {
      gate.status = "DENIED";
      setShowApprovalModal(false);
    }
  };

  const handleCreateIntent = (text: string) => {
    setCoreStatus("THINKING");
    const newMission = MissionManager.createMission(text);
    setActiveMissionId(newMission.id);
  };

  // Render Purpose-Built Mobile Companion on smaller viewports
  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-[#02030a]">
        <MobileCompanionDeck
          activeMission={activeMission}
          onSubmitIntent={handleCreateIntent}
          onSelectPillar={setActivePillar}
          activePillar={activePillar}
        />
        {showApprovalModal && selectedGate && (
          <ApprovalModal
            gate={selectedGate}
            onApprove={handleApproveGate}
            onDeny={handleDenyGate}
            onClose={() => setShowApprovalModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#02030a] text-zinc-100 font-mono">
      {/* 1. Top System Bar */}
      <TopSystemBar
        coreStatus={coreStatus}
        pendingApprovalsCount={pendingGates.length}
        activeAgentsCount={7}
      />

      {/* 2. Main Center Body: Left Rail + Center Work Surface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Rail */}
        <LeftNavigationRail
          activePillar={activePillar}
          onSelectPillar={setActivePillar}
          activeMissionsCount={missions.filter((m) => m.status === "RUNNING").length}
        />

        {/* Center Work Surface */}
        <main className="flex-1 flex flex-col overflow-y-auto p-3 lg:p-4 gap-3 bg-[radial-gradient(ellipse_at_top,rgba(8,12,30,0.6)_0%,rgba(2,3,10,0.95)_100%)]">
          {activePillar === "core" ? (
            <>
              {/* Upper Section: Center Infinity Core + Right Active Agents */}
              <div className="flex flex-col lg:flex-row gap-3 items-start">
                {/* Center Main Stage (Infinity Core + Current Mission) */}
                <div className="flex-1 flex flex-col gap-3 w-full">
                  <UltronInfinityCore status={coreStatus} />
                  <CurrentMissionCard
                    mission={activeMission}
                    onOpenMissionControl={() => setActivePillar("missions")}
                  />
                </div>

                {/* Right Column: Active Agents Stack */}
                <ActiveAgentsPanel
                  pendingApprovalsCount={pendingGates.length}
                  onOpenApprovals={handleOpenApprovals}
                  onExecuteNextStep={() => {
                    const firstRunning = activeMission?.tasks.find((t) => t.status === "RUNNING");
                    if (firstRunning && activeMission) {
                      MissionManager.completeTask(activeMission.id, firstRunning.id);
                    }
                  }}
                />
              </div>

              {/* Lower Section: 3-Panel Lower Telemetry Deck */}
              <LowerTelemetryDeck />

              {/* Bottom Section: Command Bar */}
              <BottomCommandBar
                onSubmitIntent={handleCreateIntent}
                isProcessing={coreStatus === "THINKING"}
              />
            </>
          ) : activePillar === "missions" ? (
            <PillarMissions
              missions={missions}
              activeMission={activeMission}
              onSelectMission={setActiveMissionId}
              onOpenApproval={handleOpenApprovals}
            />
          ) : activePillar === "brain" ? (
            <PillarBrain />
          ) : activePillar === "agents" ? (
            <PillarAgents />
          ) : activePillar === "tools" ? (
            <PillarTools />
          ) : activePillar === "world" ? (
            <PillarWorld />
          ) : (
            <PillarSystem />
          )}
        </main>
      </div>

      {/* 3. Lower System Capability Strip */}
      <SystemCapabilityStrip />

      {/* Human-in-the-Loop Approval Modal */}
      {showApprovalModal && selectedGate && (
        <ApprovalModal
          gate={selectedGate}
          onApprove={handleApproveGate}
          onDeny={handleDenyGate}
          onClose={() => setShowApprovalModal(false)}
        />
      )}

      {/* Adaptive Workspace Drawer */}
      {showAdaptiveWorkspace && activeMission && (
        <AdaptiveWorkspace
          mission={activeMission}
          onClose={() => setShowAdaptiveWorkspace(false)}
        />
      )}
    </div>
  );
}
