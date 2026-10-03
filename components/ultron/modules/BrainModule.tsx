"use client";

import React, { useState } from "react";
import { MemoryEngine } from "../../../core/memory/memoryEngine";
import { MemoryNode, MemoryTier } from "../../../core/types/memory";

type MemorySection =
  | "ALL"
  | "WORKING MEMORY"
  | "PROJECT MEMORY"
  | "USER MEMORY"
  | "SEMANTIC KNOWLEDGE"
  | "RECENT LEARNING"
  | "FACTS"
  | "SOURCES";

export default function BrainModule() {
  const [selectedSection, setSelectedSection] = useState<MemorySection>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newScope, setNewScope] = useState("WORKING");

  const allNodes = MemoryEngine.getNodes();

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    MemoryEngine.addWorkingMemory(
      `mem-${Date.now()}`,
      `Recorded Intel: ${newContent.slice(0, 32)}`,
      newContent.trim(),
      "user-command-deck"
    );
    setNewContent("");
  };

  const sections: { id: MemorySection; label: string; desc: string }[] = [
    { id: "ALL", label: "ALL MEMORY", desc: "Unified cognitive matrix" },
    { id: "WORKING MEMORY", label: "WORKING MEMORY (L1)", desc: "Active mission state & volatile context" },
    { id: "PROJECT MEMORY", label: "PROJECT MEMORY (L2)", desc: "Workspace files, configs & build artifacts" },
    { id: "USER MEMORY", label: "USER MEMORY (L2)", desc: "Prime User preferences, traits & mesh pairings" },
    { id: "SEMANTIC KNOWLEDGE", label: "SEMANTIC KNOWLEDGE (L3)", desc: "Vector embeddings, concepts & domain maps" },
    { id: "RECENT LEARNING", label: "RECENT LEARNING (L4)", desc: "Empirically validated agent execution heuristics" },
    { id: "FACTS", label: "FACTS (L4 INVARIANTS)", desc: "Durable ground truth & validated invariants" },
    { id: "SOURCES", label: "SOURCES & CITATIONS (L5)", desc: "External provenance & cryptographic hashes" },
  ];

  const filteredNodes = allNodes.filter((node) => {
    const matchesSection = (() => {
      if (selectedSection === "ALL") return true;
      if (selectedSection === "WORKING MEMORY") return node.tier === "L1_WORKING";
      if (selectedSection === "PROJECT MEMORY") return node.tier === "L2_EPISODIC" && node.tags.includes("project");
      if (selectedSection === "USER MEMORY") return node.tier === "L2_EPISODIC" && !node.tags.includes("project");
      if (selectedSection === "SEMANTIC KNOWLEDGE") return node.tier === "L3_SEMANTIC";
      if (selectedSection === "RECENT LEARNING") return node.tier === "L4_LONGTERM" && node.tags.includes("learning");
      if (selectedSection === "FACTS") return node.tier === "L4_LONGTERM";
      if (selectedSection === "SOURCES") return node.sourceUri !== undefined;
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
    <div className="flex-1 flex flex-col p-3 overflow-hidden select-none">
      {/* Top Header */}
      <div className="holo-panel p-3 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#63e8ff] font-bold tracking-widest uppercase">
              BRAIN MEMORY & KNOWLEDGE ONTOLOGY
            </span>
            <span className="text-[7px] px-1.5 py-0.2 rounded bg-[#5ff0a0]/20 text-[#5ff0a0] border border-[#5ff0a0]/30 font-mono">
              REALITY VALIDATED STORE
            </span>
          </div>
          <div className="text-[8px] text-[#8d9ab5]">
            Unverified AI hallucinations are rejected from long-term memory. Only reality-checked facts are promoted.
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search semantic nodes, tags, facts..."
            className="w-full bg-[#02030a]/90 border border-[#6e8cff]/25 px-2.5 py-1 text-[8px] text-[#dce4f5] rounded outline-none focus:border-[#63e8ff]"
          />
        </div>
      </div>

      {/* Main 2-Column Split: Memory Sections (Left) + Memory Nodes Grid (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0 overflow-hidden">
        {/* Left Column (4 cols): Memory Tier Navigation & Quick Add */}
        <div className="lg:col-span-4 flex flex-col gap-2 min-h-0 overflow-hidden">
          {/* Section Picker */}
          <div className="holo-panel p-2 flex flex-col gap-1 overflow-y-auto shrink-0">
            <div className="panel-title mb-1">
              MEMORY SECTIONS <span>7 TIERS</span>
            </div>
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSection(s.id)}
                className={`w-full text-left p-2 rounded transition-all flex flex-col ${
                  selectedSection === s.id
                    ? "bg-[#63e8ff]/15 border-l-2 border-[#63e8ff] text-[#dce4f5]"
                    : "text-[#8d9ab5] hover:bg-white/[0.03] hover:text-[#dce4f5] border-l-2 border-transparent"
                }`}
              >
                <div className="text-[9px] font-bold tracking-wider">{s.label}</div>
                <div className="text-[6px] text-[#5d6985] mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Quick Memory Formulation Card */}
          <form onSubmit={handleAddMemory} className="holo-panel p-2 flex flex-col gap-1.5 shrink-0">
            <div className="panel-title">
              FORMULATE MEMORY <span>INGESTION</span>
            </div>
            <textarea
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Record verified memory node..."
              className="w-full bg-[#02030a]/90 border border-[#6e8cff]/25 p-2 text-[8px] text-[#dce4f5] rounded outline-none resize-none focus:border-[#63e8ff]"
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-[8px] font-bold rounded bg-[#8d75ff]/20 text-[#8d75ff] border border-[#8d75ff]/40 hover:bg-[#8d75ff]/30 cursor-pointer text-center"
            >
              COMMIT TO WORKING MEMORY
            </button>
          </form>
        </div>

        {/* Right Column (8 cols): Memory Overview Items */}
        <div className="lg:col-span-8 holo-panel flex flex-col p-3 min-h-0 overflow-hidden">
          <div className="panel-title pb-2 mb-2 border-b border-[#6e8cff]/15 shrink-0">
            MEMORY OVERVIEW: {selectedSection} <span>{filteredNodes.length} NODES INDEXED</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNodes.length === 0 ? (
              <div className="text-[8px] text-[#5d6985] py-12 text-center font-mono">
                NO MEMORY NODES RECORDED IN THIS CLASSIFICATION
              </div>
            ) : (
              filteredNodes.map((node) => {
                const confPct = node.confidence !== undefined ? Math.round(node.confidence * 100) : 98;
                return (
                  <div
                    key={node.id}
                    className="p-2.5 rounded border border-[#6e8cff]/15 bg-[#030615]/70 hover:border-[#63e8ff]/30 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#63e8ff] shadow-[0_0_6px_#63e8ff]" />
                        <b className="text-[9px] text-[#dce4f5]">{node.title}</b>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[6px]">
                        <span className="px-1 py-0.2 rounded bg-[#8d75ff]/15 text-[#8d75ff] border border-[#8d75ff]/30">
                          {node.tier}
                        </span>
                        <span className="px-1 py-0.2 rounded bg-[#5ff0a0]/15 text-[#5ff0a0] border border-[#5ff0a0]/30">
                          CONF: {confPct}%
                        </span>
                      </div>
                    </div>

                    <p className="text-[8px] text-[#8d9ab5] mb-2 leading-relaxed">
                      {node.content}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#6e8cff]/10 text-[6px] text-[#5d6985] font-mono">
                      <div className="flex items-center gap-2">
                        <span>SOURCE: <b className="text-[#dce4f5]">{node.authorAgent || node.sourceUri || "ULTRON-KERNEL"}</b></span>
                        <span>STATUS: <b className="text-[#63e8ff]">{node.validationStatus}</b></span>
                        <span>TYPE: <b className="text-[#8d75ff]">{node.tier}</b></span>
                      </div>
                      <div>
                        STAMP: {new Date(node.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
