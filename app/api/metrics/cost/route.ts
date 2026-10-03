import { NextResponse } from "next/server";
import { UsageTracker } from "@/core/metrics/usageTracker";

export async function GET() {
  const analytics = UsageTracker.getCostAnalytics();
  return NextResponse.json(analytics);
}
