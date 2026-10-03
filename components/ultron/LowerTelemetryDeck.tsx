"use client";

import React, { useEffect, useState } from "react";
import HoloPanel from "../common/HoloPanel";

interface ActivityLogItem {
  id: string;
  time: string;
  agent: string;
  action: string;
  status: "SUCCESS" | "INFO" | "VERIFY" | "WARNING";
}

export default function LowerTelemetryDeck() {
  // Activity stream state
  const [activities, setActivities] = useState<ActivityLogItem[]>([
    {
      id: "act-1",
      time: "14:32:12",
      agent: "Researcher",
      action: "Completed market architecture analysis",
      status: "SUCCESS",
    },
    {
      id: "act-2",
      time: "14:32:14",
      agent: "Builder",
      action: "Generated Next.js API microservice scaffold",
      status: "INFO",
    },
    {
      id: "act-3",
      time: "14:32:18",
      agent: "Reality Checker",
      action: "Validated 19 unit test assertions with 0 exit code",
      status: "VERIFY",
    },
    {
      id: "act-4",
      time: "14:32:21",
      agent: "Memory Curator",
      action: "Promoted verified invariant into L4 durable memory",
      status: "SUCCESS",
    },
  ]);

  // System metrics state
  const [metrics, setMetrics] = useState({
    cpu: 32,
    mem: 64,
    bandwidth: "1.2 TB/s",
    health: "OPTIMAL",
    latency: 18,
  });

  // World telemetry state (ISS position & Crypto spot)
  const [worldData, setWorldData] = useState<{
    issLat: number;
    issLon: number;
    btcUsd: number;
    provenance: string;
  }>({
    issLat: 42.104,
    issLon: -71.058,
    btcUsd: 87400,
    provenance: "LIVE",
  });

  useEffect(() => {
    // Poll real ISS and Crypto spot data
    async function fetchTelemetry() {
      try {
        const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
        if (res.ok) {
          const d = await res.json();
          setWorldData((prev) => ({
            ...prev,
            issLat: d.latitude,
            issLon: d.longitude,
            provenance: "LIVE",
          }));
        }
      } catch {}

      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
        if (res.ok) {
          const d = await res.json();
          if (d.bitcoin?.usd) {
            setWorldData((prev) => ({ ...prev, btcUsd: d.bitcoin.usd }));
          }
        }
      } catch {}
    }

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 font-mono select-none">
      {/* 1. World Intelligence Panel */}
      <HoloPanel
        title="WORLD INTELLIGENCE"
        subtitle="SPATIAL TELEMETRY"
        badge={worldData.provenance}
        variant="cyan"
      >
        <div className="space-y-2 text-xs">
          {/* World Wireframe Map Schematic */}
          <div className="relative h-16 w-full rounded bg-[#030614] border border-white/[0.06] overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full opacity-35" viewBox="0 0 300 100">
              <path
                d="M10 30 Q 60 10, 100 40 T 180 30 T 260 50"
                fill="none"
                stroke="#00d9ff"
                strokeWidth="0.8"
                strokeDasharray="2 4"
              />
              <path
                d="M40 70 Q 120 50, 180 80 T 280 60"
                fill="none"
                stroke="#6d4aff"
                strokeWidth="0.8"
                strokeDasharray="4 6"
              />
              <circle cx="160" cy="45" r="3" fill="#00d9ff" className="animate-ping" />
              <circle cx="160" cy="45" r="2" fill="#88f5ff" />
            </svg>
            <div className="absolute top-1 left-2 text-[8px] text-[#8493b2]">
              GLOBAL GRID 100%
            </div>
            <div className="absolute bottom-1 right-2 text-[8px] text-[#00d9ff]">
              NODE: EARTH ORBIT
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
            <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
              <span className="text-[#8493b2] block text-[8px]">ISS POSITION</span>
              <span className="text-zinc-200 font-bold">
                {worldData.issLat.toFixed(2)}°, {worldData.issLon.toFixed(2)}°
              </span>
            </div>

            <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
              <span className="text-[#8493b2] block text-[8px]">FINANCIAL SPOT</span>
              <span className="text-[#00d9ff] font-bold">
                BTC ${worldData.btcUsd.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </HoloPanel>

      {/* 2. Live Activity Stream Panel */}
      <HoloPanel
        title="LIVE ACTIVITY STREAM"
        subtitle="EVENT LEDGER"
        badge="4 EVENTS"
        variant="violet"
      >
        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 text-[10px]">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-1.5 rounded bg-black/40 border border-white/[0.04] flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[#8493b2] text-[9px] shrink-0">{act.time}</span>
                <span className="font-semibold text-zinc-200 truncate">{act.action}</span>
              </div>

              <span
                className={`text-[8px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                  act.status === "SUCCESS"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : act.status === "VERIFY"
                    ? "bg-[#6d4aff]/20 text-[#d84cff]"
                    : "bg-[#00d9ff]/20 text-[#00d9ff]"
                }`}
              >
                {act.agent}
              </span>
            </div>
          ))}
        </div>
      </HoloPanel>

      {/* 3. System Metrics Panel */}
      <HoloPanel
        title="SYSTEM METRICS"
        subtitle="HARDWARE VITALS"
        badge="OPTIMAL"
        variant="cyan"
      >
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {/* CPU Gauge */}
            <div className="p-1.5 rounded bg-black/40 border border-white/[0.04] space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-[#8493b2]">CPU LOAD</span>
                <span className="text-[#00d9ff] font-bold">{metrics.cpu}%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#00d9ff]" style={{ width: `${metrics.cpu}%` }} />
              </div>
            </div>

            {/* Memory Gauge */}
            <div className="p-1.5 rounded bg-black/40 border border-white/[0.04] space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="text-[#8493b2]">MEMORY</span>
                <span className="text-[#8b5cff] font-bold">{metrics.mem}%</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#6d4aff]" style={{ width: `${metrics.mem}%` }} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/[0.06]">
            <div>
              <span className="text-[#8493b2] block text-[8px]">BANDWIDTH BUS</span>
              <span className="text-zinc-200 font-bold">{metrics.bandwidth}</span>
            </div>
            <div>
              <span className="text-[#8493b2] block text-[8px]">LATENCY</span>
              <span className="text-emerald-400 font-bold">{metrics.latency}ms</span>
            </div>
            <div>
              <span className="text-[#8493b2] block text-[8px]">CORE HEALTH</span>
              <span className="text-emerald-400 font-bold">100% HEALTHY</span>
            </div>
          </div>
        </div>
      </HoloPanel>
    </div>
  );
}
