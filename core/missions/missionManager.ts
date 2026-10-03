import { Mission, MissionTask, PolicyGate } from "../types/mission";
import { parseIntent, ParsedIntent } from "../cognition/intentParser";
import { generateMissionDAG } from "../planner/dagPlanner";
import { RealityChecker } from "../verification/realityChecker";
import { UltronEventBus } from "../events/eventBus";

const STORAGE_KEY = "ultron.missions.v2";

export class MissionManager {
  private static missions: Mission[] = [];
  private static listeners: ((missions: Mission[]) => void)[] = [];

  public static initialize(): void {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.missions = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Failed to load missions from localStorage:", e);
    }

    // If empty, create initial benchmark mission
    if (this.missions.length === 0) {
      this.createMission(
        "Build ULTRON V2 Cognitive Operating System Architecture and Command Deck"
      );
    }
  }

  public static subscribe(fn: (missions: Mission[]) => void): () => void {
    this.listeners.push(fn);
    fn([...this.missions]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private static notify(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.missions.slice(-20)));
      } catch (e) {
        console.warn("Failed to save missions:", e);
      }
    }
    this.listeners.forEach((l) => l([...this.missions]));
  }

  public static getMissions(): Mission[] {
    return [...this.missions];
  }

  public static getMission(id: string): Mission | undefined {
    return this.missions.find((m) => m.id === id || m.title.toLowerCase().includes(id.toLowerCase()));
  }

  public static getActiveMission(): Mission | undefined {
    return (
      this.missions.find(
        (m) =>
          m.status === "RUNNING" ||
          m.status === "PLANNING" ||
          m.status === "AWAITING_APPROVAL" ||
          m.status === "VERIFYING"
      ) || this.missions[0]
    );
  }

  public static createMission(userInput: string, priority?: "P0" | "P1" | "P2" | "P3"): Mission {
    const intent: ParsedIntent = parseIntent(userInput);
    const missionId = `msn-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();

    const tasks = generateMissionDAG(intent, missionId);

    // Initial Approval Gate if high-risk or security
    const approvalQueue: PolicyGate[] = [];
    if (intent.requiresApproval) {
      approvalQueue.push({
        id: `gate-${Date.now()}`,
        action: "EXECUTE_SECURITY_OR_DEPLOYMENT_ACTION",
        target: intent.title,
        reason: "Mission involves high-impact perimeter scanning or file modifications.",
        riskLevel: "HIGH",
        expectedResult: "Authorized inspection within defined boundary.",
        status: "PENDING",
        requestedBy: "agent-security",
        timestamp,
      });
      UltronEventBus.publish("APPROVAL_REQUESTED", "SECURITY", `Approval requested for mission: ${intent.title}`, {
        missionId,
      });
    }

    const mission: Mission = {
      id: missionId,
      title: intent.title,
      objective: intent.objective,
      status: approvalQueue.length > 0 ? "AWAITING_APPROVAL" : "RUNNING",
      priority: priority || intent.suggestedPriority,
      tasks,
      activeAgents: Array.from(new Set(tasks.map((t) => t.assignedAgent))),
      evidenceLedger: [
        {
          id: `ev-${Date.now()}-1`,
          sourceUri: "https://github.com/Gaurav058/ultron",
          title: "ULTRON Primary Monorepo Repository",
          snippet: "Audited existing 3D WebGL Three.js orb and hand tracking architecture.",
          confidence: 1.0,
          extractedAt: timestamp,
          claimType: "FACT",
        },
      ],
      approvalQueue,
      budget: {
        tokenSpend: 42000,
        estimatedCostUsd: 0.12,
        budgetLimitUsd: 5.0,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Mark first task as RUNNING if not blocked
    if (mission.status === "RUNNING" && mission.tasks.length > 0) {
      mission.tasks[0].status = "RUNNING";
      mission.tasks[0].progress = 45;
    }

    this.missions.unshift(mission);
    UltronEventBus.publish("MISSION_CREATED", "CONDUCTOR", `Mission created: [${mission.id}] ${mission.title}`, {
      missionId: mission.id,
      title: mission.title,
    });

    this.notify();
    return mission;
  }

  public static updateMissionStatus(missionId: string, status: Mission["status"]): boolean {
    const mission = this.getMission(missionId);
    if (!mission) return false;
    mission.status = status;
    mission.updatedAt = new Date().toISOString();
    if (status === "COMPLETED") {
      mission.completedAt = new Date().toISOString();
    }
    this.notify();
    return true;
  }

  public static pauseMission(missionId: string): boolean {
    const mission = this.getMission(missionId);
    if (!mission) return false;

    mission.status = "PAUSED";
    mission.updatedAt = new Date().toISOString();
    UltronEventBus.publish("MISSION_PAUSED", "CONDUCTOR", `Paused mission: [${mission.id}] ${mission.title}`, {
      missionId: mission.id,
    });
    this.notify();
    return true;
  }

  public static resumeMission(missionId: string): boolean {
    const mission = this.getMission(missionId);
    if (!mission) return false;

    mission.status = "RUNNING";
    mission.updatedAt = new Date().toISOString();
    UltronEventBus.publish("MISSION_RESUMED", "CONDUCTOR", `Resumed mission: [${mission.id}] ${mission.title}`, {
      missionId: mission.id,
    });
    this.notify();
    return true;
  }

  public static cancelMission(missionId: string): boolean {
    const mission = this.getMission(missionId);
    if (!mission) return false;

    mission.status = "CANCELLED";
    mission.updatedAt = new Date().toISOString();
    UltronEventBus.publish("MISSION_CANCELLED", "CONDUCTOR", `Cancelled mission: [${mission.id}] ${mission.title}`, {
      missionId: mission.id,
    });
    this.notify();
    return true;
  }

  public static retryMission(missionId: string): boolean {
    const mission = this.getMission(missionId);
    if (!mission) return false;

    mission.status = "RUNNING";
    mission.tasks.forEach((t) => {
      if (t.status === "FAILED") {
        t.status = "QUEUED";
        t.progress = 0;
      }
    });
    if (mission.tasks.length > 0) {
      mission.tasks[0].status = "RUNNING";
      mission.tasks[0].progress = 20;
    }
    mission.updatedAt = new Date().toISOString();
    UltronEventBus.publish("MISSION_STARTED", "CONDUCTOR", `Retried mission: [${mission.id}] ${mission.title}`, {
      missionId: mission.id,
    });
    this.notify();
    return true;
  }

  public static approveGate(missionId: string, gateId: string): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;

    const gate = mission.approvalQueue.find((g) => g.id === gateId);
    if (gate) {
      gate.status = "APPROVED";
      UltronEventBus.publish("APPROVAL_GRANTED", "SECURITY", `Approved security gate: ${gate.action} for ${gate.target}`, {
        missionId,
        gateId,
      });

      const hasPending = mission.approvalQueue.some((g) => g.status === "PENDING");
      if (!hasPending && mission.status === "AWAITING_APPROVAL") {
        mission.status = "RUNNING";
        const pendingTask = mission.tasks.find((t) => t.status === "QUEUED");
        if (pendingTask) {
          pendingTask.status = "RUNNING";
          pendingTask.progress = 25;
        }
      }
      mission.updatedAt = new Date().toISOString();
      this.notify();
    }
  }

  public static completeTask(missionId: string, taskId: string): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;

    const task = mission.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = "COMPLETED";
      task.progress = 100;
      task.completedAt = new Date().toISOString();

      UltronEventBus.publish("AGENT_COMPLETED", "AGENT", `Completed task: ${task.title} (${task.assignedAgent})`, {
        missionId,
        taskId,
        agent: task.assignedAgent,
      });

      // Find next task whose dependencies are satisfied
      const nextTask = mission.tasks.find(
        (t) =>
          t.status === "QUEUED" &&
          t.dependencies.every((depId) => {
            const dep = mission.tasks.find((d) => d.id === depId);
            return dep && dep.status === "COMPLETED";
          })
      );

      if (nextTask) {
        nextTask.status = "RUNNING";
        nextTask.progress = 20;
        UltronEventBus.publish("AGENT_STARTED", "AGENT", `Started task: ${nextTask.title} (${nextTask.assignedAgent})`, {
          missionId,
          taskId: nextTask.id,
          agent: nextTask.assignedAgent,
        });
      } else {
        // All tasks completed -> Run Reality Checker
        const allDone = mission.tasks.every((t) => t.status === "COMPLETED");
        if (allDone) {
          mission.status = "VERIFYING";
          mission.verificationReport = RealityChecker.auditMission(mission);
          mission.status = mission.verificationReport.overallStatus === "VERIFIED" ? "COMPLETED" : "FAILED";
          mission.completedAt = new Date().toISOString();

          if (mission.status === "COMPLETED") {
            UltronEventBus.publish("MISSION_COMPLETED", "CONDUCTOR", `Mission completed & verified: [${mission.id}] ${mission.title}`, {
              missionId,
            });
          } else {
            UltronEventBus.publish("MISSION_FAILED", "REALITY", `Mission verification failed: [${mission.id}] ${mission.title}`, {
              missionId,
            });
          }
        }
      }

      mission.updatedAt = new Date().toISOString();
      this.notify();
    }
  }
}
