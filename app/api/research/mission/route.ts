import { NextResponse } from "next/server";
import { MissionManager } from "@/core/missions/missionManager";
import { GoogleSearchProvider } from "@/core/intelligence/googleSearchProvider";
import { YouTubeResearchAdapter } from "@/core/intelligence/youtubeAdapter";
import { VerificationService } from "@/core/verification/verificationService";
import { MemoryEngine } from "@/core/memory/memoryEngine";
import { UltronEventBus } from "@/core/events/eventBus";
import { SourceProvenance } from "@/types/intelligence";

export async function POST(req: Request) {
  try {
    const { objective } = await req.json();
    if (!objective || typeof objective !== "string") {
      return NextResponse.json({ error: "Missing research objective" }, { status: 400 });
    }

    // Format mission title
    const cleanObjective = objective.trim();
    const slug = cleanObjective
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .slice(0, 32);
    const missionTitle = `RESEARCH_${slug}`;

    // 1. Create durable Mission
    const mission = MissionManager.createMission(
      `RESEARCH: ${cleanObjective}`,
      "P1"
    );

    UltronEventBus.publish("MISSION_STARTED", "PLANNER", `Initialized research mission [${missionTitle}]`, {
      missionId: mission.id,
      title: missionTitle,
    });

    // Run execution pipeline asynchronously or synchronously
    // Step 1: Planner
    UltronEventBus.publish("AGENT_TASK_STARTED", "Conductor", "Compiling DAG for multi-source research pipeline.");

    // Step 2: Google Search Grounding
    UltronEventBus.publish("TOOL_STARTED", "Researcher", `Executing Google Search grounding for: "${cleanObjective}"`);
    const searchResult = await GoogleSearchProvider.searchWithGrounding(cleanObjective);
    UltronEventBus.publish("TOOL_COMPLETED", "Researcher", `Google Search grounding completed with ${searchResult.sources.length} sources.`);

    // Step 3: YouTube Search
    let ytSources: SourceProvenance[] = [];
    if (YouTubeResearchAdapter.isConfigured()) {
      UltronEventBus.publish("TOOL_STARTED", "Researcher", `Searching YouTube for authoritative video intelligence.`);
      const ytRes = await YouTubeResearchAdapter.search(cleanObjective, "video", 3);
      if (ytRes.status === "SUCCESS") {
        ytSources = ytRes.results.map((r) => ({
          title: r.title,
          url: r.url,
          source: r.source,
          publishedAt: r.publishedAt,
          author: r.channel,
          snippet: r.snippet,
          authorityScore: 0.8,
        }));
      }
    }

    const allSources = [...searchResult.sources, ...ytSources];

    // Step 4: Analyst Synthesis
    UltronEventBus.publish("AGENT_TASK_STARTED", "Analyst", "Synthesizing claims, market data, and core entities.");
    const claims = searchResult.claims.length > 0 ? searchResult.claims : [searchResult.summary.slice(0, 120)];

    // Step 5: Verifier
    UltronEventBus.publish("AGENT_TASK_STARTED", "Verifier", "Cross-validating claims against source authority & consensus.");
    const verification = VerificationService.verifyClaims(claims, allSources);

    // Step 6: Memory Storage
    let memoryItem = null;
    if (verification.status === "VERIFIED" && verification.confidenceScore >= 0.85) {
      UltronEventBus.publish("AGENT_TASK_STARTED", "Memory", "Promoting verified claims into durable knowledge graph.");
      memoryItem = MemoryEngine.promoteSignalToMemory({
        id: `sig-${Date.now()}`,
        title: cleanObjective,
        summary: searchResult.summary,
        claims,
        entities: searchResult.entities,
        sources: allSources,
        confidence: verification.confidenceScore,
        verificationStatus: verification.status,
      });
    }

    // Step 7: Complete Mission
    MissionManager.updateMissionStatus(mission.id, "COMPLETED");
    UltronEventBus.publish("MISSION_COMPLETED", "Conductor", `Completed mission [${missionTitle}]. Verification: ${verification.status}.`, {
      missionId: mission.id,
      verificationStatus: verification.status,
    });

    return NextResponse.json({
      success: true,
      missionId: mission.id,
      missionTitle,
      summary: searchResult.summary,
      sources: allSources,
      claims,
      claimVerifications: verification.claimVerifications,
      entities: searchResult.entities,
      verificationStatus: verification.status,
      confidenceScore: verification.confidenceScore,
      promotedToMemory: Boolean(memoryItem),
    });
  } catch (err: any) {
    console.error("Research mission error:", err);
    return NextResponse.json(
      { error: "Failed to execute research mission", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
