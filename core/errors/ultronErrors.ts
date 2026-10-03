/**
 * ULTRON Error Hierarchy (Section 30)
 * Typed, secure error classes with retry metadata and secret redaction.
 */

export class UltronBaseError extends Error {
  public readonly code: string;
  public readonly details: any;
  public readonly retryable: boolean;
  public readonly timestamp: string;

  constructor(code: string, message: string, details: any = null, retryable = false) {
    // Redact potential API keys or tokens from error message
    const sanitizedMessage = message.replace(/(?:AIza[0-9A-Za-z-_]{35}|bearer\s+[A-Za-z0-9._-]+)/gi, "[REDACTED_SECRET]");
    super(sanitizedMessage);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    this.retryable = retryable;
    this.timestamp = new Date().toISOString();
  }

  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      retryable: this.retryable,
      timestamp: this.timestamp,
      details: this.details,
    };
  }
}

export class GeminiError extends UltronBaseError {
  constructor(message: string, details?: any, retryable = true) {
    super("GEMINI_ERROR", message, details, retryable);
  }
}

export class GeminiAuthenticationError extends UltronBaseError {
  constructor(message = "Gemini API authentication failed. Check GEMINI_API_KEY environment variable.", details?: any) {
    super("GEMINI_AUTH_ERROR", message, details, false);
  }
}

export class GeminiRateLimitError extends UltronBaseError {
  public readonly retryAfterMs: number;
  constructor(message = "Gemini API rate limit exceeded.", retryAfterMs = 5000, details?: any) {
    super("GEMINI_RATE_LIMIT", message, details, true);
    this.retryAfterMs = retryAfterMs;
  }
}

export class GeminiTimeoutError extends UltronBaseError {
  constructor(message = "Gemini API request timed out.", details?: any) {
    super("GEMINI_TIMEOUT", message, details, true);
  }
}

export class ToolExecutionError extends UltronBaseError {
  public readonly toolId: string;
  constructor(toolId: string, message: string, details?: any) {
    super("TOOL_EXECUTION_ERROR", `Tool [${toolId}] execution failed: ${message}`, details, false);
    this.toolId = toolId;
  }
}

export class PermissionError extends UltronBaseError {
  public readonly resource: string;
  constructor(resource: string, message = "Operation denied by policy gate.") {
    super("PERMISSION_DENIED", `Policy violation on [${resource}]: ${message}`, null, false);
    this.resource = resource;
  }
}

export class MemoryError extends UltronBaseError {
  constructor(message: string, details?: any) {
    super("MEMORY_ERROR", message, details, false);
  }
}

export class MissionError extends UltronBaseError {
  public readonly missionId?: string;
  constructor(message: string, missionId?: string, details?: any) {
    super("MISSION_ERROR", message, details, false);
    this.missionId = missionId;
  }
}

export class VoiceConnectionError extends UltronBaseError {
  constructor(message: string, retryable = true, details?: any) {
    super("VOICE_CONNECTION_ERROR", message, details, retryable);
  }
}

export class ValidationError extends UltronBaseError {
  constructor(message: string, details?: any) {
    super("VALIDATION_ERROR", message, details, false);
  }
}
