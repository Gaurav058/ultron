import { NextResponse } from "next/server";
import { BackgroundIntelligenceScheduler } from "@/core/scheduler/backgroundScheduler";
import { GlobalIntelligenceService } from "@/core/intelligence/globalIntelligenceService";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetDomainId = body.domainId;
    const query = body.query;

    if (query || targetDomainId) {
      const result = await GlobalIntelligenceService.executeResearchScan(targetDomainId, query);
      return NextResponse.json({
        success: true,
        signalsCount: result.signalsCreated.length,
        status: result.status,
      });
    }

    const result = await BackgroundIntelligenceScheduler.runHourlyIntelligenceScan("MANUAL");
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to trigger scan", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
