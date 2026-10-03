export type MemoryCategory =
  | "USER CONTEXT"
  | "WORKING MEMORY"
  | "PROJECT MEMORY"
  | "PREFERENCES"
  | "KNOWLEDGE"
  | "RECENT CONTEXT";

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

export interface MemoryItem {
  id: string;
  type: MemoryCategory;
  title: string;
  content: string;
  source: string;
  created: string;
  updated: string;
  confidence: number; // 0.00 to 1.00
  scope: "GLOBAL" | "PROJECT" | "SESSION" | "USER";
  tags: string[];
  validationStatus?: ClaimValidationStatus;
  missionId?: string;
  authorAgent?: string;
}

export type MemoryNode = MemoryItem & {
  tier: MemoryTier;
  relatedNodeIds?: string[];
  createdAt?: string;
  lastVerifiedAt?: string;
};

export interface MemoryClaim {
  id: string;
  sourceText: string;
  atomicClaim: string;
  confidenceScore: number;
  evidence: string[];
  proposedTier: MemoryTier;
  validated: boolean;
}
