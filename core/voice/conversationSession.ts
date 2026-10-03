/**
 * ULTRON Conversational Session Manager (Section 18)
 * Manages conversational context, coreference resolution, and smart context assembly.
 */

export interface ConversationMessage {
  id: string;
  role: "user" | "model" | "system" | "tool";
  content: string;
  timestamp: string;
  toolCalls?: {
    name?: string;
    toolName?: string;
    args: Record<string, any>;
    result?: any;
    status?: string;
    durationMs?: number;
  }[];
}

export interface ActiveEntity {
  name: string;
  type: "platform" | "mission" | "file" | "agent" | "concept" | "repository";
  attributes: Record<string, any>;
  lastReferencedTurn: number;
}

export interface ConversationSessionData {
  sessionId: string;
  userId: string;
  deviceId: string;
  messages: ConversationMessage[];
  activeMissionId?: string;
  activeEntities: ActiveEntity[];
  recentContext: string[];
  toolCalls: any[];
  memoryReferences: string[];
  createdAt: string;
  updatedAt: string;
}

export class ConversationSession {
  private static activeSessions: Map<string, ConversationSessionData> = new Map();
  private static defaultSessionId = "ultron-voice-session-default";

  public static getOrCreateSession(
    sessionId = this.defaultSessionId,
    userId = "operator",
    deviceId = "desktop-node-01"
  ): ConversationSessionData {
    let session = this.activeSessions.get(sessionId);
    if (!session) {
      const now = new Date().toISOString();
      session = {
        sessionId,
        userId,
        deviceId,
        messages: [
          {
            id: `msg-sys-${Date.now()}`,
            role: "system",
            content:
              "You are ULTRON, the Intelligence Operating System. You are calm, precise, technical, concise, context-aware, confident without pretending certainty. Avoid casual filler like 'Sure!', 'Absolutely!', 'How can I help you today?'. Reply with direct precision like 'Understood.', 'I'll check that.', 'Mission created.', 'I need approval before executing that action.', 'Execution completed.' Never invent or fabricate data.",
            timestamp: now,
          },
        ],
        activeEntities: [],
        recentContext: ["ULTRON OS initialized", "Local desktop environment connected"],
        toolCalls: [],
        memoryReferences: [],
        createdAt: now,
        updatedAt: now,
      };
      this.activeSessions.set(sessionId, session);
    }
    return session;
  }

  public static addMessage(
    sessionId: string,
    role: ConversationMessage["role"],
    content: string,
    toolCalls?: ConversationMessage["toolCalls"]
  ): ConversationMessage {
    const session = this.getOrCreateSession(sessionId);
    const msg: ConversationMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role,
      content,
      timestamp: new Date().toISOString(),
      toolCalls,
    };

    session.messages.push(msg);
    session.updatedAt = msg.timestamp;

    // Entity extraction heuristics for conversational coreference resolution
    this.extractEntities(session, content, role);

    return msg;
  }

  private static extractEntities(session: ConversationSessionData, text: string, role: string) {
    const turnIndex = session.messages.length;

    // Detect platform or topic entities
    const platformMatch = text.match(/(?:research|compare|analyze|platforms? like)\s+([A-Za-z0-9\s,\-]+?)(?:\.|$|and|\?)/i);
    if (platformMatch && platformMatch[1]) {
      const entityName = platformMatch[1].trim();
      const existing = session.activeEntities.find((e) => e.name.toLowerCase() === entityName.toLowerCase());
      if (existing) {
        existing.lastReferencedTurn = turnIndex;
      } else if (entityName.length > 2 && entityName.length < 50) {
        session.activeEntities.push({
          name: entityName,
          type: "platform",
          attributes: { extractedAt: new Date().toISOString() },
          lastReferencedTurn: turnIndex,
        });
      }
    }

    // Keep activeEntities capped at 10 most recent
    if (session.activeEntities.length > 10) {
      session.activeEntities = session.activeEntities.slice(-10);
    }
  }

  public static updateActiveMission(sessionId: string, missionId: string) {
    const session = this.getOrCreateSession(sessionId);
    session.activeMissionId = missionId;
  }

  /**
   * Smart Context Assembler (Section 18)
   * Selects relevant conversation history, active mission state, and tracked entities
   * instead of blindly sending the entire raw log.
   */
  public static assembleContext(sessionId: string): {
    recentMessages: ConversationMessage[];
    activeMissionId?: string;
    activeEntities: ActiveEntity[];
    systemPrompt: string;
  } {
    const session = this.getOrCreateSession(sessionId);

    // Keep system message + up to last 12 conversational turns
    const nonSystem = session.messages.filter((m) => m.role !== "system");
    const recent = nonSystem.slice(-12);

    const systemMsg = session.messages.find((m) => m.role === "system")?.content || "";

    return {
      recentMessages: recent,
      activeMissionId: session.activeMissionId,
      activeEntities: session.activeEntities,
      systemPrompt: systemMsg,
    };
  }

  public static clearSession(sessionId = this.defaultSessionId) {
    this.activeSessions.delete(sessionId);
  }
}
