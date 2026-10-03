import { NextResponse } from "next/server";
import { GlobalIntelligenceService } from "@/core/intelligence/globalIntelligenceService";

export async function GET() {
  const oracle = GlobalIntelligenceService.getOracleInsight();
  return NextResponse.json(oracle);
}
