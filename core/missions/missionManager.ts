import { Mission, MissionTask, PolicyGate } from "../types/mission";
import { parseIntent, ParsedIntent } from "../cognition/intentParser";
import { generateMissionDAG } from "../planner/dagPlanner";
import { RealityChecker } from "../verification/realityChecker";
import { CORE_AGENT_ROSTER } from "../conductor/agentRoster";

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

  public static getActiveMission(): Mission | undefined {
    return this.missions.find((m) => m.status === "RUNNING" || m.status === "PLANNING" || m.status === "AWAITING_APPROVAL") || this.missions[0];
  }

  public static createMission(userInput: string): Mission {
    const intent: ParsedIntent = parseIntent(userInput);
    const missionId = `mission-${Date.now()}`;
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
    }

    const mission: Mission = {
      id: missionId,
      title: intent.title,
      objective: intent.objective,
      status: approvalQueue.length > 0 ? "AWAITING_APPROVAL" : "RUNNING",
      priority: intent.suggestedPriority,
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
    this.notify();
    return mission;
  }

  public static approveGate(missionId: string, gateId: string): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (!mission) return;

    const gate = mission.approvalQueue.find((g) => g.id === gateId);
    if (gate) {
      gate.status = "APPROVED";
      const hasPending = mission.approvalQueue.some((g) => g.status === "PENDING");
      if (!hasPending && mission.status === "AWAITING_APPROVAL") {
        mission.status = "RUNNING";
        // Unblock first pending task
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
      } else {
        // All tasks completed -> Run Reality Checker
        const allDone = mission.tasks.every((t) => t.status === "COMPLETED");
        if (allDone) {
          mission.status = "VERIFYING";
          mission.verificationReport = RealityChecker.auditMission(mission);
          mission.status = mission.verificationReport.overallStatus === "VERIFIED" ? "COMPLETED" : "FAILED";
          mission.completedAt = new Date().toISOString();
        }
      }

      mission.updatedAt = new Date().toISOString();
      this.notify();
    }
  }
}
