# ULTRON — Official Gemini Integration Specification

## 1. Overview
ULTRON integrates Google's official Gemini API directly via the `@google/genai` SDK.
Architectural boundaries ensure that Gemini acts as a cognitive engine while ULTRON's control plane enforces execution policy, zero-trust permission boundaries, and state durability.

```
ULTRON
   │
   ├── GeminiProvider (Text generation, streaming, 14 canonical tools)
   ├── GeminiLiveProvider (WebSockets, 16kHz PCM input, 24kHz PCM output, ephemeral tokens)
   ├── ToolExecutor (Parallel execution with Promise.all(), permission validation)
   ├── MemoryService (Bounded context retrieval, episodic & vector memory)
   └── MissionService (DAG planning, multi-agent dispatch, verification)
```

## 2. Environment Variables & Security
Keys are strictly managed on the server and are **never exposed to the client or browser bundles**.

```env
# Required Server-Side Key (never commit to git)
GEMINI_API_KEY=AIzaSy...

# Dynamic Model Routing
GEMINI_TEXT_MODEL=gemini-2.5-flash
GEMINI_LIVE_MODEL=gemini-2.5-flash
GEMINI_REASONING_MODEL=gemini-2.5-pro
```

### Ephemeral Token Architecture (Section 21)
For client-side voice streaming via Gemini Live:
1. The client sends a request to `GET /api/voice/token`.
2. The ULTRON backend uses `@google/genai` to mint an ephemeral short-lived session token using the server's permanent `GEMINI_API_KEY`.
3. The client connects directly to Gemini Live using the ephemeral token without ever accessing the permanent key.

## 3. Endpoints
- `GET /api/health/gemini`: Health probe returning reachability, latency in milliseconds, model identification, and configuration status without disclosing keys.
- `POST /api/chat/stream`: Server-Sent Events (SSE) endpoint providing streaming text generation with micro-latency timing telemetry.
- `GET /api/voice/token`: Minting endpoint for Gemini Live client WebSockets.
- `POST /api/voice/chat`: Bidirectional conversational turn handler with tool calling, context compression, and real-time event broadcasting.

## 4. Workload Routing (Section 8)
Workloads are routed dynamically based on latency profiles:
- `FAST_CONVERSATION`: `gemini-2.5-flash` (temperature: 0.2, maxTokens: 1024)
- `VOICE`: `gemini-2.5-flash` (temperature: 0.2, maxTokens: 512)
- `TOOL_EXECUTION`: `gemini-2.5-flash` (temperature: 0.0, maxTokens: 2048)
- `REASONING` / `LONG_RESEARCH` / `CODE`: `gemini-2.5-pro` (temperature: 0.1, maxTokens: 4096)
- `ANALYSIS`: `gemini-2.5-flash` (temperature: 0.2, maxTokens: 2048)
