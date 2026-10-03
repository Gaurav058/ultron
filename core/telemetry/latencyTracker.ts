/**
 * ULTRON Latency Tracker & Profiler (Section 5)
 * Nanosecond/millisecond micro-profiling across all execution stages.
 */

export interface LatencyTimestamps {
  request_received?: number;
  context_started?: number;
  context_completed?: number;
  gemini_request_started?: number;
  first_token_received?: number;
  tool_call_started?: number;
  tool_call_completed?: number;
  final_response?: number;
  request_completed?: number;
}

export interface LatencyMetrics {
  ttfbMs: number;
  timeToFirstTokenMs: number;
  geminiLatencyMs: number;
  toolLatencyMs: number;
  memoryLatencyMs: number;
  totalLatencyMs: number;
  timestamps: LatencyTimestamps;
}

export class LatencyTracker {
  private timestamps: LatencyTimestamps = {};
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
    this.mark("request_received");
  }

  public mark(checkpoint: keyof LatencyTimestamps): void {
    this.timestamps[checkpoint] = Math.round(performance.now() - this.startTime);
  }

  public getMetrics(): LatencyMetrics {
    const t = this.timestamps;
    const now = Math.round(performance.now() - this.startTime);
    if (!t.request_completed) {
      t.request_completed = now;
    }

    const ttfbMs = t.first_token_received ?? t.final_response ?? (t.tool_call_started ?? now);
    const timeToFirstTokenMs = t.first_token_received ? t.first_token_received - (t.gemini_request_started ?? 0) : 0;
    const geminiLatencyMs = t.final_response && t.gemini_request_started
      ? t.final_response - t.gemini_request_started
      : (t.first_token_received ? t.first_token_received - (t.gemini_request_started ?? 0) : 0);
    const toolLatencyMs = t.tool_call_completed && t.tool_call_started
      ? t.tool_call_completed - t.tool_call_started
      : 0;
    const memoryLatencyMs = t.context_completed && t.context_started
      ? t.context_completed - t.context_started
      : 0;
    const totalLatencyMs = t.request_completed ?? now;

    return {
      ttfbMs: Math.max(0, ttfbMs),
      timeToFirstTokenMs: Math.max(0, timeToFirstTokenMs),
      geminiLatencyMs: Math.max(0, geminiLatencyMs),
      toolLatencyMs: Math.max(0, toolLatencyMs),
      memoryLatencyMs: Math.max(0, memoryLatencyMs),
      totalLatencyMs: Math.max(0, totalLatencyMs),
      timestamps: t,
    };
  }
}
