/**
 * ULTRON BACKGROUND HOURLY INTELLIGENCE SCHEDULER
 * Directive Section 5, 22
 * Executes GLOBAL_INTELLIGENCE_SCAN mission every hour.
 * Completely autonomous server-side execution independent of frontend browser session.
 */

import { GlobalIntelligenceService } from "../intelligence/globalIntelligenceService";
import { NewsResearchService } from "../intelligence/newsResearchService";
import { MissionManager } from "../missions/missionManager";
import { UltronEventBus } from "../events/eventBus";

export class BackgroundIntelligenceScheduler {
  private static timer: NodeJS.Timeout | null = null;
  private static intervalMs = 60 * 60 * 1000; // 1 hour (3600000 ms)
  private static isRunning = false;
  private static lastRun: Date | null = null;
  private static nextRun: Date = new Date(Date.now() + 60 * 60 * 1000);

  public static initialize(): void {
    if (this.timer) return;

    console.log("[ULTRON SCHEDULER] Initializing autonomous background intelligence hourly scanner...");

    // Set recurring timer
    this.timer = setInterval(() => {
      this.runHourlyIntelligenceScan("CRON_HOURLY");
    }, this.intervalMs);

    // Ensure timer doesn't prevent Node process from clean exit if needed
    if (this.timer.unref) {
      this.timer.unref();
    }

    this.nextRun = new Date(Date.now() + this.intervalMs);

    UltronEventBus.publish(
      "SCHEDULER_INITIALIZED",
      "SCHEDULER",
      `Autonomous hourly research scan scheduled. Next run at ${this.nextRun.toLocaleTimeString()}`
    );
  }

  public static getStatus(): {
    active: boolean;
    intervalMinutes: number;
    lastRun: string | null;
    nextRun: string;
    isExecutingNow: boolean;
  } {
    return {
      active: Boolean(this.timer),
      intervalMinutes: Math.round(this.intervalMs / (60 * 1000)),
      lastRun: this.lastRun ? this.lastRun.toISOString() : null,
      nextRun: this.nextRun.toISOString(),
      isExecutingNow: this.isRunning,
    };
  }

  /**
   * Run the GLOBAL_INTELLIGENCE_SCAN mission
   * Workflow: Scheduler -> Conductor -> Researcher -> Google Search -> YouTube -> Social Sources -> Normalization -> Analyst -> Verifier -> Memory -> Oracle update -> News update
   */
  public static async runHourlyIntelligenceScan(
    trigger: "CRON_HOURLY" | "MANUAL" = "CRON_HOURLY"
  ): Promise<{
    success: boolean;
    missionId?: string;
    summary: string;
  }> {
    if (this.isRunning) {
      return {
        success: false,
        summary: "Intelligence scan already in progress.",
      };
    }

    this.isRunning = true;
    this.lastRun = new Date();
    this.nextRun = new Date(Date.now() + this.intervalMs);

    console.log(`[ULTRON SCHEDULER] Launching mission: GLOBAL_INTELLIGENCE_SCAN (Trigger: ${trigger})`);

    // 1. Create durable mission in MissionManager
    const mission = MissionManager.createMission(
      "GLOBAL_INTELLIGENCE_SCAN: Scheduled multi-domain verification & entity discovery"
    );

    UltronEventBus.publish(
      "MISSION_STARTED",
      "SCHEDULER",
      `Mission [GLOBAL_INTELLIGENCE_SCAN] launched by autonomous scheduler.`,
      { missionId: mission.id }
    );

    try {
      // 2. Conductor delegates to Researcher & GlobalIntelligenceService
      UltronEventBus.publish("AGENT_TASK_STARTED", "Conductor", "Decomposing scan into adaptive domain queries.");

      const result = await GlobalIntelligenceService.executeResearchScan();

      // 3. News Research Pipeline
      await NewsResearchService.executeNewsPipeline();

      // 4. Mark Mission Complete
      MissionManager.updateMissionStatus(mission.id, "COMPLETED");

      UltronEventBus.publish(
        "MISSION_COMPLETED",
        "SCHEDULER",
        `Mission [GLOBAL_INTELLIGENCE_SCAN] completed. Signals created: ${result.signalsCreated.length}.`,
        { missionId: mission.id }
      );

      this.isRunning = false;

      return {
        success: true,
        missionId: mission.id,
        summary: `Successfully gathered ${result.signalsCreated.length} intelligence signals.`,
      };
    } catch (err: any) {
      console.error("[ULTRON SCHEDULER] Scan error:", err);
      MissionManager.updateMissionStatus(mission.id, "FAILED");
      this.isRunning = false;

      UltronEventBus.publish(
        "MISSION_FAILED",
        "SCHEDULER",
        `Mission [GLOBAL_INTELLIGENCE_SCAN] failed: ${err?.message || err}`,
        { missionId: mission.id }
      );

      return {
        success: false,
        missionId: mission.id,
        summary: `Scan failed: ${err?.message || err}`,
      };
    }
  }

  public static stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }
}

// Auto-initialize on module load so scheduler runs in the server process
BackgroundIntelligenceScheduler.initialize();
