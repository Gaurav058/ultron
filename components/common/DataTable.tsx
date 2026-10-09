"use client";

import React from "react";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  render: (item: T, idx: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T, idx: number) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No records found",
  className = "",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        style={{
          padding: "24px 16px",
          textAlign: "center",
          color: "var(--ultron-text-muted)",
          fontSize: "11px",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={`data-table-container ${className}`}
      style={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid var(--ultron-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <thead>
          <tr
            style={{
              background: "var(--ultron-bg-elevated)",
              borderBottom: "1px solid var(--ultron-border)",
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "8px 12px",
                  textAlign: col.align || "left",
                  fontWeight: 700,
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--ultron-text-muted)",
                  width: col.width,
                  whiteSpace: "nowrap",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={keyExtractor(item, idx)}
              onClick={() => onRowClick?.(item)}
              style={{
                borderBottom: "1px solid rgba(11, 42, 80, 0.4)",
                cursor: onRowClick ? "pointer" : "default",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.background = "var(--ultron-bg-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "8px 12px",
                    textAlign: col.align || "left",
                    color: "var(--ultron-text-secondary)",
                  }}
                >
                  {col.render(item, idx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
