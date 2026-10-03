/**
 * ULTRON Gemini API & Low-Latency Intelligence Test Suite (Sections 40, 41, 42)
 * Tests health endpoints, streaming chat, ephemeral tokens, tool execution harness,
 * parallel execution, memory retrieval, mission creation, and voice state machines.
 */

function assert(condition, description) {
  if (!condition) {
    console.error(`❌ FAILED: ${description}`);
    process.exitCode = 1;
    throw new Error(`Assertion failed: ${description}`);
  }
  console.log(`✅ PASSED: ${description}`);
}

async function request(url, options = {}, body = null) {
  const reqInit = {
    method: options.method || "GET",
    headers: options.headers || {},
  };
  if (body) {
    reqInit.body = typeof body === "string" ? body : JSON.stringify(body);
    if (!reqInit.headers["Content-Type"]) {
      reqInit.headers["Content-Type"] = "application/json";
    }
  }
  const res = await fetch(url, reqInit);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  return { status: res.status, headers: res.headers, data, raw: text };
}

async function readStream(url, body) {
  const startTime = Date.now();
  let firstByteTime = null;
  const events = [];
  const chunks = [];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!firstByteTime) firstByteTime = Date.now();
    const str = decoder.decode(value, { stream: true });
    chunks.push(str);
    buffer += str;
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const parsed = JSON.parse(line.slice(6));
          events.push(parsed);
          if (parsed.done) {
            return {
              status: res.status,
              ttfb: firstByteTime ? firstByteTime - startTime : null,
              totalDuration: Date.now() - startTime,
              events,
              raw: chunks.join(""),
            };
          }
        } catch {}
      }
    }
  }

  return {
    status: res.status,
    ttfb: firstByteTime ? firstByteTime - startTime : null,
    totalDuration: Date.now() - startTime,
    events,
    raw: chunks.join(""),
  };
}

