"use client";

import React from "react";

export type PillarNavId = "CORE" | "MISSIONS" | "BRAIN" | "AGENTS" | "TOOLS" | "WORLD" | "SYSTEM";

interface NavItemProps {
  icon: string;
  label: PillarNavId;
  sublabel: string;
  active: boolean;
  disabled?: boolean;
  badge?: number | string;
  onClick: () => void;
}

export function NavItem({
  icon,
  label,
  sublabel,
  active,
  disabled = false,
  badge,
  onClick,
}: NavItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`nav-item ${active ? "active" : ""} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      aria-label={`Navigate to ${label}`}
      title={`${label} — ${sublabel}`}
    >
      <span className="icon" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1">
        <strong>{label}</strong>
        <small>{sublabel}</small>
      </span>
      {badge !== undefined && (
        <span className="text-[7px] font-mono px-1 py-0.2 rounded bg-[#63e8ff]/20 text-[#63e8ff] border border-[#63e8ff]/30">
          {badge}
        </span>
      )}
    </button>
  );
}

interface NavigationRailProps {
  active: PillarNavId;
  onSelect: (module: PillarNavId) => void;
  isListening?: boolean;
  onToggleVoice?: () => void;
  missionsCount?: number;
}

export default function NavigationRail({
  active,
  onSelect,
  isListening = false,
  onToggleVoice,
  missionsCount,
}: NavigationRailProps) {
  const navItems: { icon: string; label: PillarNavId; sublabel: string; badge?: number | string }[] = [
    { icon: "◉", label: "CORE", sublabel: "COGNITION" },
    { icon: "⌁", label: "MISSIONS", sublabel: "ACTIVE WORK", badge: missionsCount },
    { icon: "✦", label: "BRAIN", sublabel: "KNOWLEDGE" },
    { icon: "♙", label: "AGENTS", sublabel: "AI WORKFORCE" },
    { icon: "⌘", label: "TOOLS", sublabel: "CAPABILITIES" },
    { icon: "◎", label: "WORLD", sublabel: "LIVE INTEL" },
    { icon: "◈", label: "SYSTEM", sublabel: "DIAGNOSTICS" },
  ];

  return (
    <aside className="left-rail holo-panel">
      {/* System Status Indicator */}
      <div className="rail-status">
        <span className="pulse-dot" />
        <span>SYSTEM STATUS</span>
        <b>ONLINE</b>
      </div>

      {/* Navigation Items */}
      <nav className="ultron-nav flex flex-col gap-0.5 my-1">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            sublabel={item.sublabel}
            active={active === item.label}
            badge={item.badge}
            onClick={() => onSelect(item.label)}
          />
        ))}
      </nav>

      {/* Voice Core indicator at bottom of Left Rail */}
      <div
        className="rail-core"
        onClick={onToggleVoice}
        style={{ cursor: "pointer" }}
        title="Toggle ULTRON Voice Core Recognition"
        role="button"
        tabIndex={0}
      >
        <div className={`mini-core ${isListening ? "animate-pulse" : ""}`} />
        <span>ULTRON</span>
        <small>{isListening ? "LISTENING..." : "VOICE CORE"}</small>
        <div className="wave mini-wave">
          {Array.from({ length: 16 }).map((_, i) => (
            <i
              key={i}
              style={{
                height: isListening
                  ? `${6 + ((i * 23) % 18)}px`
                  : `${5 + ((i * 13) % 12)}px`,
              }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
