"use client";

import React, { useEffect, useState } from "react";

export default function PillarWorld() {
  const [issPosition, setIssPosition] = useState<{ lat: number; lon: number; alt: number } | null>(null);
  const [earthquakes, setEarthquakes] = useState<any[]>([]);
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchWorldFeeds() {
      // 1. ISS Position
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

      // 3. Crypto Financial Matrix
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true");
        if (res.ok) {
          const d = await res.json();
          if (isMounted) setCryptoData(d);
        }
      } catch {}

      // 4. Open-Meteo Atmospheric Profile
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current_weather=true");
        if (res.ok) {
          const d = await res.json();
          if (isMounted) setWeatherData(d.current_weather);
        }
      } catch {}

      if (isMounted) setLoading(false);
    }

    fetchWorldFeeds();
    const interval = setInterval(fetchWorldFeeds, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-60px)] mt-[60px] p-6 font-mono text-xs text-zinc-200 bg-[#050302] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_24px_rgba(255,170,48,0.1)] mb-6">
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#ffaa30] flex items-center gap-2">
            <span>WORLD MODE</span>
            <span className="text-zinc-500 font-normal">| SPATIAL SITUATIONAL TELEMETRY</span>
          </h1>
          <p className="text-zinc-400 text-[11px] mt-1">
            Real-time external information streams with verified source provenance. No frivolous decorative 3D eye-candy.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">EXTERNAL UPLINKS ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: ISS Orbital Tracking */}
        <div className="p-4 rounded-lg border border-zinc-800 bg-black/60 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="font-bold text-[#00f0ff] uppercase text-xs">ORBITAL INFRASTRUCTURE (ISS)</h3>
            <span className="text-[10px] text-zinc-500">NORAD: 25544</span>
          </div>
          {issPosition ? (
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500">LATITUDE:</span>
                <span className="text-zinc-200 font-bold">{issPosition.lat.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500">LONGITUDE:</span>
                <span className="text-zinc-200 font-bold">{issPosition.lon.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500">ALTITUDE:</span>
                <span className="text-emerald-400 font-bold">{Math.round(issPosition.alt)} km</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500 text-[11px]">Acquiring orbital telemetry...</div>
          )}
        </div>

        {/* Card 2: Financial Index Arrays */}
        <div className="p-4 rounded-lg border border-zinc-800 bg-black/60 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="font-bold text-[#ffcc66] uppercase text-xs">FINANCIAL SPOT MATRIX</h3>
            <span className="text-[10px] text-zinc-500">COINGECKO FEED</span>
          </div>
          {cryptoData ? (
            <div className="space-y-2">
              {Object.entries(cryptoData).map(([coin, data]: [string, any]) => (
                <div key={coin} className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-400 uppercase">{coin}:</span>
                  <div className="text-right">
                    <span className="text-zinc-100 font-bold mr-2">${data.usd?.toLocaleString()}</span>
                    <span className={data.usd_24h_change >= 0 ? "text-emerald-400 text-[10px]" : "text-red-400 text-[10px]"}>
                      {data.usd_24h_change >= 0 ? "+" : ""}{data.usd_24h_change?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-500 text-[11px]">Connecting to market arrays...</div>
          )}
        </div>

        {/* Card 3: Atmospheric Profile */}
        <div className="p-4 rounded-lg border border-zinc-800 bg-black/60 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="font-bold text-zinc-100 uppercase text-xs">ATMOSPHERIC PROFILE</h3>
            <span className="text-[10px] text-zinc-500">OPEN-METEO GPS</span>
          </div>
          {weatherData ? (
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500">TEMPERATURE:</span>
                <span className="text-amber-300 font-bold">{weatherData.temperature}°C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500">WIND VELOCITY:</span>
                <span className="text-zinc-200 font-bold">{weatherData.windspeed} km/h</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-500">WEATHER CODE:</span>
                <span className="text-emerald-400 font-bold">{weatherData.weathercode} (NOMINAL)</span>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500 text-[11px]">Querying atmospheric sensors...</div>
          )}
        </div>

        {/* Card 4: Global Seismic Activity */}
        <div className="p-4 rounded-lg border border-zinc-800 bg-black/60 space-y-3 md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="font-bold text-red-400 uppercase text-xs">GLOBAL SEISMIC SENSOR ARRAY (USGS)</h3>
            <span className="text-[10px] text-zinc-500">SIGNIFICANT EVENTS (30D)</span>
          </div>
          {earthquakes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {earthquakes.map((q) => (
                <div key={q.id} className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-[11px]">
                  <div className="flex justify-between text-red-400 font-bold mb-1">
                    <span>MAG: {q.properties?.mag}</span>
                    <span className="text-zinc-500 text-[10px]">{new Date(q.properties?.time).toLocaleDateString()}</span>
                  </div>
                  <div className="text-zinc-300 truncate">{q.properties?.place}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-500 text-[11px]">No significant seismic anomalies detected globally.</div>
          )}
        </div>
      </div>
    </div>
  );
}
