export type MemoryTier =
  | "L0_CONTEXT"
  | "L1_WORKING"
  | "L2_EPISODIC"
  | "L3_SEMANTIC"
  | "L4_LONGTERM";

export type ClaimValidationStatus =
  | "UNVERIFIED"
  | "ANALYZING"
  | "VALIDATED"
  | "REJECTED"
  | "DISPUTED";

export interface MemoryNode {
  id: string;
  tier: MemoryTier;
  title: string;
  content: string;
  tags: string[];
  confidence: number; // 0.00 to 1.00
  sourceUri?: string;
  missionId?: string;
  authorAgent?: string;
  validationStatus: ClaimValidationStatus;
  embeddingVector?: number[];
  relatedNodeIds: string[];
  createdAt: string;
  lastVerifiedAt?: string;
  expiresAt?: string;
}

export interface MemoryClaim {
  id: string;
  sourceText: string;
  atomicClaim: string;
  confidenceScore: number;
  evidence: string[];
  proposedTier: MemoryTier;
  validated: boolean;
}
