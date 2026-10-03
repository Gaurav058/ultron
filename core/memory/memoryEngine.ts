import { MemoryCategory, MemoryClaim, MemoryItem, MemoryNode, MemoryTier } from "../types/memory";
import { UltronEventBus } from "../events/eventBus";

export class MemoryEngine {
  private static items: MemoryItem[] = [
    {
      id: "mem-proj-001",
      type: "PROJECT MEMORY",
      title: "Target System Identity: ULTRON V2 Cognitive OS",
      content: "Persistent cross-platform cognitive operating system coordinating Desktop Next.js deck, Gemini Live voice agent, and specialist agent fleet.",
      source: "file:///ULTRON_ARCHITECTURE.md",
      created: "2026-10-01T00:00:00Z",
      updated: "2026-10-03T10:00:00Z",
      confidence: 1.0,
      scope: "PROJECT",
      tags: ["architecture", "identity"],
      validationStatus: "VALIDATED",
    },
    {
      id: "mem-pref-001",
      type: "PREFERENCES",
      title: "UI Design & Visual Hierarchy Contract",
      content: "Theme palette: --ultron-bg: #02030A, primary text: #EAF2FF, cyan accent: #63E8FF. Zero black text in dark mode. No full-page screenshot artwork.",
      source: "USER_DIRECTIVE",
      created: "2026-10-03T07:30:00Z",
      updated: "2026-10-03T16:00:00Z",
      confidence: 1.0,
      scope: "USER",
      tags: ["design", "tokens", "ergonomics"],
      validationStatus: "VALIDATED",
    },
    {
      id: "mem-know-001",
      type: "KNOWLEDGE",
      title: "Google Gemini Live API Integration Spec",
      content: "Official @google/genai SDK used server-side with GEMINI_API_KEY environment variable. Bidirectional live streaming with real tools.",
      source: "https://ai.google.dev/api/live",
      created: "2026-10-03T11:00:00Z",
      updated: "2026-10-03T16:30:00Z",
      confidence: 0.98,
      scope: "GLOBAL",
      tags: ["ai", "gemini", "voice"],
      validationStatus: "VALIDATED",
    },
    {
      id: "mem-user-001",
      type: "USER CONTEXT",
      title: "Active Developer Environment",
      content: "Operating System: Windows 11. Shell: PowerShell. Development server running Next.js 16 on port 3000.",
      source: "SYSTEM_ENVIRONMENT",
      created: "2026-10-03T08:00:00Z",
      updated: "2026-10-03T16:50:00Z",
      confidence: 1.0,
      scope: "SESSION",
      tags: ["environment", "local"],
      validationStatus: "VALIDATED",
    },
    {
      id: "mem-work-001",
      type: "WORKING MEMORY",
      title: "Phase 7-12 Voice & UI Synchronization",
      content: "Connecting VoiceCommandBar to /api/voice/chat and synchronizing real-time events to active missions.",
      source: "agent-conductor",
      created: "2026-10-03T16:40:00Z",
      updated: "2026-10-03T17:00:00Z",
      confidence: 0.95,
      scope: "PROJECT",
      tags: ["active-task", "conductor"],
      validationStatus: "ANALYZING",
    },
  ];

  public static getItems(category?: MemoryCategory): MemoryItem[] {
    if (!category) return [...this.items];
    return this.items.filter((item) => item.type === category);
  }

  public static query(searchQuery: string, category?: MemoryCategory): MemoryItem[] {
    const q = searchQuery.toLowerCase().trim();
    let pool = category ? this.items.filter((item) => item.type === category) : this.items;
    if (!q) return pool;

    return pool.filter(
      (item) =>
        item.content.toLowerCase().includes(q) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        item.source.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  public static addMemoryItem(params: {
    type: MemoryCategory;
    title?: string;
    content: string;
    source: string;
    confidence?: number;
    scope?: "GLOBAL" | "PROJECT" | "SESSION" | "USER";
    tags?: string[];
  }): MemoryItem {
    const now = new Date().toISOString();
    const item: MemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: params.type,
      title: params.title || params.content.slice(0, 40),
      content: params.content,
      source: params.source,
      created: now,
      updated: now,
      confidence: params.confidence ?? 0.9,
      scope: params.scope || "PROJECT",
      tags: params.tags || [],
      validationStatus: "VALIDATED",
    };

    this.items.unshift(item);

    UltronEventBus.publish("MEMORY_CREATED", "MEMORY", `Recorded memory item: ${item.title}`, {
      id: item.id,
      type: item.type,
      source: item.source,
    });

    return item;
  }

  public static forgetContext(scope: "SESSION" | "RECENT" = "SESSION"): number {
    const initialCount = this.items.length;
    this.items = this.items.filter((i) => i.scope !== "SESSION" && i.type !== "RECENT CONTEXT");
    const removed = initialCount - this.items.length;

    UltronEventBus.publish("MEMORY_UPDATED", "MEMORY", `Purged ${removed} ephemeral memory contexts.`, {
      purgedCount: removed,
    });

    return removed;
  }

  // Legacy compatibility methods for existing callers
  public static getNodes(tier?: MemoryTier): MemoryNode[] {
    return this.items.map((i) => ({
      ...i,
      tier: "L4_LONGTERM" as MemoryTier,
      relatedNodeIds: [],
    }));
  }

  public static addWorkingMemory(missionId: string, title: string, content: string, agent: string): MemoryNode {
    const item = this.addMemoryItem({
      type: "WORKING MEMORY",
      title,
      content,
      source: agent,
      scope: "PROJECT",
      tags: ["working", "active-mission"],
    });
    return {
      ...item,
      tier: "L1_WORKING",
      missionId,
      authorAgent: agent,
    };
  }

  public static promoteClaimToDurableFact(claim: MemoryClaim, authorAgent: string): MemoryNode | null {
    if (!claim.validated || claim.confidenceScore < 0.85) {
      return null;
    }

    const item = this.addMemoryItem({
      type: "KNOWLEDGE",
      title: claim.atomicClaim,
      content: `${claim.sourceText}\n\nEvidence: ${claim.evidence.join("; ")}`,
      source: authorAgent,
      confidence: claim.confidenceScore,
      scope: "PROJECT",
      tags: ["verified-fact", "promoted"],
    });

    return {
      ...item,
      tier: "L4_LONGTERM",
      authorAgent,
    };
  }

  /**
   * Promote verified intelligence signal to durable memory (Directive Section 14)
   * Only VERIFIED signals with high confidence (>0.85) are promoted into Memory.
   */
  public static promoteSignalToMemory(signal: {
    id: string;
    title: string;
    summary: string;
    claims: string[];
    entities: string[];
    sources: { source: string; url: string }[];
    confidence: number;
    verificationStatus: string;
  }): MemoryItem | null {
    if (signal.verificationStatus !== "VERIFIED" || signal.confidence < 0.85) {
      // Unverified information remains Signal
      return null;
    }

    const primarySources = signal.sources.map((s) => `${s.source} (${s.url})`).join(", ");
    const content = `${signal.summary}\n\nVerified Claims:\n${signal.claims
      .map((c) => `• ${c}`)
      .join("\n")}\n\nSources: ${primarySources}`;

    return this.addMemoryItem({
      type: "KNOWLEDGE",
      title: `Verified Intelligence: ${signal.title}`,
      content,
      source: "GLOBAL_INTELLIGENCE_VERIFIER",
      confidence: signal.confidence,
      scope: "GLOBAL",
      tags: ["verified-intelligence", ...signal.entities.slice(0, 5)],
    });
  }
}
