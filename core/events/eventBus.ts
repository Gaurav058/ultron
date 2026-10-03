/**
 * ULTRON Unified Event System (Section 25)
 * Central reactive event stream for all voice, mission, agent, tool, and memory transitions.
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
  | "TOOL_STARTED"
  | "TOOL_COMPLETED"
  | "TOOL_FAILED"
  | "MEMORY_CREATED"
  | "MEMORY_UPDATED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_GRANTED"
  | "APPROVAL_DENIED"
  | "SYSTEM_STATE_CHANGED"
  | "ERROR_OCCURRED";

export interface UltronEvent<T = any> {
  id: string;
  type: UltronEventType;
  source: "VOICE" | "CONDUCTOR" | "AGENT" | "TOOL" | "MEMORY" | "REALITY" | "SECURITY" | "SYSTEM" | "USER";
  timestamp: string;
  payload: T;
  summary: string;
}

export type EventListener<T = any> = (event: UltronEvent<T>) => void;

export class UltronEventBus {
  private static listeners: Map<UltronEventType | "*", Set<EventListener>> = new Map();
  private static history: UltronEvent[] = [];
  private static maxHistory = 100;

  /**
   * Subscribe to a specific event type or all events ("*")
   */
  public static subscribe<T = any>(
    type: UltronEventType | "*",
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
    source: UltronEvent["source"],
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

    // Notify specific subscribers
    const specific = this.listeners.get(type);
    if (specific) {
      specific.forEach((listener) => {
        try {
          listener(event);
        } catch (e) {
          console.error(`Error in UltronEventBus listener for ${type}:`, e);
        }
      });
    }

    // Notify wildcard subscribers
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
