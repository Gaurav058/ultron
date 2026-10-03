"use client";

import React, { useEffect, useState } from "react";

export interface UltronHeaderProps {
  systemStatus?: "online" | "degraded" | "offline";
  operatorName?: string;
  operatorRole?: string;
}

export default function UltronHeader({
  systemStatus = "online",
  operatorName = "GAURAV",
  operatorRole = "PRIME USER",
}: UltronHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header
      style={{
        height: "60px",
        background: "#020817",
        borderBottom: "1px solid #0B2A50",
        padding: "0 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        userSelect: "none",
        zIndex: 50,
        position: "sticky",
        top: 0,
      }}
    >
      {/* LEFT: ULTRON Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #00D9FF 0%, #08172D 70%, #020817 100%)",
            boxShadow: "0 0 16px rgba(0, 217, 255, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0, 217, 255, 0.6)",
          }}
        >
          {/* Delta / A Apex glyph */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L21 19H3L12 3Z"
              stroke="#EAF4FF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 9L17 19H7L12 9Z"
              fill="#00D9FF"
              fillOpacity="0.75"
            />
            <circle cx="12" cy="15" r="2" fill="#EAF4FF" />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#EAF4FF",
              letterSpacing: "0.06em",
              lineHeight: 1.1,
            }}
          >
            ULTRON OS
          </span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "#00D9FF",
              letterSpacing: "0.14em",
              lineHeight: 1.2,
              marginTop: "2px",
            }}
          >
            INTELLIGENCE OPERATING SYSTEM
          </span>
        </div>
      </div>

      {/* CENTER-RIGHT: System Status, Connected Devices, User, Clock */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* System Online Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(0, 230, 168, 0.08)",
            padding: "4px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(0, 230, 168, 0.25)",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: systemStatus === "online" ? "#00E6A8" : "#FFB020",
              boxShadow: "0 0 8px #00E6A8",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#00E6A8",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            SYSTEM ONLINE
          </span>
        </div>

        {/* Connected Devices */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderLeft: "1px solid #0B2A50",
            paddingLeft: "18px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#7187A5",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            CONNECTED DEVICES
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C8D8EA" }}>
            {/* Desktop icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            {/* Mobile icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
            </svg>
            {/* Cloud/Network icon */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
          </div>
        </div>

        {/* User Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderLeft: "1px solid #0B2A50",
            paddingLeft: "18px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1687FF 0%, #7C4DFF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #00D9FF",
              boxShadow: "0 0 10px rgba(0, 217, 255, 0.3)",
              color: "#EAF4FF",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#EAF4FF",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
              }}
            >
              {operatorName}
            </span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: 500,
                color: "#7187A5",
                letterSpacing: "0.06em",
                marginTop: "1px",
              }}
            >
              {operatorRole}
            </span>
          </div>
        </div>

        {/* Time & Date */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            borderLeft: "1px solid #0B2A50",
            paddingLeft: "18px",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#EAF4FF",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            {formattedTime}
          </span>
          <span
            style={{
              fontSize: "10px",
              color: "#7187A5",
              letterSpacing: "0.04em",
              marginTop: "1px",
            }}
          >
            {formattedDate}
          </span>
        </div>
      </div>
    </header>
  );
}
