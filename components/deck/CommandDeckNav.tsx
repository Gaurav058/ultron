"use client";

import React from "react";

export type PillarId = "core" | "missions" | "brain" | "agents" | "tools" | "world" | "system";

interface CommandDeckNavProps {
  activePillar: PillarId;
  onSelectPillar: (pillar: PillarId) => void;
  pendingApprovalsCount: number;
  activeMissionsCount: number;
  systemHealth: "HEALTHY" | "WARNING" | "CRITICAL";
}

export default function CommandDeckNav({
  activePillar,
  onSelectPillar,
  pendingApprovalsCount,
  activeMissionsCount,
  systemHealth,
}: CommandDeckNavProps) {
  const pillars: { id: PillarId; label: string; badge?: number | string }[] = [
    { id: "core", label: "01 CORE" },
    { id: "missions", label: "02 MISSIONS", badge: activeMissionsCount > 0 ? activeMissionsCount : undefined },
    { id: "brain", label: "03 BRAIN" },
    { id: "agents", label: "04 AGENTS" },
    { id: "tools", label: "05 TOOLS" },
    { id: "world", label: "06 WORLD" },
    { id: "system", label: "07 SYSTEM" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-[#ffaa30]/20 bg-[#050302]/85 backdrop-blur-md">
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ffaa30] animate-pulse shadow-[0_0_12px_#ffaa30]" />
          <span className="font-mono text-lg font-bold tracking-widest text-[#ffaa30]">ULTRON</span>
          <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest text-[#ffcc66] border border-[#ffaa30]/40 rounded bg-[#ffaa30]/10">
            V2.0 INFINITY
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400 pl-4 border-l border-zinc-800">
          <span className="text-[#00f0ff]">DEVICES: 3</span>
          <span>•</span>
          <span className="text-zinc-300">ROUTER: AUTO</span>
          <span>•</span>
          <span className={systemHealth === "HEALTHY" ? "text-emerald-400" : "text-amber-400"}>
            HEALTH: {systemHealth}
          </span>
        </div>
      </div>

      {/* 7 Permanent Pillars Navigation */}
      <nav className="flex items-center gap-1 md:gap-2">
        {pillars.map((p) => {
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPillar(p.id)}
              className={`relative px-3 py-1.5 text-xs font-mono tracking-wider rounded transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#ffaa30]/20 text-[#ffaa30] border border-[#ffaa30]/60 shadow-[0_0_16px_rgba(255,170,48,0.25)] font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
              }`}
            >
              <span>{p.label}</span>
              {p.badge !== undefined && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#ffaa30]/30 text-[#ffcc66] font-bold">
                  {p.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pending Approvals & Quick Alert Status */}
      <div className="flex items-center gap-3">
        {pendingApprovalsCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 border border-amber-500/50 rounded bg-amber-500/15 animate-pulse">
            <span>⚠ APPROVALS:</span>
            <span>{pendingApprovalsCount}</span>
          </div>
        )}
        <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
          ZERO-TRUST DEFENSIVE
        </div>
      </div>
    </header>
  );
}
