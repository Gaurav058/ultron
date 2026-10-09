"use client";

import React, { useEffect } from "react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  width?: string | number;
  position?: "right" | "left" | "bottom";
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  width = "400px",
  position = "right",
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        justifyContent: position === "right" ? "flex-end" : position === "left" ? "flex-start" : "center",
        alignItems: position === "bottom" ? "flex-end" : "stretch",
        background: "rgba(2, 8, 23, 0.65)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: position === "bottom" ? "100%" : width,
          maxHeight: position === "bottom" ? "80vh" : "100vh",
          height: position === "bottom" ? "auto" : "100%",
          background: "var(--ultron-bg-panel)",
          borderLeft: position === "right" ? "1px solid var(--ultron-border-strong)" : "none",
          borderRight: position === "left" ? "1px solid var(--ultron-border-strong)" : "none",
          borderTop: position === "bottom" ? "1px solid var(--ultron-border-strong)" : "none",
          boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--ultron-border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            background: "var(--ultron-bg-elevated)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ultron-text-primary)", margin: 0 }}>
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <div style={{ fontSize: "11px", color: "var(--ultron-text-muted)", marginTop: "2px" }}>
                {subtitle}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--ultron-text-muted)",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
              padding: "4px",
              borderRadius: "var(--radius-xs)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: ${position === "right" ? "translateX(100%)" : position === "left" ? "translateX(-100%)" : "translateY(100%)"};
          }
          to {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}
