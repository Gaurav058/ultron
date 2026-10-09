/**
 * ULTRON Sovereign Intelligence Engine
 * Orchestrates multi-provider telemetry, layer registries, time filtering, and spatial search.
 */

import { IntelligenceEvent, IntelligenceLayerConfig, EventsQueryFilter, IntelligenceCategory } from "./types";
import { LiveDataProviders } from "./liveDataProviders";

export class IntelligenceEngine {
  private static layerDefinitions: Omit<IntelligenceLayerConfig, "eventCount">[] = [
    {
      id: "layer-geopolitics",
      name: "Geopolitical Events",
      description: "Sovereign border, treaty, and regional state actor diplomatic events.",
      category: "GEOPOLITICS",
      sourceName: "Global OSINT Feeds",
      sourceUrl: "https://liveuamap.com",
      isEnabled: true,
      refreshPolicy: "Continuous RSS",
      freshness: "RECENT",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "Multi-Source Geopolitical Telemetry",
      license: "Public Domain / Fair Use",
    },
    {
      id: "layer-conflict",
      name: "Conflict & Security",
      description: "Armed conflict, tactical defense postures, and regional skirmish tracking.",
      category: "CONFLICT",
      sourceName: "Institute for the Study of War & ACLED",
      sourceUrl: "https://www.understandingwar.org",
      isEnabled: true,
      refreshPolicy: "Daily Assessments",
      freshness: "RECENT",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "ISW / Open Conflict Catalogs",
      license: "Open Research",
    },
    {
      id: "layer-disaster",
      name: "Natural Disasters & Earthquakes",
      description: "Real-time global seismic ruptures, tsunami warnings, and geological anomalies.",
      category: "DISASTER",
      sourceName: "USGS Geological Survey",
      sourceUrl: "https://earthquake.usgs.gov",
      isEnabled: true,
      refreshPolicy: "Sub-Minute GeoJSON Feed",
      freshness: "LIVE",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "United States Geological Survey",
      license: "US Government Public Domain",
    },
    {
      id: "layer-weather",
      name: "Weather & Environmental",
      description: "Wildfires, severe atmospheric storms, volcanic plumes, and NASA satellite sensors.",
      category: "WEATHER",
      sourceName: "NASA Earth Observatory (EONET)",
      sourceUrl: "https://eonet.gsfc.nasa.gov",
      isEnabled: true,
      refreshPolicy: "Sub-Hourly Satellite Passes",
      freshness: "RECENT",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "NASA Goddard Space Flight Center",
      license: "NASA Open Data Policy",
    },
    {
      id: "layer-aviation",
      name: "Aviation Telemetry",
      description: "Commercial transit vectors, airspace closures, and military transponder alerts.",
      category: "AVIATION",
      sourceName: "OpenSky Network / ADSB Radar",
      sourceUrl: "https://opensky-network.org",
      isEnabled: true,
      refreshPolicy: "Periodic Airspace State",
      freshness: "RECENT",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "OpenSky Network Research",
      license: "Non-Commercial Academic",
    },
    {
      id: "layer-maritime",
      name: "Maritime Radar",
      description: "Strategic maritime chokepoints (Hormuz, Bab-el-Mandeb, Suez, Malacca, Bosphorus).",
      category: "MARITIME",
      sourceName: "Global Maritime Navigation Radar",
      sourceUrl: "https://www.marinetraffic.com",
      isEnabled: true,
      refreshPolicy: "Hourly Chokepoint Telemetry",
      freshness: "LIVE",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "Maritime Transponder Feeds",
      license: "Public Navigation Notice",
    },
    {
      id: "layer-economic",
      name: "Economic & Market Signals",
      description: "Strategic energy reserves, petroleum trade flows, and macroeconomic indicators.",
      category: "ECONOMIC",
      sourceName: "US Energy Information Administration",
      sourceUrl: "https://www.eia.gov",
      isEnabled: true,
      refreshPolicy: "Weekly Market Summaries",
      freshness: "PERIODIC",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "US EIA Open Data",
      license: "Public Domain",
    },
    {
      id: "layer-cyber",
      name: "Cybersecurity & Outages",
      description: "Known exploited vulnerabilities, zero-days, and critical infrastructure attacks.",
      category: "CYBER",
      sourceName: "CISA Cybersecurity Agency",
      sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
      isEnabled: true,
      refreshPolicy: "Continuous Advisory Feed",
      freshness: "RECENT",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "Cybersecurity & Infrastructure Security Agency",
      license: "US Government Work",
    },
    {
      id: "layer-tech",
      name: "Technology & AI Signals",
      description: "Frontier AI model announcements, compute cluster deployments, and quantum tech.",
      category: "TECH",
      sourceName: "Verified Tech Industry Dispatches",
      sourceUrl: "https://ai.google.dev",
      isEnabled: true,
      refreshPolicy: "Daily Intelligence Briefs",
      freshness: "RECENT",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "Curated Technical Publications",
      license: "Open Technical Index",
    },
    {
      id: "layer-missions",
      name: "ULTRON Missions & Targets",
      description: "Active autonomous multi-agent missions and investigated geographical sectors.",
      category: "MISSIONS",
      sourceName: "ULTRON Autonomous Mission Manager",
      sourceUrl: "file:///core/missions",
      isEnabled: true,
      refreshPolicy: "Real-time Internal Event Bus",
      freshness: "LIVE",
      requiresCredentials: false,
      status: "OPERATIONAL",
      attribution: "ULTRON Cognitive Engine",
      license: "Sovereign Proprietary",
    },
  ];

