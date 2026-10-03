import {
  ModelProfile,
  ModelRouteDecision,
  ModelRouteRequest,
  WorkloadCategory,
} from "../types/model";

export const REGISTERED_MODELS: ModelProfile[] = [
  {
    id: "gemini-1-5-pro",
    provider: "GEMINI",
    modelIdentifier: "gemini-1.5-pro",
    displayName: "Gemini 1.5 Pro (Multimodal & Reasoning)",
    contextWindow: 2000000,
    costPer1kInputTokens: 0.00125,
    costPer1kOutputTokens: 0.005,
    avgLatencyMs: 380,
    isAvailable: true,
    isLocal: false,
  },
  {
    id: "claude-3-5-sonnet",
    provider: "ANTHROPIC",
    modelIdentifier: "claude-3-5-sonnet-20241022",
    displayName: "Claude 3.5 Sonnet (System Architecture & Coding)",
    contextWindow: 200000,
    costPer1kInputTokens: 0.003,
    costPer1kOutputTokens: 0.015,
    avgLatencyMs: 420,
    isAvailable: true,
    isLocal: false,
  },
  {
    id: "gpt-4o",
    provider: "OPENAI",
    modelIdentifier: "gpt-4o",
    displayName: "GPT-4o Omni (Omnimodal & Rapid Planning)",
    contextWindow: 128000,
    costPer1kInputTokens: 0.0025,
    costPer1kOutputTokens: 0.01,
    avgLatencyMs: 320,
    isAvailable: true,
    isLocal: false,
  },
  {
    id: "gemini-1-5-flash",
    provider: "GEMINI",
    modelIdentifier: "gemini-1.5-flash",
    displayName: "Gemini 1.5 Flash (Ultra-Low Latency & Voice)",
    contextWindow: 1000000,
    costPer1kInputTokens: 0.000075,
    costPer1kOutputTokens: 0.0003,
    avgLatencyMs: 140,
    isAvailable: true,
    isLocal: false,
  },
  {
    id: "ollama-qwen-coder",
    provider: "OLLAMA_LOCAL",
    modelIdentifier: "qwen2.5-coder:14b",
    displayName: "Qwen 2.5 Coder 14B (Zero-Egress Airgapped)",
    contextWindow: 32768,
    costPer1kInputTokens: 0,
    costPer1kOutputTokens: 0,
    avgLatencyMs: 290,
    isAvailable: true,
    isLocal: true,
  },
  {
    id: "ollama-llama-3-3",
    provider: "OLLAMA_LOCAL",
    modelIdentifier: "llama3.3:70b-instruct-q4_K_M",
    displayName: "Llama 3.3 70B Local (Private Reasoning)",
    contextWindow: 65536,
    costPer1kInputTokens: 0,
    costPer1kOutputTokens: 0,
    avgLatencyMs: 650,
    isAvailable: true,
    isLocal: true,
  },
];

export class ModelRouter {
  public static route(request: ModelRouteRequest): ModelRouteDecision {
    // 1. Strict Privacy Constraint: enforce local airgapped models
    if (request.privacyStrict) {
      const localModels = REGISTERED_MODELS.filter((m) => m.isLocal && m.isAvailable);
      const selected =
        request.workload === "CODE_SYNTHESIS"
          ? localModels.find((m) => m.id === "ollama-qwen-coder") || localModels[0]
          : localModels.find((m) => m.id === "ollama-llama-3-3") || localModels[0];

      const fallbacks = localModels.filter((m) => m.id !== selected.id);

      return {
        selectedModel: selected,
        fallbackChain: fallbacks,
        estimatedCostUsd: 0.0,
        rationale: "Privacy boundary strictly requires local zero-egress execution.",
      };
    }

    // 2. Fast Interaction / Voice
    if (request.workload === "FAST_INTERACTION") {
      const flash = REGISTERED_MODELS.find((m) => m.id === "gemini-1-5-flash")!;
      const gpt4o = REGISTERED_MODELS.find((m) => m.id === "gpt-4o")!;
      return {
        selectedModel: flash,
        fallbackChain: [gpt4o],
        estimatedCostUsd: (request.promptLengthEst / 1000) * flash.costPer1kInputTokens,
        rationale: "Optimized for sub-200ms time-to-first-token in real-time conversational and voice turns.",
      };
    }

    // 3. Code Synthesis
    if (request.workload === "CODE_SYNTHESIS") {
      const sonnet = REGISTERED_MODELS.find((m) => m.id === "claude-3-5-sonnet")!;
      const geminiPro = REGISTERED_MODELS.find((m) => m.id === "gemini-1-5-pro")!;
      const qwenLocal = REGISTERED_MODELS.find((m) => m.id === "ollama-qwen-coder")!;
      return {
        selectedModel: sonnet,
        fallbackChain: [geminiPro, qwenLocal],
        estimatedCostUsd: (request.promptLengthEst / 1000) * sonnet.costPer1kInputTokens,
        rationale: "Claude 3.5 Sonnet prioritized for state-of-the-art AST accuracy and code refactoring.",
      };
    }

    // 4. Deep Reasoning & Architecture Planning
    const primary = REGISTERED_MODELS.find((m) => m.id === "gemini-1-5-pro")!;
    const sonnet = REGISTERED_MODELS.find((m) => m.id === "claude-3-5-sonnet")!;
    const gpt4o = REGISTERED_MODELS.find((m) => m.id === "gpt-4o")!;

    return {
      selectedModel: primary,
      fallbackChain: [sonnet, gpt4o],
      estimatedCostUsd: (request.promptLengthEst / 1000) * primary.costPer1kInputTokens,
      rationale: "Selected for massive 2M token context window and high structural reasoning capability.",
    };
  }
}
