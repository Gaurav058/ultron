import { UltronEventBus, UltronEvent } from "@/core/events/eventBus";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection acknowledgement and recent history
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "CONNECTED",
            summary: "Connected to ULTRON Real-Time Intelligence Stream",
            timestamp: new Date().toISOString(),
          })}\n\n`
        )
      );

      // Subscribe to all event types
      const unsubscribe = UltronEventBus.subscribe("*", (evt: UltronEvent) => {
        try {
          const payload = `data: ${JSON.stringify(evt)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          // Client disconnected
        }
      });

      // Keepalive heartbeat every 15 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 15000);

      // Clean up when stream closes
      return () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
