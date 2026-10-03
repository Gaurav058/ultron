import { MemoryClaim, MemoryNode, MemoryTier } from "../types/memory";

export class MemoryEngine {
  private static nodes: MemoryNode[] = [
    {
      id: "mem-l4-001",
      tier: "L4_LONGTERM",
      title: "Core System Invariant: Zero-Trust Least Privilege",
      content: "All MCP tools default to read-only scope. High/Critical operations require explicit human approval.",
      tags: ["security", "policy", "invariant"],
      confidence: 1.0,
      validationStatus: "VALIDATED",
      relatedNodeIds: ["mem-l3-002"],
      createdAt: "2026-10-01T00:00:00Z",
      lastVerifiedAt: "2026-10-03T10:00:00Z",
    },
    {
      id: "mem-l4-002",
      tier: "L4_LONGTERM",
      title: "Target System Identity: ULTRON V2 Cognitive OS",
      content: "Cross-platform cognitive operating system coordinating Desktop Next.js deck and tactical mobile nodes.",
      tags: ["architecture", "identity"],
      confidence: 1.0,
      validationStatus: "VALIDATED",
      relatedNodeIds: [],
      createdAt: "2026-10-01T00:00:00Z",
      lastVerifiedAt: "2026-10-03T10:00:00Z",
    },
    {
      id: "mem-l3-001",
      tier: "L3_SEMANTIC",
      title: "Next.js 16 + React 19 Client Component Integration",
      content: "Three.js and MediaPipe require client boundaries ('use client'). Turbopack root must be mapped.",
      tags: ["frontend", "nextjs", "react19"],
      confidence: 0.95,
      sourceUri: "file:///next.config.ts",
      validationStatus: "VALIDATED",
      relatedNodeIds: ["mem-l4-002"],
      createdAt: "2026-10-02T12:00:00Z",
    },
    {
      id: "mem-l2-001",
      tier: "L2_EPISODIC",
      title: "Repository Audit Completed",
      content: "Audited Gaurav058/ultron: Three.js orb and hand tracker preserved; created .agents-cli-spec.md contract.",
      tags: ["audit", "milestone"],
      confidence: 1.0,
      validationStatus: "VALIDATED",
      relatedNodeIds: [],
      createdAt: "2026-10-03T07:45:00Z",
    },
  ];

  public static getNodes(tier?: MemoryTier): MemoryNode[] {
    if (!tier) return [...this.nodes];
    return this.nodes.filter((n) => n.tier === tier);
  }

  public static addWorkingMemory(missionId: string, title: string, content: string, agent: string): MemoryNode {
    const node: MemoryNode = {
      id: `mem-l1-${Date.now()}`,
      tier: "L1_WORKING",
      title,
      content,
      tags: ["working", "active-mission"],
      confidence: 0.8,
      missionId,
      authorAgent: agent,
      validationStatus: "ANALYZING",
      relatedNodeIds: [],
      createdAt: new Date().toISOString(),
    };
    this.nodes.push(node);
    return node;
  }

  /**
   * Memory Governance Promotion:
   * Source -> Signal -> Claim -> Validation -> Verified L4 Fact
   */
  public static promoteClaimToDurableFact(claim: MemoryClaim, authorAgent: string): MemoryNode | null {
    if (!claim.validated || claim.confidenceScore < 0.85) {
      return null;
    }

    const newNode: MemoryNode = {
      id: `mem-l4-${Date.now()}`,
      tier: "L4_LONGTERM",
      title: claim.atomicClaim,
      content: `${claim.sourceText}\n\nEvidence: ${claim.evidence.join("; ")}`,
      tags: ["verified-fact", "promoted"],
      confidence: claim.confidenceScore,
      authorAgent,
      validationStatus: "VALIDATED",
      relatedNodeIds: [],
      createdAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
    };

    this.nodes.push(newNode);
    return newNode;
  }
}
