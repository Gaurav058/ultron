export interface SelectedLocation {
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  city?: string;
  weather?: {
    temperature: string;
    condition: string;
  };
  insights?: string[];
  cameraStatus?: "AVAILABLE" | "NO_AUTHORIZED_SOURCES";
  cameraSources?: string[];
  newsHeadlines?: string[];
}
