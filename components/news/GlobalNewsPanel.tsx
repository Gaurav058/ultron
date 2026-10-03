/**
 * ULTRON GLOBAL NEWS PANEL
 * Directive Sections 7, 17
 * Progressive rendering with initial skeletons, 5-7 ranked top news stories,
 * incremental updates, and full view-all modal with search.
 */

"use client";

import React, { useState, useEffect } from "react";
import { NewsStory } from "@/types/news";

export interface GlobalNewsPanelProps {
  stories?: NewsStory[];
  onSelectStory?: (story: NewsStory) => void;
  onViewAll?: () => void;
}

export default function GlobalNewsPanel({
  stories: propStories,
  onSelectStory,
}: GlobalNewsPanelProps) {
  const [activeTab, setActiveTab] = useState<"top" | "all">("top");
  const [stories, setStories] = useState<NewsStory[]>(propStories || []);
  const [isLoading, setIsLoading] = useState(!propStories || propStories.length === 0);
  const [showAllNewsModal, setShowAllNewsModal] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [selectedStoryDetail, setSelectedStoryDetail] = useState<NewsStory | null>(null);

  // Sync prop changes or fetch initial top stories
  useEffect(() => {
    if (propStories && propStories.length > 0) {
      setStories(propStories);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch("/api/news?limit=7")
      .then((res) => res.json())
      .then((data) => {
        if (data.stories && Array.isArray(data.stories)) {
          setStories(data.stories);
        }
      })
      .catch((err) => console.warn("Failed to fetch news:", err))
      .finally(() => setIsLoading(false));
  }, [propStories]);

  // Filter stories for modal
  const filteredModalStories = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(modalSearch.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(modalSearch.toLowerCase())) ||
      (s.location && s.location.toLowerCase().includes(modalSearch.toLowerCase()))
  );

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

      {/* STORIES STREAM: Progressive skeleton or 5-7 items */}
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
        {isLoading ? (
          // Initial Skeletons (Directive Section 17)
          Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`skel-${idx}`}
              className="ultron-card-subtle"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px",
                opacity: 0.6,
                animation: "pulse 1.5s infinite",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  background: "#08172D",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ width: "80%", height: "10px", background: "#0B2A50", borderRadius: "3px" }} />
                <div style={{ width: "45%", height: "8px", background: "#061329", borderRadius: "3px" }} />
              </div>
            </div>
          ))
        ) : (
          stories.slice(0, activeTab === "top" ? 7 : 15).map((story) => (
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
                transition: "all 0.15s ease",
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
                  {story.verificationStatus === "VERIFIED" && (
                    <span style={{ fontSize: "8.5px", color: "#00E6A8", fontWeight: 700 }}>
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER LINK: Opens full modal */}
      <div style={{ borderTop: "1px solid #0B2A50", paddingTop: "6px", marginTop: "4px" }}>
        <span
          onClick={() => setShowAllNewsModal(true)}
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

      {/* ALL NEWS COMPREHENSIVE MODAL */}
      {showAllNewsModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2, 8, 23, 0.8)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowAllNewsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "560px",
              maxHeight: "80vh",
              background: "#08172D",
              border: "1px solid #1687FF",
              borderRadius: "10px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* Header & Search */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "15px", color: "#EAF4FF", fontWeight: 700 }}>
                Global News Intelligence Feed
              </h3>
              <button
                onClick={() => setShowAllNewsModal(false)}
                style={{ background: "transparent", border: "none", color: "#7187A5", fontSize: "18px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Search news by headline, domain, or location..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
              style={{
                width: "100%",
                background: "#061329",
                border: "1px solid #0B2A50",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "#EAF4FF",
                fontSize: "12px",
                outline: "none",
              }}
            />

            {/* List */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "360px",
              }}
            >
              {filteredModalStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStoryDetail(story);
                    onSelectStory?.(story);
                  }}
                  style={{
                    background: "#061329",
                    border: "1px solid #0B2A50",
                    borderRadius: "6px",
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#EAF4FF", flex: 1 }}>
                      {story.title}
                    </span>
                    {story.verificationStatus === "VERIFIED" && (
                      <span style={{ fontSize: "9px", color: "#00E6A8", fontWeight: 700 }}>✓ VERIFIED</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "9.5px", color: "#7187A5" }}>
                    <span>{story.source}</span>
                    <span>• {story.publishedAt}</span>
                    {story.location && <span>• 📍 {story.location}</span>}
                  </div>
                  {story.summary && (
                    <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", color: "#C8D8EA", lineHeight: 1.35 }}>
                      {story.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
