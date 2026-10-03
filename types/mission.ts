export type MissionStatus =
  | "queued"
  | "planning"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "cancelled";

export interface MissionItem {
  id: string;
  title: string;
  description?: string;
  status: MissionStatus;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  timeAgo?: string;
  category?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ultron" | "conductor" | "researcher" | "analyst" | "verifier";
  text: string;
  timestamp: string;
  badge?: string;
  missionId?: string;
}
