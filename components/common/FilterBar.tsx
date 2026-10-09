"use client";

import React from "react";

export interface FilterOption {
  key: string;
  label: string;
  count?: number;
  color?: string;
}

export interface FilterBarProps {
  options: FilterOption[];
  activeKey: string;
  onChange: (key: string) => void;
  size?: "sm" | "md";
  className?: string;
}

export default function FilterBar({
  options,
  activeKey,
  onChange,
  size = "md",
  className = "",
}: FilterBarProps) {
  const padding = size === "sm" ? "3px 8px" : "5px 12px";
  const fontSize = size === "sm" ? "10px" : "11px";

  return (
    <div
      className={`filter-bar ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "wrap",
      }}
    >
      {options.map((opt) => {
        const isActive = activeKey === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            style={{
              padding,
              fontSize,
              fontWeight: 600,
              borderRadius: "var(--radius-sm)",
              border: isActive
                ? "1px solid var(--ultron-primary)"
                : "1px solid rgba(11, 42, 80, 0.5)",
              background: isActive
                ? "linear-gradient(180deg, rgba(22, 135, 255, 0.3) 0%, rgba(11, 42, 80, 0.6) 100%)"
                : "rgba(6, 19, 41, 0.6)",
              color: isActive ? "var(--ultron-text-primary)" : "var(--ultron-text-muted)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {opt.color && (
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: opt.color,
                }}
              />
            )}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  fontSize: "9px",
                  opacity: 0.8,
                  padding: "0 3px",
                  borderRadius: "var(--radius-xs)",
                  background: isActive ? "rgba(0, 217, 255, 0.2)" : "rgba(113, 135, 165, 0.15)",
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
