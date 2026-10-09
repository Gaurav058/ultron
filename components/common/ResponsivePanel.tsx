"use client";

import React from "react";

export interface ResponsivePanelProps {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  scrollable?: boolean;
}

export default function ResponsivePanel({
  title,
  subtitle,
  badge,
  headerActions,
  children,
  footer,
  style,
  className = "",
  scrollable = true,
}: ResponsivePanelProps) {
  return (
    <div
      className={`responsive-panel ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--ultron-bg-panel)",
        border: "1px solid var(--ultron-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        backdropFilter: "blur(16px)",
        ...style,
      }}
    >
      {(title || headerActions) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: "1px solid rgba(11, 42, 80, 0.4)",
            background: "rgba(8, 23, 45, 0.4)",
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {title && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--ultron-text-primary)",
                  }}
                >
                  {title}
                </span>
              )}
              {badge}
            </div>
            {subtitle && (
              <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)", marginTop: "1px" }}>
                {subtitle}
              </div>
            )}
          </div>

          {headerActions && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>{headerActions}</div>}
        </div>
      )}

      <div
        style={{
          flex: 1,
          padding: "12px 14px",
          overflowY: scrollable ? "auto" : "visible",
          minHeight: 0,
        }}
      >
        {children}
      </div>

      {footer && (
        <div
          style={{
            padding: "8px 14px",
            borderTop: "1px solid rgba(11, 42, 80, 0.4)",
            background: "rgba(3, 13, 31, 0.5)",
            flexShrink: 0,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
