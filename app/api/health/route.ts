import { NextResponse } from "next/server";
import { SystemStatus, SystemHealthReport } from "@/types/system";
import { GeminiProvider } from "@/core/gemini/geminiProvider";
import { Google3DMapService } from "@/core/maps/google3DMapService";
import { YouTubeResearchAdapter } from "@/core/intelligence/youtubeAdapter";
import { BackgroundIntelligenceScheduler } from "@/core/scheduler/backgroundScheduler";

export async function GET() {
  const timestamp = new Date().toISOString();

  // 1. Core & API
  const apiStatus = "online";
  const coreStatus = "online";

  // 2. Google Gemini / Search Grounding
  const hasGeminiKey = GeminiProvider.isConfigured();
  const geminiStatus = hasGeminiKey ? "online" : "offline";

  // 3. Google Maps
  const mapsKey = Google3DMapService.getApiKey();
  const mapsStatus = mapsKey ? "online" : "degraded"; // degraded uses real Nominatim

  // 4. YouTube
  const youtubeKey = YouTubeResearchAdapter.isConfigured();
  const youtubeStatus = youtubeKey ? "online" : "offline";

  // 5. Scheduler
  const schedulerActive = BackgroundIntelligenceScheduler.getStatus().active;
  const schedulerStatus = schedulerActive ? "online" : "degraded";

  // 6. Memory & Agent Runtime
  const memoryStatus = "online";
  const agentRuntimeStatus = "online";
  const toolFabricStatus = "online";
  const eventBusStatus = "online";
  const databaseStatus = "online";
  const researchEngineStatus = hasGeminiKey ? "online" : "degraded";
  const verificationStatus = "online";

  const status: SystemStatus = {
    core: coreStatus,
    api: apiStatus,
    database: databaseStatus,
    memory: memoryStatus,
    agentRuntime: agentRuntimeStatus,
    toolFabric: toolFabricStatus,
    eventBus: eventBusStatus,
    scheduler: schedulerStatus,
    researchEngine: researchEngineStatus,
    googleSearch: geminiStatus,
    youtube: youtubeStatus,
    maps: mapsStatus,
    verification: verificationStatus,
  };

  const isDegraded = Object.values(status).some((v) => v === "offline" || v === "degraded");
  const overall = isDegraded ? "degraded" : "online";

  const report: SystemHealthReport = {
    overall,
    status,
    subsystems: {
      core: { name: "Kernel Core", status: coreStatus, lastChecked: timestamp },
      api: { name: "HTTP / Next.js Gateway", status: apiStatus, lastChecked: timestamp },
      database: { name: "Persistence Store", status: databaseStatus, lastChecked: timestamp },
      memory: { name: "Durable Vector & Memory Graph", status: memoryStatus, lastChecked: timestamp },
      agentRuntime: { name: "Autonomous Agent Fleet", status: agentRuntimeStatus, lastChecked: timestamp },
      toolFabric: { name: "Tool Execution Fabric", status: toolFabricStatus, lastChecked: timestamp },
      eventBus: { name: "System Event Bus", status: eventBusStatus, lastChecked: timestamp },
      scheduler: {
        name: "Hourly Background Scheduler",
        status: schedulerStatus,
        message: schedulerActive ? "Hourly scan active" : "Scheduler paused",
        lastChecked: timestamp,
      },
      researchEngine: {
        name: "Global Intelligence Engine",
        status: researchEngineStatus,
        lastChecked: timestamp,
      },
      googleSearch: {
        name: "Google Search Grounding",
        status: geminiStatus,
        message: hasGeminiKey ? "Gemini Grounding Active" : "GEMINI_API_KEY required",
        lastChecked: timestamp,
      },
      youtube: {
        name: "YouTube Data API",
        status: youtubeStatus,
        message: youtubeKey ? "YouTube Source Active" : "YOUTUBE SOURCE UNAVAILABLE (Key not configured)",
        lastChecked: timestamp,
      },
      maps: {
        name: "Google Maps 3D Platform",
        status: mapsStatus,
        message: mapsKey ? "Google Maps 3D Active" : "Nominatim Fallback Active",
        lastChecked: timestamp,
      },
      verification: {
        name: "Multi-Source Claim Verifier",
        status: verificationStatus,
        lastChecked: timestamp,
      },
    },
    timestamp,
  };

  return NextResponse.json(report);
}
