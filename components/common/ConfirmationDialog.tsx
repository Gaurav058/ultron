"use client";

import React, { useEffect } from "react";
import UltronButton from "./UltronButton";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
}: ConfirmationDialogProps) {
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
        zIndex: 9500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(2, 8, 23, 0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "420px",
          background: "var(--ultron-bg-panel)",
          border: isDestructive ? "1px solid var(--ultron-error)" : "1px solid var(--ultron-border-strong)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isDestructive && <span style={{ color: "var(--ultron-error)", fontSize: "16px" }}>⚠</span>}
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: isDestructive ? "var(--ultron-error)" : "var(--ultron-text-primary)",
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        <div style={{ fontSize: "12px", color: "var(--ultron-text-secondary)", lineHeight: 1.5 }}>
          {message}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
          <UltronButton variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </UltronButton>
          <UltronButton
            variant={isDestructive ? "danger" : "primary"}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </UltronButton>
        </div>
      </div>
    </div>
  );
}
