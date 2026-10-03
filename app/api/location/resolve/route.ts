import { NextResponse } from "next/server";
import { LocationPipelineService } from "@/core/maps/locationPipelineService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");

  if (!latStr || !lonStr) {
    return NextResponse.json(
      { error: "Missing latitude or longitude query parameters" },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: "Invalid latitude or longitude numbers" },
      { status: 400 }
    );
  }

  try {
    const location = await LocationPipelineService.resolveLocation(lat, lon);
    return NextResponse.json(location);
  } catch (err: any) {
    console.error("Location pipeline API error:", err);
    return NextResponse.json(
      { error: "Location pipeline resolution failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
