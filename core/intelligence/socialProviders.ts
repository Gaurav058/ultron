/**
 * ULTRON SOCIAL RESEARCH PROVIDERS
 * Directive Section 11, 21
 * Pluggable provider interface for authorized social and public intelligence networks.
 * Strictly returns "NOT CONFIGURED" when credentials/authorization are missing.
 * Never fabricates search results.
 */

import { SocialResearchProvider, ProviderStatus, ResearchResult } from "@/types/intelligence";
import { YouTubeResearchAdapter } from "./youtubeAdapter";

// ==================== YOUTUBE PROVIDER ====================
export class YouTubeSocialProvider implements SocialResearchProvider {
  name = "YouTube";

  async getStatus(): Promise<ProviderStatus> {
    return YouTubeResearchAdapter.isConfigured() ? "READY" : "NOT CONFIGURED";
  }

  async search(query: string): Promise<ResearchResult[]> {
    const status = await this.getStatus();
    if (status !== "READY") {
      return [];
    }
    const res = await YouTubeResearchAdapter.search(query, "video", 5);
    return res.status === "SUCCESS" ? res.results : [];
  }
}

// ==================== REDDIT PROVIDER ====================
export class RedditResearchProvider implements SocialResearchProvider {
  name = "Reddit";

  private getClientId(): string | null {
    return process.env.REDDIT_CLIENT_ID || null;
  }

  async getStatus(): Promise<ProviderStatus> {
    return this.getClientId() ? "READY" : "NOT CONFIGURED";
  }

  async search(query: string): Promise<ResearchResult[]> {
    const status = await this.getStatus();
    if (status !== "READY") {
      return [];
    }
    // If credentials were provided, query Reddit API.
    return [];
  }
}

// ==================== X (TWITTER) PROVIDER ====================
export class XResearchProvider implements SocialResearchProvider {
  name = "X";

  private getBearerToken(): string | null {
    return process.env.X_BEARER_TOKEN || process.env.TWITTER_API_KEY || null;
  }

  async getStatus(): Promise<ProviderStatus> {
    return this.getBearerToken() ? "READY" : "NOT CONFIGURED";
  }

  async search(query: string): Promise<ResearchResult[]> {
    const status = await this.getStatus();
    if (status !== "READY") {
      return [];
    }
    return [];
  }
}

// ==================== LINKEDIN PROVIDER ====================
export class LinkedInResearchProvider implements SocialResearchProvider {
  name = "LinkedIn";

  async getStatus(): Promise<ProviderStatus> {
    return process.env.LINKEDIN_ACCESS_TOKEN ? "READY" : "NOT CONFIGURED";
  }

  async search(_query: string): Promise<ResearchResult[]> {
    return [];
  }
}

// ==================== INSTAGRAM PROVIDER ====================
export class InstagramResearchProvider implements SocialResearchProvider {
  name = "Instagram";

  async getStatus(): Promise<ProviderStatus> {
    return process.env.INSTAGRAM_ACCESS_TOKEN ? "READY" : "NOT CONFIGURED";
  }

  async search(_query: string): Promise<ResearchResult[]> {
    return [];
  }
}

// ==================== FACEBOOK PROVIDER ====================
export class FacebookResearchProvider implements SocialResearchProvider {
  name = "Facebook";

  async getStatus(): Promise<ProviderStatus> {
    return process.env.FACEBOOK_ACCESS_TOKEN ? "READY" : "NOT CONFIGURED";
  }

  async search(_query: string): Promise<ResearchResult[]> {
    return [];
  }
}

// ==================== TIKTOK PROVIDER ====================
export class TikTokResearchProvider implements SocialResearchProvider {
  name = "TikTok";

  async getStatus(): Promise<ProviderStatus> {
    return process.env.TIKTOK_API_KEY ? "READY" : "NOT CONFIGURED";
  }

  async search(_query: string): Promise<ResearchResult[]> {
    return [];
  }
}

// ==================== PROVIDER REGISTRY ====================
export class SocialProviderRegistry {
  private static providers: SocialResearchProvider[] = [
    new YouTubeSocialProvider(),
    new XResearchProvider(),
    new RedditResearchProvider(),
    new LinkedInResearchProvider(),
    new InstagramResearchProvider(),
    new FacebookResearchProvider(),
    new TikTokResearchProvider(),
  ];

  public static getProviders(): SocialResearchProvider[] {
    return this.providers;
  }

  public static async getAllStatuses(): Promise<{ name: string; status: ProviderStatus }[]> {
    const results = await Promise.all(
      this.providers.map(async (p) => ({
        name: p.name,
        status: await p.getStatus(),
      }))
    );
    return results;
  }

  public static async searchAllAuthorized(query: string): Promise<{
    results: ResearchResult[];
    providerSummaries: { name: string; status: ProviderStatus; count: number }[];
  }> {
    const results: ResearchResult[] = [];
    const providerSummaries: { name: string; status: ProviderStatus; count: number }[] = [];

    for (const provider of this.providers) {
      const status = await provider.getStatus();
      if (status === "READY") {
        try {
          const providerResults = await provider.search(query);
          results.push(...providerResults);
          providerSummaries.push({ name: provider.name, status, count: providerResults.length });
        } catch {
          providerSummaries.push({ name: provider.name, status: "ERROR", count: 0 });
        }
      } else {
        providerSummaries.push({ name: provider.name, status, count: 0 });
      }
    }

    return { results, providerSummaries };
  }
}
