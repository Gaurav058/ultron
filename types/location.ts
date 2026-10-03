export interface SelectedLocation {
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  city?: string;
  elevation?: number;
  timezone?: string;
  weather?: {
    temperature: string;
    condition: string;
    windSpeed?: string;
    humidity?: string;
    feelsLike?: string;
  };
  insights?: string[];
  cameraStatus: "AVAILABLE" | "NO_AUTHORIZED_SOURCES";
  cameraSources: string[];
  newsHeadlines?: string[];
  events?: string[];
  mapsIntelligence?: {
    formattedAddress?: string;
    coordinates?: string;
    countryCode?: string;
    source?: string;
  };
}
