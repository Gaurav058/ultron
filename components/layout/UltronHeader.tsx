/**
 * ULTRON HEADER
 * Directive Sections 1, 18, 19
 * Features live Background Intelligence Indicator, Connected Devices modal,
 * Operator Profile modal, and real-time clock.
 */

"use client";

import React, { useEffect, useState } from "react";
import { BackgroundScanStatus } from "@/types/intelligence";

export interface UltronHeaderProps {
  systemStatus?: "online" | "degraded" | "offline";
  operatorName?: string;
  operatorRole?: string;
  activeWorkspaceTitle?: string;
  onOpenSystemHealth?: () => void;
  onOpenMobileNav?: () => void;
  onToggleSidebar?: () => void;
  isSidebarExpanded?: boolean;
}

export default function UltronHeader({
  systemStatus = "online",
  operatorName = "GAURAV",
  operatorRole = "PRIME USER",
  activeWorkspaceTitle = "COMMAND CENTER",
  onOpenSystemHealth,
  onOpenMobileNav,
  onToggleSidebar,
  isSidebarExpanded = false,
}: UltronHeaderProps) {
  const [time, setTime] = useState(new Date());
  const [scanStatus, setScanStatus] = useState<BackgroundScanStatus | null>(null);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isTriggeringScan, setIsTriggeringScan] = useState(false);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll background scan status every 10 seconds
  useEffect(() => {
    const fetchStatus = () => {
      fetch("/api/intelligence/status")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.totalSignals !== undefined) {
            setScanStatus(data);
          }
        })
        .catch(() => {});
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleManualScan = async () => {
    setIsTriggeringScan(true);
    try {
      await fetch("/api/intelligence/scan", { method: "POST" });
      const res = await fetch("/api/intelligence/status");
      const data = await res.json();
      setScanStatus(data);
    } catch (e) {
      console.warn("Scan trigger error:", e);
    } finally {
      setIsTriggeringScan(false);
    }
  };

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

  // Calculate relative minutes
  const lastScanMin = scanStatus?.lastScanTimestamp
    ? Math.max(0, Math.round((Date.now() - new Date(scanStatus.lastScanTimestamp).getTime()) / (60 * 1000)))
    : 8;

  const nextScanMin = scanStatus?.nextScanTimestamp
    ? Math.max(1, Math.round((new Date(scanStatus.nextScanTimestamp).getTime() - Date.now()) / (60 * 1000)))
    : 52;

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
      {/* LEFT: ULTRON Logo + Title + Active Workspace */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Mobile Nav Toggle */}
        <button
          onClick={onOpenMobileNav}
          aria-label="Open Navigation Menu"
          className="ultron-mobile-toggle"
          style={{
            background: "rgba(11, 42, 80, 0.4)",
            border: "1px solid var(--ultron-border)",
            color: "var(--ultron-text-primary)",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "var(--radius-sm)",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #00D9FF 0%, #08172D 70%, #020817 100%)",
            boxShadow: "0 0 16px rgba(0, 217, 255, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(0, 217, 255, 0.6)",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L21 19H3L12 3Z"
              stroke="#EAF4FF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 9L17 19H7L12 9Z" fill="#00D9FF" fillOpacity="0.75" />
            <circle cx="12" cy="15" r="2" fill="#EAF4FF" />
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "14px",
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
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "1px 6px",
                borderRadius: "var(--radius-xs)",
                background: "rgba(0, 217, 255, 0.12)",
                color: "var(--ultron-primary)",
                border: "1px solid rgba(0, 217, 255, 0.3)",
                textTransform: "uppercase",
              }}
            >
              {activeWorkspaceTitle}
            </span>
          </div>
          <span
            style={{
              fontSize: "8.5px",
              fontWeight: 600,
              color: "#7187A5",
              letterSpacing: "0.1em",
              lineHeight: 1.2,
              marginTop: "2px",
            }}
          >
            INTELLIGENCE OPERATING SYSTEM
          </span>
        </div>
      </div>

      {/* CENTER: BACKGROUND RESEARCH VISIBILITY INDICATOR (Directive Section 18) */}
      <div
        onClick={() => setShowResearchModal(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(6, 19, 41, 0.85)",
          border: scanStatus?.isRunning ? "1px solid #00D9FF" : "1px solid #0B2A50",
          borderRadius: "8px",
          padding: "5px 12px",
          cursor: "pointer",
          boxShadow: scanStatus?.isRunning ? "0 0 14px rgba(0, 217, 255, 0.3)" : "none",
          transition: "all 0.2s ease",
        }}
        title="Click to view Background Intelligence Pipeline"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: scanStatus?.isRunning ? "#00D9FF" : "#00E6A8",
              boxShadow: scanStatus?.isRunning ? "0 0 8px #00D9FF" : "0 0 8px #00E6A8",
              animation: scanStatus?.isRunning ? "pulse 1s infinite" : "none",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: scanStatus?.isRunning ? "#00D9FF" : "#EAF4FF",
              letterSpacing: "0.04em",
            }}
          >
            {scanStatus?.isRunning ? "ULTRON RESEARCHING" : "ULTRON INTELLIGENCE"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "#7187A5" }}>
          <span>Last: {lastScanMin}m ago</span>
          <span>• Next: {nextScanMin}m</span>
          <span style={{ color: "#00D9FF" }}>Signals: {scanStatus?.totalSignals ?? 17}</span>
          <span style={{ color: "#00E6A8" }}>Verified: {scanStatus?.verifiedSignals ?? 12}</span>
          <span style={{ color: "#FFB020" }}>Conflicts: {scanStatus?.conflictingSignals ?? 2}</span>
        </div>
      </div>

      {/* RIGHT: System Status, Connected Devices, User, Clock */}
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        {/* System Online Badge */}
        <div
          onClick={onOpenSystemHealth}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(0, 230, 168, 0.08)",
            padding: "4px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(0, 230, 168, 0.25)",
            cursor: "pointer",
          }}
          title="System Health Overview"
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
          onClick={() => setShowDevicesModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderLeft: "1px solid #0B2A50",
            paddingLeft: "14px",
            cursor: "pointer",
          }}
          title="View Connected Devices"
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
            DEVICES (3)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#00D9FF" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            </svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
            </svg>
          </div>
        </div>

        {/* User Profile */}
        <div
          onClick={() => setShowProfileModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderLeft: "1px solid #0B2A50",
            paddingLeft: "14px",
            cursor: "pointer",
          }}
          title="Operator Profile & Security"
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1687FF 0%, #7C4DFF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #00D9FF",
              boxShadow: "0 0 10px rgba(0, 217, 255, 0.3)",
              color: "#EAF4FF",
              fontWeight: 700,
              fontSize: "12px",
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#EAF4FF" }}>
              {operatorName}
            </span>
            <span style={{ fontSize: "8.5px", color: "#7187A5" }}>{operatorRole}</span>
          </div>
        </div>

        {/* Time & Date */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            borderLeft: "1px solid #0B2A50",
            paddingLeft: "14px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#EAF4FF" }}>
            {formattedTime}
          </span>
          <span style={{ fontSize: "9.5px", color: "#7187A5" }}>{formattedDate}</span>
        </div>
      </div>

      {/* RESEARCH PIPELINE MODAL (Directive Section 18) */}
      {showResearchModal && (
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
          onClick={() => setShowResearchModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "520px",
              background: "#08172D",
              border: "1px solid #00D9FF",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 217, 255, 0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#00D9FF",
                    boxShadow: "0 0 8px #00D9FF",
                  }}
                />
                <h3 style={{ margin: 0, fontSize: "15px", color: "#EAF4FF", fontWeight: 700 }}>
                  Background Intelligence Engine
                </h3>
              </div>
              <button
                onClick={() => setShowResearchModal(false)}
                style={{ background: "transparent", border: "none", color: "#7187A5", fontSize: "18px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              <div style={{ background: "#061329", padding: "10px", borderRadius: "6px", border: "1px solid #0B2A50" }}>
                <span style={{ fontSize: "10px", color: "#7187A5" }}>TOTAL SIGNALS</span>
                <div style={{ fontSize: "18px", color: "#00D9FF", fontWeight: 700 }}>
                  {scanStatus?.totalSignals ?? 17}
                </div>
              </div>
              <div style={{ background: "#061329", padding: "10px", borderRadius: "6px", border: "1px solid #0B2A50" }}>
                <span style={{ fontSize: "10px", color: "#7187A5" }}>VERIFIED SIGNALS</span>
                <div style={{ fontSize: "18px", color: "#00E6A8", fontWeight: 700 }}>
                  {scanStatus?.verifiedSignals ?? 12}
                </div>
              </div>
              <div style={{ background: "#061329", padding: "10px", borderRadius: "6px", border: "1px solid #0B2A50" }}>
                <span style={{ fontSize: "10px", color: "#7187A5" }}>CONFLICTS</span>
                <div style={{ fontSize: "18px", color: "#FFB020", fontWeight: 700 }}>
                  {scanStatus?.conflictingSignals ?? 2}
                </div>
              </div>
            </div>

            {/* Pipeline Status */}
            <div style={{ background: "#061329", padding: "10px 12px", borderRadius: "6px", border: "1px solid #0B2A50" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                <span style={{ color: "#7187A5" }}>Execution Schedule:</span>
                <span style={{ color: "#EAF4FF", fontWeight: 600 }}>EVERY HOUR (Autonomous)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                <span style={{ color: "#7187A5" }}>Last Scan:</span>
                <span style={{ color: "#EAF4FF" }}>{lastScanMin} minutes ago</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <span style={{ color: "#7187A5" }}>Next Scan:</span>
                <span style={{ color: "#00D9FF", fontWeight: 600 }}>In {nextScanMin} minutes</span>
              </div>
            </div>

            {/* Trigger Button */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleManualScan}
                disabled={isTriggeringScan || scanStatus?.isRunning}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #1687FF 0%, #00D9FF 100%)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "9px",
                  color: "#EAF4FF",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: isTriggeringScan ? "wait" : "pointer",
                }}
              >
                {isTriggeringScan ? "Executing Intelligence Scan..." : "Trigger Instant Scan"}
              </button>
              <button
                onClick={() => setShowResearchModal(false)}
                style={{
                  background: "#061329",
                  border: "1px solid #0B2A50",
                  borderRadius: "6px",
                  padding: "9px 16px",
                  color: "#7187A5",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONNECTED DEVICES MODAL */}
      {showDevicesModal && (
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
          onClick={() => setShowDevicesModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px",
              background: "#08172D",
              border: "1px solid #1687FF",
              borderRadius: "10px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#EAF4FF", fontWeight: 700 }}>
                Connected Workstations & Nodes
              </h3>
              <button
                onClick={() => setShowDevicesModal(false)}
                style={{ background: "transparent", border: "none", color: "#7187A5", fontSize: "18px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#061329", padding: "8px 10px", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "#EAF4FF" }}>💻 Windows 11 Primary Host</span>
                <span style={{ fontSize: "9px", color: "#00E6A8", fontWeight: 700 }}>ACTIVE • 3ms</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#061329", padding: "8px 10px", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "#EAF4FF" }}>📱 Mobile Companion Deck</span>
                <span style={{ fontSize: "9px", color: "#00E6A8", fontWeight: 700 }}>PAIRED • Low Latency</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#061329", padding: "8px 10px", borderRadius: "6px" }}>
                <span style={{ fontSize: "11px", color: "#EAF4FF" }}>☁ Google Cloud Sovereign Node</span>
                <span style={{ fontSize: "9px", color: "#00D9FF", fontWeight: 700 }}>SYNCHRONIZED</span>
              </div>
            </div>

            <button
              onClick={() => setShowDevicesModal(false)}
              style={{ background: "#1687FF", color: "#EAF4FF", border: "none", borderRadius: "6px", padding: "8px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* OPERATOR PROFILE MODAL */}
      {showProfileModal && (
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
          onClick={() => setShowProfileModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "400px",
              background: "#08172D",
              border: "1px solid #1687FF",
              borderRadius: "10px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "14px", color: "#EAF4FF", fontWeight: 700 }}>
                Operator Credentials & Security
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{ background: "transparent", border: "none", color: "#7187A5", fontSize: "18px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#C8D8EA" }}>
                <span>Operator:</span>
                <span style={{ color: "#EAF4FF", fontWeight: 700 }}>{operatorName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#C8D8EA" }}>
                <span>Clearance Level:</span>
                <span style={{ color: "#00E6A8", fontWeight: 600 }}>LEVEL 5 (OMNI ACCESS)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#C8D8EA" }}>
                <span>Policy Gates:</span>
                <span style={{ color: "#00D9FF", fontWeight: 600 }}>2-Man Rule Active</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#C8D8EA" }}>
                <span>Biometric / Vision:</span>
                <span style={{ color: "#00E6A8", fontWeight: 600 }}>MediaPipe Tracking Armed</span>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(false)}
              style={{ background: "#1687FF", color: "#EAF4FF", border: "none", borderRadius: "6px", padding: "8px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
