/**
 * ULTRON Usage & Cost Tracker (Section 35)
 * Accurately aggregates tokens, model usage, tool calls, and execution metrics.
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

export class UsageTracker {
  private static records: UsageRecord[] = [];

  // Approximate Gemini standard pricing per 1k tokens
  private static pricingTable: Record<string, { inputPer1k: number; outputPer1k: number }> = {
    "gemini-2.5-flash": { inputPer1k: 0.000075, outputPer1k: 0.0003 },
    "gemini-2.5-pro": { inputPer1k: 0.00125, outputPer1k: 0.005 },
    "gemini-1.5-flash": { inputPer1k: 0.000075, outputPer1k: 0.0003 },
    "gemini-1.5-pro": { inputPer1k: 0.00125, outputPer1k: 0.005 },
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
    if (this.records.length > 200) {
      this.records.pop();
    }

    return record;
  }

  public static getAggregateMetrics(): {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCostUsd: number;
    totalRequests: number;
    avgLatencyMs: number;
  } {
    const totalRequests = this.records.length;
    if (totalRequests === 0) {
      return { totalInputTokens: 0, totalOutputTokens: 0, totalCostUsd: 0, totalRequests: 0, avgLatencyMs: 0 };
    }

    const totalInputTokens = this.records.reduce((sum, r) => sum + r.inputTokens, 0);
    const totalOutputTokens = this.records.reduce((sum, r) => sum + r.outputTokens, 0);
    const totalCostUsd = this.records.reduce((sum, r) => sum + r.estimatedCostUsd, 0);
    const avgLatencyMs = Math.round(this.records.reduce((sum, r) => sum + r.durationMs, 0) / totalRequests);

    return {
      totalInputTokens,
      totalOutputTokens,
      totalCostUsd: Number(totalCostUsd.toFixed(4)),
      totalRequests,
      avgLatencyMs,
    };
  }

  public static getRecentRecords(limit = 10): UsageRecord[] {
    return this.records.slice(0, limit);
  }
}
