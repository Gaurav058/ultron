import { NextResponse } from "next/server";
import { FREE_TOOLS_CATALOG, EXCLUDED_TOOLS_CATALOG } from "@/core/tools/freeToolsCatalog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const mode = searchParams.get("mode");
  const pricing = searchParams.get("pricing");
  const search = searchParams.get("search");

  let tools = [...FREE_TOOLS_CATALOG];

  if (category && category !== "All") {
    tools = tools.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  if (mode && mode !== "All") {
    tools = tools.filter((t) => t.executionMode === mode);
  }

  if (pricing && pricing !== "All") {
    tools = tools.filter((t) => t.pricingStatus === pricing);
  }

  if (search && search.trim().length > 0) {
    const q = search.toLowerCase();
    tools = tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    tools,
    excluded: EXCLUDED_TOOLS_CATALOG,
    totalRegistered: FREE_TOOLS_CATALOG.length,
    totalExcluded: EXCLUDED_TOOLS_CATALOG.length,
    timestamp: new Date().toISOString(),
  });
}
