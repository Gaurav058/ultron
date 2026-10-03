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
}
