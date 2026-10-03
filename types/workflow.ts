export type WorkflowNodeStatus =
  | "idle"
  | "queued"
  | "planning"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "cancelled";

export interface WorkflowNode {
  id: string;
  agentId: string;
  name: string;
  type?: string;
  status: WorkflowNodeStatus;
  progress?: number;
  input?: unknown;
  output?: unknown;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  icon?: string;
  details?: {
    task?: string;
    tools?: string[];
    summary?: string;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  active?: boolean;
}
