"use client";

import React from "react";

export type UltronStatusState =
  | "READY"
  | "ONLINE"
  | "THINKING"
  | "EXECUTING"
  | "WAITING"
  | "VERIFYING"
  | "ERROR"
  | "STANDBY";

interface StatusIndicatorProps {
  state: UltronStatusState;
  showText?: boolean;
  className?: string;
}

export default function StatusIndicator({
  state,
  showText = true,
  className = "",
}: StatusIndicatorProps) {
  const getColors = () => {
    switch (state) {
      case "READY":
      case "ONLINE":
        return { dot: "bg-[#00d9ff]", shadow: "shadow-[0_0_10px_#00d9ff]", text: "text-[#00d9ff]" };
      case "THINKING":
        return { dot: "bg-[#d84cff] animate-ping", shadow: "shadow-[0_0_12px_#d84cff]", text: "text-[#d84cff]" };
      case "EXECUTING":
        return { dot: "bg-[#00d9ff] animate-pulse", shadow: "shadow-[0_0_12px_#00d9ff]", text: "text-[#00d9ff]" };
      case "WAITING":
        return { dot: "bg-[#ffaa30]", shadow: "shadow-[0_0_10px_#ffaa30]", text: "text-[#ffaa30]" };
      case "VERIFYING":
        return { dot: "bg-[#6d4aff] animate-pulse", shadow: "shadow-[0_0_12px_#6d4aff]", text: "text-[#8b5cff]" };
      case "ERROR":
        return { dot: "bg-red-500", shadow: "shadow-[0_0_12px_#ef4444]", text: "text-red-400" };
      case "STANDBY":
      default:
        return { dot: "bg-zinc-500", shadow: "shadow-[0_0_6px_#71717a]", text: "text-zinc-400" };
    }
  };

  const { dot, shadow, text } = getColors();

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase ${className}`}>
      <span className={`w-2 h-2 rounded-full ${dot} ${shadow}`} />
      {showText && <span className={`font-semibold ${text}`}>{state}</span>}
    </div>
  );
}
