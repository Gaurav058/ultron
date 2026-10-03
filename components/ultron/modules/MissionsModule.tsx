"use client";

import React, { useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus, { UltronStatusType } from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import { Mission, MissionTask } from "../../../core/types/mission";
import { MissionManager } from "../../../core/missions/missionManager";
import { RealityChecker } from "../../../core/verification/realityChecker";

type MissionFilter = "ALL" | "ACTIVE" | "QUEUED" | "COMPLETED" | "FAILED";

export interface MissionsModuleProps {
  missions: Mission[];
  activeMission?: Mission;
  onSelectMission: (missionId: string) => void;
  onOpenApproval: () => void;
  onCreateMission?: (title: string) => void;
}

export default function MissionsModule({
  missions = [],
  activeMission,
  onSelectMission,
  onOpenApproval,
  onCreateMission,
}: MissionsModuleProps) {
  const [filter, setFilter] = useState<MissionFilter>("ALL");
  const [activeTab, setActiveTab] = useState<"PLAN" | "VERIFICATION" | "EVIDENCE">("PLAN");

  const currentMission = activeMission || missions[0];

  const handleAdvanceTask = (taskId: string) => {
    if (!currentMission) return;
    MissionManager.completeTask(currentMission.id, taskId);
  };

  const filteredMissions = missions.filter((m) => {
    if (filter === "ACTIVE") return m.status === "RUNNING" || m.status === "AWAITING_APPROVAL" || m.status === "VERIFYING";
    if (filter === "QUEUED") return m.status === "CREATED" || m.status === "PLANNING";
    if (filter === "COMPLETED") return m.status === "COMPLETED";
    if (filter === "FAILED") return m.status === "FAILED";
    return true;
  });

  const completedTasks = currentMission?.tasks.filter((t) => t.status === "COMPLETED") || [];
  const percentComplete = currentMission
    ? Math.round((completedTasks.length / Math.max(1, currentMission.tasks.length)) * 100)
    : 0;

  const realityReport = currentMission ? RealityChecker.auditMission(currentMission) : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        padding: "10px 1.4vw",
        overflow: "hidden",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* Header Bar */}
      <UltronPanel
        title="MISSION CONTROL"
        subtitle="Autonomous Task Orchestration"
        badge={<UltronStatus status={filteredMissions.length > 0 ? "ONLINE" : "WAITING"} label={`${filteredMissions.length} MISSIONS`} size="sm" />}
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {(["ALL", "ACTIVE", "QUEUED", "COMPLETED", "FAILED"] as MissionFilter[]).map((f) => (
              <UltronButton
                key={f}
                size="sm"
                variant={filter === f ? "primary" : "secondary"}
                onClick={() => setFilter(f)}
              >
                {f}
              </UltronButton>
            ))}
          </div>
        }
      >
        <div style={{ fontSize: "11px", color: "#AAB8D4" }}>
          Autonomous decomposition of operator intent into verifiable, empirical execution graphs governed by policy gates.
        </div>
      </UltronPanel>

      {/* Main Grid: Left Mission List + Right Mission Workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Mission List */}
        <UltronPanel
          title="MISSION REGISTRY"
          subtitle={filter}
          badge={<span style={{ fontSize: "10px", color: "#71809D" }}>{filteredMissions.length} TOTAL</span>}
        >
          {filteredMissions.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "30px 10px",
                textAlign: "center",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#EAF2FF" }}>
                NO MISSIONS
              </div>
              <div style={{ fontSize: "11px", color: "#71809D", maxWidth: "220px", lineHeight: 1.4 }}>
                Create your first mission using the command bar.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
              {filteredMissions.map((m) => {
                const isSelected = currentMission?.id === m.id;
                const completed = m.tasks.filter((t) => t.status === "COMPLETED").length;
                const pct = Math.round((completed / Math.max(1, m.tasks.length)) * 100);

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMission(m.id)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "6px",
                      background: isSelected ? "rgba(99, 232, 255, 0.08)" : "rgba(105, 150, 255, 0.03)",
                      border: isSelected ? "1px solid rgba(99, 232, 255, 0.40)" : "1px solid rgba(105, 150, 255, 0.12)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "#63E8FF" : "#EAF2FF" }}>
                        {m.title}
                      </span>
                      <UltronStatus status={m.status} size="sm" />
                    </div>

                    <div style={{ fontSize: "10px", color: "#71809D", marginBottom: "6px" }}>
                      ID: {m.id.slice(0, 12)} • {m.tasks.length} tasks
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: "100%", height: "3px", borderRadius: "2px", background: "rgba(105, 150, 255, 0.12)", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #8D75FF, #63E8FF)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </UltronPanel>

        {/* Selected Mission Workspace */}
        {currentMission ? (
          <UltronPanel
            title={currentMission.title}
            subtitle={`ID: ${currentMission.id}`}
            badge={<UltronStatus status={currentMission.status} size="sm" />}
            actions={
              <div style={{ display: "flex", gap: "6px" }}>
                {(["PLAN", "VERIFICATION", "EVIDENCE"] as const).map((t) => (
                  <UltronButton
                    key={t}
                    size="sm"
                    variant={activeTab === t ? "primary" : "secondary"}
                    onClick={() => setActiveTab(t)}
                  >
                    {t}
                  </UltronButton>
                ))}
              </div>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", overflowY: "auto" }}>
              {/* Mission Objective */}
              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  background: "rgba(99, 232, 255, 0.03)",
                  border: "1px solid rgba(105, 150, 255, 0.15)",
                  fontSize: "12px",
                  color: "#C9D5EA",
                }}
              >
                <span style={{ color: "#8FA3C5", fontWeight: 600, marginRight: "6px" }}>OBJECTIVE:</span>
                {currentMission.objective}
              </div>

              {/* Tab 1: DAG Plan */}
              {activeTab === "PLAN" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#8FA3C5", textTransform: "uppercase" }}>
                    TASK NODES ({completedTasks.length}/{currentMission.tasks.length} COMPLETED — {percentComplete}%)
                  </div>

                  {currentMission.tasks.map((task, idx) => (
                    <div
                      key={task.id}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background:
                          task.status === "RUNNING"
                            ? "rgba(99, 232, 255, 0.06)"
                            : "rgba(105, 150, 255, 0.02)",
                        border:
                          task.status === "RUNNING"
                            ? "1px solid rgba(99, 232, 255, 0.35)"
                            : "1px solid rgba(105, 150, 255, 0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "10px", color: "#71809D", fontFamily: "var(--font-mono)" }}>
                          0{idx + 1}
                        </span>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: "#EAF2FF" }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: "10px", color: "#71809D" }}>
                            Agent: {task.assignedAgent} • Deps: {task.dependencies.length > 0 ? task.dependencies.join(", ") : "Root"}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <UltronStatus status={task.status} size="sm" />
                        {task.status === "RUNNING" && (
                          <UltronButton
                            size="sm"
                            variant="primary"
                            onClick={() => handleAdvanceTask(task.id)}
                          >
                            EXECUTE STEP ➔
                          </UltronButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Reality Verification */}
              {activeTab === "VERIFICATION" && realityReport && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#8FA3C5", textTransform: "uppercase" }}>
                    EMPIRICAL INTEGRITY GATES ({realityReport.overallStatus})
                  </div>
                  {realityReport.assertions.map((assertion, idx) => (
                    <div
                      key={`${assertion.gate}-${idx}`}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background: "rgba(105, 150, 255, 0.02)",
                        border: "1px solid rgba(105, 150, 255, 0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#EAF2FF" }}>
                          {assertion.gate}
                        </div>
                        <div style={{ fontSize: "10px", color: "#71809D" }}>
                          {assertion.details} • Score: {assertion.score}
                        </div>
                      </div>
                      <UltronStatus
                        status={assertion.status === "PASSED" ? "ONLINE" : "ERROR"}
                        label={assertion.status}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Evidence Ledger */}
              {activeTab === "EVIDENCE" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#8FA3C5", textTransform: "uppercase" }}>
                    EVIDENCE LEDGER ({currentMission.evidenceLedger.length} CLAIMS)
                  </div>
                  {currentMission.evidenceLedger.length === 0 ? (
                    <div style={{ fontSize: "11px", color: "#71809D", padding: "10px" }}>
                      No evidence claims gathered yet.
                    </div>
                  ) : (
                    currentMission.evidenceLedger.map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          background: "rgba(105, 150, 255, 0.02)",
                          border: "1px solid rgba(105, 150, 255, 0.10)",
                          fontSize: "11px",
                          color: "#C9D5EA",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#EAF2FF" }}>{ev.title}</div>
                        <div style={{ fontSize: "10px", color: "#AAB8D4", marginTop: "2px" }}>
                          {ev.snippet}
                        </div>
                        <div style={{ fontSize: "9px", color: "#71809D", marginTop: "2px" }}>
                          Source: {ev.sourceUri} • Type: {ev.claimType}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </UltronPanel>
        ) : (
          <UltronPanel title="MISSION DETAILS" subtitle="Inspector">
            <div style={{ padding: "20px", textAlign: "center", color: "#71809D", fontSize: "12px" }}>
              Select a mission from the registry to view details.
            </div>
          </UltronPanel>
        )}
      </div>
    </div>
  );
}
