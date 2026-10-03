export type ToolRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ToolCategory =
  | "SYSTEM"
  | "FILESYSTEM"
  | "NETWORK"
  | "SANDBOX"
  | "BROWSER"
  | "DEVICE"
  | "CODE"
  | "REPOSITORY"
  | "DATABASE"
  | "COMMUNICATION"
  | "PRODUCTIVITY";

export interface ToolParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description: string;
  required: boolean;
  default?: any;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  status: "ONLINE" | "STANDBY" | "REQUIRES_AUTH" | "NOT_CONFIGURED" | "DISABLED";
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean;
  permission: string;
  authentication: "NONE" | "API_KEY" | "OAUTH2" | "SYSTEM_CREDENTIAL" | "NOT_CONFIGURED";
  lastExecution?: string;
  executionCount: number;
  availability: "AVAILABLE" | "RESTRICTED" | "NOT_CONFIGURED";
  parameters: ToolParameter[];
  outputSchemaDescription: string;
  rateLimitPerMinute: number;
  isEnabled: boolean;
}

export interface ToolInvocation {
  id: string;
  toolId: string;
  callerAgentId: string;
  missionId?: string;
  taskId?: string;
  inputPayload: Record<string, any>;
  timestamp: string;
  approvedBy?: string;
}

export interface ToolExecutionResult {
  invocationId: string;
  toolId: string;
  success: boolean;
  outputData: any;
  executionDurationMs: number;
  error?: string;
  redactedFields: string[];
}
