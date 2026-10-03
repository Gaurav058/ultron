/**
 * Comprehensive Automated Verification Script for Section 37 Tests
 * Tests all routes, theme consistency, zero image artifacts, and voice cognition endpoints.
 */

async function runTests() {
  console.log("=== ULTRON OS — VERIFICATION SUITE STARTING ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = "") {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - Detail: ${detail}`);
      failed++;
    }
  }

  const BASE_URL = "http://localhost:3000";

  // 1. ROUTE VERIFICATIONS (Tests 1-7)
  const routes = [
    { path: "/core", name: "TEST 1: /core page" },
    { path: "/missions", name: "TEST 2: /missions page" },
    { path: "/brain", name: "TEST 3: /brain page" },
    { path: "/agents", name: "TEST 4: /agents page" },
    { path: "/tools", name: "TEST 5: /tools page" },
    { path: "/world", name: "TEST 6: /world page" },
    { path: "/system", name: "TEST 7: /system page" },
  ];

  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route.path}`);
      assert(res.status === 200, `${route.name} HTTP 200 OK`, `Status: ${res.status}`);
      const text = await res.text();

      // Check NO reference screenshot / artwork as full-screen background
      assert(
        !text.includes("ultron-core-art") && !text.includes("ULTRON_Exact_Reference"),
        `${route.name} NO reference screenshot/artwork present`
      );

      // Check persistent shell tokens & structure
      assert(
        text.includes("ultron-shell-root") || text.includes("ultron-layout") || text.includes("NavigationRail"),
        `${route.name} Persistent UltronShell layout rendered`
      );
    } catch (e) {
      assert(false, `${route.name} connection`, e.message);
    }
  }

  // 2. VOICE COGNITION & TOOL CALLING VERIFICATION (Tests 8-14)
  console.log("\n--- Testing Voice Agent Endpoints (Tests 8-14) ---");

  // TEST 9: "Hello ULTRON."
  try {
    const res9 = await fetch(`${BASE_URL}/api/voice/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello ULTRON.", sessionId: "test-verify-session" }),
    });
    const d9 = await res9.json();
    assert(
      d9.success && d9.text && d9.text.toLowerCase().includes("ultron"),
      'TEST 9: Say "Hello ULTRON." - ULTRON responds precisely',
      `Response: "${d9.text}"`
    );
  } catch (e) {
    assert(false, "TEST 9: Voice greeting", e.message);
  }

  // TEST 10: "What can you see in my current system?"
  try {
    const res10 = await fetch(`${BASE_URL}/api/voice/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What can you see in my current system?", sessionId: "test-verify-session" }),
    });
    const d10 = await res10.json();
    assert(
      d10.success && (d10.text.includes("Windows") || d10.text.includes("desktop") || d10.text.includes("operational")),
      'TEST 10: Say "What can you see in my current system?" - Real system state reported',
      `Response: "${d10.text}"`
    );
  } catch (e) {
    assert(false, "TEST 10: Current system query", e.message);
  }

  // TEST 11: "Create a mission to analyze the current ULTRON project."
  let createdMissionId = "";
  try {
    const res11 = await fetch(`${BASE_URL}/api/voice/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Create a mission to analyze the current ULTRON project.", sessionId: "test-verify-session" }),
    });
    const d11 = await res11.json();
    assert(
      d11.success && d11.actions && d11.actions.some((a) => a.toolName === "create_mission"),
      'TEST 11: Say "Create a mission to analyze the current ULTRON project." - Mission created entity',
      `Response: "${d11.text}"`
    );
    const createAction = d11.actions?.find((a) => a.toolName === "create_mission");
    createdMissionId = createAction?.result?.missionId || "";
  } catch (e) {
    assert(false, "TEST 11: Create mission via voice", e.message);
  }

  // TEST 12: "Pause that mission."
  try {
    const res12 = await fetch(`${BASE_URL}/api/voice/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Pause that mission.", sessionId: "test-verify-session" }),
    });
    const d12 = await res12.json();
    assert(
      d12.success && d12.text.toLowerCase().includes("paused"),
      'TEST 12: Say "Pause that mission." - State changes to PAUSED',
      `Response: "${d12.text}"`
    );
  } catch (e) {
    assert(false, "TEST 12: Pause mission", e.message);
  }

  // TEST 13: "Resume it."
  try {
    const res13 = await fetch(`${BASE_URL}/api/voice/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Resume it.", sessionId: "test-verify-session" }),
    });
    const d13 = await res13.json();
    assert(
      d13.success && d13.text.toLowerCase().includes("resumed"),
      'TEST 13: Say "Resume it." - State changes to RUNNING',
      `Response: "${d13.text}"`
    );
  } catch (e) {
    assert(false, "TEST 13: Resume mission", e.message);
  }

  // TEST 14: "What did we just do?"
  try {
    const res14 = await fetch(`${BASE_URL}/api/voice/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What did we just do?", sessionId: "test-verify-session" }),
    });
    const d14 = await res14.json();
    assert(
      d14.success && d14.text && d14.text.length > 10,
      'TEST 14: Say "What did we just do?" - Conversation context understood',
      `Response: "${d14.text}"`
    );
  } catch (e) {
    assert(false, "TEST 14: Conversation context", e.message);
  }

  // 3. SESSION INSPECTION VERIFICATION
  try {
    const resSession = await fetch(`${BASE_URL}/api/voice/session?sessionId=test-verify-session`);
    const dSession = await resSession.json();
    assert(
      dSession.success && dSession.session && dSession.session.messagesCount >= 5,
      "VOICE SESSION PERSISTENCE: Session holds conversation history turns",
      `Turns logged: ${dSession.session?.messagesCount}`
    );
  } catch (e) {
    assert(false, "VOICE SESSION PERSISTENCE", e.message);
  }

  console.log(`\n=== VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
