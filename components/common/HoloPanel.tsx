"use client";

import React from "react";

interface HoloPanelProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  status?: "nominal" | "active" | "warning" | "error" | "info";
  variant?: "cyan" | "violet" | "amber" | "default";
  className?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  cutCorner?: boolean;
}

export default function HoloPanel({
  title,
  subtitle,
  badge,
  status = "nominal",
  variant = "cyan",
  className = "",
  headerAction,
  children,
  cutCorner = true,
}: HoloPanelProps) {
  const getBorderColor = () => {
    switch (variant) {
      case "violet":
        return "border-[#6d4aff]/30 hover:border-[#6d4aff]/60 shadow-[0_0_20px_rgba(109,74,255,0.12)]";
      case "amber":
        return "border-[#ffaa30]/35 hover:border-[#ffaa30]/70 shadow-[0_0_20px_rgba(255,170,48,0.15)]";
      case "cyan":
      default:
        return "border-[#00d9ff]/25 hover:border-[#00d9ff]/50 shadow-[0_0_20px_rgba(0,217,255,0.12)]";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-[#00d9ff] shadow-[0_0_8px_#00d9ff] animate-pulse";
      case "warning":
        return "bg-[#ffaa30] shadow-[0_0_8px_#ffaa30]";
      case "error":
        return "bg-red-500 shadow-[0_0_8px_#ef4444]";
      case "info":
        return "bg-[#6d4aff] shadow-[0_0_8px_#6d4aff]";
      case "nominal":
      default:
        return "bg-emerald-400 shadow-[0_0_8px_#34d399]";
    }
  };

  return (
    <div
      className={`relative bg-[#080c1e]/75 backdrop-blur-xl border rounded-[4px] transition-all duration-300 ${getBorderColor()} ${className}`}
      style={{
        clipPath: cutCorner
          ? "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)"
          : undefined,
      }}
    >
      {/* Precision corner bracket decors */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00d9ff]/60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00d9ff]/60 pointer-events-none" />

      {/* Header if specified */}
      {(title || subtitle || badge || headerAction) && (
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
            <div>
              {title && (
                <div className="font-['Rajdhani',sans-serif] text-xs font-bold tracking-widest uppercase text-zinc-100 flex items-center gap-1.5">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="font-mono text-[9px] text-[#8493b2] tracking-wider uppercase">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[#00d9ff] font-semibold">
                {badge}
              </span>
            )}
            {headerAction}
          </div>
        </div>
      )}

      {/* Main body content */}
      <div className="p-3.5">{children}</div>
    </div>
  );
}
