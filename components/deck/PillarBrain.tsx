"use client";

import React, { useState } from "react";
import { MemoryEngine } from "../../core/memory/memoryEngine";
import { MemoryNode, MemoryTier } from "../../core/types/memory";

export default function PillarBrain() {
  const [selectedTier, setSelectedTier] = useState<MemoryTier | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const allNodes = MemoryEngine.getNodes();

  const filteredNodes = allNodes.filter((node) => {
    const matchesTier = selectedTier === "ALL" || node.tier === selectedTier;
    const matchesQuery =
      searchQuery === "" ||
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTier && matchesQuery;
  });

  const tiers: { id: MemoryTier | "ALL"; label: string; desc: string }[] = [
    { id: "ALL", label: "ALL TIERS", desc: "Global memory projection" },
    { id: "L4_LONGTERM", label: "L4 LONG-TERM", desc: "Verified durable facts & invariants" },
    { id: "L3_SEMANTIC", label: "L3 SEMANTIC", desc: "Vector indexed knowledge base" },
    { id: "L2_EPISODIC", label: "L2 EPISODIC", desc: "Historical execution event ledger" },
    { id: "L1_WORKING", label: "L1 WORKING", desc: "Active mission state canvas" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-60px)] mt-[60px] p-6 font-mono text-xs text-zinc-200 bg-[#050302] overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_24px_rgba(255,170,48,0.1)] mb-6">
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#ffaa30] flex items-center gap-2">
            <span>ULTRON BRAIN</span>
            <span className="text-zinc-500 font-normal">| 5-TIER GOVERNED MEMORY ONTOLOGY</span>
          </h1>
          <p className="text-zinc-400 text-[11px] mt-1">
            Unverified AI completions are never dumped into permanent storage. Facts must pass the Reality Validation pipeline.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search semantic nodes, tags..."
            className="w-full px-3 py-2 bg-black border border-zinc-800 rounded text-zinc-100 text-xs focus:outline-none focus:border-[#ffaa30]"
          />
        </div>
      </div>

      {/* Governance Pipeline Visualizer */}
      <div className="p-4 rounded-lg border border-zinc-800 bg-black/40 mb-6">
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
          MEMORY PROMOTION & GOVERNANCE PIPELINE
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-[10px]">
          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
            <div className="text-zinc-400 font-bold mb-1">01. RAW SOURCE</div>
            <div className="text-zinc-500 text-[9px]">Web, Code, Document I/O</div>
          </div>
          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
            <div className="text-zinc-400 font-bold mb-1">02. SIGNAL FILTER</div>
            <div className="text-zinc-500 text-[9px]">Regex & AST Parser</div>
          </div>
          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
            <div className="text-[#00f0ff] font-bold mb-1">03. ATOMIC CLAIM</div>
            <div className="text-zinc-500 text-[9px]">Confidence &gt; 0.85</div>
          </div>
          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800">
            <div className="text-amber-400 font-bold mb-1">04. REALITY CHECK</div>
            <div className="text-zinc-500 text-[9px]">Empirical Sandbox Test</div>
          </div>
          <div className="p-2.5 rounded bg-[#ffaa30]/15 border border-[#ffaa30]/40">
            <div className="text-[#ffcc66] font-bold mb-1">05. L4 DURABLE FACT</div>
            <div className="text-[#ffaa30] text-[9px]">Signed Ground Truth</div>
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tiers.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTier(t.id)}
            className={`px-3 py-1.5 rounded text-xs transition-all ${
              selectedTier === t.id
                ? "bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 font-bold shadow-[0_0_12px_rgba(255,209,102,0.3)]"
                : "bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Memory Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-lg border border-zinc-800/80 bg-black/50 hover:border-[#ffaa30]/50 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                node.tier === "L4_LONGTERM"
                  ? "bg-[#ffaa30]/20 text-[#ffcc66] border border-[#ffaa30]/40"
                  : node.tier === "L3_SEMANTIC"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : node.tier === "L2_EPISODIC"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  : "bg-zinc-800 text-zinc-400"
              }`}>
                {node.tier}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                CONF: {Math.round(node.confidence * 100)}%
              </span>
            </div>

            <h3 className="font-bold text-zinc-100 text-xs">{node.title}</h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3">{node.content}</p>

            <div className="flex flex-wrap gap-1 pt-1">
              {node.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/60">
              <span>STATUS: {node.validationStatus}</span>
              <span>VERIFIED: {node.lastVerifiedAt ? "YES" : "PENDING"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
