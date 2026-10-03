"use client";

import React, { useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import { Mission, MissionTask } from "../../../core/types/mission";
import { MissionManager } from "../../../core/missions/missionManager";
import { RealityChecker } from "../../../core/verification/realityChecker";

type MissionFilter = "ALL" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED";

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
  const [activeTab, setActiveTab] = useState<"PLAN" | "TRACE" | "VERIFICATION" | "EVIDENCE">("PLAN");
  const [newMissionPrompt, setNewMissionPrompt] = useState("");

  const currentMission = activeMission || missions[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionPrompt.trim()) return;
    if (onCreateMission) {
      onCreateMission(newMissionPrompt.trim());
    } else {
      MissionManager.createMission(newMissionPrompt.trim());
    }
    setNewMissionPrompt("");
  };

  const handlePause = (id: string) => {
    MissionManager.pauseMission(id);
  };

  const handleResume = (id: string) => {
    MissionManager.resumeMission(id);
  };

  const handleCancel = (id: string) => {
    MissionManager.cancelMission(id);
  };

  const handleRetry = (id: string) => {
    MissionManager.retryMission(id);
  };

  const handleAdvanceTask = (taskId: string) => {
    if (!currentMission) return;
    MissionManager.completeTask(currentMission.id, taskId);
  };

  const filteredMissions = missions.filter((m) => {
    if (filter === "RUNNING") return m.status === "RUNNING" || m.status === "AWAITING_APPROVAL" || m.status === "VERIFYING";
    if (filter === "PAUSED") return m.status === "PAUSED";
    if (filter === "COMPLETED") return m.status === "COMPLETED";
    if (filter === "FAILED") return m.status === "FAILED";
    return true;
  });

  const completedTasks = currentMission?.tasks.filter((t) => t.status === "COMPLETED") || [];
  const percentComplete = currentMission
    ? Math.round((completedTasks.length / Math.max(1, currentMission.tasks.length)) * 100)
    : 0;

  const currentStep = currentMission?.tasks.find((t) => t.status === "RUNNING")?.title ||
    (currentMission?.status === "COMPLETED" ? "All steps verified" : "Awaiting execution");

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
        title="MISSION MANAGEMENT CONTROL"
        subtitle="DAG Task Scheduling & Policy Enforcement"
        badge={<UltronStatus status={filteredMissions.length > 0 ? "ONLINE" : "WAITING"} label={`${filteredMissions.length} MISSIONS`} size="sm" />}
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {(["ALL", "RUNNING", "PAUSED", "COMPLETED", "FAILED"] as MissionFilter[]).map((f) => (
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)" }}>
            Real-time mission execution graphs. Each step requires empirical verification before proceeding.
          </div>

          {/* Quick Create Form */}
          <form onSubmit={handleCreate} style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              value={newMissionPrompt}
              onChange={(e) => setNewMissionPrompt(e.target.value)}
              placeholder="Deploy new mission..."
              style={{
                height: "30px",
                width: "220px",
                padding: "0 10px",
                fontSize: "11px",
                background: "var(--ultron-panel)",
                color: "var(--ultron-text-primary)",
                border: "1px solid var(--ultron-border)",
                borderRadius: "4px",
                outline: "none",
              }}
            />
            <UltronButton type="submit" variant="primary" size="sm" disabled={!newMissionPrompt.trim()}>
              + CREATE
            </UltronButton>
          </form>
        </div>
      </UltronPanel>

      {/* Main Grid: Left Mission List + Right Mission Workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Mission List */}
        <UltronPanel
          title="MISSION REGISTRY"
          subtitle={filter}
          badge={<span style={{ fontSize: "10px", color: "var(--ultron-text-muted)" }}>{filteredMissions.length} TOTAL</span>}
        >
          {filteredMissions.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 10px",
                textAlign: "center",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ultron-text-primary)" }}>
                NO ACTIVE MISSIONS
              </div>
              <div style={{ fontSize: "11px", color: "var(--ultron-text-muted)", maxWidth: "220px", lineHeight: 1.4 }}>
                Enter an intent above or command ULTRON via voice to create a mission.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "100%", paddingRight: "4px" }}>
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
                      background: isSelected ? "rgba(99, 232, 255, 0.08)" : "var(--ultron-panel)",
                      border: isSelected ? "1px solid var(--ultron-border-active)" : "1px solid var(--ultron-border)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "var(--ultron-cyan)" : "var(--ultron-text-primary)" }}>
                        {m.title}
                      </span>
                      <UltronStatus status={m.status} size="sm" />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--ultron-text-muted)", marginBottom: "6px" }}>
                      <span>ID: {m.id}</span>
                      <span style={{ color: "var(--ultron-cyan)" }}>{m.priority}</span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: "100%", height: "4px", borderRadius: "2px", background: "rgba(99, 232, 255, 0.12)", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, var(--ultron-violet), var(--ultron-cyan))",
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
            subtitle={`MISSION ID: ${currentMission.id}`}
            badge={<UltronStatus status={currentMission.status} size="sm" />}
            actions={
              <div style={{ display: "flex", gap: "6px" }}>
                {(["PLAN", "TRACE", "VERIFICATION", "EVIDENCE"] as const).map((t) => (
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
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", height: "100%", overflowY: "auto", paddingRight: "4px" }}>
              {/* Mission Metadata Grid (Section 7) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "6px",
                  padding: "8px",
                  borderRadius: "6px",
                  background: "var(--ultron-bg-secondary)",
                  border: "1px solid var(--ultron-border)",
                  fontSize: "11px",
                  fontFamily: "var(--ultron-font-mono)",
                }}
              >
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>PRIORITY: </span>
                  <strong style={{ color: "var(--ultron-cyan)" }}>{currentMission.priority}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>PROGRESS: </span>
                  <strong style={{ color: "var(--ultron-success)" }}>{percentComplete}%</strong>
                </div>
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>CURRENT STEP: </span>
                  <strong style={{ color: "var(--ultron-text-primary)" }}>{currentStep.slice(0, 20)}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>APPROVALS: </span>
                  <strong style={{ color: currentMission.approvalQueue.length > 0 ? "var(--ultron-warning)" : "var(--ultron-success)" }}>
                    {currentMission.approvalQueue.length} PENDING
                  </strong>
                </div>
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>CREATED: </span>
                  <span>{new Date(currentMission.createdAt).toLocaleTimeString()}</span>
                </div>
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>UPDATED: </span>
                  <span>{new Date(currentMission.updatedAt).toLocaleTimeString()}</span>
                </div>
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>AGENTS: </span>
                  <span style={{ color: "var(--ultron-cyan)" }}>{currentMission.activeAgents.join(", ")}</span>
                </div>
                <div>
                  <span style={{ color: "var(--ultron-text-muted)" }}>RESULT: </span>
                  <span style={{ color: currentMission.status === "COMPLETED" ? "var(--ultron-success)" : "var(--ultron-text-muted)" }}>
                    {currentMission.status === "COMPLETED" ? "VERIFIED" : "IN_PROGRESS"}
                  </span>
                </div>
              </div>

              {/* Action Buttons Toolbar (Section 7: Pause, Resume, Cancel, Retry, Open Approvals) */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  background: "var(--ultron-panel)",
                  border: "1px solid var(--ultron-border)",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>ACTIONS:</span>

                {currentMission.status === "RUNNING" && (
                  <UltronButton
                    size="sm"
                    variant="secondary"
                    onClick={() => handlePause(currentMission.id)}
                  >
                    ⏸ PAUSE MISSION
                  </UltronButton>
                )}

                {currentMission.status === "PAUSED" && (
                  <UltronButton
                    size="sm"
                    variant="primary"
                    onClick={() => handleResume(currentMission.id)}
                  >
                    ▶ RESUME MISSION
                  </UltronButton>
                )}

                {currentMission.status === "FAILED" && (
                  <UltronButton
                    size="sm"
                    variant="primary"
                    onClick={() => handleRetry(currentMission.id)}
                  >
                    ↺ RETRY MISSION
                  </UltronButton>
                )}

                {currentMission.status !== "COMPLETED" && currentMission.status !== "CANCELLED" && (
                  <UltronButton
                    size="sm"
                    variant="danger"
                    onClick={() => handleCancel(currentMission.id)}
                  >
                    ✕ CANCEL
                  </UltronButton>
                )}

                {currentMission.approvalQueue.length > 0 && (
                  <UltronButton
                    size="sm"
                    variant="primary"
                    onClick={onOpenApproval}
                  >
                    🛡 INSPECT APPROVAL GATE ({currentMission.approvalQueue.length})
                  </UltronButton>
                )}
              </div>

              {/* Tab 1: DAG Plan */}
              {activeTab === "PLAN" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--ultron-cyan)", textTransform: "uppercase" }}>
                    TASK EXECUTION NODES ({completedTasks.length}/{currentMission.tasks.length} COMPLETED)
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
                            : "var(--ultron-panel)",
                        border:
                          task.status === "RUNNING"
                            ? "1px solid var(--ultron-border-active)"
                            : "1px solid var(--ultron-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", fontFamily: "var(--ultron-font-mono)" }}>
                          0{idx + 1}
                        </span>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--ultron-text-primary)" }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)" }}>
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

              {/* Tab 2: Mission Trace (Section 7: View mission trace) */}
              {activeTab === "TRACE" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--ultron-cyan)", textTransform: "uppercase" }}>
                    MISSION EXECUTION AUDIT TRACE
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      background: "var(--ultron-bg)",
                      border: "1px solid var(--ultron-border)",
                      fontFamily: "var(--ultron-font-mono)",
                      fontSize: "11px",
                      lineHeight: "1.6",
                      color: "var(--ultron-text-secondary)",
                    }}
                  >
                    <div>[{new Date(currentMission.createdAt).toLocaleTimeString()}] MISSION INITIATED: {currentMission.title}</div>
                    <div>[{new Date(currentMission.createdAt).toLocaleTimeString()}] DAG COMPILED: {currentMission.tasks.length} task nodes scheduled.</div>
                    {currentMission.tasks.map((t, idx) => (
                      <div key={idx} style={{ color: t.status === "COMPLETED" ? "var(--ultron-success)" : t.status === "RUNNING" ? "var(--ultron-cyan)" : "var(--ultron-text-muted)" }}>
                        [NODE {idx + 1}] {t.assignedAgent} → {t.title}: {t.status} ({t.progress}%)
                      </div>
                    ))}
                    {currentMission.completedAt && (
                      <div style={{ color: "var(--ultron-success)", marginTop: "4px" }}>
                        [{new Date(currentMission.completedAt).toLocaleTimeString()}] REALITY VERIFICATION PASSED. MISSION COMPLETE.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Reality Verification */}
              {activeTab === "VERIFICATION" && realityReport && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--ultron-cyan)", textTransform: "uppercase" }}>
                    EMPIRICAL INTEGRITY GATES ({realityReport.overallStatus})
                  </div>
                  {realityReport.assertions.map((assertion, idx) => (
                    <div
                      key={`${assertion.gate}-${idx}`}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background: "var(--ultron-panel)",
                        border: "1px solid var(--ultron-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--ultron-text-primary)" }}>
                          {assertion.gate}
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)" }}>
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

              {/* Tab 4: Evidence Ledger */}
              {activeTab === "EVIDENCE" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--ultron-cyan)", textTransform: "uppercase" }}>
                    EVIDENCE LEDGER ({currentMission.evidenceLedger.length} CLAIMS)
                  </div>
                  {currentMission.evidenceLedger.length === 0 ? (
                    <div style={{ fontSize: "11px", color: "var(--ultron-text-muted)", padding: "10px" }}>
                      No evidence claims gathered yet.
                    </div>
                  ) : (
                    currentMission.evidenceLedger.map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "6px",
                          background: "var(--ultron-panel)",
                          border: "1px solid var(--ultron-border)",
                          fontSize: "11px",
                          color: "var(--ultron-text-secondary)",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "var(--ultron-text-primary)" }}>{ev.title}</div>
                        <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)", marginTop: "2px" }}>
                          {ev.snippet}
                        </div>
                        <div style={{ fontSize: "9px", color: "var(--ultron-cyan)", marginTop: "2px" }}>
                          Source: {ev.sourceUri} • Type: {ev.claimType} • Conf: {Math.round(ev.confidence * 100)}%
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
            <div style={{ padding: "20px", textAlign: "center", color: "var(--ultron-text-muted)", fontSize: "12px" }}>
              Select a mission from the registry to view details.
            </div>
          </UltronPanel>
        )}
      </div>
    </div>
  );
}
