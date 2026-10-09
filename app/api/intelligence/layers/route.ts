import { NextResponse } from "next/server";
import { IntelligenceEngine } from "@/core/intelligence/pipeline/intelligenceEngine";

export async function GET() {
  try {
    const layers = await IntelligenceEngine.getLayers();
    return NextResponse.json({
      success: true,
      layers,
      count: layers.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to retrieve intelligence layers" },
      { status: 500 }
    );
  }
}
