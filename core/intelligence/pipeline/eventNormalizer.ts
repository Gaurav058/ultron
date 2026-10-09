/**
 * ULTRON Sovereign Event Normalizer
 * Validates coordinates, timestamps, URLs, categories, and sanitizes untrusted input.
 */

import { IntelligenceEvent, IntelligenceCategory } from "./types";
import { SSRFGuard } from "../../security/ssrfGuard";

export class EventNormalizer {
  public static isValidCoordinate(lat: any, lon: any): boolean {
    if (typeof lat !== "number" || typeof lon !== "number") return false;
    if (isNaN(lat) || isNaN(lon)) return false;
    if (lat < -90 || lat > 90) return false;
    if (lon < -180 || lon > 180) return false;
    return true;
  }

  public static sanitizeString(input: string, maxLength = 800): string {
    if (!input || typeof input !== "string") return "";
    return input
      .replace(/<[^>]*>/g, "") // Strip HTML tags
      .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "") // Strip control characters
      .trim()
      .slice(0, maxLength);
  }

  public static normalizeTimestamp(input?: string): string {
    if (!input) return new Date().toISOString();
    const parsed = new Date(input);
    return !isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
  }

  public static sanitizeUrl(url?: string): string {
    if (!url) return "";
    const check = SSRFGuard.validateUrl(url);
    return check.allowed && check.sanitizedUrl ? check.sanitizedUrl : "";
  }

  public static validateAndNormalize(raw: Partial<IntelligenceEvent>): IntelligenceEvent | null {
    if (!raw.title || typeof raw.title !== "string") return null;
    if (!this.isValidCoordinate(raw.latitude, raw.longitude)) return null;

    const category = (raw.category?.toUpperCase() || "GEOPOLITICS") as IntelligenceCategory;
    const retrievedAt = new Date().toISOString();
    const eventTime = this.normalizeTimestamp(raw.eventTime || raw.publishedAt);
    const publishedAt = this.normalizeTimestamp(raw.publishedAt || raw.eventTime);

    return {
      id: raw.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: this.sanitizeString(raw.title, 160),
      category,
      summary: this.sanitizeString(raw.summary || "", 600),
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
      altitude: typeof raw.altitude === "number" ? Number(raw.altitude) : undefined,
      eventTime,
      publishedAt,
      retrievedAt,
      sourceName: this.sanitizeString(raw.sourceName || "Open Telemetry", 80),
      sourceUrl: this.sanitizeUrl(raw.sourceUrl),
      sourceType: raw.sourceType || "PUBLIC_FEED",
      verificationStatus: raw.verificationStatus || "VERIFIED",
      confidenceScore: typeof raw.confidenceScore === "number" ? Math.min(1.0, Math.max(0.1, raw.confidenceScore)) : undefined,
      freshness: raw.freshness || "RECENT",
      severity: raw.severity || "MEDIUM",
      geographicalScope: this.sanitizeString(raw.geographicalScope || "Global", 100),
      relatedReports: Array.isArray(raw.relatedReports) ? raw.relatedReports.slice(0, 5) : [],
      rawRecordReference: raw.rawRecordReference,
    };
  }
}
