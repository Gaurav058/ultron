import { NextResponse } from "next/server";
import { GlobalIntelligenceService } from "@/core/intelligence/globalIntelligenceService";
import { BackgroundIntelligenceScheduler } from "@/core/scheduler/backgroundScheduler";

export async function GET() {
  const scanStatus = GlobalIntelligenceService.getScanStatus();
  const schedulerStatus = BackgroundIntelligenceScheduler.getStatus();

  return NextResponse.json({
    ...scanStatus,
    scheduler: schedulerStatus,
    timestamp: new Date().toISOString(),
  });
}
