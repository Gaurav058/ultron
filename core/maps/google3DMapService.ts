/**
 * ULTRON GOOGLE 3D MAPS & EARTH SERVICE
 * Directive Sections 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 17, 18, 19
 * Handles Google Maps Platform 3D JavaScript API, photorealistic tiles,
 * <gmp-map-3d> lifecycle, camera management, search, and authentic geocoding.
 */

import { UsageTracker } from "../metrics/usageTracker";
import {
  SelectedLocation,
  IntelligenceMarker,
  GoogleMapsDiagnostics,
  EarthLayer,
} from "@/types/location";

export interface ReverseGeocodeResult {
  formattedAddress: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  placeId?: string;
  elevation?: number;
  timezone?: string;
  source: "GOOGLE_MAPS" | "OPENSTREETMAP_NOMINATIM" | "COORDINATE_FALLBACK";
}

export interface GeocodeSearchResult {
  lat: number;
  lon: number;
  formattedAddress: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
}

export class Google3DMapService {
  private static apiLoadPromise: Promise<void> | null = null;
  private static authErrorOccurred = false;

  public static getApiKey(): string | null {
    if (typeof window !== "undefined") {
      return (
        (window as any).__ULTRON_GOOGLE_MAPS_KEY ||
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        null
      );
    }
    return (
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      null
    );
  }

