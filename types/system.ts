export type SubsystemHealth = "online" | "degraded" | "offline" | "unknown";

export interface SystemStatus {
  core: SubsystemHealth;
  api: SubsystemHealth;
  database: SubsystemHealth;
  memory: SubsystemHealth;
  agentRuntime: SubsystemHealth;
  toolFabric: SubsystemHealth;
  eventBus: SubsystemHealth;
  webSocket?: SubsystemHealth;
  scheduler?: SubsystemHealth;
  researchEngine?: SubsystemHealth;
  googleSearch?: SubsystemHealth;
  youtube?: SubsystemHealth;
  maps?: SubsystemHealth;
  verification?: SubsystemHealth;
}

export interface SubsystemDetail {
  name: string;
  status: SubsystemHealth;
  latencyMs?: number;
  message?: string;
  lastChecked: string;
}

export interface SystemHealthReport {
  overall: SubsystemHealth;
  status: SystemStatus;
  subsystems: Record<string, SubsystemDetail>;
  timestamp: string;
}

export interface SystemInfoMetadata {
  model: string;
  contextWindow: string;
  voiceModel: string;
  uptime: string;
  environment: "Production" | "Development" | "Staging";
  activeKeyConfigured?: boolean;
}
