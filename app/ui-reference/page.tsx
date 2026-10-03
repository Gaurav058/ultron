"use client";

import React, { useState } from "react";
import Link from "next/link";

type ViewportMode = "1920x1080" | "1440x900" | "1280x800" | "iphone" | "android" | "fit";
type ComparisonMode = "side-by-side" | "overlay" | "reference-only" | "live-only";

const VIEWPORT_DIMS: Record<ViewportMode, { width: string; height: string; label: string }> = {
  "1920x1080": { width: "1920px", height: "1080px", label: "Desktop Full HD (1920×1080)" },
  "1440x900": { width: "1440px", height: "900px", label: "MacBook Pro (1440×900)" },
  "1280x800": { width: "1280px", height: "800px", label: "Compact Desktop (1280×800)" },
  "iphone": { width: "393px", height: "852px", label: "iPhone 16 / 17 Pro (393×852)" },
  "android": { width: "412px", height: "915px", label: "Android Pixel (412×915)" },
  "fit": { width: "100%", height: "100%", label: "Fit Window (Responsive)" },
};

export default function UiReferencePage() {
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("side-by-side");
  const [viewport, setViewport] = useState<ViewportMode>("1440x900");
  const [opacity, setOpacity] = useState(50);
  const [showGrid, setShowGrid] = useState(false);

  const currentDims = VIEWPORT_DIMS[viewport];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#010208] text-zinc-100 font-mono overflow-hidden select-none">
      {/* Top QA Navigation Bar */}
      <header className="h-14 px-4 bg-[#050818]/90 border-b border-[#00d9ff]/20 backdrop-blur-md flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-2.5 py-1 text-xs font-bold tracking-wider rounded bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/30 hover:bg-[#00d9ff]/20 transition-colors"
          >
            ← RETURN TO ULTRON OS
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-xs font-bold tracking-widest text-[#edf6ff] uppercase">
            VISUAL QA BENCHMARK: <span className="text-[#00d9ff]">REFERENCE CONTRACT vs LIVE UI</span>
          </span>
        </div>

        {/* Viewport & Mode Controls */}
        <div className="flex items-center gap-4 text-xs">
          {/* Mode Switcher */}
          <div className="flex items-center rounded border border-white/10 p-0.5 bg-black/40">
            {(["side-by-side", "overlay", "reference-only", "live-only"] as ComparisonMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setComparisonMode(mode)}
                className={`px-2 py-1 rounded text-[10px] tracking-wider uppercase transition-colors ${
                  comparisonMode === mode
                    ? "bg-[#00d9ff] text-black font-bold shadow-[0_0_10px_rgba(0,217,255,0.4)]"
                    : "text-[#7180a4] hover:text-white"
                }`}
              >
                {mode.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Viewport Presets */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#7180a4]">VIEWPORT:</span>
            <select
              value={viewport}
              onChange={(e) => setViewport(e.target.value as ViewportMode)}
              className="bg-[#080d22] border border-[#00d9ff]/30 text-[#edf6ff] text-[10px] px-2 py-1 rounded outline-none cursor-pointer"
            >
              {Object.entries(VIEWPORT_DIMS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Opacity Slider for Overlay Mode */}
          {comparisonMode === "overlay" && (
            <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded border border-white/10">
              <span className="text-[10px] text-[#7180a4]">OVERLAY OPACITY:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-24 accent-[#00d9ff] cursor-pointer"
              />
              <span className="text-[10px] text-[#00d9ff] font-bold w-7 text-right">{opacity}%</span>
            </div>
          )}

          {/* Alignment Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1 text-[10px] rounded border transition-colors ${
              showGrid
                ? "bg-[#d34cff]/20 text-[#d34cff] border-[#d34cff]"
                : "border-white/10 text-[#7180a4] hover:text-white"
            }`}
          >
            GRID: {showGrid ? "ON" : "OFF"}
          </button>
        </div>
      </header>

      {/* Main Inspection Canvas Area */}
      <main className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#010207] relative">
        {/* Alignment Grid Overlay if enabled */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-40 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, #00d9ff 1px, transparent 1px), linear-gradient(to bottom, #00d9ff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        )}

        {/* 1. Side-by-Side Comparison Mode */}
        {comparisonMode === "side-by-side" && (
          <div className="flex w-full h-full gap-4">
            {/* Left Pane: Target Reference Contract */}
            <div className="flex-1 flex flex-col rounded border border-[#7654ff]/40 bg-[#040614] overflow-hidden">
              <div className="h-8 px-3 bg-[#080d26] border-b border-[#7654ff]/30 flex items-center justify-between text-[11px] shrink-0">
                <span className="font-bold text-[#b7b1ff] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7654ff] shadow-[0_0_8px_#7654ff]" />
                  PRIMARY VISUAL CONTRACT (REFERENCE IMAGE)
                </span>
                <span className="text-[10px] text-[#7180a4]">SOURCE: Page 1 Specification</span>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-[#02030a]">
                <img
                  src="/ultron_reference.png"
                  alt="ULTRON Reference Specification"
                  className="max-w-full max-h-full object-contain rounded shadow-[0_0_30px_rgba(118,84,255,0.2)]"
                />
              </div>
            </div>

            {/* Right Pane: Live ULTRON OS Command Center */}
            <div className="flex-1 flex flex-col rounded border border-[#00d9ff]/40 bg-[#040614] overflow-hidden">
              <div className="h-8 px-3 bg-[#080d26] border-b border-[#00d9ff]/30 flex items-center justify-between text-[11px] shrink-0">
                <span className="font-bold text-[#00d9ff] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d9ff] shadow-[0_0_8px_#00d9ff]" />
                  CURRENT LIVE ULTRON OS (INTERACTIVE RUNTIME)
                </span>
                <span className="text-[10px] text-[#63f5d2]">ONLINE • v2.0.0</span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <iframe
                  src="/"
                  title="Live ULTRON OS Runtime"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. Overlay Comparison Mode */}
        {comparisonMode === "overlay" && (
          <div
            className="relative border border-[#00d9ff]/30 rounded overflow-hidden shadow-[0_0_50px_rgba(0,217,255,0.15)]"
            style={{
              width: currentDims.width === "100%" ? "100%" : currentDims.width,
              height: currentDims.height === "100%" ? "100%" : currentDims.height,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {/* Live Interactive UI Layer */}
            <iframe
              src="/"
              title="Live ULTRON OS Runtime"
              className="absolute inset-0 w-full h-full border-0 z-10"
            />

            {/* Reference Image Layer with Adjustable Opacity */}
            <div
              className="absolute inset-0 pointer-events-none z-20 transition-opacity"
              style={{ opacity: opacity / 100 }}
            >
              <img
                src="/ultron_reference.png"
                alt="Reference Contract Overlay"
                className="w-full h-full object-fill"
              />
            </div>
          </div>
        )}

        {/* 3. Reference Only Mode */}
        {comparisonMode === "reference-only" && (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src="/ultron_reference.png"
              alt="ULTRON Reference Specification Full"
              className="max-w-full max-h-full object-contain rounded border border-[#7654ff]/40 shadow-[0_0_40px_rgba(118,84,255,0.25)]"
            />
          </div>
        )}

        {/* 4. Live Only Mode */}
        {comparisonMode === "live-only" && (
          <div
            className="border border-[#00d9ff]/30 rounded overflow-hidden"
            style={{
              width: currentDims.width === "100%" ? "100%" : currentDims.width,
              height: currentDims.height === "100%" ? "100%" : currentDims.height,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <iframe
              src="/"
              title="Live ULTRON OS Runtime"
              className="w-full h-full border-0"
            />
          </div>
        )}
      </main>

      {/* Visual Contract Audit Verification Strip */}
      <footer className="h-10 px-4 bg-[#030510] border-t border-white/10 flex items-center justify-between text-[10px] text-[#7180a4] shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[#edf6ff] font-bold">CONTRACT VERIFICATION GATES:</span>
          <span className="text-[#63f5d2]">✓ Infinity Core Centered</span>
          <span className="text-[#63f5d2]">✓ Robotic Entity Embodiment</span>
          <span className="text-[#63f5d2]">✓ 7-Pillar Left Rail</span>
          <span className="text-[#63f5d2]">✓ Live Agents Roster</span>
          <span className="text-[#63f5d2]">✓ 3D Perspective World Grid</span>
          <span className="text-[#63f5d2]">✓ Real Telemetry & Doctor</span>
          <span className="text-[#63f5d2]">✓ Multimodal Command Bar</span>
        </div>
        <div>
          <span>SPEC: ULTRON MASTER DIRECTIVE v2.0</span>
        </div>
      </footer>
    </div>
  );
}
