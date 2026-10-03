"use client";

import React, { useState } from "react";
import { MissionItem, ChatMessage } from "@/types/mission";

export interface MissionsAndChatPanelProps {
  missions: MissionItem[];
  activeMissionId?: string;
  onSelectMission?: (id: string) => void;
  onNewMission?: () => void;
  chatMessages: ChatMessage[];
  onSendMessage?: (text: string) => void;
  isProcessing?: boolean;
}

export default function MissionsAndChatPanel({
  missions,
  activeMissionId,
  onSelectMission,
  onNewMission,
  chatMessages,
  onSendMessage,
  isProcessing = false,
}: MissionsAndChatPanelProps) {
  const [activeTab, setActiveTab] = useState<"missions" | "chat">("missions");
  const [inputText, setInputText] = useState("");

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    onSendMessage?.(inputText.trim());
    setInputText("");
  };

  const activeCount = missions.filter(
    (m) => m.status === "running" || m.status === "planning"
  ).length;

  return (
    <div
      className="ultron-panel-base"
      style={{
        width: "295px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* PANEL HEADER: Title & Tabs */}
      <div
        style={{
          padding: "14px 14px 10px 14px",
          borderBottom: "1px solid #0B2A50",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#EAF4FF",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            MISSIONS & CHAT
          </span>
        </div>

        {/* Segmented Tabs & + New Mission Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(3, 13, 31, 0.8)",
              padding: "2px",
              borderRadius: "6px",
              border: "1px solid #0B2A50",
            }}
          >
            <button
              onClick={() => setActiveTab("missions")}
              style={{
                background: activeTab === "missions" ? "#0B2A50" : "transparent",
                border: "none",
                borderRadius: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: 600,
                color: activeTab === "missions" ? "#00D9FF" : "#7187A5",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              Active Missions
              <span
                style={{
                  background: activeTab === "missions" ? "#1687FF" : "rgba(11, 42, 80, 0.6)",
                  color: "#EAF4FF",
                  borderRadius: "10px",
                  padding: "1px 5px",
                  fontSize: "9px",
                  fontWeight: 700,
                }}
              >
                {activeCount || 2}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("chat")}
              style={{
                background: activeTab === "chat" ? "#0B2A50" : "transparent",
                border: "none",
                borderRadius: "5px",
                padding: "4px 8px",
                fontSize: "11px",
                fontWeight: 600,
                color: activeTab === "chat" ? "#00D9FF" : "#7187A5",
                cursor: "pointer",
              }}
            >
              Chat
            </button>
          </div>

          {/* + New Mission Action Button */}
          <button
            onClick={onNewMission}
            style={{
              background: "rgba(0, 217, 255, 0.08)",
              border: "1px solid rgba(0, 217, 255, 0.4)",
              borderRadius: "6px",
              padding: "4px 9px",
              fontSize: "10px",
              fontWeight: 600,
              color: "#00D9FF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 217, 255, 0.2)";
              e.currentTarget.style.borderColor = "#00D9FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0, 217, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(0, 217, 255, 0.4)";
            }}
          >
            <span style={{ fontSize: "12px", lineHeight: 1 }}>+</span> New Mission
          </button>
        </div>
      </div>

      {/* MISSIONS STREAM */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          scrollbarWidth: "none",
        }}
      >
        {missions.map((mission) => {
          const isSelected = activeMissionId === mission.id;
          const isRunning = mission.status === "running" || mission.status === "planning";
          const isCompleted = mission.status === "completed";
          const isFailed = mission.status === "failed";
          const isQueued = mission.status === "queued" || mission.status === "waiting";

          return (
            <div
              key={mission.id}
              onClick={() => onSelectMission?.(mission.id)}
              className="ultron-card-subtle"
              style={{
                padding: "9px 11px",
                cursor: "pointer",
                border: isSelected ? "1px solid #00D9FF" : "1px solid #0B2A50",
                boxShadow: isSelected ? "0 0 10px rgba(0, 217, 255, 0.2)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {/* Row 1: Icon, Title, Status & Progress */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", flex: 1, minWidth: 0 }}>
                  {/* Category / Initial Badge */}
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: isRunning
                        ? "rgba(0, 217, 255, 0.15)"
                        : isCompleted
                        ? "rgba(0, 230, 168, 0.15)"
                        : isFailed
                        ? "rgba(255, 77, 103, 0.15)"
                        : "rgba(113, 135, 165, 0.15)",
                      border: `1px solid ${
                        isRunning ? "#00D9FF" : isCompleted ? "#00E6A8" : isFailed ? "#FF4D67" : "#7187A5"
                      }`,
                      color: isRunning ? "#00D9FF" : isCompleted ? "#00E6A8" : isFailed ? "#FF4D67" : "#7187A5",
                      fontSize: "9px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {mission.title.charAt(0)}
                  </div>

                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#EAF4FF",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {mission.title}
                  </span>
                </div>

                {/* Status Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  {isRunning && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#00E6A8",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#00E6A8",
                          boxShadow: "0 0 5px #00E6A8",
                        }}
                      />
                      {mission.progress ? `• ${mission.progress}%` : "Running"}
                    </span>
                  )}
                  {isCompleted && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#00E6A8" }}>
                      • Completed
                    </span>
                  )}
                  {isFailed && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#FF4D67" }}>
                      • Failed
                    </span>
                  )}
                  {isQueued && (
                    <span style={{ fontSize: "10px", color: "#7187A5" }}>Queued</span>
                  )}
                </div>
              </div>

              {/* Row 2: Description */}
              {mission.description && (
                <p
                  style={{
                    fontSize: "10.5px",
                    color: "#7187A5",
                    lineHeight: 1.3,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {mission.description}
                </p>
              )}

              {/* Row 3: Relative Time */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                <span style={{ fontSize: "9.5px", color: "#435873" }}>
                  {mission.timeAgo || "2h 12m ago"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOWER SECTION: RECENT CHAT ACTIVITY */}
      <div
        style={{
          borderTop: "1px solid #0B2A50",
          background: "rgba(3, 13, 31, 0.6)",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxHeight: "260px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#C8D8EA",
              letterSpacing: "0.05em",
            }}
          >
            Recent Chat
          </span>
        </div>

        {/* Chat message bubbles */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            overflowY: "auto",
            maxHeight: "150px",
            scrollbarWidth: "none",
          }}
        >
          {chatMessages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: isUser ? "flex-start" : "stretch",
                  gap: "2px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: isUser ? "#1687FF" : "#00D9FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#020817",
                    }}
                  >
                    {isUser ? "U" : "A"}
                  </div>
                  <span style={{ fontSize: "9px", color: "#435873" }}>{msg.timestamp}</span>
                </div>

                <div
                  style={{
                    background: isUser ? "rgba(22, 135, 255, 0.12)" : "rgba(8, 23, 45, 0.9)",
                    border: isUser ? "1px solid rgba(22, 135, 255, 0.3)" : "1px solid #0B2A50",
                    borderRadius: "6px",
                    padding: "6px 8px",
                    fontSize: "10.5px",
                    color: isUser ? "#EAF4FF" : "#C8D8EA",
                    lineHeight: 1.35,
                  }}
                >
                  {msg.text}

                  {msg.badge && (
                    <div style={{ marginTop: "4px" }}>
                      <span
                        style={{
                          background: "rgba(0, 217, 255, 0.12)",
                          border: "1px solid rgba(0, 217, 255, 0.4)",
                          color: "#00D9FF",
                          borderRadius: "4px",
                          padding: "1px 5px",
                          fontSize: "8.5px",
                          fontWeight: 600,
                        }}
                      >
                        {msg.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini Chat Input */}
        <form
          onSubmit={handleSend}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#08172D",
            border: "1px solid #0B2A50",
            borderRadius: "6px",
            padding: "2px 6px",
            gap: "6px",
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "11px",
              color: "#EAF4FF",
              padding: "4px 2px",
            }}
          />
          <button
            type="submit"
            disabled={isProcessing || !inputText.trim()}
            style={{
              background: "transparent",
              border: "none",
              color: inputText.trim() ? "#00D9FF" : "#435873",
              cursor: inputText.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