  public static isGoogleMapsConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 0 && !key.includes("MY_API_KEY"));
  }

  /**
   * Safe Diagnostic Status without ever leaking the API key string
   */
  public static getDiagnostics(markerCount = 0, isEarthReady = false): GoogleMapsDiagnostics {
    const hasKey = this.isGoogleMapsConfigured();
    let mapsConnected: "CONNECTED" | "API KEY MISSING" | "CONFIGURATION ERROR" = "CONNECTED";

    if (!hasKey) {
      mapsConnected = "API KEY MISSING";
    } else if (this.authErrorOccurred) {
      mapsConnected = "CONFIGURATION ERROR";
    }

    return {
      apiKeyConfigured: hasKey,
      mapsConnected,
      earth3dReady: isEarthReady,
      locationReady: true,
      intelligenceReady: true,
      activeMode: "hybrid (Photorealistic 3D)",
      markerCount,
      lastError: this.authErrorOccurred
        ? "Google Maps Platform rejected the API key or referrer restrictions."
        : undefined,
    };
  }

  /**
   * Singleton loader for Google Maps JavaScript API (beta channel with maps3d, places, geocoding)
   */
  public static loadGoogleMapsAPI(): Promise<void> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("Cannot load Google Maps in server environment."));
    }

    if ((window as any).google?.maps?.maps3d) {
      return Promise.resolve();
    }

    if (this.apiLoadPromise) {
      return this.apiLoadPromise;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      return Promise.reject(new Error("API KEY MISSING"));
    }

    this.apiLoadPromise = new Promise((resolve, reject) => {
      // Set up Google Maps auth failure listener
      (window as any).gm_authFailure = () => {
        console.warn("[ULTRON 3D EARTH] Google Maps Authentication Failure: API Key rejected or unauthorized.");
        this.authErrorOccurred = true;
      };

      // Check if script already exists in document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        // Wait for google.maps to be available
        const checkInterval = setInterval(() => {
          if ((window as any).google?.maps) {
            clearInterval(checkInterval);
            (window as any).google.maps
              .importLibrary("maps3d")
              .then(() => resolve())
              .catch(reject);
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=maps3d,places,geocoding`;
      script.async = true;
      script.defer = true;

      script.onload = async () => {
        try {
          if ((window as any).google?.maps?.importLibrary) {
            await (window as any).google.maps.importLibrary("maps3d");
            await (window as any).google.maps.importLibrary("geocoding");
          }
          resolve();
        } catch (err) {
          console.error("[ULTRON 3D EARTH] Error importing maps3d library:", err);
          reject(err);
        }
      };

      script.onerror = (err) => {
        this.apiLoadPromise = null;
        reject(new Error("Failed to load Google Maps script from CDN."));
      };

      document.head.appendChild(script);
    });

    return this.apiLoadPromise;
  }

  /**
   * Instantiate and configure <gmp-map-3d> element
   */
  public static async createMap3DElement(
    container: HTMLElement,
    options?: {
      center?: { lat: number; lng: number; altitude?: number };
      range?: number;
      tilt?: number;
      heading?: number;
      mode?: "hybrid" | "satellite";
    }
  ): Promise<any> {
    await this.loadGoogleMapsAPI();

    const mapElement = document.createElement("gmp-map-3d") as any;
    mapElement.setAttribute("mode", options?.mode || "hybrid");
    mapElement.style.width = "100%";
    mapElement.style.height = "100%";
    mapElement.style.display = "block";
    mapElement.style.outline = "none";
    mapElement.style.background = "#020817";

    // Initial global Earth position
    const center = options?.center || { lat: 20, lng: 0, altitude: 12000000 };
    mapElement.center = center;
    mapElement.range = options?.range || 18000000;
    mapElement.tilt = options?.tilt ?? 0;
    mapElement.heading = options?.heading ?? 0;

    container.innerHTML = "";
    container.appendChild(mapElement);

    return mapElement;
  }

  /**
   * Smooth camera flight to specified geographic coordinates
   */
  public static flyTo(
    map: any,
    lat: number,
    lon: number,
    options?: {
      altitude?: number;
      range?: number;
      tilt?: number;
      heading?: number;
      durationMillis?: number;
    }
  ): void {
    if (!map) return;

    const targetCenter = {
      lat,
      lng: lon,
      altitude: options?.altitude ?? 0,
    };
    const targetRange = options?.range ?? 250000;
    const targetTilt = options?.tilt ?? 55;
    const targetHeading = options?.heading ?? 0;
    const duration = options?.durationMillis ?? 2200;

    try {
      if (typeof map.flyCameraTo === "function") {
        map.flyCameraTo({
          endCamera: {
            center: targetCenter,
            range: targetRange,
            tilt: targetTilt,
            heading: targetHeading,
          },
          durationMillis: duration,
        });
      } else {
        map.center = targetCenter;
        if (targetRange) map.range = targetRange;
        if (targetTilt !== undefined) map.tilt = targetTilt;
        if (targetHeading !== undefined) map.heading = targetHeading;
      }
    } catch (e) {
      console.warn("[ULTRON 3D EARTH] Camera flight notice:", e);
      map.center = targetCenter;
    }
  }

  /**
   * Zoom camera in
   */
  public static zoomIn(map: any): void {
    if (!map) return;
    const currentRange = map.range || 5000000;
    const newRange = Math.max(150, currentRange * 0.55);

    try {
      if (typeof map.flyCameraTo === "function") {
        map.flyCameraTo({
          endCamera: {
            center: map.center,
            range: newRange,
            tilt: map.tilt || 0,
            heading: map.heading || 0,
          },
          durationMillis: 500,
        });
      } else {
        map.range = newRange;
      }
    } catch {
      map.range = newRange;
    }
  }

  /**
   * Zoom camera out
   */
  public static zoomOut(map: any): void {
    if (!map) return;
    const currentRange = map.range || 5000000;
    const newRange = Math.min(26000000, currentRange * 1.7);

    try {
      if (typeof map.flyCameraTo === "function") {
        map.flyCameraTo({
          endCamera: {
            center: map.center,
            range: newRange,
            tilt: map.tilt || 0,
            heading: map.heading || 0,
          },
          durationMillis: 500,
        });
      } else {
        map.range = newRange;
      }
    } catch {
      map.range = newRange;
    }
  }

  /**
   * Tilt camera up or down
   */
  public static tilt(map: any, delta: number): void {
    if (!map) return;
    const currentTilt = map.tilt || 0;
    const newTilt = Math.min(80, Math.max(0, currentTilt + delta));

    try {
      if (typeof map.flyCameraTo === "function") {
        map.flyCameraTo({
          endCamera: {
            center: map.center,
            range: map.range,
            tilt: newTilt,
            heading: map.heading || 0,
          },
          durationMillis: 400,
        });
      } else {
        map.tilt = newTilt;
      }
    } catch {
      map.tilt = newTilt;
    }
  }

  /**
   * Rotate camera around heading
   */
  public static rotate(map: any, delta: number): void {
    if (!map) return;
    const currentHeading = map.heading || 0;
    const newHeading = (currentHeading + delta + 360) % 360;

    try {
      if (typeof map.flyCameraTo === "function") {
        map.flyCameraTo({
          endCamera: {
            center: map.center,
            range: map.range,
            tilt: map.tilt || 0,
            heading: newHeading,
          },
          durationMillis: 400,
        });
      } else {
        map.heading = newHeading;
      }
    } catch {
      map.heading = newHeading;
    }
  }

  /**
   * Reset Earth to global command center viewpoint
   */
  public static resetEarth(map: any): void {
    if (!map) return;
    this.flyTo(map, 20, 0, {
      altitude: 12000000,
      range: 18000000,
      tilt: 0,
      heading: 0,
      durationMillis: 1800,
    });
  }

  /**
   * Geocode a search query (e.g. Dubai, Tokyo, New York, Jaipur, London)
   * Resolves coordinates without hardcoded lists.
   */
  public static async geocodeSearch(query: string): Promise<GeocodeSearchResult | null> {
    if (!query || !query.trim()) return null;
    const clean = query.trim();

    // 1. Try Google Maps Geocoder if loaded in client
    if (typeof window !== "undefined" && (window as any).google?.maps?.Geocoder) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        const response: any = await new Promise((resolve) => {
          geocoder.geocode({ address: clean }, (results: any[], status: string) => {
            if (status === "OK" && results && results.length > 0) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          });
        });

        if (response) {
          const lat = response.geometry.location.lat();
          const lon = response.geometry.location.lng();
          let city: string | undefined;
          let region: string | undefined;
          let country: string | undefined;
          let countryCode: string | undefined;

          for (const comp of response.address_components || []) {
            if (comp.types.includes("locality")) city = comp.long_name;
            if (comp.types.includes("administrative_area_level_1")) region = comp.long_name;
            if (comp.types.includes("country")) {
              country = comp.long_name;
              countryCode = comp.short_name;
            }
          }

          return {
            lat,
            lon,
            formattedAddress: response.formatted_address,
            city: city || region || clean,
            region,
            country: country || "Earth",
            countryCode,
          };
        }
      } catch (e) {
        console.warn("[ULTRON 3D EARTH] Client Google Geocoder warning, trying Nominatim:", e);
      }
    }

    // 2. OpenStreetMap Nominatim search fallback (genuine geographic database)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(clean)}&limit=1`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "UltronIntelligenceOS/1.0",
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          return {
            lat: parseFloat(first.lat),
            lon: parseFloat(first.lon),
            formattedAddress: first.display_name,
            city: first.name || clean,
            country: "Earth",
          };
        }
      }
    } catch (e) {
      console.warn("[ULTRON 3D EARTH] Nominatim geocode fallback failed:", e);
    }

    return null;
  }

  /**
   * Acquire browser device geolocation with clean promise
   */
  public static getUserLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        reject(new Error("LOCATION_NOT_SUPPORTED"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          reject(new Error(err.code === 1 ? "LOCATION PERMISSION DENIED" : "LOCATION_UNAVAILABLE"));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * Render real intelligence markers onto the 3D map
   */
  public static renderMarkers(
    map: any,
    markers: IntelligenceMarker[],
    onMarkerClick: (marker: IntelligenceMarker) => void
  ): () => void {
    if (!map) return () => {};

    // Remove old marker elements
    const existingMarkers = map.querySelectorAll("gmp-marker-3d, gmp-marker-3d-interactive");
    existingMarkers.forEach((m: any) => m.remove());

    const createdElements: HTMLElement[] = [];

    markers.forEach((marker) => {
      try {
        const markerEl = document.createElement("gmp-marker-3d") as any;
        markerEl.position = {
          lat: marker.latitude,
          lng: marker.longitude,
          altitude: marker.altitude ?? 0,
        };
        markerEl.setAttribute("title", marker.title);

        markerEl.addEventListener("gmp-click", (e: any) => {
          e?.stopPropagation?.();
          onMarkerClick(marker);
        });

        map.appendChild(markerEl);
        createdElements.push(markerEl);
      } catch (e) {
        console.warn("[ULTRON 3D EARTH] Error creating marker element:", e);
      }
    });

    // Cleanup function
    return () => {
      createdElements.forEach((el) => {
        try {
          el.remove();
        } catch {}
      });
    };
  }

  /**
   * Server-side & Client-side Reverse geocode latitude and longitude into physical location
   */
  public static async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<ReverseGeocodeResult> {
    const apiKey = this.getApiKey();

    // 1. Try Google Maps Geocoding API if configured
    if (apiKey) {
      try {
        const start = Date.now();
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });

        if (res.ok) {
          const data = await res.json();
          UsageTracker.recordUsage({
            model: "Google Maps Geocoding API",
            inputTokens: 0,
            outputTokens: 0,
            toolCallsCount: 1,
            durationMs: Date.now() - start,
            workload: "MAPS_GEOCODING",
          });

          if (data.results && data.results.length > 0) {
            const first = data.results[0];
            let city: string | undefined;
            let region: string | undefined;
            let country: string | undefined;
            let countryCode: string | undefined;

            for (const comp of first.address_components) {
              if (comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")) {
                city = comp.long_name;
              }
              if (comp.types.includes("administrative_area_level_1")) {
                region = comp.long_name;
              }
              if (comp.types.includes("country")) {
                country = comp.long_name;
                countryCode = comp.short_name;
              }
            }

            return {
              formattedAddress: first.formatted_address,
              city: city || region || "Global Sector",
              region: region || city,
              country: country || "Earth",
              countryCode,
              placeId: first.place_id,
              source: "GOOGLE_MAPS",
            };
          }
        }
      } catch (err) {
        console.warn("[ULTRON 3D EARTH] Google Geocoding failed, falling back to real Nominatim:", err);
      }
    }

    // 2. OpenStreetMap Nominatim real reverse geocoder (free public API, genuine geographic data)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "UltronIntelligenceOS/1.0 (https://github.com/Gaurav058/ultron)",
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || addr.state_district;
        const region = addr.state || addr.region;
        const country = addr.country;
        const countryCode = addr.country_code ? addr.country_code.toUpperCase() : undefined;

        return {
          formattedAddress: data.display_name || `${lat.toFixed(3)}°, ${lon.toFixed(3)}°`,
          city: city || region || "Earth Zone",
          region,
          country: country || "International Waters / Territory",
          countryCode,
          source: "OPENSTREETMAP_NOMINATIM",
        };
      }
    } catch (e) {
      console.warn("[ULTRON 3D EARTH] Nominatim reverse geocode error:", e);
    }

    // 3. Coordinate fallback (strictly factual, no made-up city)
    return {
      formattedAddress: `Sector Coordinates [${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E]`,
      city: "Global Sector",
      region: "Global Terrestrial",
      country: "Earth",
      source: "COORDINATE_FALLBACK",
    };
  }
}

