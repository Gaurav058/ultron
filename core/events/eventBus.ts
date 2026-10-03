/**
 * ULTRON Unified Event System (Section 16, 25)
 * Central reactive event stream for all voice, mission, agent, tool, intelligence, location, and memory transitions.
 */

export type UltronEventType =
  | "VOICE_INPUT"
  | "VOICE_OUTPUT"
  | "VOICE_STATE_CHANGED"
  | "MISSION_CREATED"
  | "MISSION_STARTED"
  | "MISSION_PAUSED"
  | "MISSION_RESUMED"
  | "MISSION_COMPLETED"
  | "MISSION_FAILED"
  | "MISSION_CANCELLED"
  | "AGENT_STARTED"
  | "AGENT_COMPLETED"
  | "AGENT_BLOCKED"
  | "AGENT_TASK_STARTED"
  | "AGENT_TASK_COMPLETED"
  | "TOOL_STARTED"
  | "TOOL_COMPLETED"
  | "TOOL_FAILED"
  | "MEMORY_CREATED"
  | "MEMORY_UPDATED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_GRANTED"
  | "APPROVAL_DENIED"
  | "SYSTEM_STATE_CHANGED"
  | "ERROR_OCCURRED"
  | "NEWS_UPDATED"
  | "NEWS_PIPELINE_STARTED"
  | "INTELLIGENCE_SCAN_STARTED"
  | "INTELLIGENCE_SCAN_COMPLETED"
  | "INTELLIGENCE_SCAN_FAILED"
  | "INTELLIGENCE_SIGNAL_CREATED"
  | "LOCATION_PIPELINE_STARTED"
  | "LOCATION_PIPELINE_COMPLETED"
  | "ORACLE_UPDATED"
  | "SCHEDULER_INITIALIZED"
  | (string & {});

export type EventSource =
  | "VOICE"
  | "CONDUCTOR"
  | "AGENT"
  | "TOOL"
  | "MEMORY"
  | "REALITY"
  | "SECURITY"
  | "SYSTEM"
  | "USER"
  | "SCHEDULER"
  | "MAPS"
  | "ORACLE"
  | "RESEARCHER"
  | "PLANNER"
  | "ANALYST"
  | "VERIFIER"
  | (string & {});

export interface UltronEvent<T = any> {
  id: string;
  type: UltronEventType;
  source: EventSource;
  timestamp: string;
  payload: T;
  summary: string;
}

export type EventListener<T = any> = (event: UltronEvent<T>) => void;

export class UltronEventBus {
  private static listeners: Map<string, Set<EventListener>> = new Map();
  private static history: UltronEvent[] = [];
  private static maxHistory = 100;

  /**
   * Subscribe to a specific event type, wildcard prefix (e.g. "MISSION_*"), or all events ("*")
   */
  public static subscribe<T = any>(
    type: string,
    listener: EventListener<T>
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as EventListener);

    return () => {
      this.listeners.get(type)?.delete(listener as EventListener);
    };
  }

  /**
   * Publish an event to all registered listeners
   */
  public static publish<T = any>(
    type: UltronEventType,
    source: EventSource,
    summary: string,
    payload: T = {} as T
  ): UltronEvent<T> {
    const event: UltronEvent<T> = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      source,
      timestamp: new Date().toISOString(),
      payload,
      summary,
    };

    // Keep ring buffer of event history
    this.history.unshift(event);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    // Direct subscribers
    const direct = this.listeners.get(type);
    if (direct) {
      direct.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error(`Error in UltronEventBus listener for ${type}:`, e);
        }
      });
    }

    // Prefix subscribers (e.g. "MISSION_*", "AGENT_*")
    for (const [key, listeners] of this.listeners.entries()) {
      if (key.endsWith("*") && key !== "*") {
        const prefix = key.slice(0, -1);
        if (type.startsWith(prefix)) {
          listeners.forEach((l) => {
            try {
              l(event);
            } catch (e) {
              console.error(`Error in UltronEventBus prefix listener for ${key}:`, e);
            }
          });
        }
      }
    }

    // Wildcard subscribers
    const wildcard = this.listeners.get("*");
    if (wildcard) {
      wildcard.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error("Error in UltronEventBus wildcard listener:", e);
        }
      });
    }

    return event;
  }

  /**
   * Get recent event history
   */
  public static getHistory(limit = 20): UltronEvent[] {
    return this.history.slice(0, limit);
  }

  /**
   * Clear event history (testing only)
   */
  public static clearHistory(): void {
    this.history = [];
  }
}
