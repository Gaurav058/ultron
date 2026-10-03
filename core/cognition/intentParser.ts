export interface ParsedIntent {
  rawInput: string;
  isMission: boolean;
  intentCategory: "RESEARCH" | "CODING" | "SECURITY" | "WORLD" | "SYSTEM" | "CONVERSATION";
  title: string;
  objective: string;
  suggestedPriority: "P0" | "P1" | "P2" | "P3";
  requiredCapabilities: string[];
  estimatedComplexity: "SIMPLE" | "MODERATE" | "COMPLEX";
  requiresApproval: boolean;
}

export function parseIntent(input: string): ParsedIntent {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Keyword heuristic matrix with word boundaries
  const isCodeBuild = /\b(build|code|develop|refactor|implement|create microservice|component|script)\b/i.test(lower);
  const isSecurity = /\b(vulnerability|cve|threat|attack|exploit|security audit|firewall|pentest|penetration)\b/i.test(lower);
  const isResearch = /\b(research|analyze|investigate|study|compare|market report|competitors|findings)\b/i.test(lower);
  const isSystem = /\b(status|health|diagnostic|doctor|cpu|memory|vitals|device nodes)\b/i.test(lower);
  const isWorld = /\b(global|earthquake|iss|weather|market prices|satellite|spatial)\b/i.test(lower);

  let category: ParsedIntent["intentCategory"] = "CONVERSATION";
  let isMission = false;
  let complexity: ParsedIntent["estimatedComplexity"] = "SIMPLE";
  let priority: ParsedIntent["suggestedPriority"] = "P2";
  let requiresApproval = false;
  const capabilities: string[] = [];

  if (isCodeBuild) {
    category = "CODING";
    isMission = true;
    complexity = "COMPLEX";
    priority = "P1";
    capabilities.push("ast_generation", "sandbox_execution", "test_verification");
  } else if (isSecurity) {
    category = "SECURITY";
    isMission = true;
    complexity = "COMPLEX";
    priority = "P0";
    requiresApproval = true;
    capabilities.push("vulnerability_analysis", "sast_audit", "defensive_posture");
  } else if (isResearch) {
    category = "RESEARCH";
    isMission = true;
    complexity = "MODERATE";
    priority = "P1";
    capabilities.push("multi_source_search", "evidence_extraction", "citation_graph");
  } else if (isSystem) {
    category = "SYSTEM";
    isMission = false;
    capabilities.push("system_telemetry", "doctor_diagnostics");
  } else if (isWorld) {
    category = "WORLD";
    isMission = false;
    capabilities.push("spatial_telemetry", "public_feeds");
  } else if (trimmed.split(" ").length > 8) {
    isMission = true;
    category = "RESEARCH";
    complexity = "MODERATE";
    capabilities.push("contextual_reasoning", "knowledge_retrieval");
  }

  // Derive title from intent
  const firstSentence = trimmed.split(/[.?!]/)[0] || trimmed;
  const title = firstSentence.length > 50 ? `${firstSentence.substring(0, 47)}...` : firstSentence;

  return {
    rawInput: trimmed,
    isMission,
    intentCategory: category,
    title,
    objective: trimmed,
    suggestedPriority: priority,
    requiredCapabilities: capabilities,
    estimatedComplexity: complexity,
    requiresApproval,
  };
}
