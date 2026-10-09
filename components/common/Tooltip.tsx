"use client";

import React, { useState } from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  content,
  children,
  position = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: 9999,
            bottom: position === "top" ? "calc(100% + 6px)" : undefined,
            top: position === "bottom" ? "calc(100% + 6px)" : undefined,
            left: position === "top" || position === "bottom" ? "50%" : undefined,
            right: position === "left" ? "calc(100% + 6px)" : undefined,
            transform:
              position === "top" || position === "bottom"
                ? "translateX(-50%)"
                : undefined,
            padding: "4px 8px",
            background: "var(--ultron-bg-elevated)",
            border: "1px solid var(--ultron-border-strong)",
            borderRadius: "var(--radius-sm)",
            fontSize: "10px",
            fontWeight: 500,
            color: "var(--ultron-text-primary)",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
            pointerEvents: "none",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
