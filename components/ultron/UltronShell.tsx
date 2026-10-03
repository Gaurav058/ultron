"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import UltronHeader from "../layout/UltronHeader";
import IconNavRail, { NavItemKey } from "../layout/IconNavRail";
import MissionsAndChatPanel from "../missions/MissionsAndChatPanel";
import AgentWorkflowPipeline from "../workflow/AgentWorkflowPipeline";
import LiveActivityPanel, { ActivityFeedItem } from "../activity/LiveActivityPanel";
import SystemHealthPanel from "../system/SystemHealthPanel";
import UltronOraclePanel from "../oracle/UltronOraclePanel";
import GlobalNewsPanel from "../news/GlobalNewsPanel";
import UltronCommandBar from "../command/UltronCommandBar";

const GlobalIntelligenceGlobe = dynamic(
  () => import("../globe/GlobalIntelligenceGlobe"),
  { ssr: false }
);

import MissionsModule from "./modules/MissionsModule";
import BrainModule from "./modules/BrainModule";
import AgentsModule from "./modules/AgentsModule";
import ToolsModule from "./modules/ToolsModule";
import WorldModule from "./modules/WorldModule";
import SystemModule from "./modules/SystemModule";
import ApprovalModal from "../deck/ApprovalModal";

import { Mission, PolicyGate } from "../../core/types/mission";
import { MissionManager } from "../../core/missions/missionManager";
import { RealityChecker } from "../../core/verification/realityChecker";
import { UltronDoctor } from "../../core/runtime/ultronDoctor";
import { UltronEventBus, UltronEvent } from "../../core/events/eventBus";
import { UltronVoiceEngine } from "@/lib/voiceEngine";

import { MissionItem, ChatMessage } from "@/types/mission";
import { WorkflowNode } from "@/types/workflow";
import { SelectedLocation } from "@/types/location";
import { NewsStory } from "@/types/news";
import { SystemStatus } from "@/types/system";

import {
  DEMO_MISSIONS,
  DEMO_CHAT_MESSAGES,
  DEMO_WORKFLOW_NODES,
  DEMO_NEWS_STORIES,
  DEMO_LOCATION_DUBAI,
  DEMO_SYSTEM_STATUS,
  DEMO_SYSTEM_INFO,
} from "@/lib/demo/ultronDemoData";

export interface UltronShellProps {
  initialModule?: string;
}

