import { NextRequest, NextResponse } from "next/server";
import { GeminiLiveProvider } from "@/core/gemini/geminiLiveProvider";

export const dynamic = "force-dynamic";

/**
 * GET /api/voice/token (Section 21)
 * Ephemeral token endpoint for client-side Gemini Live WebSockets.
 */
export async function GET(req: NextRequest) {
  try {
    const result = await GeminiLiveProvider.createEphemeralToken();

    return NextResponse.json({
      success: true,
      provider: "gemini-live",
      token: result.token,
      ephemeralToken: result.token || "unconfigured-ephemeral-token",
      model: result.model,
      configured: result.configured,
      expiresAt: result.expiresAt,
      websocketUrl: result.websocketUrl,
      resumptionHandle: result.resumptionHandle,
    });
  } catch (error: any) {
    console.error("Error in /api/voice/token:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to mint ephemeral token.",
      },
      { status: 500 }
    );
  }
}
