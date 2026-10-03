export type AgentRole =
  | "CONDUCTOR"
  | "RESEARCHER"
  | "BUILDER"
  | "DESIGNER"
  | "SECURITY"
  | "QA"
  | "REALITY_CHECKER"
  | "MEMORY_CURATOR"
  | "DEVOPS"
  | "ANALYST"
  | "ARCHITECT"
  | "DEVICE_AGENT"
  | "SPECIALIST";

export type AgentExecutionStatus =
  | "IDLE"
  | "READY"
  | "RUNNING"
  | "WAITING"
  | "BLOCKED"
  | "FAILED"
  | "THINKING"
  | "EXECUTING"
  | "AWAITING_APPROVAL"
  | "ERROR";

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
  domain?: string;
  description: string;
  status: AgentExecutionStatus;
  currentTask?: string;
  currentTaskId?: string;
  currentMissionId?: string;
  lastActivity?: string;
  capabilities: string[];
  tools: string[];
  permissions: string[];
  requiredSkills?: string[];
  allowedTools: string[];
  prohibitedTools: string[];
  systemPrompt: string;
  avatarColor?: string;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  metrics: AgentMetrics;
}
