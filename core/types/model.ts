export type ModelProvider =
  | "OPENAI"
  | "ANTHROPIC"
  | "GEMINI"
  | "OPENROUTER"
  | "OLLAMA_LOCAL"
  | "LM_STUDIO_LOCAL";

export type WorkloadCategory =
  | "FAST_INTERACTION"
  | "DEEP_REASONING"
  | "CODE_SYNTHESIS"
  | "MULTIMODAL_VISION"
  | "CLASSIFIED_OFFLINE";

export interface ModelProfile {
  id: string;
  provider: ModelProvider;
  modelIdentifier: string;
  displayName: string;
  contextWindow: number;
  costPer1kInputTokens: number;
  costPer1kOutputTokens: number;
  avgLatencyMs: number;
  isAvailable: boolean;
  isLocal: boolean;
}

export interface ModelRouteRequest {
  workload: WorkloadCategory;
  promptLengthEst: number;
  maxTokensRequired?: number;
  privacyStrict: boolean; // if true, forces local model
  requiresReasoning: boolean;
}

export interface ModelRouteDecision {
  selectedModel: ModelProfile;
  fallbackChain: ModelProfile[];
  estimatedCostUsd: number;
  rationale: string;
}
