export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: "TOOL_INVOCATION" | "APPROVAL_DECISION" | "MISSION_TRANSITION" | "SECURITY_ALERT" | "MODEL_CALL";
  actor: string; // user, agent id, or system
  severity: "INFO" | "WARNING" | "CRITICAL";
  details: string;
  metadata?: Record<string, any>;
  cryptographicSignature?: string;
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  affectedComponent: string;
  description: string;
  remediation: string;
  cveId?: string;
  detectedAt: string;
  resolved: boolean;
}
