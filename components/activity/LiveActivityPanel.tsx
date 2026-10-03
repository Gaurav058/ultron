"use client";

import React from "react";

export interface ActivityFeedItem {
  timestamp: string;
  source: string;
  event: string;
  status: string;
}

export interface LiveActivityPanelProps {
  items?: ActivityFeedItem[];
  onViewAll?: () => void;
}

export default function LiveActivityPanel({
  items = [
    { timestamp: "10:42", source: "Researcher", event: "Fetched 12 sources", status: "ONLINE" },
    { timestamp: "10:38", source: "Analyst", event: "Completed analysis", status: "ONLINE" },
    { timestamp: "10:32", source: "Conductor", event: "Mission created", status: "ONLINE" },
    { timestamp: "10:21", source: "Memory", event: "Stored 5 new facts", status: "ONLINE" },
    { timestamp: "10:18", source: "Web Search", event: "Results retrieved", status: "ONLINE" },
    { timestamp: "10:12", source: "Agent", event: "Updated status", status: "ONLINE" },
  ],
  onViewAll,
}: LiveActivityPanelProps) {
  const getActorColor = (source: string) => {
    switch (source.toLowerCase()) {
      case "researcher":
        return "#00D9FF";
      case "analyst":
        return "#7C4DFF";
      case "conductor":
        return "#1687FF";
      case "memory":
        return "#1687FF";
      case "web search":
        return "#00E6A8";
      default:
        return "#FFB020";
    }
  };

  return (
    <div
      className="ultron-panel-base"
      style={{
        width: "195px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px 12px",
        flexShrink: 0,
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#EAF4FF",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          LIVE ACTIVITY
        </span>
      </div>

      {/* ITEMS LIST */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          scrollbarWidth: "none",
        }}
      >
        {items.map((item, idx) => {
          const color = getActorColor(item.source);
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                borderBottom: idx < items.length - 1 ? "1px solid rgba(11, 42, 80, 0.4)" : "none",
                paddingBottom: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: color,
                    }}
                  />
                  <span style={{ fontSize: "9px", color: "#7187A5" }}>{item.timestamp}</span>
                </div>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: color,
                  }}
                >
                  {item.source}
                </span>
              </div>

              <span
                style={{
                  fontSize: "10px",
                  color: "#C8D8EA",
                  lineHeight: 1.25,
                }}
              >
                {item.event}
              </span>
            </div>
          );
        })}
      </div>

      {/* FOOTER LINK */}
      <div style={{ borderTop: "1px solid #0B2A50", paddingTop: "6px", marginTop: "4px" }}>
        <span
          onClick={onViewAll}
          style={{
            fontSize: "9.5px",
            fontWeight: 600,
            color: "#00D9FF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "3px",
          }}
        >
          View All Activity →
        </span>
      </div>
    </div>
  );
}
