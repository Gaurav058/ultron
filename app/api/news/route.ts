import { NextResponse } from "next/server";
import { NewsResearchService } from "@/core/intelligence/newsResearchService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "7", 10);
  const filter = searchParams.get("filter"); // e.g. "top" or "all"

  if (filter === "all") {
    const all = NewsResearchService.getAllNews();
    return NextResponse.json({ stories: all, count: all.length });
  }

  const stories = NewsResearchService.getTopNews(limit);
  return NextResponse.json({ stories, count: stories.length });
}

export async function POST() {
  const updatedStories = await NewsResearchService.executeNewsPipeline();
  return NextResponse.json({ success: true, count: updatedStories.length, stories: updatedStories });
}
