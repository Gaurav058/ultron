export type IntelligenceMarkerType =
  | "NEWS"
  | "EVENT"
  | "TECHNOLOGY"
  | "BUSINESS"
  | "SECURITY"
  | "ENVIRONMENT"
  | "RESEARCH"
  | "MISSION";

export interface IntelligenceMarker {
  id: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  type: IntelligenceMarkerType;
  title: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  source: string;
  timestamp: string;
  details?: string;
}

export type EarthLayer =
  | "ALL"
  | "NEWS"
  | "EVENTS"
  | "WEATHER"
  | "TECHNOLOGY"
  | "BUSINESS"
  | "SECURITY"
  | "ENVIRONMENT"
  | "MISSIONS";

export type EarthStatus =
  | "INITIALIZING EARTH"
  | "LOADING GOOGLE MAPS"
  | "EARTH ONLINE"
  | "MAP ERROR"
  | "API KEY MISSING"
  | "MAP UNAVAILABLE";

export interface GoogleMapsDiagnostics {
  apiKeyConfigured: boolean;
  mapsConnected: "CONNECTED" | "API KEY MISSING" | "CONFIGURATION ERROR";
  earth3dReady: boolean;
  locationReady: boolean;
  intelligenceReady: boolean;
  activeMode: string;
  markerCount: number;
  lastError?: string;
}

export interface SelectedLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  name?: string;
  city?: string;
  country?: string;
  region?: string;
  selectedAt?: string;
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

