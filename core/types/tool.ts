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

export type ToolExecutionMode = "local" | "approved_api" | "user_opened_website";

export type ToolPricingStatus = "free_core" | "freemium" | "paid" | "unverified";

export type ToolAutomationPermission =
  | "approved"
  | "user_interaction_required"
  | "unverified";

export type ToolHubCategory =
  | "Image & Design"
  | "Developer Tools"
  | "Research & Learning"
  | "Computational Tools"
  | "Security"
  | "Media Discovery"
  | "Global Intelligence";

export type ToolAvailabilityStatus =
  | "AVAILABLE"
  | "RESTRICTED"
  | "REQUIRES_CREDENTIAL"
  | "EXCLUDED";

export type ToolHealthStatus = "OPERATIONAL" | "DEGRADED" | "UNAVAILABLE" | "UNKNOWN";

export type SecurityRiskLevel = "L0" | "L1" | "L2" | "L3";

export type ToolActionType =
  | "LAUNCH_EXTERNAL"
  | "LOCAL_IMAGE_COMPRESS"
  | "HIBP_BREACH_CHECK"
  | "GUTENBERG_SEARCH"
  | "WAYBACK_SEARCH"
  | "WORLD_MONITOR_DISCOVERY"
  | "ALTERNATIVE_SEARCH";

export interface FreeToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolHubCategory;
  websiteUrl: string;
  documentationUrl: string;
  executionMode: ToolExecutionMode;
  pricingStatus: ToolPricingStatus;
  subscriptionRequiredForIntendedUse: boolean;
  automationPermission: ToolAutomationPermission;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  requiredPermissions: string[];
  supportedPlatforms: string[];
  availabilityStatus: ToolAvailabilityStatus;
  limitations: string[];
  lastVerifiedAt: string;
  termsUrl: string;
  healthStatus: ToolHealthStatus;
  riskLevel: SecurityRiskLevel;
  actionType: ToolActionType;
  excludedReason?: string;
}

