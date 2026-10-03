export interface SystemVitals {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  activeAgentsCount: number;
  activeMissionsCount: number;
  pendingApprovalsCount: number;
  uptimeSeconds: number;
  vectorDbStatus: "HEALTHY" | "DEGRADED" | "OFFLINE";
  modelRouterStatus: "ONLINE" | "FALLBACK_ACTIVE" | "OFFLINE";
  networkLatencyMs: number;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: "DESKTOP" | "IOS_TACTICAL" | "ANDROID_EDGE" | "CLI_TERMINAL";
  ipAddress: string;
  status: "ONLINE" | "STANDBY" | "DISCONNECTED";
  lastSyncTimestamp: string;
  batteryLevel?: number;
  capabilities: string[];
}

export interface DoctorCheckResult {
  category: "DATABASE" | "MODEL_PROVIDERS" | "MCP_TOOLS" | "SANDBOX" | "STORAGE" | "PERMISSIONS";
  name: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  message: string;
  remediationAdvice?: string;
  latencyMs?: number;
}

export interface UltronDoctorReport {
  overallHealth: "HEALTHY" | "WARNING" | "CRITICAL";
  timestamp: string;
  checks: DoctorCheckResult[];
  summary: string;
}
