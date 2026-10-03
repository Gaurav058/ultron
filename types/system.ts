export interface SystemStatus {
  api: "online" | "offline" | "unknown";
  database: "online" | "offline" | "unknown";
  memory: "online" | "offline" | "unknown";
  agentRuntime: "online" | "offline" | "unknown";
  toolFabric: "online" | "offline" | "unknown";
  eventBus: "online" | "offline" | "unknown";
  webSocket?: "online" | "offline" | "unknown";
  core?: "online" | "offline" | "unknown";
}

export interface SystemInfoMetadata {
  model: string;
  contextWindow: string;
  voiceModel: string;
  uptime: string;
  environment: "Production" | "Development" | "Staging";
}
