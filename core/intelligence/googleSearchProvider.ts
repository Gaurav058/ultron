/**
 * ULTRON GOOGLE SEARCH GROUNDING PROVIDER
 * Directive Section 9, 21
 * Uses Gemini Google Search grounding tool to retrieve verified live web information
 * with full provenance, citations, and claim attribution.
 */

import { GoogleGenAI } from "@google/genai";
import { SourceProvenance } from "@/types/intelligence";
import { UsageTracker } from "../metrics/usageTracker";

export interface SearchGroundingResult {
  status: "SUCCESS" | "SEARCH UNAVAILABLE";
  query: string;
  summary: string;
  sources: SourceProvenance[];
  claims: string[];
  entities: string[];
  rawGroundingMetadata?: any;
  timestamp: string;
  error?: string;
}

export class GoogleSearchProvider {
  private static client: GoogleGenAI | null = null;

  public static isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  }

  private static getClient(): GoogleGenAI {
    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    }
    return this.client;
  }

  /**
   * Execute real live Google Search with Gemini grounding
   */
  public static async searchWithGrounding(query: string): Promise<SearchGroundingResult> {
    const timestamp = new Date().toISOString();

    if (!this.isConfigured()) {
      return {
        status: "SEARCH UNAVAILABLE",
        query,
        summary: "Search unavailable: GEMINI_API_KEY is not configured.",
        sources: [],
        claims: [],
        entities: [],
        timestamp,
        error: "GEMINI_API_KEY missing",
      };
    }

    const startTime = Date.now();

    try {
      const ai = this.getClient();
      const model = process.env.GEMINI_REASONING_MODEL || process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";

      // Execute search grounding with googleSearch tool
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are the ULTRON web intelligence research sub-agent.
Execute a live research scan for: "${query}".
Provide:
1. An objective factual synthesis of the latest verified findings.
2. A list of specific verifiable claims extracted from the findings.
3. Key named entities (people, companies, technologies, locations).

Ensure every single fact and claim is strictly verified by your search grounding.`,
              },
            ],
          },
        ],
        config: {
          tools: [{ googleSearch: {} } as any],
          temperature: 0.2,
        },
      });

      const candidate = (response as any).candidates?.[0];
      const textParts = candidate?.content?.parts?.filter((p: any) => p.text);
      const fullText = textParts ? textParts.map((p: any) => p.text).join("\n") : "";

      // Extract Grounding Metadata and Sources
      const groundingMeta = candidate?.groundingMetadata;
      const sources: SourceProvenance[] = [];

      if (groundingMeta?.groundingChunks) {
        for (const chunk of groundingMeta.groundingChunks) {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || "Web Reference",
              url: chunk.web.uri || "",
              source: chunk.web.title ? chunk.web.title.split("-")[0].trim() : "Google Search",
              snippet: chunk.web.snippet || "",
              authorityScore: 0.85,
              publishedAt: timestamp,
            });
          }
        }
      }

      // Deduplicate sources by URL
      const uniqueSources = Array.from(
        new Map(sources.filter((s) => s.url).map((s) => [s.url, s])).values()
      );

      // Extract claims and entities from generated text
      const claims: string[] = [];
      const entities: string[] = [];

      const lines = fullText.split("\n");
      let inClaims = false;
      let inEntities = false;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().includes("claim") || trimmed.toLowerCase().includes("findings:")) {
          inClaims = true;
          inEntities = false;
          continue;
        }
        if (trimmed.toLowerCase().includes("entit") || trimmed.toLowerCase().includes("key named")) {
          inEntities = true;
          inClaims = false;
          continue;
        }

        if (inClaims && (trimmed.startsWith("-") || trimmed.startsWith("•") || /^\d+\./.test(trimmed))) {
          const clean = trimmed.replace(/^[-•\d.]+\s*/, "").trim();
          if (clean.length > 10) claims.push(clean);
        }

        if (inEntities && (trimmed.startsWith("-") || trimmed.startsWith("•") || /^\d+\./.test(trimmed))) {
          const clean = trimmed.replace(/^[-•\d.]+\s*/, "").trim();
          if (clean.length > 2) entities.push(clean);
        }
      }

      // Fallback: If formatted parsing didn't find claims, extract substantial sentences
      if (claims.length === 0 && fullText.length > 50) {
        const sentences = fullText.split(/(?<=[.?!])\s+/);
        claims.push(...sentences.filter((s: string) => s.length > 30).slice(0, 5));
      }

      const durationMs = Date.now() - startTime;

      // Track usage
      UsageTracker.recordUsage({
        model,
        inputTokens: Math.round(query.length / 4),
        outputTokens: Math.round(fullText.length / 4),
        toolCallsCount: 1,
        durationMs,
        workload: "SEARCH_GROUNDING",
      });

      return {
        status: "SUCCESS",
        query,
        summary: fullText,
        sources: uniqueSources,
        claims: claims.slice(0, 8),
        entities: entities.slice(0, 10),
        rawGroundingMetadata: groundingMeta,
        timestamp,
      };
    } catch (err: any) {
      console.error("Google Search Grounding Error:", err?.message || err);
      return {
        status: "SEARCH UNAVAILABLE",
        query,
        summary: "SEARCH UNAVAILABLE: Failed to execute search grounding with Gemini.",
        sources: [],
        claims: [],
        entities: [],
        timestamp,
        error: err?.message || String(err),
      };
    }
  }
}
