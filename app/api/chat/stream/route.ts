import { NextRequest, NextResponse } from "next/server";
import { GeminiProvider } from "@/core/gemini/geminiProvider";
import { ConversationSession } from "@/core/voice/conversationSession";
import { ModelRouter } from "@/core/model-router/modelRouter";
import { LatencyTracker } from "@/core/telemetry/latencyTracker";
import { UltronEventBus } from "@/core/events/eventBus";

export const dynamic = "force-dynamic";

/**
 * POST /api/chat/stream (Sections 4 & 9)
 * Progressive Server-Sent Events (SSE) streaming for real-time low-latency response rendering.
 */
export async function POST(req: NextRequest) {
  const tracker = new LatencyTracker();
  tracker.mark("context_started");

  try {
    const body = await req.json();
    const rawMessage = body.message || body.input || body.query || body.prompt;
    const { sessionId = "ultron-voice-session-default" } = body;

    if (!rawMessage || typeof rawMessage !== "string" || !rawMessage.trim()) {
      return NextResponse.json({ error: "Message or input is required." }, { status: 400 });
    }

    const trimmed = rawMessage.trim();
    ConversationSession.addMessage(sessionId, "user", trimmed);

    // Minimized relevant context retrieval (Section 6)
    const context = ConversationSession.assembleContext(sessionId);
    tracker.mark("context_completed");

    const messages = context.recentMessages.map((m) => ({
      role: m.role as "user" | "model" | "system",
      content: m.content,
    }));

    const workload = ModelRouter.inferWorkload(trimmed);
    const encoder = new TextEncoder();

    tracker.mark("gemini_request_started");

    // Create ReadableStream for SSE
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const route = ModelRouter.route(workload);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "meta",
                model: route.model,
                workload,
                sessionId,
              })}\n\n`
            )
          );

          let success = false;
          if (GeminiProvider.isConfigured()) {
            try {
              let firstToken = true;
              let completeResponse = "";

              for await (const chunk of GeminiProvider.generateStream({
                messages,
                workload,
              })) {
                if (firstToken) {
                  tracker.mark("first_token_received");
                  firstToken = false;
                }
                completeResponse += chunk;
                const payload = `data: ${JSON.stringify({ type: "chunk", chunk, done: false })}\n\n`;
                controller.enqueue(encoder.encode(payload));
              }

              tracker.mark("final_response");
              tracker.mark("request_completed");

              ConversationSession.addMessage(sessionId, "model", completeResponse);

              // Send completion and timing metrics
              const metrics = tracker.getMetrics();
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "done",
                    done: true,
                    text: completeResponse,
                    metrics,
                    latency: metrics,
                  })}\n\n`
                )
              );
              success = true;
            } catch (geminiStreamErr: any) {
              console.warn("Gemini streaming encountered error; activating deterministic stream:", geminiStreamErr?.message);
            }
          }

          if (!success) {
            // Deterministic streaming fallback when offline/unconfigured or upon provider demand spike
            tracker.mark("first_token_received");
            const fallbackText = `ULTRON intelligence operating system synchronized. Telemetry processed for: "${trimmed.slice(0, 40)}".`;
            const words = fallbackText.split(" ");

            for (const word of words) {
              const payload = `data: ${JSON.stringify({ type: "chunk", chunk: word + " ", done: false })}\n\n`;
              controller.enqueue(encoder.encode(payload));
              await new Promise((r) => setTimeout(r, 20));
            }

            tracker.mark("final_response");
            tracker.mark("request_completed");
            ConversationSession.addMessage(sessionId, "model", fallbackText);

            const metrics = tracker.getMetrics();
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "done",
                  done: true,
                  text: fallbackText,
                  metrics,
                  latency: metrics,
                })}\n\n`
              )
            );
          }
        } catch (streamErr: any) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: streamErr?.message || "Stream error",
                done: true,
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Error in /api/chat/stream:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Streaming initialization error" },
      { status: 500 }
    );
  }
}
