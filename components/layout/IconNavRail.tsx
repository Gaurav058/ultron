"use client";

import React from "react";

export type NavItemKey =
  | "home"
  | "missions"
  | "agents"
  | "brain"
  | "world"
  | "world-monitor"
  | "tools"
  | "system"
  | "settings";

export interface IconNavRailProps {
  activeItem?: NavItemKey;
  onSelect?: (item: NavItemKey) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface RailItem {
  id: NavItemKey;
  label: string;
  badge?: string;
  icon: (active: boolean) => React.ReactNode;
}

export default function IconNavRail({
  activeItem = "home",
  onSelect,
  isExpanded = false,
  onToggleExpanded,
  isMobileOpen = false,
  onCloseMobile,
}: IconNavRailProps) {
  const items: RailItem[] = [
    {
      id: "home",
      label: "Command Center",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "missions",
      label: "Missions",
      badge: "DAG",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="6" r="2" fill={active ? "#00D9FF" : "none"} />
          <circle cx="12" cy="12" r="2" fill={active ? "#00D9FF" : "none"} />
        </svg>
      ),
    },
    {
      id: "agents",
      label: "Agents",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "brain",
      label: "Memory & Knowledge",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
        </svg>
      ),
    },
    {
      id: "world",
      label: "Global Intelligence",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      id: "world-monitor",
      label: "World Monitor",
      badge: "LIVE",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
          <circle cx="12" cy="12" r="3" fill={active ? "#00D9FF" : "none"} stroke="#00D9FF" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      id: "tools",
      label: "Free Tools",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      id: "system",
      label: "System",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h18" />
          <path d="M12 3v18" />
        </svg>
      ),
    },
  ];

  const renderNavContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "8px 6px",
        gap: "6px",
      }}
    >
      {/* Optional Expand/Collapse Header Button (Desktop) */}
      <div
        style={{
          display: "flex",
          justifyContent: isExpanded ? "space-between" : "center",
          alignItems: "center",
          padding: "4px 8px 8px 8px",
          borderBottom: "1px solid rgba(11, 42, 80, 0.4)",
          marginBottom: "4px",
        }}
      >
        {isExpanded && (
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--ultron-text-muted)" }}>
            NAVIGATION
          </span>
        )}
        <button
          onClick={onToggleExpanded}
          title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--ultron-text-muted)",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "var(--radius-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isExpanded ? (
              <polyline points="11 19 4 12 11 5" />
            ) : (
              <polyline points="13 5 20 12 13 19" />
            )}
          </svg>
        </button>
      </div>

      {/* Nav Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, overflowY: "auto" }}>
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelect?.(item.id);
                onCloseMobile?.();
              }}
              style={{
                width: "100%",
                height: isExpanded ? "38px" : "46px",
                borderRadius: "var(--radius-md)",
                background: isActive
                  ? "linear-gradient(90deg, rgba(22, 135, 255, 0.3) 0%, rgba(11, 42, 80, 0.5) 100%)"
                  : "transparent",
                border: isActive ? "1px solid var(--ultron-primary)" : "1px solid transparent",
                boxShadow: isActive ? "0 0 12px rgba(0, 217, 255, 0.25)" : "none",
                color: isActive ? "var(--ultron-text-primary)" : "var(--ultron-text-muted)",
                display: "flex",
                flexDirection: isExpanded ? "row" : "column",
                alignItems: "center",
                justifyContent: isExpanded ? "flex-start" : "center",
                padding: isExpanded ? "0 12px" : "4px 0",
                gap: isExpanded ? "10px" : "3px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--ultron-primary)";
                  e.currentTarget.style.background = "var(--ultron-bg-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--ultron-text-muted)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.icon(isActive)}
              </div>

              <span
                style={{
                  fontSize: isExpanded ? "12px" : "9px",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  color: isActive ? "var(--ultron-text-primary)" : "inherit",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.label}
              </span>

              {isExpanded && item.badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "1px 5px",
                    borderRadius: "var(--radius-xs)",
                    background: item.badge === "LIVE" ? "rgba(0, 230, 168, 0.15)" : "rgba(0, 217, 255, 0.15)",
                    color: item.badge === "LIVE" ? "var(--ultron-success)" : "var(--ultron-primary)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Nav Rail */}
      <nav
        className="ultron-desktop-nav"
        style={{
          width: isExpanded ? "230px" : "58px",
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "var(--ultron-bg-panel)",
          borderRight: "1px solid var(--ultron-border)",
          borderRadius: "var(--radius-lg)",
          userSelect: "none",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {renderNavContent()}
      </nav>

      {/* Mobile Drawer Navigation (<768px) */}
      {isMobileOpen && (
        <div
          className="ultron-mobile-nav-backdrop"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9990,
            background: "rgba(2, 8, 23, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
          }}
          onClick={onCloseMobile}
        >
          <div
            style={{
              width: "250px",
              height: "100%",
              background: "var(--ultron-bg-elevated)",
              borderRight: "1px solid var(--ultron-border-strong)",
              boxShadow: "8px 0 24px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
}
