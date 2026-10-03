"use client";

import React, { useState } from "react";
import UltronStatus, { UltronStatusType } from "../common/UltronStatus";

export interface TopSystemBarProps {
  coreStatus?: string;
  doctorHealth?: string;
  time: Date;
  onOpenApprovals?: () => void;
  pendingGatesCount?: number;
}

export default function TopSystemBar({
  coreStatus = "ONLINE",
  doctorHealth = "OPTIMAL",
  time,
  onOpenApprovals,
  pendingGatesCount = 0,
}: TopSystemBarProps) {
  const [showUserPopover, setShowUserPopover] = useState(false);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).toUpperCase();

  const mapCoreStatus = (st: string): UltronStatusType => {
    switch (st.toUpperCase()) {
      case "ONLINE":
      case "IDLE":
      case "SUCCESS":
        return "ONLINE";
      case "RUNNING":
      case "EXECUTING":
      case "THINKING":
      case "PLANNING":
        return "RUNNING";
      case "WAITING":
      case "LISTENING":
        return "WAITING";
      case "DEGRADED":
        return "DEGRADED";
      case "FAILED":
      case "ERROR":
        return "ERROR";
      case "OFFLINE":
        return "OFFLINE";
      default:
        return "READY";
    }
  };

  return (
    <header
      className="top-system-bar"
      style={{
        height: "48px",
        minHeight: "48px",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(4, 7, 20, 0.95)",
        borderBottom: "1px solid rgba(105, 150, 255, 0.20)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        position: "relative",
        zIndex: 50,
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* Left: ULTRON Brand + Subtitle */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#63E8FF",
            boxShadow: "0 0 10px #63E8FF",
          }}
        />
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "1.2px",
              color: "#EAF2FF",
              lineHeight: 1,
            }}
          >
            ULTRON
          </div>
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.8px",
              color: "#71809D",
              marginTop: "2px",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            INTELLIGENCE OPERATING SYSTEM
          </div>
        </div>
      </div>

      {/* Center/Right: System Telemetry, Gaurav Operator, Time */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Core Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <UltronStatus
            status={mapCoreStatus(coreStatus)}
            label={`CORE ${coreStatus === "IDLE" ? "ONLINE" : coreStatus}`}
            size="sm"
          />
        </div>

        {/* Connected Device */}
        <div
          className="hidden md:flex"
          style={{
            alignItems: "center",
            gap: "5px",
            padding: "3px 8px",
            borderRadius: "4px",
            background: "rgba(105, 150, 255, 0.05)",
            border: "1px solid rgba(105, 150, 255, 0.15)",
            fontSize: "11px",
            color: "#AAB8D4",
          }}
        >
          <span style={{ color: "#63E8FF", fontSize: "10px" }}>▣</span>
          <span style={{ fontWeight: 500 }}>DESKTOP CONNECTED</span>
        </div>

        {/* Prime User Gaurav with Interactive Profile Popover */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowUserPopover(!showUserPopover)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 9px",
              borderRadius: "5px",
              background: showUserPopover ? "rgba(99, 232, 255, 0.14)" : "rgba(99, 232, 255, 0.06)",
              border: "1px solid rgba(99, 232, 255, 0.28)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            aria-label="Prime Operator Profile"
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#5FF0A0",
                boxShadow: "0 0 6px #5FF0A0",
              }}
            />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF", letterSpacing: "0.5px" }}>
              GAURAV
            </span>
          </button>

          {/* User Profile Popover */}
          {showUserPopover && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "240px",
                background: "rgba(7, 11, 28, 0.96)",
                border: "1px solid rgba(105, 150, 255, 0.30)",
                borderRadius: "8px",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 232, 255, 0.12)",
                backdropFilter: "blur(20px)",
                padding: "12px",
                zIndex: 100,
                color: "#EAF2FF",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "8px",
                  marginBottom: "8px",
                  borderBottom: "1px solid rgba(105, 150, 255, 0.15)",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#63E8FF", letterSpacing: "0.6px" }}>
                  OPERATOR PROFILE
                </div>
                <button
                  type="button"
                  onClick={() => setShowUserPopover(false)}
                  style={{
                    fontSize: "12px",
                    color: "#71809D",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#71809D" }}>NAME</span>
                  <span style={{ fontWeight: 600, color: "#EAF2FF" }}>GAURAV</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#71809D" }}>ROLE</span>
                  <span style={{ fontWeight: 600, color: "#C9D5EA" }}>PRIME ARCHITECT</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#71809D" }}>AUTHORITY</span>
                  <span style={{ fontWeight: 600, color: "#5FF0A0" }}>LEVEL 5 (SOVEREIGN)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#71809D" }}>CONNECTED</span>
                  <span style={{ fontWeight: 600, color: "#63E8FF" }}>DESKTOP + MESH</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#71809D" }}>ZERO-TRUST</span>
                  <span style={{ fontWeight: 600, color: "#5FF0A0" }}>VERIFIED</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Time */}
        <div className="hidden sm:flex" style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#EAF2FF", fontFamily: "var(--font-mono)" }}>
            {formattedTime}
          </span>
          <span style={{ fontSize: "9px", color: "#71809D", letterSpacing: "0.5px" }}>
            {formattedDate}
          </span>
        </div>

        {/* System Diagnostics Health */}
        <div className="hidden lg:flex" style={{ alignItems: "center" }}>
          <UltronStatus
            status={doctorHealth === "OPTIMAL" || doctorHealth === "HEALTHY" ? "ONLINE" : "DEGRADED"}
            label={`SYS: ${doctorHealth}`}
            size="sm"
          />
        </div>

        {/* Pending approvals badge if any */}
        {pendingGatesCount > 0 && (
          <button
            type="button"
            onClick={onOpenApprovals}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 7px",
              borderRadius: "4px",
              background: "rgba(255, 209, 102, 0.15)",
              border: "1px solid rgba(255, 209, 102, 0.40)",
              color: "#FFD166",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <span>⚠</span>
            <span>{pendingGatesCount} GATE</span>
          </button>
        )}
      </div>
    </header>
  );
}
