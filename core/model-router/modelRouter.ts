import {
  ModelProfile,
  ModelRouteDecision as LegacyModelRouteDecision,
  ModelRouteRequest,
} from "../types/model";

export const REGISTERED_MODELS: ModelProfile[] = [
  {
    id: "gemini-2-5-flash",
    provider: "GEMINI",
    modelIdentifier: "gemini-2.5-flash",
    displayName: "Gemini 2.5 Flash (Ultra-Low Latency, Live Audio & Conversational)",
    contextWindow: 1048576,
    costPer1kInputTokens: 0.000075,
    costPer1kOutputTokens: 0.0003,
    avgLatencyMs: 120,
    isAvailable: true,
    isLocal: false,
  },
  {
    id: "gemini-2-5-pro",
    provider: "GEMINI",
    modelIdentifier: "gemini-2.5-pro",
    displayName: "Gemini 2.5 Pro (Deep Reasoning, Long Research & Code)",
    contextWindow: 2097152,
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

/**
 * ULTRON Workload Categories (Section 8)
 * Distinguishes:
 * - FAST CONVERSATION
 * - REASONING
 * - VOICE
 * - TOOL EXECUTION
 * - LONG RESEARCH
 * - CODE
 * - ANALYSIS
 */
export type UltronWorkload =
  | "FAST_CONVERSATION"
  | "REASONING"
  | "VOICE"
  | "TOOL_EXECUTION"
  | "LONG_RESEARCH"
  | "CODE"
  | "ANALYSIS";

export interface ModelRouteDecision {
  model: string;
  workload: UltronWorkload;
  temperature: number;
  maxOutputTokens: number;
  rationale: string;
}

export class ModelRouter {
  /**
   * Determine model configuration based on workload string or legacy ModelRouteRequest
   */
  public static route(arg?: UltronWorkload | ModelRouteRequest): any {
    // If called with legacy ModelRouteRequest object:
    if (arg && typeof arg === "object" && "privacyStrict" in arg) {
      return this.routeLegacy(arg as ModelRouteRequest);
    }

    const workload: UltronWorkload = (typeof arg === "string" ? arg : "FAST_CONVERSATION");
    const textModel = process.env.GEMINI_TEXT_MODEL || "gemini-3.5-flash";
    const reasoningModel = process.env.GEMINI_REASONING_MODEL || "gemini-3.5-flash";
    const liveModel = process.env.GEMINI_LIVE_MODEL || "gemini-3.5-flash";

    switch (workload) {
      case "FAST_CONVERSATION":
        return {
          model: textModel,
          workload,
          temperature: 0.2,
          maxOutputTokens: 1024,
          rationale: "Lowest-latency Flash model selected for immediate conversational TTFB.",
        };

      case "VOICE":
        return {
          model: liveModel,
          workload,
          temperature: 0.2,
          maxOutputTokens: 512,
          rationale: "Gemini Live model configured for real-time 16kHz/24kHz streaming audio.",
        };

      case "TOOL_EXECUTION":
        return {
          model: textModel,
          workload,
          temperature: 0.0,
          maxOutputTokens: 2048,
          rationale: "Deterministic Flash model with zero temperature for reliable schema arguments.",
        };

      case "REASONING":
      case "LONG_RESEARCH":
      case "CODE":
        return {
          model: reasoningModel,
          workload,
          temperature: 0.1,
          maxOutputTokens: 4096,
          rationale: "Deep reasoning Pro model selected for DAG compilation, code synthesis and verification.",
        };

      case "ANALYSIS":
      default:
        return {
          model: textModel,
          workload,
          temperature: 0.2,
          maxOutputTokens: 2048,
          rationale: "Standard balanced model routing.",
        };
    }
  }

  private static routeLegacy(request: ModelRouteRequest): LegacyModelRouteDecision {
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

    if (request.workload === "FAST_INTERACTION") {
      const flash = REGISTERED_MODELS.find((m) => m.id === "gemini-2-5-flash") || REGISTERED_MODELS[0];
      const gpt4o = REGISTERED_MODELS.find((m) => m.id === "gpt-4o") || REGISTERED_MODELS[3];
      return {
        selectedModel: flash,
        fallbackChain: [gpt4o],
        estimatedCostUsd: (request.promptLengthEst / 1000) * flash.costPer1kInputTokens,
        rationale: "Optimized for sub-200ms time-to-first-token in real-time conversational and voice turns.",
      };
    }

    if (request.workload === "CODE_SYNTHESIS") {
      const sonnet = REGISTERED_MODELS.find((m) => m.id === "claude-3-5-sonnet") || REGISTERED_MODELS[2];
      const geminiPro = REGISTERED_MODELS.find((m) => m.id === "gemini-2-5-pro") || REGISTERED_MODELS[1];
      const qwenLocal = REGISTERED_MODELS.find((m) => m.id === "ollama-qwen-coder") || REGISTERED_MODELS[4];
      return {
        selectedModel: sonnet,
        fallbackChain: [geminiPro, qwenLocal],
        estimatedCostUsd: (request.promptLengthEst / 1000) * sonnet.costPer1kInputTokens,
        rationale: "Claude 3.5 Sonnet prioritized for state-of-the-art AST accuracy and code refactoring.",
      };
    }

    const primary = REGISTERED_MODELS.find((m) => m.id === "gemini-2-5-pro") || REGISTERED_MODELS[1];
    const sonnet = REGISTERED_MODELS.find((m) => m.id === "claude-3-5-sonnet") || REGISTERED_MODELS[2];
    const gpt4o = REGISTERED_MODELS.find((m) => m.id === "gpt-4o") || REGISTERED_MODELS[3];

    return {
      selectedModel: primary,
      fallbackChain: [sonnet, gpt4o],
      estimatedCostUsd: (request.promptLengthEst / 1000) * primary.costPer1kInputTokens,
      rationale: "Selected for massive context window and high structural reasoning capability.",
    };
  }

  /**
   * Infer workload category from user text prompt
   */
  public static inferWorkload(prompt: string): UltronWorkload {
    const p = prompt.toLowerCase();
    if (p.includes("code") || p.includes("function") || p.includes("refactor") || p.includes("typescript") || p.includes("script")) {
      return "CODE";
    }
    if (p.includes("research") || p.includes("compare") || p.includes("analyze") || p.includes("market")) {
      return "LONG_RESEARCH";
    }
    if (p.includes("plan") || p.includes("architect") || p.includes("dag") || p.includes("mission")) {
      return "REASONING";
    }
    return "FAST_CONVERSATION";
  }
}
