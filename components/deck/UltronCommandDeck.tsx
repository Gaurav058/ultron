"use client";

import React, { useEffect, useState } from "react";
import CommandDeckNav, { PillarId } from "./CommandDeckNav";
import PillarCore from "./PillarCore";
import PillarMissions from "./PillarMissions";
import PillarBrain from "./PillarBrain";
import PillarAgents from "./PillarAgents";
import PillarTools from "./PillarTools";
import PillarWorld from "./PillarWorld";
import PillarSystem from "./PillarSystem";
import ApprovalModal from "./ApprovalModal";
import AdaptiveWorkspace from "../adaptive/AdaptiveWorkspace";
import { Mission, PolicyGate } from "../../core/types/mission";
import { MissionManager } from "../../core/missions/missionManager";

export default function UltronCommandDeck() {
  const [activePillar, setActivePillar] = useState<PillarId>("core");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<PolicyGate | null>(null);
  const [showAdaptiveWorkspace, setShowAdaptiveWorkspace] = useState(false);

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

  const pendingGates = missions.flatMap((m) => m.approvalQueue.filter((g) => g.status === "PENDING"));

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
    const newMission = MissionManager.createMission(text);
    setActiveMissionId(newMission.id);
    setActivePillar("missions");
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 font-mono select-none overflow-x-hidden">
      {/* 7-Pillars Navigation Bar */}
      <CommandDeckNav
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
        pendingApprovalsCount={pendingGates.length}
        activeMissionsCount={missions.filter((m) => m.status === "RUNNING").length}
        systemHealth="HEALTHY"
      />

      {/* Main View Router */}
      <main className="w-full">
        {activePillar === "core" && (
          <PillarCore
            activeMission={activeMission}
            onSubmitIntent={handleCreateIntent}
            onOpenApprovals={handleOpenApprovals}
            pendingApprovalsCount={pendingGates.length}
          />
        )}

        {activePillar === "missions" && (
          <PillarMissions
            missions={missions}
            activeMission={activeMission}
            onSelectMission={setActiveMissionId}
            onOpenApproval={handleOpenApprovals}
          />
        )}

        {activePillar === "brain" && <PillarBrain />}

        {activePillar === "agents" && <PillarAgents />}

        {activePillar === "tools" && <PillarTools />}

        {activePillar === "world" && <PillarWorld />}

        {activePillar === "system" && <PillarSystem />}
      </main>

      {/* Floating Action Button for Adaptive Workspace */}
      {activeMission && activePillar === "missions" && (
        <button
          onClick={() => setShowAdaptiveWorkspace(true)}
          className="fixed bottom-6 right-6 z-30 px-4 py-2 bg-[#ffaa30]/20 hover:bg-[#ffaa30]/30 text-[#ffcc66] border border-[#ffaa30]/60 rounded-lg shadow-[0_0_20px_rgba(255,170,48,0.3)] backdrop-blur-md text-xs font-bold tracking-wider transition-all"
        >
          [OPEN ADAPTIVE WORKSPACE]
        </button>
      )}

      {/* Human-in-the-Loop Approval Modal */}
      {showApprovalModal && selectedGate && (
        <ApprovalModal
          gate={selectedGate}
          onApprove={handleApproveGate}
          onDeny={handleDenyGate}
          onClose={() => setShowApprovalModal(false)}
        />
      )}

      {/* Adaptive Cognitive Workspace */}
      {showAdaptiveWorkspace && activeMission && (
        <AdaptiveWorkspace
          mission={activeMission}
          onClose={() => setShowAdaptiveWorkspace(false)}
        />
      )}
    </div>
  );
}
