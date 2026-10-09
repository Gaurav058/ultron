"use client";

import React from "react";

export interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  width?: string | number;
  onClear?: () => void;
  disabled?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  width = "220px",
  onClear,
  disabled = false,
}: SearchInputProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--ultron-text-muted)"
        strokeWidth="2"
        style={{
          position: "absolute",
          left: "8px",
          pointerEvents: "none",
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "5px 24px 5px 28px",
          fontSize: "11px",
          color: "var(--ultron-text-primary)",
          background: "rgba(6, 19, 41, 0.8)",
          border: "1px solid var(--ultron-border)",
          borderRadius: "var(--radius-sm)",
          outline: "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--ultron-primary)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--ultron-border)";
        }}
      />

      {value && (
        <button
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          style={{
            position: "absolute",
            right: "6px",
            background: "transparent",
            border: "none",
            color: "var(--ultron-text-muted)",
            cursor: "pointer",
            fontSize: "12px",
            padding: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