export default function UltronShell({ initialModule = "CORE" }: UltronShellProps) {
  // Navigation State
  const [activeNav, setActiveNav] = useState<NavItemKey>(
    initialModule.toLowerCase() as NavItemKey || "home"
  );

  // Backend Missions State
  const [backendMissions, setBackendMissions] = useState<Mission[]>([]);
  const [activeMissionId, setActiveMissionId] = useState<string>("mission-1");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<PolicyGate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Conversational Chat Stream
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(DEMO_CHAT_MESSAGES);

  // Workflow Graph Nodes State
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>(DEMO_WORKFLOW_NODES);

  // Global Intelligence & News State
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>(DEMO_LOCATION_DUBAI);
  const [newsStories] = useState<NewsStory[]>(DEMO_NEWS_STORIES);

  // Activity Feed
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([
    { timestamp: "10:42", source: "Researcher", event: "Fetched 12 sources", status: "ONLINE" },
    { timestamp: "10:38", source: "Analyst", event: "Completed analysis", status: "ONLINE" },
    { timestamp: "10:32", source: "Conductor", event: "Mission created", status: "ONLINE" },
    { timestamp: "10:21", source: "Memory", event: "Stored 5 new facts", status: "ONLINE" },
    { timestamp: "10:18", source: "Web Search", event: "Results retrieved", status: "ONLINE" },
    { timestamp: "10:12", source: "Agent", event: "Updated status", status: "ONLINE" },
  ]);

  // System Health & Diagnostics
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(DEMO_SYSTEM_STATUS);
  const [activeModel, setActiveModel] = useState<string>("Gemini 1.5 Pro");
  const [doctorHealth, setDoctorHealth] = useState<string>("OPTIMAL");

  // Initialize MissionManager & Check Health
  useEffect(() => {
    MissionManager.initialize();
    const unsubscribe = MissionManager.subscribe((updated) => {
      setBackendMissions(updated);
    });

    // Check Gemini API Health
    fetch("/api/health/gemini")
      .then((res) => res.json())
      .then((data) => {
        if (data.configured && data.model) {
          setActiveModel(data.model);
          setSystemStatus((prev) => ({ ...prev, api: "online" }));
        }
      })
      .catch(() => {
        setSystemStatus((prev) => ({ ...prev, api: "offline" }));
      });

    // Run Doctor Diagnostics
    UltronDoctor.runDiagnostics().then((report) => {
      setDoctorHealth(report.overallHealth === "HEALTHY" ? "OPTIMAL" : report.overallHealth);
    });

    return unsubscribe;
  }, []);

  // Subscribe to Unified Event Bus
  useEffect(() => {
    const unsubscribe = UltronEventBus.subscribe("*", (evt: UltronEvent) => {
      const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      let statusBadge = "ONLINE";
      if (evt.type.includes("ERROR") || evt.type.includes("FAILED")) statusBadge = "ERROR";
      else if (evt.type.includes("APPROVAL")) statusBadge = "WARN";

      setActivityFeed((prev) => [
        {
          timestamp: timeStr,
          source: evt.source || "Agent",
          event: evt.summary,
          status: statusBadge,
        },
        ...prev.slice(0, 15),
      ]);

      // If tool or agent started, reflect dynamically in workflow nodes
      if (evt.type === "TOOL_STARTED") {
        setWorkflowNodes((nodes) =>
          nodes.map((n) =>
            n.id === "node-websearch"
              ? { ...n, status: "running" }
              : n
          )
        );
      } else if (evt.type === "TOOL_COMPLETED") {
        setWorkflowNodes((nodes) =>
          nodes.map((n) =>
            n.id === "node-websearch"
              ? { ...n, status: "completed" }
              : n
          )
        );
      }
    });

    return unsubscribe;
  }, []);

  // Combined UI Missions: map backend missions or fallback to DEMO_MISSIONS
  const uiMissions: MissionItem[] = useMemo(() => {
    if (backendMissions.length === 0) {
      return DEMO_MISSIONS;
    }

    const mapped = backendMissions.map((bm): MissionItem => {
      const totalTasks = bm.tasks.length || 1;
      const completedTasks = bm.tasks.filter((t) => t.status === "COMPLETED").length;
      const progress = Math.round((completedTasks / totalTasks) * 100);

      let status: MissionItem["status"] = "queued";
      if (bm.status === "RUNNING") status = "running";
      else if (bm.status === "COMPLETED") status = "completed";
      else if (bm.status === "FAILED") status = "failed";
      else if (bm.status === "AWAITING_APPROVAL") status = "waiting";

      return {
        id: bm.id,
        title: bm.title,
        description: bm.objective,
        status,
        progress,
        createdAt: bm.createdAt,
        updatedAt: bm.updatedAt,
        timeAgo: "Just now",
      };
    });

    // Merge backend missions at top, followed by demo reference items
    const backendIds = new Set(mapped.map((m) => m.id));
    const extraDemos = DEMO_MISSIONS.filter((dm) => !backendIds.has(dm.id));
    return [...mapped, ...extraDemos];
  }, [backendMissions]);

  // Handle Command Submission -> POST /api/voice/chat
  const handleCommandSubmit = async (commandText: string) => {
    if (!commandText.trim()) return;

    setIsProcessing(true);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsgId = `chat-u-${Date.now()}`;
    const newChat: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: commandText,
      timestamp: now,
    };

    setChatMessages((prev) => [...prev, newChat]);

    UltronEventBus.publish(
      "SYSTEM_STATE_CHANGED",
      "USER",
      `Directing intent to Gemini kernel: "${commandText.slice(0, 38)}..."`
    );

    try {
      const res = await fetch("/api/voice/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: commandText,
          sessionId: "ultron-desktop-session",
        }),
      });

      if (!res.ok) {
        throw new Error(`Kernel returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.text || "Command processed successfully.";
      if (data.model) setActiveModel(data.model);

      let createdMissionId: string | undefined;

      // Process actions / tools executed by Gemini
      if (data.actions && data.actions.length > 0) {
        for (const action of data.actions) {
          const toolName = action.name || action.toolName;
          UltronEventBus.publish("TOOL_STARTED", "AGENT", `Executed Gemini tool: ${toolName}`);

          if (toolName === "create_mission" && action.result?.missionId) {
            createdMissionId = action.result.missionId;
            if (createdMissionId) {
              setActiveMissionId(createdMissionId);
            }
          }
          UltronEventBus.publish("TOOL_COMPLETED", "TOOL", `Completed ${toolName}`);
        }
      }

      // Add Ultron response message to chat stream
      const botMsgId = `chat-b-${Date.now()}`;
      setChatMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: "ultron",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          badge: createdMissionId ? "Mission Created" : undefined,
          missionId: createdMissionId,
        },
      ]);

      // Speak response through voice engine
      try {
        UltronVoiceEngine.getInstance().speak(replyText);
      } catch {}

      // Refresh MissionManager state
      setBackendMissions(MissionManager.getMissions());
    } catch (err: any) {
      console.warn("API notice; executing local fallback:", err?.message);
      // Fallback: create local mission
      const localMission = MissionManager.createMission(commandText);
      setActiveMissionId(localMission.id);
      setBackendMissions(MissionManager.getMissions());

      const botMsgId = `chat-b-${Date.now()}`;
      setChatMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: "ultron",
          text: `Mission initialized: "${commandText}". Autonomous pipeline compiled.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          badge: "Mission Created",
          missionId: localMission.id,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle News Item Click -> Update Globe & Location Details
  const handleSelectNewsStory = (story: NewsStory) => {
    if (story.latitude !== undefined && story.longitude !== undefined) {
      setSelectedLocation({
        latitude: story.latitude,
        longitude: story.longitude,
        city: story.location?.split(",")[0] || "Global Zone",
        country: story.location?.split(",")[1]?.trim() || "Earth",
        weather: {
          temperature: "28°C",
          condition: "Clear",
        },
        insights: [
          `News Signal: ${story.title}`,
          `Source: ${story.source} (${story.publishedAt})`,
          "Regional intelligence telemetry active",
        ],
        cameraStatus: "NO_AUTHORIZED_SOURCES",
      });
    }
  };

  // Approval Gates Handling
  const handleApproveGate = (gateId: string) => {
    if (activeBackendMission) {
      MissionManager.approveGate(activeBackendMission.id, gateId);
      setBackendMissions(MissionManager.getMissions());
    }
    setShowApprovalModal(false);
    setSelectedGate(null);
  };

  const handleDenyGate = (_gateId: string) => {
    setShowApprovalModal(false);
    setSelectedGate(null);
  };

  const handleNewMission = () => {
    const name = prompt("Enter objective for new ULTRON Mission:");
    if (name) {
      handleCommandSubmit(name);
    }
  };

  const activeBackendMission =
    backendMissions.find((m) => m.id === activeMissionId) || backendMissions[0];

  return (
    <div
      className="ultron-os-bg"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: "#C8D8EA",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* 1. TOP HEADER (60px) */}
      <UltronHeader
        systemStatus={systemStatus.api === "online" ? "online" : "degraded"}
        operatorName="GAURAV"
        operatorRole="PRIME USER"
      />

      {/* 2. MAIN WORKSPACE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          padding: "10px 12px 6px 12px",
          gap: "10px",
        }}
      >
        {/* Leftmost Vertical Icon Navigation Rail */}
        <IconNavRail
          activeItem={activeNav}
          onSelect={(item) => setActiveNav(item)}
        />

        {/* View Switch: HOME (Primary Command Center matching reference image) */}
        {activeNav === "home" ? (
          <>
            {/* LEFT COLUMN: Missions & Chat */}
            <MissionsAndChatPanel
              missions={uiMissions}
              activeMissionId={activeMissionId}
              onSelectMission={(id) => setActiveMissionId(id)}
              onNewMission={handleNewMission}
              chatMessages={chatMessages}
              onSendMessage={handleCommandSubmit}
              isProcessing={isProcessing}
            />

            {/* CENTER COLUMN: Workflow Pipeline (Upper) + Global Intelligence & Telemetry (Lower) */}
            <div
              style={{
                flex: "1 1 0%",
                minWidth: "580px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                overflow: "hidden",
              }}
            >
              {/* Center Upper: AGENT WORKFLOW PIPELINE */}
              <AgentWorkflowPipeline
                nodes={workflowNodes}
                metrics={{
                  totalAgents: 10,
                  activeTasks: 3,
                  completedToday: 12,
                  systemLoad: "Normal",
                }}
              />

              {/* Center Lower: 3-Way Split (Global Intelligence + Live Activity + System Health) */}
              <div
                style={{
                  flex: "1 1 0%",
                  minHeight: "260px",
                  display: "flex",
                  gap: "10px",
                  overflow: "hidden",
                }}
              >
                {/* 3D Earth Globe with Layer Filters */}
                <GlobalIntelligenceGlobe
                  selectedLocation={selectedLocation}
                  onSelectLocation={(loc) => setSelectedLocation(loc)}
                />

                {/* Live Activity Feed */}
                <LiveActivityPanel
                  items={activityFeed}
                  onViewAll={() => setActiveNav("system")}
                />

                {/* System Health Checklist */}
                <SystemHealthPanel status={systemStatus} />
              </div>
            </div>

            {/* RIGHT COLUMN: Ultron Oracle + Global News */}
            <div
              style={{
                width: "295px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {/* Upper Right: ULTRON ORACLE */}
              <UltronOraclePanel
                quote="The future is not predicted, it's built by those who see it first."
                author="ULTRON"
                activeModel={activeModel}
                systemInfo={DEMO_SYSTEM_INFO}
              />

              {/* Lower Right: GLOBAL NEWS */}
              <GlobalNewsPanel
                stories={newsStories}
                onSelectStory={handleSelectNewsStory}
                onViewAll={() => alert("All Global News Feeds Synced.")}
              />
            </div>
          </>
        ) : (
          /* Secondary Detailed Modules Navigation */
          <div
            style={{
              flex: 1,
              height: "100%",
              overflowY: "auto",
              padding: "4px",
            }}
          >
            {activeNav === "missions" && (
              <MissionsModule
                missions={backendMissions}
                activeMission={activeBackendMission}
                onSelectMission={setActiveMissionId}
                onOpenApproval={() => {}}
                onCreateMission={(prompt) => handleCommandSubmit(prompt)}
              />
            )}
            {activeNav === "brain" && <BrainModule />}
            {activeNav === "agents" && (
              <AgentsModule
                activeTaskAgentId={
                  activeBackendMission?.tasks.find((t) => t.status === "RUNNING")?.assignedAgent
                }
              />
            )}
            {activeNav === "tools" && <ToolsModule />}
            {activeNav === "world" && <WorldModule />}
            {activeNav === "system" && <SystemModule />}
          </div>
        )}
      </div>

      {/* 3. BOTTOM COMMAND BAR */}
      <div style={{ padding: "2px 14px 8px 14px" }}>
        <UltronCommandBar
          onSubmit={handleCommandSubmit}
          isProcessing={isProcessing}
        />
      </div>

      {/* Approval Modal for Policy Gates */}
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
