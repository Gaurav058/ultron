export type AgentRole =
  | "CONDUCTOR"
  | "RESEARCHER"
  | "ARCHITECT"
  | "BUILDER"
  | "DESIGNER"
  | "SECURITY"
  | "REALITY_CHECKER"
  | "MEMORY_CURATOR"
  | "DEVICE_AGENT"
  | "SPECIALIST";

export type AgentExecutionStatus = "IDLE" | "THINKING" | "EXECUTING" | "AWAITING_APPROVAL" | "BLOCKED" | "ERROR";

export interface AgentMetrics {
  totalTasksCompleted: number;
  totalTokensUsed: number;
  totalCostUsd: number;
  successRate: number; // 0.00 to 1.00
  avgDurationSec: number;
  verificationPassRate: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: AgentRole;
  domain: string;
  description: string;
  avatarColor: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  capabilities: string[];
  requiredSkills: string[];
  allowedTools: string[];
  prohibitedTools: string[];
  systemPrompt: string;
  status: AgentExecutionStatus;
  currentTaskId?: string;
  currentMissionId?: string;
  metrics: AgentMetrics;
}
