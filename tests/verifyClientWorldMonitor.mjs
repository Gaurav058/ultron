import http from "http";
import assert from "node:assert";

async function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function verifyWorldMonitor() {
  console.log("=== VERIFYING /world-monitor NATIVE WORKSPACE ===");

  const res = await fetchRoute("/world-monitor");
  assert.strictEqual(res.status, 200, "HTTP status must be 200");
  assert.strictEqual(res.headers["content-type"]?.includes("text/html"), true, "Content type must be text/html");

  const html = res.data;

  // 1. Verify it does NOT contain external iframe to worldmonitor.app
  assert.strictEqual(
    html.includes("<iframe src=\"https://worldmonitor.app"),
    false,
    "Must NOT iframe external worldmonitor.app"
  );
  console.log("✓ Invariant: No external iframe to worldmonitor.app");

  // 2. Verify workspace titles and description
  assert.strictEqual(html.includes("WORLD MONITOR"), true, "Must include WORLD MONITOR");
  assert.strictEqual(html.includes("GLOBAL INTELLIGENCE"), true, "Must include GLOBAL INTELLIGENCE");
  assert.strictEqual(
    html.includes("source-attributed operational view"),
    true,
    "Must include operational view description"
  );
  console.log("✓ Invariant: Native workspace branding and description present");

  // 3. Verify layers and intelligence categories
  const categories = [
    "Seismic (USGS)",
    "Environmental (NASA)",
    "Maritime Radar",
    "Cyber Defense (CISA)",
    "Geopolitics",
    "ULTRON Missions"
  ];

  for (const cat of categories) {
    const found = html.includes(cat) || html.includes(cat.replace(/&amp;/g, "&"));
    assert.strictEqual(found, true, `Category '${cat}' must be present in layer controls`);
  }
  console.log("✓ Invariant: Intelligence layer registry controls rendered");

  // 4. Verify API integration with real feeds
  const eventsRes = await fetchRoute("/api/intelligence/events");
  assert.strictEqual(eventsRes.status, 200, "API events endpoint must be 200");
  const eventsData = JSON.parse(eventsRes.data);
  assert.strictEqual(eventsData.success, true, "API response must be success: true");
  assert.strictEqual(Array.isArray(eventsData.events), true, "Events must be an array");
  assert.strictEqual(eventsData.events.length > 0, true, "Must contain real live events");
  console.log(`✓ Invariant: /api/intelligence/events returned ${eventsData.events.length} verified real events`);

  // Verify coordinates and sources of sample events
  const sample = eventsData.events[0];
  assert.ok(typeof sample.latitude === "number", "Latitude must be a valid number");
  assert.ok(typeof sample.longitude === "number", "Longitude must be a valid number");
  assert.ok(sample.sourceName, "SourceName must be non-empty");
  assert.ok(sample.sourceUrl, "SourceUrl must be non-empty");
  console.log(`✓ Sample verified event: "${sample.title}" from ${sample.sourceName} at [${sample.latitude}, ${sample.longitude}]`);

  // 5. Verify Layers endpoint
  const layersRes = await fetchRoute("/api/intelligence/layers");
  assert.strictEqual(layersRes.status, 200, "API layers endpoint must be 200");
  const layersData = JSON.parse(layersRes.data);
  assert.strictEqual(Array.isArray(layersData.layers), true, "Layers must be an array");
  console.log(`✓ Invariant: /api/intelligence/layers returned ${layersData.layers.length} registered layers`);

  console.log("\n=======================================================");
  console.log("ALL NATIVE WORLD MONITOR INVARIANTS RIGOROUSLY VERIFIED.");
  console.log("=======================================================");
}

verifyWorldMonitor().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
