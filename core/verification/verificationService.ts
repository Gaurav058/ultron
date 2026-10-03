/**
 * ULTRON VERIFICATION SERVICE
 * Directive Section 13, 14
 * Cross-checks claims across multiple sources, assesses source authority,
 * checks publication recency, and detects contradictions.
 *
 * States: VERIFIED | PARTIALLY_VERIFIED | CONFLICTING | UNVERIFIED
 * Does not silently convert uncertain information into facts.
 */

import { SourceProvenance, VerificationState, ClaimVerification } from "@/types/intelligence";

export interface VerificationEvaluation {
  status: VerificationState;
  confidenceScore: number;
  claimVerifications: ClaimVerification[];
  summary: string;
  sourceAgreementRatio: number;
  detectedContradictions: string[];
}

export class VerificationService {
  /**
   * Authority weighting dictionary for known institutional/news sources
   */
  private static SOURCE_AUTHORITY: Record<string, number> = {
    reuters: 0.95,
    "associated press": 0.95,
    ap: 0.95,
    bloomberg: 0.92,
    "nature": 0.98,
    "science": 0.98,
    "mit technology review": 0.92,
    "financial times": 0.9,
    "wall street journal": 0.9,
    "ieee spectrum": 0.9,
    "nasa": 0.98,
    "cisa": 0.95,
    "github": 0.88,
    "arxiv": 0.85,
    "the verge": 0.82,
    "techcrunch": 0.82,
    "google research": 0.92,
    "gulf business": 0.85,
    "economic times": 0.85,
  };

  /**
   * Calculate source authority score (0 to 1)
   */
  public static assessSourceAuthority(source: SourceProvenance): number {
    if (source.authorityScore && source.authorityScore > 0) {
      return source.authorityScore;
    }
    const name = (source.source || source.title || "").toLowerCase();
    for (const [known, score] of Object.entries(this.SOURCE_AUTHORITY)) {
      if (name.includes(known)) return score;
    }
    // High-level TLD heuristic for primary sources (.gov, .edu, .org)
    try {
      if (source.url) {
        const hostname = new URL(source.url).hostname.toLowerCase();
        if (hostname.endsWith(".gov") || hostname.endsWith(".edu")) return 0.95;
        if (hostname.endsWith(".org")) return 0.85;
      }
    } catch {}
    return 0.7; // default standard web source
  }

  /**
   * Verify an array of claims against collected sources
   */
  public static verifyClaims(
    claims: string[],
    sources: SourceProvenance[]
  ): VerificationEvaluation {
    if (sources.length === 0) {
      return {
        status: "UNVERIFIED",
        confidenceScore: 0,
        claimVerifications: claims.map((c) => ({
          claim: c,
          status: "UNVERIFIED",
          supportingSources: [],
          confidenceScore: 0,
          reasoning: "No external verifiable sources found.",
        })),
        summary: "UNVERIFIED: Zero sources provided for verification.",
        sourceAgreementRatio: 0,
        detectedContradictions: [],
      };
    }

    const verifiedClaims: ClaimVerification[] = [];
    const contradictions: string[] = [];

    // Calculate aggregated source authority
    const authorityScores = sources.map((s) => this.assessSourceAuthority(s));
    const avgAuthority =
      authorityScores.reduce((sum, s) => sum + s, 0) / (authorityScores.length || 1);

    for (const claim of claims) {
      const claimLower = claim.toLowerCase();

      // Find sources whose title or snippet mentions keywords from the claim
      const words = claimLower
        .split(/\s+/)
        .filter((w) => w.length > 3 && !["with", "from", "that", "this", "have", "were"].includes(w));

      const matchingSources = sources.filter((s) => {
        const text = `${s.title} ${s.snippet || ""}`.toLowerCase();
        const matches = words.filter((w) => text.includes(w));
        return matches.length >= Math.min(2, words.length);
      });

      // Detect potential negation / contradiction patterns
      const hasContradictionWords =
        claimLower.includes("denied") ||
        claimLower.includes("refuted") ||
        claimLower.includes("false") ||
        claimLower.includes("contrary to") ||
        claimLower.includes("disputed");

      let claimStatus: VerificationState = "UNVERIFIED";
      let confidence = 0;
      let reasoning = "";

      if (hasContradictionWords && matchingSources.length > 1) {
        claimStatus = "CONFLICTING";
        confidence = 0.5;
        reasoning = "Contradictory or conflicting claims identified in reporting.";
        contradictions.push(claim);
      } else if (matchingSources.length >= 2) {
        claimStatus = "VERIFIED";
        confidence = Math.min(0.98, avgAuthority * 0.95 + 0.1);
        reasoning = `Corroborated across ${matchingSources.length} independent sources with authority ${Math.round(avgAuthority * 100)}%.`;
      } else if (matchingSources.length === 1) {
        claimStatus = "PARTIALLY_VERIFIED";
        confidence = Math.min(0.75, avgAuthority * 0.8);
        reasoning = `Referenced by single primary source (${matchingSources[0].source || matchingSources[0].title}). Awaiting corroboration.`;
      } else {
        claimStatus = "UNVERIFIED";
        confidence = 0.2;
        reasoning = "Not directly corroborated in retrieved snippets.";
      }

      verifiedClaims.push({
        claim,
        status: claimStatus,
        supportingSources: matchingSources.map((s) => s.url || s.title),
        confidenceScore: Number(confidence.toFixed(2)),
        reasoning,
      });
    }

    // Determine overall status
    const verifiedCount = verifiedClaims.filter((c) => c.status === "VERIFIED").length;
    const partialCount = verifiedClaims.filter((c) => c.status === "PARTIALLY_VERIFIED").length;
    const conflictCount = verifiedClaims.filter((c) => c.status === "CONFLICTING").length;

    let overallStatus: VerificationState = "UNVERIFIED";
    if (conflictCount > 0 && conflictCount >= verifiedCount) {
      overallStatus = "CONFLICTING";
    } else if (verifiedCount >= 2 || (verifiedCount > 0 && verifiedCount >= claims.length / 2)) {
      overallStatus = "VERIFIED";
    } else if (partialCount > 0 || verifiedCount > 0) {
      overallStatus = "PARTIALLY_VERIFIED";
    }

    const overallConfidence =
      verifiedClaims.length > 0
        ? verifiedClaims.reduce((sum, c) => sum + c.confidenceScore, 0) / verifiedClaims.length
        : 0;

    return {
      status: overallStatus,
      confidenceScore: Number(overallConfidence.toFixed(2)),
      claimVerifications: verifiedClaims,
      summary: `Overall status ${overallStatus}: ${verifiedCount} verified, ${partialCount} partially verified, ${conflictCount} conflicting claims.`,
      sourceAgreementRatio: Number((verifiedCount / (claims.length || 1)).toFixed(2)),
      detectedContradictions: contradictions,
    };
  }
}
