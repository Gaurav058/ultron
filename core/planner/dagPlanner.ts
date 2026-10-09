import { MissionTask, Priority } from "../types/mission";
import { ParsedIntent } from "../cognition/intentParser";

export function generateMissionDAG(intent: ParsedIntent, missionId: string): MissionTask[] {
  const timestamp = new Date().toISOString();

  if (intent.intentCategory === "TOOL") {
    const task1: MissionTask = {
      id: `${missionId}-t1`,
      missionId,
      title: "Tool Capability Resolution & Schema Validation",
      description: `Select eligible tool and validate input parameters against schema for: "${intent.objective}".`,
      assignedAgent: "ARCHITECT",
      requiredSkills: ["tool_registry", "schema_validation"],
      status: "QUEUED",
      dependencies: [],
      progress: 0,
      startedAt: timestamp,
    };

    const task2: MissionTask = {
      id: `${missionId}-t2`,
      missionId,
      title: "Permission & Sandbox Pre-Execution Check",
      description: "Verify risk level (L0-L3), check user consent gates, and isolate local execution bounds.",
      assignedAgent: "SECURITY",
      requiredSkills: ["permission_engine", "ssrf_guard"],
      status: "QUEUED",
      dependencies: [task1.id],
      progress: 0,
    };

    const task3: MissionTask = {
      id: `${missionId}-t3`,
      missionId,
      title: "Execute Sovereign Tool & Generate Output Artifact",
      description: "Perform local processing or external workflow launch; record byte measurements and outputs.",
      assignedAgent: "BUILDER",
      requiredSkills: ["tool_execution", "artifact_generation"],
      status: "QUEUED",
      dependencies: [task2.id],
      progress: 0,
    };

    const task4: MissionTask = {
      id: `${missionId}-t4`,
      missionId,
      title: "Verify Result & Record Provenance Ledger",
      description: "Verify actual artifact integrity, calculate compression savings or result status, and record provenance.",
      assignedAgent: "REALITY_CHECKER",
      requiredSkills: ["artifact_verification", "provenance_logging"],
      status: "QUEUED",
      dependencies: [task3.id],
      progress: 0,
    };

    return [task1, task2, task3, task4];
  }

  if (intent.intentCategory === "WORLD_MONITOR") {
    const task1: MissionTask = {
      id: `${missionId}-t1`,
      missionId,
      title: "Query World Monitor MCP & Discover Verified Feeds",
      description: `Query anonymous get_sources discovery endpoint for domain: "${intent.objective}".`,
      assignedAgent: "RESEARCHER",
      requiredSkills: ["mcp_discovery", "geopolitical_retrieval"],
      status: "QUEUED",
      dependencies: [],
      progress: 0,
      startedAt: timestamp,
    };

    const task2: MissionTask = {
      id: `${missionId}-t2`,
      missionId,
      title: "Correlate Multidomain Intelligence & Check Freshness",
      description: "Cross-reference conflict feeds, maritime choke points, and infrastructure data; audit freshness.",
      assignedAgent: "RESEARCHER",
      requiredSkills: ["evidence_corroboration", "freshness_check"],
      status: "QUEUED",
      dependencies: [task1.id],
      progress: 0,
    };

    const task3: MissionTask = {
      id: `${missionId}-t3`,
      missionId,
      title: "Synthesize Evidence-Linked Geopolitical Assessment",
      description: "Separate source-reported facts from inference; link original source URLs and geographical scopes.",
      assignedAgent: "ARCHITECT",
      requiredSkills: ["osint_synthesis", "provenance_tracking"],
      status: "QUEUED",
      dependencies: [task2.id],
      progress: 0,
    };

    const task4: MissionTask = {
      id: `${missionId}-t4`,
      missionId,
      title: "Reality Check & Provenance Verification",
      description: "Audit source freshness status, ensure zero fabricated claims, and commit to memory.",
      assignedAgent: "REALITY_CHECKER",
      requiredSkills: ["reality_verification", "memory_promotion"],
      status: "QUEUED",
      dependencies: [task3.id],
      progress: 0,
    };

    return [task1, task2, task3, task4];
  }

  if (intent.intentCategory === "CODING") {
    const task1: MissionTask = {
      id: `${missionId}-t1`,
      missionId,
      title: "Synthesize Technical Requirements & Architecture",
      description: `Analyze objective: "${intent.objective}". Generate modular component structure, data models, and API interfaces.`,
      assignedAgent: "ARCHITECT",
      requiredSkills: ["system_design", "typescript_patterns"],
      status: "QUEUED",
      dependencies: [],
      progress: 0,
      startedAt: timestamp,
    };

    const task2: MissionTask = {
      id: `${missionId}-t2`,
      missionId,
      title: "Implement Domain Logic & Component Suite",
      description: "Write clean, type-safe implementation code adhering to architectural invariants.",
      assignedAgent: "BUILDER",
      requiredSkills: ["code_synthesis", "nextjs", "react"],
      status: "QUEUED",
      dependencies: [task1.id],
      progress: 0,
    };

    const task3: MissionTask = {
      id: `${missionId}-t3`,
      missionId,
      title: "Perform Defensive Security & SAST Audit",
      description: "Static code analysis for secret scrubbing, input injection sanitization, and OWASP compliance.",
      assignedAgent: "SECURITY",
      requiredSkills: ["sast_audit", "vulnerability_scan"],
      status: "QUEUED",
      dependencies: [task2.id],
      progress: 0,
    };

    const task4: MissionTask = {
      id: `${missionId}-t4`,
      missionId,
      title: "Execute Test Suite in Ephemeral Sandbox",
      description: "Run deterministic unit and integration test assertions with zero-exit requirement.",
      assignedAgent: "REALITY_CHECKER",
      requiredSkills: ["sandbox_testing", "reality_verification"],
      status: "QUEUED",
      dependencies: [task3.id],
      progress: 0,
    };

    return [task1, task2, task3, task4];
  }

  if (intent.intentCategory === "SECURITY") {
    const task1: MissionTask = {
      id: `${missionId}-t1`,
      missionId,
      title: "Target Surface Reconnaissance & Scope Definition",
      description: `Define authorization perimeter and map asset surfaces for: "${intent.objective}".`,
      assignedAgent: "SECURITY",
      requiredSkills: ["threat_modeling", "scope_boundary"],
      status: "QUEUED",
      dependencies: [],
      progress: 0,
    };

    const task2: MissionTask = {
      id: `${missionId}-t2`,
      missionId,
      title: "Automated IOC & CVE Database Correlation",
      description: "Cross-reference dependencies against NVD, CISA KEV, and active advisory catalogs.",
      assignedAgent: "RESEARCHER",
      requiredSkills: ["cve_retrieval", "evidence_extraction"],
      status: "QUEUED",
      dependencies: [task1.id],
      progress: 0,
    };

    const task3: MissionTask = {
      id: `${missionId}-t3`,
      missionId,
      title: "Compile Defensive Remediation Matrix",
      description: "Generate actionable patches, config hardening steps, and MITRE ATT&CK mitigation mappings.",
      assignedAgent: "BUILDER",
      requiredSkills: ["security_remediation", "patch_synthesis"],
      status: "QUEUED",
      dependencies: [task2.id],
      progress: 0,
    };

    const task4: MissionTask = {
      id: `${missionId}-t4`,
      missionId,
      title: "Empirical Policy & Verification Gate",
      description: "Verify that zero unapproved offensive probes were executed and all findings are grounded in proof.",
      assignedAgent: "REALITY_CHECKER",
      requiredSkills: ["reality_verification", "policy_validation"],
      status: "QUEUED",
      dependencies: [task3.id],
      progress: 0,
    };

    return [task1, task2, task3, task4];
  }

  // Default: Research & Synthesis DAG
  const task1: MissionTask = {
    id: `${missionId}-t1`,
    missionId,
    title: "Multi-Source Query Expansion & Retrieval",
    description: `Query academic, web, and internal documentation indexes for: "${intent.objective}".`,
    assignedAgent: "RESEARCHER",
    requiredSkills: ["multi_source_search", "query_expansion"],
    status: "QUEUED",
    dependencies: [],
    progress: 0,
  };

  const task2: MissionTask = {
    id: `${missionId}-t2`,
    missionId,
    title: "Extract Atomic Claims & Score Sources",
    description: "Extract verifiable claims with confidence scoring; distinguish Fact from Opinion.",
    assignedAgent: "RESEARCHER",
    requiredSkills: ["evidence_extraction", "source_scoring"],
    status: "QUEUED",
    dependencies: [task1.id],
    progress: 0,
  };

  const task3: MissionTask = {
    id: `${missionId}-t3`,
    missionId,
    title: "Synthesize Comprehensive Intelligence Dossier",
    description: "Formulate verified executive brief with grounded citations and actionable findings.",
    assignedAgent: "ARCHITECT",
    requiredSkills: ["synthesis_reporting", "citation_formatting"],
    status: "QUEUED",
    dependencies: [task2.id],
    progress: 0,
  };

  const task4: MissionTask = {
    id: `${missionId}-t4`,
    missionId,
    title: "Reality Check & Long-Term Memory Promotion",
    description: "Empirically audit citations for reachability and promote verified facts into L4 memory.",
    assignedAgent: "REALITY_CHECKER",
    requiredSkills: ["citation_audit", "memory_promotion"],
    status: "QUEUED",
    dependencies: [task3.id],
    progress: 0,
  };

  return [task1, task2, task3, task4];
}
