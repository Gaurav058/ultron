"use client";

import React from "react";

export default function SystemCapabilityStrip() {
  const capabilities = [
    { title: "INFINITY CORE", desc: "Unlimited computing power", icon: "◉" },
    { title: "MULTI DEVICE SYNC", desc: "Seamless across devices", icon: "⇄" },
    { title: "AI AGENT NETWORK", desc: "Specialized AI workforce", icon: "⌬" },
    { title: "REAL TIME INTELLIGENCE", desc: "Live data from the world", icon: "⚡" },
    { title: "VOICE FIRST", desc: "Speak naturally, get results", icon: "🎙" },
    { title: "SECURITY BY DESIGN", desc: "Your data, your control", icon: "⌗" },
  ];

  return (
    <div className="w-full border-t border-white/[0.06] bg-[#02030a]/90 backdrop-blur-md px-3 py-1.5 flex items-center justify-between text-[9px] font-mono text-[#8493b2] select-none overflow-x-auto">
      <div className="flex items-center gap-4 lg:gap-8 mx-auto">
        {capabilities.map((cap) => (
          <div key={cap.title} className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className="text-[#00d9ff]">{cap.icon}</span>
            <span className="font-['Rajdhani',sans-serif] font-bold text-zinc-300 tracking-wider">
              {cap.title}:
            </span>
            <span className="hidden sm:inline text-[#8493b2]">{cap.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
