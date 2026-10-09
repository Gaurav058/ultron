import { NextResponse } from "next/server";
import { WorldMonitorService } from "@/core/worldmonitor/worldMonitorService";

export async function GET() {
  try {
    const status = await WorldMonitorService.getProviderStatus();
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to retrieve World Monitor status" },
      { status: 500 }
    );
  }
}
