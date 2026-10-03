"use client";

import React, { useState } from "react";
import { Mission } from "../../core/types/mission";
import { CORE_AGENT_ROSTER } from "../../core/conductor/agentRoster";
import { PillarId } from "../deck/CommandDeckNav";

interface MobileCompanionDeckProps {
  activeMission?: Mission;
  onSubmitIntent: (text: string) => void;
  onSelectPillar: (pillar: PillarId) => void;
  activePillar: PillarId;
}

export default function MobileCompanionDeck({
  activeMission,
  onSubmitIntent,
  onSelectPillar,
  activePillar,
}: MobileCompanionDeckProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const completedCount = activeMission?.tasks.filter((t) => t.status === "COMPLETED").length || 0;
  const progressPercent = activeMission
    ? Math.round((completedCount / Math.max(1, activeMission.tasks.length)) * 100)
    : 72;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmitIntent(input.trim());
    setInput("");
  };

  return (
    <div className="w-full min-h-screen bg-[#02030a] text-zinc-100 font-mono flex flex-col justify-between p-4 pb-20 select-none">
      {/* Top Mobile Bar */}
      <div className="flex items-center justify-between py-2 border-b border-white/[0.08]">
        <button className="text-zinc-400 p-1">☰</button>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00d9ff] animate-pulse shadow-[0_0_8px_#00d9ff]" />
          <span className="font-['Orbitron',sans-serif] text-sm font-bold tracking-widest text-[#00d9ff]">
            ULTRON
          </span>
          <span className="text-[9px] text-[#8493b2]">OS</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
          <span>●</span>
          <span>LIVE</span>
        </div>
      </div>

      {/* Main Center Area: Entity, Greeting & Mission */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-4">
        {/* Sleek Mini Holographic Infinity Core Visual */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(109,74,255,0.25)_0%,rgba(0,217,255,0.1)_45%,transparent_75%)]" />
          <svg className="absolute inset-0 w-full h-full animate-[spin_30s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0, 217, 255, 0.3)" strokeWidth="0.8" strokeDasharray="3 6" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(109, 74, 255, 0.3)" strokeWidth="0.8" strokeDasharray="8 6" />
          </svg>

          {/* Central Cybernetic Android Silhouette */}
          <div className="relative z-10 flex flex-col items-center">
            <svg className="w-28 h-28 drop-shadow-[0_0_20px_#00d9ff]" viewBox="0 0 120 120" fill="none">
              <path d="M40 100 L45 76 L60 68 L75 76 L80 100 Z" fill="#04060e" stroke="#00d9ff" strokeWidth="0.8" />
              <path d="M60 24 C46 24 42 34 42 46 C42 54 48 60 60 62 C72 60 78 54 78 46 C78 34 74 24 60 24 Z" fill="#060914" stroke="#00d9ff" strokeWidth="1" />
              <ellipse cx="54" cy="42" rx="3.5" ry="1.4" fill="#00d9ff" className="animate-pulse" />
              <ellipse cx="66" cy="42" rx="3.5" ry="1.4" fill="#00d9ff" className="animate-pulse" />
              <circle cx="60" cy="85" r="5" fill="#6d4aff" className="animate-ping" opacity="0.6" />
              <circle cx="60" cy="85" r="3" fill="#00d9ff" />
            </svg>
          </div>
        </div>

        {/* Personalized Greeting */}
        <div className="text-center space-y-1">
          <h1 className="font-['Rajdhani',sans-serif] text-base font-bold text-zinc-100 tracking-wider">
            Good Evening, Gaurav —
          </h1>
          <p className="text-xs text-[#8493b2] font-mono">
            How can I elevate your reality today?
          </p>
        </div>

        {/* Active Mission Card */}
        <div className="w-full max-w-sm p-3.5 rounded bg-[#060a1c]/80 border border-[#00d9ff]/25 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#8493b2] uppercase tracking-widest font-['Rajdhani',sans-serif]">
              ACTIVE MISSION
            </span>
            <span className="text-[#00d9ff] font-bold">{progressPercent}%</span>
          </div>

          <div className="font-['Rajdhani',sans-serif] text-xs font-bold text-zinc-100 truncate">
            {activeMission?.title || "Build AETHORA AI Platform"}
          </div>

          <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6d4aff] to-[#00d9ff]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Active Agents Horizontal Scroll */}
        <div className="w-full max-w-sm space-y-1">
          <div className="flex items-center justify-between text-[9px] text-[#8493b2] uppercase px-1">
            <span>ACTIVE AGENTS</span>
            <span className="text-emerald-400">7 RUNNING</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CORE_AGENT_ROSTER.map((agent) => (
              <div
                key={agent.id}
                className="px-2.5 py-1.5 rounded bg-black/50 border border-white/[0.08] flex items-center gap-1.5 shrink-0"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: agent.avatarColor }}
                />
                <span className="text-[10px] text-zinc-300 font-semibold">{agent.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile System Status Grid */}
        <div className="w-full max-w-sm grid grid-cols-4 gap-1.5 text-center text-[9px] pt-1">
          <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
            <span className="text-[#8493b2] block text-[8px]">CORE</span>
            <span className="text-[#00d9ff] font-bold">100%</span>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
            <span className="text-[#8493b2] block text-[8px]">MEMORY</span>
            <span className="text-zinc-200 font-bold">64%</span>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
            <span className="text-[#8493b2] block text-[8px]">STORAGE</span>
            <span className="text-zinc-200 font-bold">72%</span>
          </div>
          <div className="p-1.5 rounded bg-black/40 border border-white/[0.04]">
            <span className="text-[#8493b2] block text-[8px]">HEALTH</span>
            <span className="text-emerald-400 font-bold">OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Voice & Intent Input */}
      <div className="fixed bottom-14 left-4 right-4 z-40">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 rounded-full bg-[#080c1e]/95 border border-[#00d9ff]/40 shadow-[0_0_20px_rgba(0,217,255,0.2)] backdrop-blur-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ULTRON..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-zinc-100 placeholder-[#8493b2] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            className="w-8 h-8 rounded-full bg-[#00d9ff] text-black font-bold flex items-center justify-center"
          >
            🎙
          </button>
        </form>
      </div>

      {/* Bottom Mobile Dock Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 h-12 bg-[#02040c]/95 border-t border-white/[0.08] backdrop-blur-xl flex items-center justify-around px-4 z-40 text-[9px]">
        {(["core", "missions", "brain", "system"] as PillarId[]).map((tab) => {
          const isActive = activePillar === tab;
          return (
            <button
              key={tab}
              onClick={() => onSelectPillar(tab)}
              className={`flex flex-col items-center gap-0.5 tracking-wider uppercase font-['Rajdhani',sans-serif] ${
                isActive ? "text-[#00d9ff] font-bold" : "text-[#8493b2]"
              }`}
            >
              <span>{tab === "core" ? "◉" : tab === "missions" ? "⎋" : tab === "brain" ? "◈" : "⚙"}</span>
              <span>{tab}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
