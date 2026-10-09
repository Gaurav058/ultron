/**
 * ULTRON Sovereign Intelligence Pipeline: Data Types & Schema Definitions
 * Implements the normalized schema specified in Phase 5 of the Production Directive.
 */

export type IntelligenceCategory =
  | "GEOPOLITICS"
  | "CONFLICT"
  | "DISASTER"
  | "WEATHER"
  | "AVIATION"
  | "MARITIME"
  | "ECONOMIC"
  | "CYBER"
  | "TECH"
  | "MISSIONS";

export type EventVerificationStatus = "VERIFIED" | "CONFIRMED" | "UNVERIFIED";

export type EventFreshnessStatus = "LIVE" | "RECENT" | "PERIODIC" | "CACHED" | "STALE";

export type EventSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface IntelligenceEvent {
  id: string;
  title: string;
  category: IntelligenceCategory;
  summary: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  eventTime: string;
  publishedAt: string;
  retrievedAt: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: "PUBLIC_FEED" | "GOVERNMENT_API" | "OPEN_RADAR" | "MISSION_TARGET";
  verificationStatus: EventVerificationStatus;
  confidenceScore?: number;
  freshness: EventFreshnessStatus;
  severity?: EventSeverity;
  geographicalScope?: string;
  relatedReports?: Array<{ title: string; url: string }>;
  rawRecordReference?: Record<string, any>;
}

export interface IntelligenceLayerConfig {
  id: string;
  name: string;
  description: string;
  category: IntelligenceCategory;
  sourceName: string;
  sourceUrl: string;
  isEnabled: boolean;
  refreshPolicy: string;
  freshness: EventFreshnessStatus;
  requiresCredentials: boolean;
  status: "OPERATIONAL" | "DEGRADED" | "UNCONFIGURED";
  eventCount: number;
  attribution: string;
  license: string;
}

export interface EventsQueryFilter {
  layers?: string[]; // layer IDs or categories
  timeRange?: "latest" | "24h" | "7d" | "all";
  searchQuery?: string;
  minSeverity?: EventSeverity;
  bbox?: { minLat: number; maxLat: number; minLon: number; maxLon: number };
}
