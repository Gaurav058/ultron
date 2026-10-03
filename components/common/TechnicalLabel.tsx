"use client";

import React from "react";

interface TechnicalLabelProps {
  label: string;
  value?: React.ReactNode;
  hint?: string;
  variant?: "cyan" | "violet" | "gold" | "muted";
  className?: string;
}

export default function TechnicalLabel({
  label,
  value,
  hint,
  variant = "muted",
  className = "",
}: TechnicalLabelProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "cyan":
        return { label: "text-[#00d9ff]/70", value: "text-[#00d9ff]" };
      case "violet":
        return { label: "text-[#8b5cff]/70", value: "text-[#d84cff]" };
      case "gold":
        return { label: "text-[#ffaa30]/70", value: "text-[#ffcc66]" };
      case "muted":
      default:
        return { label: "text-[#8493b2]", value: "text-zinc-200" };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`flex items-center justify-between text-xs font-mono ${className}`}>
      <span className={`text-[10px] tracking-widest uppercase font-['Rajdhani',sans-serif] font-medium ${styles.label}`}>
        {label}
      </span>
      {value && (
        <span className={`font-semibold tracking-wider ${styles.value}`}>
          {value}
        </span>
      )}
      {hint && <span className="text-[9px] text-zinc-500 ml-1">{hint}</span>}
    </div>
  );
}
