import { NextResponse } from "next/server";
import { WorldMonitorService } from "@/core/worldmonitor/worldMonitorService";

export async function GET() {
  try {
    const data = await WorldMonitorService.getSources();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to retrieve World Monitor sources" },
      { status: 500 }
    );
  }
}
