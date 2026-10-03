/**
 * ULTRON YOUTUBE RESEARCH ADAPTER
 * Directive Section 10, 21
 * Official YouTube Data API v3 integration with support for video, channel, and playlist search.
 * Strictly adheres to non-fabrication rule: returns "YOUTUBE SOURCE UNAVAILABLE" if unconfigured or failing.
 */

import { ResearchResult } from "@/types/intelligence";

export interface YouTubeSearchResult {
  status: "SUCCESS" | "YOUTUBE SOURCE UNAVAILABLE";
  results: ResearchResult[];
  error?: string;
}

export class YouTubeResearchAdapter {
  private static getApiKey(): string | null {
    return process.env.YOUTUBE_API_KEY || process.env.GOOGLE_MAPS_API_KEY || null;
  }

  public static isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  /**
   * Search YouTube videos, channels, and playlists
   */
  public static async search(
    query: string,
    type: "video" | "channel" | "playlist" | "all" = "video",
    maxResults = 5
  ): Promise<YouTubeSearchResult> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return {
        status: "YOUTUBE SOURCE UNAVAILABLE",
        results: [],
        error: "YouTube API key not configured in environment.",
      };
    }

    try {
      const typeParam = type === "all" ? "video,channel,playlist" : type;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=${typeParam}&maxResults=${maxResults}&key=${apiKey}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn("YouTube API error:", res.status, errorText);
        return {
          status: "YOUTUBE SOURCE UNAVAILABLE",
          results: [],
          error: `YouTube API returned status ${res.status}: ${errorText.slice(0, 100)}`,
        };
      }

      const data = await res.json();
      const items = data.items || [];

      const results: ResearchResult[] = items.map((item: any) => {
        const snippet = item.snippet || {};
        const videoId = item.id?.videoId || item.id?.playlistId || item.id?.channelId;
        const targetUrl = item.id?.videoId
          ? `https://www.youtube.com/watch?v=${videoId}`
          : item.id?.channelId
          ? `https://www.youtube.com/channel/${videoId}`
          : `https://www.youtube.com/playlist?list=${videoId}`;

        return {
          title: snippet.title || "YouTube Video",
          url: targetUrl,
          source: "YouTube",
          publishedAt: snippet.publishedAt,
          snippet: snippet.description || "",
          channel: snippet.channelTitle || "",
          videoId,
          thumbnail: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "",
          relevance: 0.9,
          metadata: {
            kind: item.id?.kind,
            channelId: snippet.channelId,
          },
        };
      });

      return {
        status: "SUCCESS",
        results,
      };
    } catch (err: any) {
      console.warn("YouTube fetch exception:", err?.message || err);
      return {
        status: "YOUTUBE SOURCE UNAVAILABLE",
        results: [],
        error: err?.message || String(err),
      };
    }
  }

  public static async searchChannels(query: string, maxResults = 3): Promise<YouTubeSearchResult> {
    return this.search(query, "channel", maxResults);
  }

  public static async searchPlaylists(query: string, maxResults = 3): Promise<YouTubeSearchResult> {
    return this.search(query, "playlist", maxResults);
  }
}
