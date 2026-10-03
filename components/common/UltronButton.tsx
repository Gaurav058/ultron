"use client";

import React, { useState } from "react";

export type UltronButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type UltronButtonSize = "sm" | "md" | "lg";

export interface UltronButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: UltronButtonVariant;
  size?: UltronButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function UltronButton({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  style,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: UltronButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          background: isHovered && !disabled ? "rgba(99, 232, 255, 0.16)" : "rgba(99, 232, 255, 0.10)",
          border: "1px solid rgba(99, 232, 255, 0.35)",
          color: "#63E8FF",
          boxShadow: isHovered && !disabled ? "0 0 16px rgba(99, 232, 255, 0.18)" : "none",
        };
      case "danger":
        return {
          background: isHovered && !disabled ? "rgba(255, 102, 122, 0.20)" : "rgba(255, 102, 122, 0.10)",
          border: "1px solid rgba(255, 102, 122, 0.35)",
          color: "#FF667A",
          boxShadow: isHovered && !disabled ? "0 0 16px rgba(255, 102, 122, 0.20)" : "none",
        };
      case "ghost":
        return {
          background: isHovered && !disabled ? "rgba(99, 232, 255, 0.08)" : "transparent",
          border: "1px solid transparent",
          color: isHovered && !disabled ? "#63E8FF" : "#AAB8D4",
        };
      case "secondary":
      default:
        return {
          background: isHovered && !disabled ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(105, 150, 255, 0.20)",
          color: isHovered && !disabled ? "#EAF2FF" : "#C9D5EA",
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "sm":
        return {
          padding: "4px 8px",
          fontSize: "11px",
          borderRadius: "4px",
          gap: "4px",
        };
      case "lg":
        return {
          padding: "10px 18px",
          fontSize: "13px",
          borderRadius: "8px",
          gap: "8px",
        };
      case "md":
      default:
        return {
          padding: "6px 12px",
          fontSize: "12px",
          borderRadius: "6px",
          gap: "6px",
        };
    }
  };

  return (
    <button
      className={`ultron-btn ${className}`}
      disabled={disabled}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave?.(e);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "var(--ultron-font)",
        fontWeight: 500,
        letterSpacing: "0.5px",
        outline: "none",
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
}
