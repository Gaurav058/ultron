"use client";

import React from "react";

export interface UltronPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function UltronPanel({
  title,
  subtitle,
  badge,
  actions,
  children,
  className = "",
  bodyClassName = "",
  style,
  ...rest
}: UltronPanelProps) {
  const hasHeader = Boolean(title || subtitle || badge || actions);

  return (
    <div
      className={`ultron-panel-root ${className}`}
      style={{
        background: "rgba(7, 11, 28, 0.88)",
        border: "1px solid rgba(105, 150, 255, 0.20)",
        borderRadius: "10px",
        boxShadow: "0 0 30px rgba(0, 0, 0, 0.25)",
        color: "#EAF2FF",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        ...style,
      }}
      {...rest}
    >
      {hasHeader && (
        <div
          className="ultron-panel-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderBottom: "1px solid rgba(105, 150, 255, 0.15)",
            background: "rgba(99, 232, 255, 0.02)",
            minHeight: "36px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            {title && (
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "#EAF2FF",
                  fontFamily: "var(--ultron-font)",
                }}
              >
                {title}
              </span>
            )}
            {subtitle && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#71809D",
                  letterSpacing: "0.4px",
                }}
              >
                {subtitle}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {badge}
            {actions}
          </div>
        </div>
      )}

      <div
        className={`ultron-panel-body ${bodyClassName}`}
        style={{
          padding: "12px",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}
