/**
 * ULTRON USAGE & COST CONTROL TELEMETRY
 * Directive Section 20
 * Tracks Gemini API requests, search grounding, Maps calls, YouTube calls, tokens,
 * background missions, and research duration with daily and monthly aggregations.
 * Never exposes secrets.
 */

export interface UsageRecord {
  id: string;
  timestamp: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  toolCallsCount: number;
  durationMs: number;
  workload: string;
}

export interface CostAnalyticsReport {
  daily: {
    geminiRequests: number;
    searchGroundingRequests: number;
    mapsCalls: number;
    youtubeCalls: number;
    inputTokens: number;
    outputTokens: number;
    backgroundMissions: number;
    totalResearchDurationMs: number;
    estimatedCostUsd: number;
  };
  monthly: {
    geminiRequests: number;
    searchGroundingRequests: number;
    mapsCalls: number;
    youtubeCalls: number;
    inputTokens: number;
    outputTokens: number;
    backgroundMissions: number;
    totalResearchDurationMs: number;
    estimatedCostUsd: number;
  };
  allTime: {
    totalRequests: number;
    totalTokens: number;
    totalCostUsd: number;
    avgLatencyMs: number;
  };
  recentRecords: UsageRecord[];
}

export class UsageTracker {
  private static records: UsageRecord[] = [];

  // Standard pricing table ($ per 1k tokens)
  private static pricingTable: Record<string, { inputPer1k: number; outputPer1k: number }> = {
    "gemini-2.5-flash": { inputPer1k: 0.000075, outputPer1k: 0.0003 },
    "gemini-2.5-pro": { inputPer1k: 0.00125, outputPer1k: 0.005 },
    "gemini-1.5-flash": { inputPer1k: 0.000075, outputPer1k: 0.0003 },
    "gemini-1.5-pro": { inputPer1k: 0.00125, outputPer1k: 0.005 },
    "Google Maps Geocoding API": { inputPer1k: 0.005, outputPer1k: 0 },
    "YouTube Data API": { inputPer1k: 0.001, outputPer1k: 0 },
  };

  public static recordUsage(params: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    toolCallsCount?: number;
    durationMs: number;
    workload?: string;
  }): UsageRecord {
    const pricing = this.pricingTable[params.model] || { inputPer1k: 0.0001, outputPer1k: 0.0004 };
    const cost =
      (params.inputTokens / 1000) * pricing.inputPer1k +
      (params.outputTokens / 1000) * pricing.outputPer1k;

    const record: UsageRecord = {
      id: `use-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      model: params.model,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      estimatedCostUsd: Number(cost.toFixed(6)),
      toolCallsCount: params.toolCallsCount || 0,
      durationMs: params.durationMs,
      workload: params.workload || "GENERAL",
    };

    this.records.unshift(record);
    if (this.records.length > 500) {
      this.records.pop();
    }

    return record;
  }

  public static getCostAnalytics(): CostAnalyticsReport {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const dailyRecords = this.records.filter((r) => new Date(r.timestamp).getTime() >= oneDayAgo);
    const monthlyRecords = this.records.filter((r) => new Date(r.timestamp).getTime() >= thirtyDaysAgo);

    const aggregateSlice = (slice: UsageRecord[]) => {
      let geminiRequests = 0;
      let searchGroundingRequests = 0;
      let mapsCalls = 0;
      let youtubeCalls = 0;
      let backgroundMissions = 0;
      let inputTokens = 0;
      let outputTokens = 0;
      let totalResearchDurationMs = 0;
      let estimatedCostUsd = 0;

      for (const r of slice) {
        inputTokens += r.inputTokens;
        outputTokens += r.outputTokens;
        totalResearchDurationMs += r.durationMs;
        estimatedCostUsd += r.estimatedCostUsd;

        if (r.workload === "SEARCH_GROUNDING") searchGroundingRequests++;
        else if (r.workload === "MAPS_GEOCODING") mapsCalls++;
        else if (r.workload.includes("YOUTUBE")) youtubeCalls++;
        else if (r.workload.includes("BACKGROUND") || r.workload.includes("SCAN")) backgroundMissions++;
        else geminiRequests++;
      }

      return {
        geminiRequests,
        searchGroundingRequests,
        mapsCalls,
        youtubeCalls,
        inputTokens,
        outputTokens,
        backgroundMissions,
        totalResearchDurationMs,
        estimatedCostUsd: Number(estimatedCostUsd.toFixed(4)),
      };
    };

    const totalRequests = this.records.length;
    const totalTokens = this.records.reduce((sum, r) => sum + r.inputTokens + r.outputTokens, 0);
    const totalCostUsd = Number(this.records.reduce((sum, r) => sum + r.estimatedCostUsd, 0).toFixed(4));
    const avgLatencyMs =
      totalRequests > 0
        ? Math.round(this.records.reduce((sum, r) => sum + r.durationMs, 0) / totalRequests)
        : 0;

    return {
      daily: aggregateSlice(dailyRecords),
      monthly: aggregateSlice(monthlyRecords),
      allTime: {
        totalRequests,
        totalTokens,
        totalCostUsd,
        avgLatencyMs,
      },
      recentRecords: this.records.slice(0, 15),
    };
  }

  public static getAggregateMetrics() {
    const report = this.getCostAnalytics();
    return {
      totalInputTokens: report.monthly.inputTokens,
      totalOutputTokens: report.monthly.outputTokens,
      totalCostUsd: report.allTime.totalCostUsd,
      totalRequests: report.allTime.totalRequests,
      avgLatencyMs: report.allTime.avgLatencyMs,
    };
  }

  public static getRecentRecords(limit = 10): UsageRecord[] {
    return this.records.slice(0, limit);
  }
}
