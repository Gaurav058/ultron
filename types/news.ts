import { VerificationState } from "./intelligence";

export interface NewsStory {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  category?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  location?: string;
  url?: string;
  summary?: string;
  verificationStatus?: VerificationState;
  importanceScore?: number; // 0 to 100
  claims?: string[];
  entities?: string[];
  sourceQuality?: number; // 0 to 1
  isTopNews?: boolean;
}
