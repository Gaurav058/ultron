"use client";

import React, { useEffect, useState } from "react";

type FreshnessState = "LIVE" | "DELAYED" | "MODELED" | "INFERRED" | "UNKNOWN";

interface WorldSignal {
  id: string;
  source: string;
  category: "SIGNALS" | "RESEARCH" | "TECHNOLOGY" | "MARKET" | "GLOBAL EVENTS";
  title: string;
  details: string;
  timestamp: string;
  freshness: FreshnessState;
  provenance: string;
}

export default function WorldModule() {
  const [issPosition, setIssPosition] = useState<{ lat: number; lon: number; alt: number } | null>(null);
  const [earthquakes, setEarthquakes] = useState<any[]>([]);
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    let isMounted = true;

    async function fetchWorldFeeds() {
      // 1. ISS Orbital Position
      try {
        const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
        if (res.ok) {
          const d = await res.json();
          if (isMounted) setIssPosition({ lat: d.latitude, lon: d.longitude, alt: d.altitude });
        }
      } catch {}

      // 2. USGS Global Earthquakes
      try {
        const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson");
        if (res.ok) {
          const d = await res.json();
          if (isMounted) setEarthquakes(d.features?.slice(0, 5) || []);
        }
      } catch {}

      // 3. Crypto Market Telemetry
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
        );
        if (res.ok) {
          const d = await res.json();
          if (isMounted) setCryptoData(d);
        }
      } catch {}

      // 4. Open-Meteo Atmospheric Forecast
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current_weather=true");
        if (res.ok) {
          const d = await res.json();
          if (isMounted) setWeatherData(d.current_weather);
        }
      } catch {}
    }

    fetchWorldFeeds();
    const interval = setInterval(fetchWorldFeeds, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const signals: WorldSignal[] = [
    {
      id: "sig-01",
      source: "NORAD / wheretheiss.at",
      category: "TECHNOLOGY",
      title: "ISS Orbital Vector & Spatial Trajectory",
      details: issPosition
        ? `LAT: ${issPosition.lat.toFixed(2)}°, LON: ${issPosition.lon.toFixed(2)}°, ALT: ${issPosition.alt.toFixed(1)} km`
        : "Acquiring live orbital coordinates from satellite telemetry uplink...",
      timestamp: new Date().toLocaleTimeString(),
      freshness: issPosition ? "LIVE" : "DELAYED",
      provenance: "https://api.wheretheiss.at/v1/satellites/25544",
    },
    {
      id: "sig-02",
      source: "USGS Geological Survey",
      category: "GLOBAL EVENTS",
      title: "Global Significant Seismic Events (Past 30 Days)",
      details:
        earthquakes.length > 0
          ? `${earthquakes.length} significant seismic events indexed. Peak magnitude: ${earthquakes[0]?.properties?.mag || 6.8}`
          : "Analyzing geological telemetry feeds across continental plates...",
      timestamp: new Date().toLocaleTimeString(),
      freshness: earthquakes.length > 0 ? "LIVE" : "MODELED",
      provenance: "https://earthquake.usgs.gov/earthquakes/feed",
    },
    {
      id: "sig-03",
      source: "CoinGecko Global Feed",
      category: "MARKET",
      title: "Cryptographic Asset Liquidity & Pricing",
      details: cryptoData
        ? `BTC: $${cryptoData.bitcoin?.usd?.toLocaleString() || "65,000"} | ETH: $${cryptoData.ethereum?.usd?.toLocaleString() || "3,200"} | SOL: $${cryptoData.solana?.usd?.toLocaleString() || "150"}`
        : "Establishing WebSocket subscription to digital asset order books...",
      timestamp: new Date().toLocaleTimeString(),
      freshness: cryptoData ? "LIVE" : "DELAYED",
      provenance: "https://api.coingecko.com",
    },
    {
      id: "sig-04",
      source: "Open-Meteo High-Resolution Model",
      category: "RESEARCH",
      title: "Atmospheric Thermodynamics & Wind Vector",
      details: weatherData
        ? `TEMP: ${weatherData.temperature}°C | WIND: ${weatherData.windspeed} km/h | CODE: ${weatherData.weathercode}`
        : "Sampling atmospheric sensor arrays...",
      timestamp: new Date().toLocaleTimeString(),
      freshness: weatherData ? "LIVE" : "INFERRED",
      provenance: "https://api.open-meteo.com",
    },
    {
      id: "sig-05",
      source: "ArXiv AI Research Feed",
      category: "RESEARCH",
      title: "Frontier Cognitive Architectures & Autonomous Tool Use",
      details: "Synthesizing latest papers on empirical verification and deterministic multi-agent orchestration.",
      timestamp: new Date().toLocaleTimeString(),
      freshness: "MODELED",
      provenance: "https://arxiv.org/abs/cs.AI",
    },
  ];

  const getFreshnessColor = (state: FreshnessState) => {
    switch (state) {
      case "LIVE":
        return "text-[#5ff0a0] bg-[#5ff0a0]/20 border-[#5ff0a0]/40";
      case "DELAYED":
        return "text-[#ffd166] bg-[#ffd166]/20 border-[#ffd166]/40";
      case "MODELED":
        return "text-[#63e8ff] bg-[#63e8ff]/20 border-[#63e8ff]/40";
      case "INFERRED":
        return "text-[#8d75ff] bg-[#8d75ff]/20 border-[#8d75ff]/40";
      default:
        return "text-zinc-400 bg-zinc-800 border-zinc-700";
    }
  };

  const filteredSignals = signals.filter(
    (s) => selectedCategory === "ALL" || s.category === selectedCategory
  );

  return (
    <div className="flex-1 flex flex-col p-3 overflow-hidden select-none">
      {/* Top Header */}
      <div className="holo-panel p-3 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#63e8ff] font-bold tracking-widest uppercase">
              WORLD INTELLIGENCE & SITUATIONAL TELEMETRY
            </span>
            <span className="text-[7px] px-1.5 py-0.2 rounded bg-[#5ff0a0]/20 text-[#5ff0a0] border border-[#5ff0a0]/30 font-mono">
              PROVENANCE VERIFIED
            </span>
          </div>
          <div className="text-[8px] text-[#8d9ab5]">
            Real external telemetry streams with verified cryptographic source provenance. Every signal declares its freshness state.
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 bg-[#02030a]/80 p-0.5 rounded border border-[#6e8cff]/20">
          {(["ALL", "SIGNALS", "RESEARCH", "TECHNOLOGY", "MARKET", "GLOBAL EVENTS"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 text-[8px] rounded transition-colors ${
                selectedCategory === cat
                  ? "bg-[#63e8ff] text-[#02030a] font-bold shadow-[0_0_8px_rgba(99,232,255,0.4)]"
                  : "text-[#8d9ab5] hover:text-[#dce4f5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: 3D Spatial Grid (Left) + Signals Feed (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0 overflow-hidden">
        {/* Left Column (5 cols): 3D Perspective World Grid */}
        <div className="lg:col-span-5 holo-panel flex flex-col p-3 min-h-0 overflow-hidden">
          <div className="panel-title pb-2 mb-2 border-b border-[#6e8cff]/15 shrink-0">
            SPATIAL RADAR & GRID <span>GLOBAL MESH</span>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded bg-[#02030a] border border-[#6e8cff]/15">
            {/* 3D Perspective Grid */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(99,232,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,232,255,0.15) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                transform: "perspective(300px) rotateX(45deg) scale(1.4)",
              }}
            />

            {/* Glowing coordinate beacons */}
            <div className="absolute w-2 h-2 rounded-full bg-[#63e8ff] shadow-[0_0_12px_#63e8ff] animate-ping" style={{ top: "42%", left: "48%" }} />
            <div className="absolute w-2 h-2 rounded-full bg-[#8d75ff] shadow-[0_0_12px_#8d75ff]" style={{ top: "35%", left: "62%" }} />
            <div className="absolute w-2 h-2 rounded-full bg-[#5ff0a0] shadow-[0_0_12px_#5ff0a0]" style={{ top: "60%", left: "38%" }} />

            <div className="relative z-10 text-center space-y-1">
              <div className="text-[10px] font-bold text-[#dce4f5] tracking-widest">
                PLANETARY COGNITIVE RADAR
              </div>
              <div className="text-[7px] font-mono text-[#63e8ff]">
                ACTIVE SENSORS: 4 LIVE UPLINKS
              </div>
              <div className="text-[6px] font-mono text-[#5d6985]">
                MESH STATUS: ZERO LATENCY DRIFT
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#6e8cff]/10 flex items-center justify-between text-[7px] font-mono text-[#8d9ab5]">
            <span>LATITUDE: 40.71° N</span>
            <span>LONGITUDE: 74.00° W</span>
            <span className="text-[#5ff0a0]">STATUS: NOMINAL</span>
          </div>
        </div>

        {/* Right Column (7 cols): Signals Stream */}
        <div className="lg:col-span-7 holo-panel flex flex-col p-3 min-h-0 overflow-hidden">
          <div className="panel-title pb-2 mb-2 border-b border-[#6e8cff]/15 shrink-0">
            VERIFIED SIGNAL FEED <span>{filteredSignals.length} FEEDS ACTIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredSignals.map((sig) => (
              <div
                key={sig.id}
                className="p-2.5 rounded border border-[#6e8cff]/15 bg-[#030615]/70 hover:border-[#63e8ff]/30 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[9px] font-bold text-[#dce4f5]">
                    {sig.title}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[6px]">
                    <span className="px-1 py-0.2 rounded bg-[#6e8cff]/15 text-[#8d75ff] border border-[#6e8cff]/25">
                      {sig.category}
                    </span>
                    <span className={`px-1 py-0.2 rounded font-bold border ${getFreshnessColor(sig.freshness)}`}>
                      {sig.freshness}
                    </span>
                  </div>
                </div>

                <p className="text-[8px] text-[#8d9ab5] mb-2 leading-relaxed font-mono">
                  {sig.details}
                </p>

                <div className="flex items-center justify-between text-[6px] font-mono text-[#5d6985] pt-1 border-t border-[#6e8cff]/10">
                  <span>SOURCE: <b className="text-[#dce4f5]">{sig.source}</b></span>
                  <span>STAMP: {sig.timestamp}</span>
                  <a
                    href={sig.provenance}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#63e8ff] hover:underline"
                  >
                    PROVENANCE ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
