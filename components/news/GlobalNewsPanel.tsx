"use client";

import React, { useState } from "react";
import { NewsStory } from "@/types/news";

export interface GlobalNewsPanelProps {
  stories?: NewsStory[];
  onSelectStory?: (story: NewsStory) => void;
  onViewAll?: () => void;
}

export default function GlobalNewsPanel({
  stories = [],
  onSelectStory,
  onViewAll,
}: GlobalNewsPanelProps) {
  const [activeTab, setActiveTab] = useState<"top" | "all">("top");

  return (
    <div
      className="ultron-panel-base"
      style={{
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "12px 14px 10px 14px",
        overflow: "hidden",
      }}
    >
      {/* HEADER: Title & Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #0B2A50",
          paddingBottom: "8px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#EAF4FF",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          GLOBAL NEWS
        </span>

        {/* Tabs: Top News / All News */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setActiveTab("top")}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "top" ? "2px solid #00D9FF" : "2px solid transparent",
              padding: "2px 0",
              fontSize: "10.5px",
              fontWeight: 600,
              color: activeTab === "top" ? "#00D9FF" : "#7187A5",
              cursor: "pointer",
            }}
          >
            Top News
          </button>
          <button
            onClick={() => setActiveTab("all")}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "all" ? "2px solid #00D9FF" : "2px solid transparent",
              padding: "2px 0",
              fontSize: "10.5px",
              fontWeight: 600,
              color: activeTab === "all" ? "#00D9FF" : "#7187A5",
              cursor: "pointer",
            }}
          >
            All News
          </button>
        </div>
      </div>

      {/* STORIES STREAM (5 items) */}
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
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory?.(story)}
            className="ultron-card-subtle"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "6px 8px",
              cursor: "pointer",
            }}
          >
            {/* Square Thumbnail */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "6px",
                background: "linear-gradient(135deg, #0B2A50 0%, #061329 100%)",
                border: "1px solid #123F70",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {story.imageUrl ? (
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span style={{ fontSize: "14px" }}>📡</span>
              )}
            </div>

            {/* Content: Title & Meta */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#EAF4FF",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {story.title}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "9px", color: "#7187A5" }}>{story.publishedAt}</span>
                {story.category && (
                  <span
                    style={{
                      fontSize: "8.5px",
                      color: "#00D9FF",
                      background: "rgba(0, 217, 255, 0.12)",
                      padding: "0 4px",
                      borderRadius: "3px",
                      fontWeight: 600,
                    }}
                  >
                    {story.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
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
          View All News →
        </span>
      </div>
    </div>
  );
}
