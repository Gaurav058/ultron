/**
 * ULTRON INTELLIGENCE OPERATING SYSTEM — DATA MODELS
 * Directive Sections 4, 6, 7, 10, 11, 12, 13, 14, 15
 */

export type VerificationState =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "CONFLICTING"
  | "UNVERIFIED";

export interface SourceProvenance {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  author?: string;
  snippet?: string;
  authorityScore?: number; // 0 to 1
  isPrimary?: boolean;
}

export interface ClaimVerification {
  claim: string;
  status: VerificationState;
  supportingSources: string[];
  contradictingSources?: string[];
  confidenceScore: number; // 0 to 1
  reasoning: string;
}

export interface IntelligenceSignal {
  id: string;
  title: string;
  summary: string;
  sources: SourceProvenance[];
  claims: string[];
  claimVerifications?: ClaimVerification[];
  entities: string[];
  locations: {
    name: string;
    latitude?: number;
    longitude?: number;
    country?: string;
  }[];
  publishedAt: string;
  discoveredAt: string;
  importance: number; // 0 to 100
  confidence: number; // 0 to 1
  verificationStatus: VerificationState;
  relatedSignals: string[];
  category?: string;
  promotedToMemory?: boolean;
}

export interface ResearchResult {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
  snippet?: string;
  author?: string;
  channel?: string;
  videoId?: string;
  thumbnail?: string;
  relevance?: number;
  metadata?: Record<string, any>;
}

export type ProviderStatus =
  | "READY"
  | "AUTHENTICATED"
  | "NOT CONFIGURED"
  | "RATE_LIMITED"
  | "ERROR";

export interface SocialResearchProvider {
  name: string;
  search(query: string): Promise<ResearchResult[]>;
  getStatus(): Promise<ProviderStatus>;
}

export interface AdaptiveDomainConfig {
  id: string;
  name: string;
  frequencyMinutes: number;
  priority: "HIGH" | "MEDIUM" | "STANDARD";
  queries: string[];
  sources: string[];
  lastRun: string | null;
  nextRun: string;
  enabled: boolean;
}

export interface OracleInsight {
  id: string;
  timestamp: string;
  insight: string;
  confidence: number; // 0 to 1
  sources: SourceProvenance[];
  relatedSignals: string[];
  keyTakeaway: string;
  domain: string;
  actionableMissions?: string[];
}

export interface BackgroundScanStatus {
  isRunning: boolean;
  lastScanTimestamp: string | null;
  nextScanTimestamp: string;
  totalSignals: number;
  verifiedSignals: number;
  conflictingSignals: number;
  activeDomain?: string;
  currentStep?: string;
  recentScanDurationMs?: number;
}
