import { NextResponse } from "next/server";
import { GlobalIntelligenceService } from "@/core/intelligence/globalIntelligenceService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const signals = GlobalIntelligenceService.getSignals(limit);

  return NextResponse.json({ signals, count: signals.length });
}
