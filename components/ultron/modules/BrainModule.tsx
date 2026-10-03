"use client";

import React, { useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import { MemoryEngine } from "../../../core/memory/memoryEngine";
import { MemoryNode } from "../../../core/types/memory";

type BrainSection =
  | "ALL"
  | "WORKING MEMORY"
  | "PROJECT MEMORY"
  | "USER PREFERENCES"
  | "KNOWLEDGE"
  | "RECENT CONTEXT";

export default function BrainModule() {
  const [selectedSection, setSelectedSection] = useState<BrainSection>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [newContent, setNewContent] = useState("");

  const allNodes = MemoryEngine.getNodes();

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    MemoryEngine.addWorkingMemory(
      `mem-${Date.now()}`,
      `Recorded Intel: ${newContent.slice(0, 32)}`,
      newContent.trim(),
      "operator-command"
    );
    setNewContent("");
  };

  const sections: { id: BrainSection; label: string; desc: string }[] = [
    { id: "ALL", label: "ALL MEMORY", desc: "Unified memory matrix" },
    { id: "WORKING MEMORY", label: "WORKING MEMORY", desc: "Active volatile session context" },
    { id: "PROJECT MEMORY", label: "PROJECT MEMORY", desc: "Codebase architecture & build artifacts" },
    { id: "USER PREFERENCES", label: "USER PREFERENCES", desc: "Operator settings & governance policies" },
    { id: "KNOWLEDGE", label: "KNOWLEDGE", desc: "Durable L4 vector facts & domain ontology" },
    { id: "RECENT CONTEXT", label: "RECENT CONTEXT", desc: "Empirically verified execution traces" },
  ];

  const filteredNodes = allNodes.filter((node) => {
    const matchesSection = (() => {
      if (selectedSection === "ALL") return true;
      if (selectedSection === "WORKING MEMORY") return node.tier === "L1_WORKING";
      if (selectedSection === "PROJECT MEMORY") return node.tier === "L2_EPISODIC" && node.tags.includes("project");
      if (selectedSection === "USER PREFERENCES") return node.tags.includes("preference") || node.tags.includes("user");
      if (selectedSection === "KNOWLEDGE") return node.tier === "L3_SEMANTIC" || node.tier === "L4_LONGTERM";
      if (selectedSection === "RECENT CONTEXT") return node.tier === "L4_LONGTERM" || node.tags.includes("learning");
      return true;
    })();

    const matchesQuery =
      searchQuery === "" ||
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSection && matchesQuery;
  });

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
      {/* Brain Header (Section 19: Title: BRAIN, Subtitle: Memory and knowledge system) */}
      <UltronPanel
        title="BRAIN"
        subtitle="Memory and knowledge system"
        badge={<UltronStatus status="ONLINE" label={`${allNodes.length} NODES`} size="sm" />}
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
              }}
            />
          </div>
        }
      >
        <div style={{ fontSize: "11px", color: "#AAB8D4" }}>
          Unified five-tier memory ontology with zero hallucination promotion. Only reality-checked facts are committed to durable L4 vector storage.
        </div>
      </UltronPanel>

      {/* Main Grid: Left Sections + Right Memory Items */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Sections Rail */}
        <UltronPanel title="CATEGORIES" subtitle="Ontology Tiers">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {sections.map((s) => {
              const isSelected = selectedSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSection(s.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    background: isSelected ? "rgba(99, 232, 255, 0.08)" : "transparent",
                    border: isSelected ? "1px solid rgba(99, 232, 255, 0.35)" : "1px solid transparent",
                    color: isSelected ? "#63E8FF" : "#AAB8D4",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                    {s.label}
                  </span>
                  <span style={{ fontSize: "9px", color: isSelected ? "#C9D5EA" : "#71809D", marginTop: "1px" }}>
                    {s.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </UltronPanel>

        {/* Memory Nodes View */}
        <UltronPanel
          title={selectedSection}
          subtitle={`${filteredNodes.length} Nodes Indexed`}
          badge={<UltronStatus status="ONLINE" label="PERSISTED" size="sm" />}
        >
          {filteredNodes.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 10px",
                textAlign: "center",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#EAF2FF" }}>
                NO MEMORY NODES FOUND
              </div>
              <div style={{ fontSize: "11px", color: "#71809D" }}>
                No facts or records match the current filter.
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
              {filteredNodes.map((node) => (
                <div
                  key={node.id}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: "rgba(105, 150, 255, 0.03)",
                    border: "1px solid rgba(105, 150, 255, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF" }}>
                      {node.title}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        background: "rgba(99, 232, 255, 0.10)",
                        color: "#63E8FF",
                        border: "1px solid rgba(99, 232, 255, 0.25)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {node.tier}
                    </span>
                  </div>

                  <div style={{ fontSize: "11px", color: "#AAB8D4", lineHeight: 1.4 }}>
                    {node.content}
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "6px",
                      borderTop: "1px solid rgba(105, 150, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "9px",
                      color: "#71809D",
                    }}
                  >
                    <span>ID: {node.id.slice(0, 10)}</span>
                    <span>Conf: {Math.round((node.confidence || 0.95) * 100)}%</span>
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
