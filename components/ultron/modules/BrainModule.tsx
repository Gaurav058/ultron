"use client";

import React, { useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import { MemoryEngine } from "../../../core/memory/memoryEngine";
import { MemoryCategory, MemoryItem } from "../../../core/types/memory";

type BrainFilter = "ALL" | MemoryCategory;

export default function BrainModule() {
  const [selectedFilter, setSelectedFilter] = useState<BrainFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<MemoryCategory>("PROJECT MEMORY");

  const allItems = MemoryEngine.getItems();

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    MemoryEngine.addMemoryItem({
      type: newCategory,
      title: `Operator Note: ${newContent.slice(0, 32)}`,
      content: newContent.trim(),
      source: "OPERATOR_DIRECTIVE",
      confidence: 1.0,
      scope: "PROJECT",
    });
    setNewContent("");
  };

  const categories: { id: BrainFilter; label: string; desc: string }[] = [
    { id: "ALL", label: "ALL MEMORY", desc: "Unified memory matrix" },
    { id: "USER CONTEXT", label: "USER CONTEXT", desc: "Operator environment & device parameters" },
    { id: "WORKING MEMORY", label: "WORKING MEMORY", desc: "Active task session scratchpad" },
    { id: "PROJECT MEMORY", label: "PROJECT MEMORY", desc: "Codebase architecture & build invariants" },
    { id: "PREFERENCES", label: "PREFERENCES", desc: "Style guidelines, tokens & policy constraints" },
    { id: "KNOWLEDGE", label: "KNOWLEDGE", desc: "Verified domain ontology & external specs" },
    { id: "RECENT CONTEXT", label: "RECENT CONTEXT", desc: "Transient conversational turn references" },
  ];

  const filteredItems = MemoryEngine.query(
    searchQuery,
    selectedFilter === "ALL" ? undefined : (selectedFilter as MemoryCategory)
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        padding: "10px 1.4vw",
        overflow: "hidden",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* Brain Header (Section 8) */}
      <UltronPanel
        title="BRAIN"
        subtitle="Memory and Knowledge Interface"
        badge={<UltronStatus status="ONLINE" label={`${allItems.length} RECORDS`} size="sm" />}
        actions={
          <div style={{ width: "240px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memory..."
              style={{
                width: "100%",
                height: "28px",
                padding: "0 10px",
                fontSize: "11px",
                borderRadius: "4px",
                background: "var(--ultron-panel)",
                color: "var(--ultron-text-primary)",
                border: "1px solid var(--ultron-border)",
                outline: "none",
              }}
            />
          </div>
        }
      >
        <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)" }}>
          Strict promotion-gated memory store. Transient conversational signals must be empirically verified before committing to durable memory.
        </div>
      </UltronPanel>

      {/* Main Grid: Left Categories Rail + Right Memory Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Categories Rail */}
        <UltronPanel title="CATEGORIES" subtitle="Section 8 Memory Tiers">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {categories.map((c) => {
              const isSelected = selectedFilter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedFilter(c.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    background: isSelected ? "rgba(99, 232, 255, 0.08)" : "transparent",
                    border: isSelected ? "1px solid var(--ultron-border-active)" : "1px solid transparent",
                    color: isSelected ? "var(--ultron-cyan)" : "var(--ultron-text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: "9px", color: isSelected ? "var(--ultron-text-primary)" : "var(--ultron-text-muted)", marginTop: "1px" }}>
                    {c.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Add Memory Box */}
          <div style={{ marginTop: "auto", paddingTop: "10px", borderTop: "1px solid var(--ultron-border)" }}>
            <form onSubmit={handleAddMemory} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>RECORD DURABLE FACT</span>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                style={{
                  fontSize: "10px",
                  padding: "4px",
                  background: "var(--ultron-panel)",
                  color: "var(--ultron-text-primary)",
                  border: "1px solid var(--ultron-border)",
                  borderRadius: "4px",
                }}
              >
                <option value="PROJECT MEMORY">PROJECT MEMORY</option>
                <option value="PREFERENCES">PREFERENCES</option>
                <option value="USER CONTEXT">USER CONTEXT</option>
                <option value="KNOWLEDGE">KNOWLEDGE</option>
              </select>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter verified fact..."
                rows={2}
                style={{
                  fontSize: "11px",
                  padding: "6px",
                  background: "var(--ultron-panel)",
                  color: "var(--ultron-text-primary)",
                  border: "1px solid var(--ultron-border)",
                  borderRadius: "4px",
                  outline: "none",
                  resize: "none",
                }}
              />
              <UltronButton type="submit" variant="primary" size="sm" disabled={!newContent.trim()}>
                RECORD FACT ➔
              </UltronButton>
            </form>
          </div>
        </UltronPanel>

        {/* Memory Items View */}
        <UltronPanel
          title={selectedFilter}
          subtitle={`${filteredItems.length} Verified Records`}
          badge={<UltronStatus status="ONLINE" label="PERSISTED" size="sm" />}
        >
          {filteredItems.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px 10px",
                textAlign: "center",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ultron-text-primary)" }}>
                NO MEMORY FOUND
              </div>
              <div style={{ fontSize: "11px", color: "var(--ultron-text-muted)" }}>
                No records currently exist for category "{selectedFilter}".
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "8px",
                overflowY: "auto",
                maxHeight: "100%",
                paddingRight: "4px",
              }}
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: "var(--ultron-panel)",
                    border: "1px solid var(--ultron-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--ultron-text-primary)" }}>
                      {item.title || item.type}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        background: "rgba(99, 232, 255, 0.10)",
                        color: "var(--ultron-cyan)",
                        border: "1px solid rgba(99, 232, 255, 0.25)",
                        fontFamily: "var(--ultron-font-mono)",
                      }}
                    >
                      {item.type}
                    </span>
                  </div>

                  <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)", lineHeight: 1.4 }}>
                    {item.content}
                  </div>

                  {/* Section 8 fields: type, content, source, created, updated, confidence, scope */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "6px",
                      borderTop: "1px solid var(--ultron-border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      fontSize: "10px",
                      color: "var(--ultron-text-muted)",
                      fontFamily: "var(--ultron-font-mono)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>SOURCE: {item.source}</span>
                      <span style={{ color: "var(--ultron-cyan)" }}>SCOPE: {item.scope}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>CONF: {Math.round(item.confidence * 100)}%</span>
                      <span>UPD: {new Date(item.updated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </UltronPanel>
      </div>
    </div>
  );
}
