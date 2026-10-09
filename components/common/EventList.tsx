"use client";

import React from "react";

export interface EventListItem {
  id: string;
  title: string;
  category: string;
  location?: string;
  timestamp: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sourceName?: string;
  summary?: string;
  coordinates?: { lat: number; lon: number };
}

export interface EventListProps {
  items: EventListItem[];
  selectedId?: string;
  onSelect: (item: EventListItem) => void;
  emptyMessage?: string;
}

export default function EventList({
  items,
  selectedId,
  onSelect,
  emptyMessage = "No events matching active filters",
}: EventListProps) {
  if (items.length === 0) {
    return (
      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          color: "var(--ultron-text-muted)",
          fontSize: "11px",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  const getCategoryColor = (cat: string) => {
    switch (cat.toUpperCase()) {
      case "CONFLICT":
      case "SECURITY":
        return "var(--ultron-error)";
      case "DISASTER":
      case "EARTHQUAKE":
      case "WEATHER":
        return "var(--ultron-warning)";
      case "GEOPOLITICS":
        return "var(--ultron-primary)";
      case "MARITIME":
      case "AVIATION":
        return "var(--ultron-blue)";
      case "CYBER":
        return "var(--ultron-purple)";
      default:
        return "var(--ultron-success)";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const catColor = getCategoryColor(item.category);

        return (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              background: isSelected
                ? "linear-gradient(90deg, rgba(22, 135, 255, 0.22) 0%, rgba(11, 42, 80, 0.4) 100%)"
                : "rgba(6, 19, 41, 0.6)",
              border: isSelected
                ? "1px solid var(--ultron-primary)"
                : "1px solid rgba(11, 42, 80, 0.5)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "var(--ultron-bg-hover)";
                e.currentTarget.style.borderColor = "rgba(0, 217, 255, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = "rgba(6, 19, 41, 0.6)";
                e.currentTarget.style.borderColor = "rgba(11, 42, 80, 0.5)";
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: isSelected ? "var(--ultron-text-primary)" : "var(--ultron-text-secondary)",
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </div>

              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "1px 5px",
                  borderRadius: "var(--radius-xs)",
                  background: `${catColor}18`,
                  color: catColor,
                  border: `1px solid ${catColor}35`,
                  whiteSpace: "nowrap",
                }}
              >
                {item.category}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "var(--ultron-text-muted)",
                marginTop: "2px",
              }}
            >
              <span>{item.location || (item.coordinates ? `[${item.coordinates.lat.toFixed(1)}°, ${item.coordinates.lon.toFixed(1)}°]` : "Global Scope")}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{item.timestamp}</span>
            </div>

            {item.sourceName && (
              <div style={{ fontSize: "9px", color: "var(--ultron-text-muted)", opacity: 0.8 }}>
                Source: {item.sourceName}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
