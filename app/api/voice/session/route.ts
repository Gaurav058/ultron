import { NextRequest, NextResponse } from "next/server";
import { ConversationSession } from "@/core/voice/conversationSession";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") || "ultron-voice-session-default";

  const session = ConversationSession.getOrCreateSession(sessionId);
  return NextResponse.json({
    success: true,
    session: {
      sessionId: session.sessionId,
      messagesCount: session.messages.length,
      activeMissionId: session.activeMissionId,
      activeEntities: session.activeEntities,
      messages: session.messages.slice(-20),
    },
  });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId") || "ultron-voice-session-default";

  ConversationSession.clearSession(sessionId);
  return NextResponse.json({
    success: true,
    message: `Session ${sessionId} cleared.`,
  });
}
