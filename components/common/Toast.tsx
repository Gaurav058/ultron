"use client";

import React, { useEffect } from "react";

export interface ToastProps {
  id: string;
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  onDismiss: (id: string) => void;
  durationMs?: number;
}

export default function Toast({
  id,
  type = "info",
  title,
  message,
  onDismiss,
  durationMs = 4000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, durationMs);
    return () => clearTimeout(timer);
  }, [id, durationMs, onDismiss]);

  const getColor = () => {
    switch (type) {
      case "success":
        return { border: "var(--ultron-success)", icon: "✓" };
      case "warning":
        return { border: "var(--ultron-warning)", icon: "⚠" };
      case "error":
        return { border: "var(--ultron-error)", icon: "✕" };
      case "info":
      default:
        return { border: "var(--ultron-primary)", icon: "ℹ" };
    }
  };

  const cfg = getColor();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "10px 14px",
        background: "var(--ultron-bg-elevated)",
        border: `1px solid ${cfg.border}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
        minWidth: "260px",
        maxWidth: "360px",
        fontSize: "11px",
        color: "var(--ultron-text-primary)",
      }}
    >
      <span style={{ color: cfg.border, fontWeight: 700, fontSize: "12px" }}>
        {cfg.icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: "2px" }}>{title}</div>}
        <div style={{ color: "var(--ultron-text-secondary)", lineHeight: 1.3 }}>{message}</div>
      </div>
      <button
        onClick={() => onDismiss(id)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--ultron-text-muted)",
          cursor: "pointer",
          fontSize: "12px",
          padding: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
