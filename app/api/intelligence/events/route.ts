import { NextResponse } from "next/server";
import { IntelligenceEngine } from "@/core/intelligence/pipeline/intelligenceEngine";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const layersParam = searchParams.get("layers");
    const timeRange = (searchParams.get("time") || "all") as any;
    const searchQuery = searchParams.get("search") || undefined;

    const layers = layersParam ? layersParam.split(",") : undefined;

    const events = await IntelligenceEngine.getAllEvents({
      layers,
      timeRange,
      searchQuery,
    });

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to retrieve intelligence events" },
      { status: 500 }
    );
  }
}
