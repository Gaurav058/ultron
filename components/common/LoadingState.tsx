"use client";

import React from "react";

export interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingState({
  message = "Acquiring telemetry...",
  size = "md",
}: LoadingStateProps) {
  const spinnerSize = size === "lg" ? 28 : size === "md" ? 20 : 14;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "24px",
        width: "100%",
        color: "var(--ultron-text-muted)",
        fontSize: "11px",
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: "2px solid rgba(0, 217, 255, 0.15)",
          borderTopColor: "var(--ultron-primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span>{message}</span>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
