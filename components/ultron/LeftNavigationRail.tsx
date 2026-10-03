"use client";

import React from "react";
import { PillarId } from "../deck/CommandDeckNav";

interface LeftNavigationRailProps {
  activePillar: PillarId;
  onSelectPillar: (pillar: PillarId) => void;
  activeMissionsCount: number;
}

export default function LeftNavigationRail({
  activePillar,
  onSelectPillar,
  activeMissionsCount,
}: LeftNavigationRailProps) {
  const items: {
    id: PillarId;
    label: string;
    sublabel: string;
    icon: string;
    badge?: number | string;
  }[] = [
    { id: "core", label: "CORE", sublabel: "Cognitive Engine", icon: "◉" },
    { id: "missions", label: "MISSIONS", sublabel: "Active Objectives", icon: "⎋", badge: activeMissionsCount > 0 ? activeMissionsCount : undefined },
    { id: "brain", label: "BRAIN", sublabel: "Knowledge / Memory", icon: "◈" },
    { id: "agents", label: "AGENTS", sublabel: "AI Workforce", icon: "⌬" },
    { id: "tools", label: "TOOLS", sublabel: "Capabilities", icon: "⌗" },
    { id: "world", label: "WORLD", sublabel: "Live Intelligence", icon: "🌐" },
    { id: "system", label: "SYSTEM", sublabel: "Diagnostics", icon: "⚙" },
  ];

  return (
    <aside className="w-[180px] lg:w-[200px] h-full border-r border-[#00d9ff]/20 bg-[#02040c]/85 backdrop-blur-xl flex flex-col justify-between p-3 select-none z-30 shrink-0">
      {/* Navigation Items Stack */}
      <div className="space-y-1.5 pt-2">
        <div className="font-['Rajdhani',sans-serif] text-[10px] font-bold text-[#8493b2] tracking-[0.2em] uppercase px-2 mb-2">
          SYSTEM MATRIX
        </div>

        {items.map((item) => {
          const isActive = activePillar === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPillar(item.id)}
              className={`w-full group relative flex items-center justify-between px-3 py-2 rounded-[3px] transition-all duration-200 text-left ${
                isActive
                  ? "bg-gradient-to-r from-[#00d9ff]/15 to-[#6d4aff]/10 border-l-2 border-[#00d9ff] text-zinc-100 shadow-[0_0_15px_rgba(0,217,255,0.15)]"
                  : "text-[#8493b2] hover:text-zinc-200 hover:bg-white/[0.03] border-l-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-xs ${isActive ? "text-[#00d9ff] drop-shadow-[0_0_8px_#00d9ff]" : "text-[#8493b2] group-hover:text-zinc-300"}`}>
                  {item.icon}
                </span>
                <div>
                  <div className={`font-['Orbitron',sans-serif] text-[11px] font-bold tracking-wider ${isActive ? "text-[#00d9ff]" : "text-zinc-200"}`}>
                    {item.label}
                  </div>
                  <div className="font-['Rajdhani',sans-serif] text-[9px] text-[#8493b2] tracking-wider uppercase">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-full bg-[#00d9ff]/20 border border-[#00d9ff]/40 text-[#00d9ff] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Connected Devices Card & Mini Telemetry */}
      <div className="space-y-3 pt-3 border-t border-white/[0.08]">
        <div className="p-2.5 rounded bg-black/40 border border-white/[0.06] space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-['Rajdhani',sans-serif] font-bold text-[#8493b2] tracking-widest uppercase">
            <span>CONNECTED NODES</span>
            <span className="text-[#00d9ff]">3 SYNCED</span>
          </div>

          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="truncate">DESKTOP MAIN</span>
              <span className="text-emerald-400">100%</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="truncate">IPHONE 15 PRO</span>
              <span className="text-emerald-400">98%</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="truncate">EDGE NODE 01</span>
              <span className="text-[#00d9ff]">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Audio / Voice Indicator */}
        <div className="flex items-center justify-between px-2 text-[10px] font-mono text-[#8493b2]">
          <span>VOICE FABRIC</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            STANDBY
          </span>
        </div>
      </div>
    </aside>
  );
}
