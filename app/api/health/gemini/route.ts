import { NextRequest, NextResponse } from "next/server";
import { GeminiProvider } from "@/core/gemini/geminiProvider";
import { ModelRouter } from "@/core/model-router/modelRouter";

export const dynamic = "force-dynamic";

/**
 * GET /api/health/gemini (Section 32 & 33)
 * Reports provider configuration, reachability, model, and latency without leaking secrets.
 */
export async function GET(req: NextRequest) {
  const configured = GeminiProvider.isConfigured();
  const route = ModelRouter.route("FAST_CONVERSATION");
  const timestamp = new Date().toISOString();

  if (!configured) {
    return NextResponse.json({
      provider: "gemini",
      configured: false,
      reachable: false,
      model: route.model,
      status: "NOT_CONFIGURED",
      latencyMs: 0,
      message: "GEMINI_API_KEY environment variable is not configured.",
      timestamp,
    });
  }

  const start = performance.now();
  try {
    const res = await GeminiProvider.generateText({
      messages: [{ role: "user", content: "ping" }],
      workload: "FAST_CONVERSATION",
      toolsEnabled: false,
      maxOutputTokens: 5,
    });

    const latencyMs = Math.round(performance.now() - start);

    return NextResponse.json({
      provider: "gemini",
      configured: true,
      reachable: true,
      model: res.model,
      latencyMs,
      timestamp,
    });
  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - start);
    return NextResponse.json(
      {
        provider: "gemini",
        configured: true,
        reachable: false,
        model: route.model,
        error: error?.message || "Health ping failed",
        latencyMs,
        timestamp,
      },
      { status: 503 }
    );
  }
}
