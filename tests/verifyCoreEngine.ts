import { parseIntent } from "../core/cognition/intentParser";
import { generateMissionDAG } from "../core/planner/dagPlanner";
import { ModelRouter } from "../core/model-router/modelRouter";
import { RealityChecker } from "../core/verification/realityChecker";
import { MemoryEngine } from "../core/memory/memoryEngine";
import { ToolRegistry } from "../core/tools/toolRegistry";
import { UltronDoctor } from "../core/runtime/ultronDoctor";
import { Mission } from "../core/types/mission";

async function runTests() {
  console.log("=== ULTRON V2 CORE ENGINE VERIFICATION SUITE ===\n");
  let passCount = 0;
  let testCount = 0;

  function assert(condition: boolean, testName: string) {
    testCount++;
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passCount++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  // 1. Intent Parser Tests
  const codingIntent = parseIntent("Build a production authentication microservice with JWT and rate limiting");
  assert(codingIntent.isMission === true, "Intent Parser: Detects coding mission");
  assert(codingIntent.intentCategory === "CODING", "Intent Parser: Categorizes as CODING");
  assert(codingIntent.requiredCapabilities.includes("ast_generation"), "Intent Parser: Maps required capabilities");

  const securityIntent = parseIntent("Perform vulnerability audit and CVE analysis on current dependencies");
  assert(securityIntent.intentCategory === "SECURITY", "Intent Parser: Categorizes as SECURITY");
  assert(securityIntent.requiresApproval === true, "Intent Parser: Flags security for approval gating");

  // 2. DAG Planner Tests
  const dag = generateMissionDAG(codingIntent, "test-m1");
  assert(dag.length === 4, "DAG Planner: Compiles 4 sequential/parallel task nodes");
  assert(dag[1].dependencies.includes(dag[0].id), "DAG Planner: Enforces task dependency graph");
  assert(dag[3].assignedAgent === "REALITY_CHECKER", "DAG Planner: Final task assigned to Reality Checker");

  // 3. Model Router Tests
  const codeDecision = ModelRouter.route({
    workload: "CODE_SYNTHESIS",
    promptLengthEst: 1500,
    privacyStrict: false,
    requiresReasoning: true,
  });
  assert(codeDecision.selectedModel.provider === "ANTHROPIC", "Model Router: Selects Claude 3.5 Sonnet for code");
  assert(codeDecision.fallbackChain.length > 0, "Model Router: Generates robust fallback chain");

  const privateDecision = ModelRouter.route({
    workload: "DEEP_REASONING",
    promptLengthEst: 2000,
    privacyStrict: true,
    requiresReasoning: true,
  });
  assert(privateDecision.selectedModel.isLocal === true, "Model Router: Enforces local model on privacy boundary");

  // 4. Memory Engine Tests
  const l4Memories = MemoryEngine.getNodes("L4_LONGTERM");
  assert(l4Memories.length >= 2, "Memory Engine: Retrieves durable L4 memories");
  const promoted = MemoryEngine.promoteClaimToDurableFact(
    {
      id: "claim-1",
      sourceText: "Verified that Next.js 16 requires 'use client' for Three.js canvases.",
      atomicClaim: "Next.js 16 Three.js boundary",
      confidenceScore: 0.96,
      evidence: ["https://nextjs.org/docs/app"],
      proposedTier: "L4_LONGTERM",
      validated: true,
    },
    "agent-builder"
  );
  assert(promoted !== null && promoted.tier === "L4_LONGTERM", "Memory Engine: Promotes validated claims to L4");

  // 5. Tool Registry Tests
  const tools = ToolRegistry.getTools();
  assert(tools.length >= 5, "Tool Registry: Registers built-in MCP tools");
  const telemetryResult = await ToolRegistry.executeTool({
    id: "inv-1",
    toolId: "system_telemetry",
    callerAgentId: "agent-conductor",
    inputPayload: {},
    timestamp: new Date().toISOString(),
  });
  assert(telemetryResult.success === true, "Tool Registry: Executes system_telemetry tool");

  // High-risk tool without approval should fail
  const blockedSandbox = await ToolRegistry.executeTool({
    id: "inv-2",
    toolId: "sandbox_terminal",
    callerAgentId: "agent-builder",
    inputPayload: { command: "rm -rf /" },
    timestamp: new Date().toISOString(),
  });
  assert(blockedSandbox.success === false, "Tool Registry: Blocks high-risk tool without explicit approval");

  // 6. Reality Checker Tests
  const mockMission: Mission = {
    id: "m-audit-test",
    title: "Test Mission",
    objective: "Verify reality checks",
    status: "RUNNING",
    priority: "P1",
    tasks: dag.map((t, idx) => ({
      ...t,
      status: idx < 3 ? "COMPLETED" : "RUNNING",
      progress: idx < 3 ? 100 : 50,
    })),
    activeAgents: ["ARCHITECT", "BUILDER", "SECURITY", "REALITY_CHECKER"],
    evidenceLedger: [
      {
        id: "ev-1",
        sourceUri: "https://github.com",
        title: "Test Evidence",
        snippet: "Verified code",
        confidence: 0.95,
        claimType: "FACT",
        extractedAt: new Date().toISOString(),
      },
    ],
    approvalQueue: [],
    budget: { tokenSpend: 5000, estimatedCostUsd: 0.05 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const report = RealityChecker.auditMission(mockMission);
  assert(report.assertions.length === 4, "Reality Checker: Evaluates 4 empirical verification gates");

  // 7. Ultron Doctor Tests
  const doctorReport = await UltronDoctor.runDiagnostics();
  assert(doctorReport.checks.length >= 5, "Ultron Doctor: Executes 6 subsystem health checks");
  assert(doctorReport.overallHealth === "HEALTHY", "Ultron Doctor: Reports overall healthy status");

  console.log(`\n=== RESULT: ${passCount}/${testCount} TESTS PASSED ===\n`);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
