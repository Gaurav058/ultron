export type MissionStatus =
  | "CREATED"
  | "PLANNING"
  | "RUNNING"
  | "AWAITING_APPROVAL"
  | "PAUSED"
  | "VERIFYING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "ARCHIVED";

export type TaskStatus =
  | "QUEUED"
  | "RUNNING"
  | "AWAITING_APPROVAL"
  | "VERIFYING"
  | "COMPLETED"
  | "FAILED"
  | "BLOCKED"
  | "SKIPPED";

export type Priority = "P0" | "P1" | "P2" | "P3";

export interface EvidenceNode {
  id: string;
  sourceUri: string;
  title: string;
  snippet: string;
  confidence: number; // 0.00 to 1.00
  extractedAt: string;
  verifiedBy?: string;
  claimType: "FACT" | "INFERENCE" | "OPINION" | "UNVERIFIED_CLAIM";
}

export interface PolicyGate {
  id: string;
  action: string;
  target: string;
  reason: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  expectedResult: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  requestedBy: string;
  timestamp: string;
}

export interface VerificationAssertion {
  gate: "OBJECTIVE_MATCH" | "CODE_EXECUTION" | "FACT_CITATION" | "SECURITY_POLICY";
  status: "PASSED" | "FAILED" | "WARNING";
  score: number;
  details: string;
  timestamp: string;
}

export interface VerificationReport {
  overallStatus: "PENDING" | "VERIFIED" | "DRIFT_DETECTED" | "FAILED";
  assertions: VerificationAssertion[];
  realityCheckerSummary: string;
  completedAt?: string;
}

export interface MissionTask {
  id: string;
  missionId: string;
  title: string;
  description: string;
  assignedAgent: string;
  requiredSkills: string[];
  status: TaskStatus;
  dependencies: string[]; // IDs of predecessor tasks
  progress: number; // 0 to 100
  inputPayload?: Record<string, any>;
  outputData?: Record<string, any>;
  evidenceIds?: string[];
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface Mission {
  id: string;
  title: string;
  objective: string;
  status: MissionStatus;
  priority: Priority;
  tasks: MissionTask[];
  activeAgents: string[];
  evidenceLedger: EvidenceNode[];
  approvalQueue: PolicyGate[];
  verificationReport?: VerificationReport;
  budget: {
    tokenSpend: number;
    estimatedCostUsd: number;
    budgetLimitUsd?: number;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
