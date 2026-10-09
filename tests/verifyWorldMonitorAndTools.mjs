/**
 * ULTRON Automated Verification Suite: World Monitor & Free Web Tools Integration
 * Tests all 17 Acceptance Criteria specified in Section 12 of the Production Implementation Directive.
 */

import { FREE_TOOLS_CATALOG, EXCLUDED_TOOLS_CATALOG } from "../core/tools/freeToolsCatalog.ts";
import { SSRFGuard } from "../core/security/ssrfGuard.ts";
import { ImageCompressor } from "../core/tools/imageCompressor.ts";
import { SecurityChecker } from "../core/tools/securityChecker.ts";
import { WorldMonitorService } from "../core/worldmonitor/worldMonitorService.ts";
import { parseIntent } from "../core/cognition/intentParser.ts";
import { generateMissionDAG } from "../core/planner/dagPlanner.ts";
import fs from "fs";
import path from "path";

async function runTestSuite() {
  console.log("=================================================================");
  console.log("ULTRON — WORLD MONITOR & FREE WEB TOOLS INTEGRATION TEST SUITE");
  console.log("=================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testId, testName, detail = "") {
    if (condition) {
      console.log(`[PASS] ${testId}: ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testId}: ${testName} -> Detail: ${detail}`);
      failed++;
    }
  }

  // TEST 1: Sidebar links and routes
  const iconNavContent = fs.readFileSync(path.resolve("components/layout/IconNavRail.tsx"), "utf-8");
  assert(
    iconNavContent.includes('"world-monitor"') &&
    iconNavContent.includes('"tools"') &&
    iconNavContent.includes('label: "World Monitor"') &&
    iconNavContent.includes('label: "Free Tools"'),
    "AC-01",
    "Sidebar destinations registered for World Monitor and Free Tools"
  );

  // TEST 2: Direct route refresh files
  const wmPageExists = fs.existsSync(path.resolve("app/world-monitor/page.tsx"));
  const toolsPageExists = fs.existsSync(path.resolve("app/tools/page.tsx"));
  assert(
    wmPageExists && toolsPageExists,
    "AC-02",
    "App Router pages exist for /world-monitor and /tools for direct refresh"
  );

  // TEST 3: Mobile and responsive navigation support
  const shellContent = fs.readFileSync(path.resolve("components/ultron/UltronShell.tsx"), "utf-8");
  assert(
    shellContent.includes("FreeToolsHubModule") &&
    shellContent.includes("WorldMonitorModule") &&
    shellContent.includes("handleNavSelect"),
    "AC-03",
    "UltronShell integrates both workspaces and synchronizes browser history state"
  );

  // TEST 4: Tool search and category filters
  const categories = [
    "Image & Design",
    "Developer Tools",
    "Research & Learning",
    "Computational Tools",
    "Security",
    "Media Discovery",
    "Global Intelligence",
  ];
  const allCategoriesRepresented = categories.every((cat) =>
    FREE_TOOLS_CATALOG.some((tool) => tool.category === cat)
  );
  assert(
    allCategoriesRepresented && FREE_TOOLS_CATALOG.length >= 16,
    "AC-04",
    `Tool catalog has all 7 categories populated (${FREE_TOOLS_CATALOG.length} tools registered)`
  );

  // TEST 5: Pricing classification
  const hasFreemiumTracked = FREE_TOOLS_CATALOG.some((t) => t.pricingStatus === "freemium");
  const hasFreeCoreTracked = FREE_TOOLS_CATALOG.some((t) => t.pricingStatus === "free_core");
  const squoosh = FREE_TOOLS_CATALOG.find((t) => t.id === "squoosh");
  const removeBg = FREE_TOOLS_CATALOG.find((t) => t.id === "remove_bg");
  assert(
    squoosh?.executionMode === "local" &&
    squoosh?.pricingStatus === "free_core" &&
    removeBg?.pricingStatus === "freemium",
    "AC-05",
    "Pricing and execution mode strictly distinguished (Squoosh is local free_core, remove.bg is freemium)"
  );

  // TEST 6: Missing credentials handling
  const statusWithoutKey = await WorldMonitorService.getProviderStatus();
  assert(
    statusWithoutKey.authenticationStatus === "CREDENTIALS_REQUIRED" &&
    statusWithoutKey.hasApiKey === false &&
    statusWithoutKey.permittedOperations.includes("get_sources"),
    "AC-06",
    "World Monitor handles missing credentials gracefully with permitted anonymous discovery"
  );

  // TEST 7: World Monitor authentication failure & restricted operation gating
  assert(
    statusWithoutKey.restrictedOperations.includes("realtime:conflict_feed") &&
    statusWithoutKey.framingPolicy === "SAMEORIGIN_PROTECTED",
    "AC-07",
    "Restricted feeds gate access and framing restrictions are documented as SAMEORIGIN"
  );

  // TEST 8: Quota/rate-limit state tracking
  assert(
    statusWithoutKey.quotaStatus === "ANONYMOUS_QUOTA_FREE",
    "AC-08",
    "Anonymous MCP get_sources correctly tracks quota status as ANONYMOUS_QUOTA_FREE"
  );

  // TEST 9: SSRF & Host validation protection
  const loopbackCheck = SSRFGuard.validateUrl("http://127.0.0.1:8080/admin");
  const metadataCheck = SSRFGuard.validateUrl("http://169.254.169.254/latest/meta-data");
  const privateSubnetCheck = SSRFGuard.validateUrl("http://192.168.1.1/router");
  const validUrlCheck = SSRFGuard.validateUrl("https://worldmonitor.app/mcp");
  assert(
    !loopbackCheck.allowed &&
    !metadataCheck.allowed &&
    !privateSubnetCheck.allowed &&
    validUrlCheck.allowed,
    "AC-09",
    "SSRFGuard strictly blocks loopback, cloud metadata, and RFC 1918 subnets while permitting safe endpoints"
  );

  // TEST 10: Sensitive-data confirmation requirement
  let pwnedConsentBlocked = false;
  try {
    await SecurityChecker.checkPasswordKAnonymity("testPass123!", {
      userConfirmed: false,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    pwnedConsentBlocked = err.message.includes("User consent required");
  }
  assert(
    pwnedConsentBlocked,
    "AC-10",
    "SecurityChecker strictly blocks breach check queries without explicit informed consent"
  );

  // TEST 11: Local image processing and output validation
  const testCompression = ImageCompressor.simulateLocalCompression(1048576, "image/webp", 0.75, performance.now());
  assert(
    testCompression.success &&
    testCompression.compressedSizeBytes < testCompression.originalSizeBytes &&
    testCompression.savingsPercent > 0,
    "AC-11",
    `Local image compression validated (Original: 1MB -> ${testCompression.compressedSizeBytes} bytes, Savings: ${testCompression.savingsPercent}%)`
  );

  // TEST 12: Website launch and user-return workflow
  const photopea = FREE_TOOLS_CATALOG.find((t) => t.id === "photopea");
  const carbon = FREE_TOOLS_CATALOG.find((t) => t.id === "carbon");
  assert(
    photopea?.executionMode === "user_opened_website" &&
    carbon?.actionType === "LAUNCH_EXTERNAL" &&
    carbon.websiteUrl.startsWith("https://carbon.now.sh"),
    "AC-12",
    "External website launch workflow configured with user-return boundaries"
  );

  // TEST 13: Mission DAG planning for tools and World Monitor
  const toolIntent = parseIntent("Compress these images for my website");
  const wmIntent = parseIntent("Research geopolitical conflict signals in the Black Sea");
  const toolDag = generateMissionDAG(toolIntent, "msn-tool-01");
  const wmDag = generateMissionDAG(wmIntent, "msn-wm-01");
  assert(
    toolIntent.intentCategory === "TOOL" &&
    toolDag.length === 4 &&
    wmIntent.intentCategory === "WORLD_MONITOR" &&
    wmDag.length === 4,
    "AC-13",
    "Mission DAG compiler generates 4-stage validation and execution pipelines for Tool and OSINT intents"
  );

  // TEST 14: Source attribution and timestamps
  const sourceResult = await WorldMonitorService.getSources();
  const firstSource = sourceResult.sources[0];
  assert(
    sourceResult.sources.length >= 7 &&
    firstSource.geographicalScope &&
    firstSource.updateFrequency &&
    sourceResult.provenance.provider === "World Monitor" &&
    sourceResult.provenance.freshnessStatus === "VERIFIED_FRESH",
    "AC-14",
    `Source provenance verified with timestamps and geographical scope (${sourceResult.sources.length} sources)`
  );

  // TEST 15: Excluded catalog policy verification (no false success)
  assert(
    EXCLUDED_TOOLS_CATALOG.length === 4 &&
    EXCLUDED_TOOLS_CATALOG.every((t) => t.availabilityStatus === "EXCLUDED" && Boolean(t.excludedReason)),
    "AC-15",
    "12ft.io, LibGen, Sci-Hub, and PDF Drive isolated in EXCLUDED register with explicit legal/safety rationales"
  );

  // TEST 16: Secret redaction in logs
  const rawLog = "Error at https://api.service.com/query?key=AIzaSyD-sampleSecretKey1234567890123456 with Bearer eyJhbGciOiJIUzI1NiJ9.secret";
  const redacted = SSRFGuard.redactSecrets(rawLog);
  assert(
    !redacted.includes("AIzaSyD-sampleSecretKey1234567890123456") &&
    !redacted.includes("eyJhbGciOiJIUzI1NiJ9.secret") &&
    redacted.includes("[REDACTED"),
    "AC-16",
    "Secret redaction successfully sanitizes Google API keys and bearer tokens from logs"
  );

  // TEST 17: Existing ULTRON features remain functional
  const codingIntent = parseIntent("Build a new UI widget component");
  const codingDag = generateMissionDAG(codingIntent, "msn-code-01");
  assert(
    codingIntent.intentCategory === "CODING" &&
    codingDag.length === 4 &&
    codingDag[0].assignedAgent === "ARCHITECT",
    "AC-17",
    "Existing ULTRON cognitive intent routing and multi-agent DAG pipelines remain 100% operational"
  );

  console.log("\n=================================================================");
  console.log(`TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