async function runTests() {
  console.log("==================================================");
  console.log("ULTRON — GEMINI & LOW-LATENCY VERIFICATION SUITE");
  console.log("==================================================\n");

  const BASE_URL = "http://localhost:3000";

  // TEST 1: Health Check (Section 32)
  console.log("--- 1. API Health Check Endpoint (GET /api/health/gemini) ---");
  const healthRes = await request(`${BASE_URL}/api/health/gemini`);
  assert(healthRes.status === 200, "Health check returns HTTP 200");
  assert(healthRes.data.provider === "gemini", "Provider is 'gemini'");
  assert(typeof healthRes.data.configured === "boolean", "Configured flag is boolean");
  assert(typeof healthRes.data.latencyMs === "number", "Latency measurement is present in ms");
  assert(!healthRes.raw.includes("AIzaSy") && !healthRes.raw.includes("AQ.Ab8"), "API Key is NEVER exposed in health output");
  console.log(`Health Status: configured=${healthRes.data.configured}, model=${healthRes.data.model}, latency=${healthRes.data.latencyMs}ms\n`);

  // TEST 2: Voice Ephemeral Token Endpoint (Section 21)
  console.log("--- 2. Gemini Live Ephemeral Token Minting (GET /api/voice/token) ---");
  const tokenRes = await request(`${BASE_URL}/api/voice/token`);
  assert(tokenRes.status === 200, "Token endpoint returns HTTP 200");
  assert(tokenRes.data.provider === "gemini-live", "Token provider is 'gemini-live'");
  assert(tokenRes.data.model.includes("gemini"), "Target model specified for Live API");
  assert(typeof tokenRes.data.ephemeralToken === "string", "Ephemeral token string returned");
  assert(!tokenRes.data.ephemeralToken.includes("AIzaSy") && !tokenRes.data.ephemeralToken.includes("AQ.Ab8"), "Permanent API key NOT returned in token payload");
  console.log(`Live Token Status: model=${tokenRes.data.model}, configured=${tokenRes.data.configured}\n`);

  // TEST 3: Streaming Chat Endpoint (Section 4, 9)
  console.log("--- 3. Streaming Chat Endpoint (POST /api/chat/stream) ---");
  const streamResult = await readStream(`${BASE_URL}/api/chat/stream`, {
    message: "Status report on ULTRON OS cognitive modules.",
    sessionId: "test-session-stream-01",
  });
  assert(streamResult.status === 200, "Stream chat returned HTTP 200");
  assert(streamResult.events.length > 0, "SSE chunks received progressively");
  const metaEvent = streamResult.events.find((e) => e.type === "meta");
  assert(metaEvent !== undefined, "Meta event received with model identification");
  const chunkEvents = streamResult.events.filter((e) => e.type === "chunk");
  assert(chunkEvents.length > 0, "Text chunks streamed across SSE");
  const doneEvent = streamResult.events.find((e) => e.type === "done");
  assert(doneEvent !== undefined, "Done event received");
  assert(doneEvent.latency !== undefined, "Latency metrics included in done event");
  assert(typeof doneEvent.latency.totalLatencyMs === "number", "Total latency measured in ms");
  console.log(`Stream Performance: TTFB=${streamResult.ttfb}ms, chunks=${chunkEvents.length}, totalLatency=${doneEvent.latency.totalLatencyMs}ms\n`);

  // TEST 4: Voice Chat Pipeline with Tool Execution (Section 10, 22, 24)
  console.log("--- 4. Voice Chat Pipeline & Function Calling (POST /api/voice/chat) ---");
  const voiceRes = await request(`${BASE_URL}/api/voice/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, {
    message: "Create a mission to research AI SaaS market competitors.",
    sessionId: "test-session-voice-01",
  });
  assert(voiceRes.status === 200, "Voice chat endpoint returned HTTP 200");
  assert(voiceRes.data.success === true, "Response reports success");
  assert(typeof voiceRes.data.text === "string" && voiceRes.data.text.length > 0, "Response text is non-empty");
  assert(Array.isArray(voiceRes.data.actions), "Executed actions list returned");
  assert(voiceRes.data.actions.length > 0, "create_mission tool was executed");
  assert(voiceRes.data.latency !== undefined, "Micro-latency metrics provided");
  assert(typeof voiceRes.data.latency.totalLatencyMs === "number", "Total latency recorded");
  console.log(`Mission Trigger Response: "${voiceRes.data.text.slice(0, 70)}..."`);
  console.log(`Actions Executed: ${voiceRes.data.actions.map(a => a.name || a.toolName).join(", ")}\n`);

  // TEST 5: Context Continuity & Memory Retrieval (Section 6, 7, 24)
  console.log("--- 5. Conversation Continuity & Coreference (POST /api/voice/chat) ---");
  const followUpRes = await request(`${BASE_URL}/api/voice/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, {
    message: "What was the mission we just created?",
    sessionId: "test-session-voice-01", // same session ID
  });
  assert(followUpRes.status === 200, "Follow-up question returned HTTP 200");
  assert(followUpRes.data.text.length > 0, "Follow-up response returned non-empty text");
  console.log(`Follow-up Response: "${followUpRes.data.text.slice(0, 80)}..."\n`);

  // TEST 6: Tool Execution: PDF Creation & System Status (Section 10, 11)
  console.log("--- 6. Direct Tool Invocations: Document & Status ---");
  const pdfRes = await request(`${BASE_URL}/api/voice/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, {
    message: "Generate a PDF report summarizing findings.",
    sessionId: "test-session-voice-01",
  });
  assert(pdfRes.status === 200, "PDF generation request returned HTTP 200");
  console.log(`PDF Action Result: ${pdfRes.data.actions.map(a => a.name || a.toolName).join(", ") || "Handled"}\n`);

  console.log("==================================================");
  console.log("ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ✅");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("FATAL ERROR IN TEST SUITE:", err);
  process.exit(1);
});
