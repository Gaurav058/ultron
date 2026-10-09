"use client";

import React from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: string[];
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`page-header ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "12px 16px",
        background: "rgba(6, 19, 41, 0.75)",
        border: "1px solid var(--ultron-border)",
        borderRadius: "var(--radius-lg)",
        backdropFilter: "blur(12px)",
        marginBottom: "12px",
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            color: "var(--ultron-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span>{crumb}</span>
              {idx < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--ultron-text-primary)",
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            {title}
          </h1>
          {badge}
        </div>

        {actions && <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>{actions}</div>}
      </div>

      {subtitle && (
        <div
          style={{
            fontSize: "12px",
            color: "var(--ultron-text-secondary)",
            lineHeight: 1.4,
            maxWidth: "960px",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
