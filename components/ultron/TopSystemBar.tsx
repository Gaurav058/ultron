"use client";

import React, { useEffect, useState } from "react";
import StatusIndicator, { UltronStatusState } from "../common/StatusIndicator";

interface TopSystemBarProps {
  coreStatus: UltronStatusState;
  pendingApprovalsCount: number;
  activeAgentsCount: number;
}

export default function TopSystemBar({
  coreStatus,
  pendingApprovalsCount,
  activeAgentsCount,
}: TopSystemBarProps) {
  const [timeString, setTimeString] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateString(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
        }).toUpperCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-[52px] w-full border-b border-[#00d9ff]/20 bg-[#02040c]/90 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between z-40 select-none">
      {/* Left: Brand & Build */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00d9ff] animate-pulse shadow-[0_0_12px_#00d9ff]" />
          <span className="font-['Orbitron',sans-serif] text-sm lg:text-base font-black tracking-widest text-[#e6edf8]">
            ULTRON<span className="text-[#00d9ff]"> OS</span>
          </span>
        </div>
        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.1] text-[#8493b2] tracking-widest uppercase hidden sm:inline-block">
          v2.0.0 INFINITY
        </span>
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-white/[0.08] text-[10px] font-mono text-[#8493b2]">
          <span>SYSTEM:</span>
          <span className="text-[#00d9ff] font-semibold">100% OPTIMAL</span>
        </div>
      </div>

      {/* Center: System Title & Mantra */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="font-['Orbitron',sans-serif] text-xs lg:text-sm font-bold tracking-[0.3em] text-[#00d9ff] flex items-center gap-1.5">
          <span>ULTRON</span>
        </div>
        <div className="font-['Rajdhani',sans-serif] text-[9px] lg:text-[10px] tracking-[0.25em] text-[#8493b2] uppercase font-medium hidden md:block">
          BEYOND INTELLIGENCE. BEYOND LIMITS.
        </div>
      </div>

      {/* Right: Dynamic Telemetry & Identity */}
      <div className="flex items-center gap-3 lg:gap-5 text-xs font-mono">
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-[11px] font-bold text-zinc-200 tracking-wider">
            {timeString || "12:00:00"}
          </span>
          <span className="text-[9px] text-[#8493b2] tracking-widest">
            {dateString || "OCT 03"}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/[0.08] text-[10px] text-[#8493b2]">
          <span>OPERATOR:</span>
          <span className="text-zinc-200 font-bold tracking-wider">GAURAV</span>
        </div>

        <div className="flex items-center gap-2">
          <StatusIndicator state={coreStatus} />
          {pendingApprovalsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold animate-pulse">
              ⚠ {pendingApprovalsCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
