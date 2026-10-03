# ULTRON — Latency Optimization & Micro-Telemetry

## 1. Latency Target Profile
- **Streaming Text TTFB:** < 250ms (First chunk rendered progressively to user).
- **Voice Response TTFA (Time-To-First-Audio):** < 400ms via Gemini Live WebSockets.
- **Context Assembly:** < 15ms by limiting context to recent turns and targeted memory hits.
- **Tool Execution:** Measured per-tool with maximum concurrency.

## 2. Timing Stages Tracked
Every request registers high-resolution timestamps via `LatencyTracker`:
1. `request_received`: HTTP/WebSocket ingress timestamp.
2. `context_started`: Context builder initialization.
3. `context_completed`: Minimized context compiled.
4. `gemini_request_started`: Payload sent to Google GenAI API.
5. `first_token_received`: First token received (TTFT).
6. `tool_call_started`: First tool execution begins.
7. `tool_call_completed`: All tool calls resolved.
8. `final_response`: Model finishes generation.
9. `request_completed`: Final byte dispatched to client.

## 3. Metrics Calculated & Logged
- **TTFB (Time-To-First-Byte):** `context_completed - request_received`
- **TTFT (Time-To-First-Token):** `first_token_received - gemini_request_started`
- **Gemini Latency:** `final_response - gemini_request_started`
- **Tool Latency:** `tool_call_completed - tool_call_started`
- **Total Latency:** `request_completed - request_received`

## 4. Context Minimization Strategy (Section 6)
To avoid multi-second TTFB caused by oversized prompts, ULTRON never sends full historical logs. Instead:
- Recent turns: Capped at last 6 conversational turns.
- Memory: Top 3 relevant items retrieved via indexed keyword/semantic similarity.
- Active Mission: Summary of current objective and active tasks only.
- System Prompt: Concise, static instructions without bloated examples.
