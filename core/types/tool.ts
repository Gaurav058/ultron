export type ToolRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

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
  category: "SYSTEM" | "FILESYSTEM" | "NETWORK" | "SANDBOX" | "BROWSER" | "DEVICE";
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean;
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