  /**
   * Retrieves all normalized events across providers, applying layer and time filters.
   */
  public static async getAllEvents(query: EventsQueryFilter = {}): Promise<IntelligenceEvent[]> {
    const [earthquakes, nasaEvents, cisaEvents] = await Promise.all([
      LiveDataProviders.fetchUSGSEarthquakes(),
      LiveDataProviders.fetchNASAEonetEvents(),
      LiveDataProviders.fetchCISACyberThreats(),
    ]);

    const maritimeEvents = LiveDataProviders.getMaritimeChokepointEvents();
    const missionEvents = LiveDataProviders.getUltronMissionEvents();

    let all: IntelligenceEvent[] = [
      ...earthquakes,
      ...nasaEvents,
      ...maritimeEvents,
      ...cisaEvents,
      ...missionEvents,
    ];

    // 1. Layer/Category Filtering
    if (query.layers && query.layers.length > 0 && !query.layers.includes("ALL")) {
      const allowedCategories = new Set(query.layers.map((l) => l.toUpperCase()));
      all = all.filter((e) => allowedCategories.has(e.category.toUpperCase()));
    }

    // 2. Time Filtering
    if (query.timeRange && query.timeRange !== "all") {
      const now = Date.now();
      const cutoffMs =
        query.timeRange === "latest"
          ? 6 * 60 * 60 * 1000 // 6 hours
          : query.timeRange === "24h"
          ? 24 * 60 * 60 * 1000 // 24 hours
          : 7 * 24 * 60 * 60 * 1000; // 7 days

      all = all.filter((e) => {
        const t = new Date(e.eventTime).getTime();
        return now - t <= cutoffMs;
      });
    }

    // 3. Search Query Filtering
    if (query.searchQuery && query.searchQuery.trim().length > 0) {
      const q = query.searchQuery.toLowerCase();
      all = all.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.sourceName.toLowerCase().includes(q) ||
          (e.geographicalScope && e.geographicalScope.toLowerCase().includes(q))
      );
    }

    // 4. Bounding Box Filtering
    if (query.bbox) {
      const { minLat, maxLat, minLon, maxLon } = query.bbox;
      all = all.filter(
        (e) =>
          e.latitude >= minLat &&
          e.latitude <= maxLat &&
          e.longitude >= minLon &&
          e.longitude <= maxLon
      );
    }

    // Sort by most recent eventTime descending
    return all.sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime());
  }

  /**
   * Retrieves operational layer registry with real dynamically counted events.
   */
  public static async getLayers(): Promise<IntelligenceLayerConfig[]> {
    const events = await this.getAllEvents({ timeRange: "all" });

    // Count events per category
    const countMap: Record<string, number> = {};
    for (const e of events) {
      const cat = e.category.toUpperCase();
      countMap[cat] = (countMap[cat] || 0) + 1;
    }

    return this.layerDefinitions.map((layer) => ({
      ...layer,
      eventCount: countMap[layer.category] || 0,
    }));
  }
}
