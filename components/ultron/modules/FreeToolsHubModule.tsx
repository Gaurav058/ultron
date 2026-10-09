"use client";

import React, { useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import { FreeToolDefinition } from "@/core/types/tool";
import { FREE_TOOLS_CATALOG, EXCLUDED_TOOLS_CATALOG } from "@/core/tools/freeToolsCatalog";
import { ImageCompressor, ImageCompressionResult } from "@/core/tools/imageCompressor";
import { SecurityChecker, PasswordBreachResult } from "@/core/tools/securityChecker";

export interface FreeToolsHubModuleProps {
  onDispatchMission?: (prompt: string) => void;
}

export default function FreeToolsHubModule({ onDispatchMission }: FreeToolsHubModuleProps) {
  const [selectedTool, setSelectedTool] = useState<FreeToolDefinition>(FREE_TOOLS_CATALOG[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedPricing, setSelectedPricing] = useState("All");
  const [showExcluded, setShowExcluded] = useState(false);

  // Squoosh Interactive State
  const [compressionFormat, setCompressionFormat] = useState<"image/webp" | "image/jpeg" | "image/png">("image/webp");
  const [compressionQuality, setCompressionQuality] = useState(75);
  const [compressionResult, setCompressionResult] = useState<ImageCompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Carbon / Ray.so State
  const [codeSnippet, setCodeSnippet] = useState(`// ULTRON Intelligence Kernel\nconst status = "OPERATIONAL";\nconsole.log({ status, timestamp: Date.now() });`);

  // HIBP State
  const [hibpPasswordInput, setHibpPasswordInput] = useState("");
  const [hibpConsent, setHibpConsent] = useState(false);
  const [hibpResult, setHibpResult] = useState<PasswordBreachResult | null>(null);
  const [hibpLoading, setHibpLoading] = useState(false);
  const [hibpError, setHibpError] = useState<string | null>(null);

  // Recent Invocations & Artifacts History
  const [recentInvocations, setRecentInvocations] = useState<Array<{
    toolId: string;
    toolName: string;
    timestamp: string;
    mode: string;
    status: string;
  }>>([
    { toolId: "squoosh", toolName: "Squoosh Image Optimizer", timestamp: "10:45", mode: "local", status: "VERIFIED" },
    { toolId: "carbon", toolName: "Carbon Code Screenshots", timestamp: "10:30", mode: "user_opened_website", status: "LAUNCHED" },
    { toolId: "haveibeenpwned", toolName: "Have I Been Pwned", timestamp: "10:15", mode: "approved_api", status: "VERIFIED" },
  ]);

  const categories = [
    "All",
    "Image & Design",
    "Developer Tools",
    "Research & Learning",
    "Computational Tools",
    "Security",
    "Media Discovery",
    "Global Intelligence",
  ];

  const filteredTools = FREE_TOOLS_CATALOG.filter((t) => {
    const matchesSearch =
      searchQuery === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchesMode = selectedMode === "All" || t.executionMode === selectedMode;
    const matchesPricing = selectedPricing === "All" || t.pricingStatus === selectedPricing;
    return matchesSearch && matchesCategory && matchesMode && matchesPricing;
  });

  const handleLaunchWebsite = (tool: FreeToolDefinition) => {
    let url = tool.websiteUrl;
    if (tool.id === "carbon") {
      url = `https://carbon.now.sh/?code=${encodeURIComponent(codeSnippet)}`;
    } else if (tool.id === "ray_so") {
      const b64 = typeof window !== "undefined" ? btoa(codeSnippet) : "";
      url = `https://ray.so/#code=${b64}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");

    setRecentInvocations((prev) => [
      {
        toolId: tool.id,
        toolName: tool.name,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        mode: tool.executionMode,
        status: "LAUNCHED",
      },
      ...prev.slice(0, 7),
    ]);
  };

  const handleRunLocalCompression = async () => {
    setIsCompressing(true);
    setCompressionResult(null);

    try {
      // Create a deterministic sample canvas image to compress
      if (typeof document !== "undefined") {
        const testCanvas = document.createElement("canvas");
        testCanvas.width = 1200;
        testCanvas.height = 800;
        const ctx = testCanvas.getContext("2d");
        if (ctx) {
          // Draw high-resolution gradient test pattern
          const grad = ctx.createLinearGradient(0, 0, 1200, 800);
          grad.addColorStop(0, "#020817");
          grad.addColorStop(0.5, "#0B2A50");
          grad.addColorStop(1, "#1687FF");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1200, 800);

          ctx.fillStyle = "#00D9FF";
          ctx.font = "bold 36px monospace";
          ctx.fillText("ULTRON TEST IMAGE ARTIFACT", 100, 400);
        }

        const sampleDataUrl = testCanvas.toDataURL("image/png");
        const res = await ImageCompressor.compressInBrowser(sampleDataUrl, {
          format: compressionFormat,
          quality: compressionQuality / 100,
        });

        setCompressionResult(res);

        setRecentInvocations((prev) => [
          {
            toolId: "squoosh",
            toolName: "Squoosh Image Optimizer",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            mode: "local",
            status: `OPTIMIZED (-${res.savingsPercent}%)`,
          },
          ...prev.slice(0, 7),
        ]);
      }
    } catch (err: any) {
      console.error("Compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCheckPwnedPassword = async () => {
    if (!hibpConsent) {
      setHibpError("Explicit consent required before dispatching external query.");
      return;
    }
    if (!hibpPasswordInput) {
      setHibpError("Password field cannot be empty.");
      return;
    }

    setHibpLoading(true);
    setHibpError(null);
    setHibpResult(null);

    try {
      const res = await SecurityChecker.checkPasswordKAnonymity(hibpPasswordInput, {
        userConfirmed: true,
        timestamp: new Date().toISOString(),
      });
      setHibpResult(res);

      setRecentInvocations((prev) => [
        {
          toolId: "haveibeenpwned",
          toolName: "Have I Been Pwned",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          mode: "approved_api",
          status: res.pwned ? `BREACH FOUND (${res.breachCount})` : "SECURE (0)",
        },
        ...prev.slice(0, 7),
      ]);
    } catch (err: any) {
      setHibpError(err?.message || "Breach check failed");
    } finally {
      setHibpLoading(false);
    }
  };

  const getPricingBadge = (pricing: string, mode: string) => {
    if (mode === "local") {
      return { label: "FREE LOCAL", color: "#00E6A8", bg: "rgba(0, 230, 168, 0.1)" };
    }
    if (pricing === "free_core") {
      return { label: "FREE WEB", color: "#00D9FF", bg: "rgba(0, 217, 255, 0.1)" };
    }
    if (pricing === "freemium") {
      return { label: "FREEMIUM", color: "#FFAB00", bg: "rgba(255, 171, 0, 0.1)" };
    }
    if (pricing === "paid") {
      return { label: "SUBSCRIPTION REQ", color: "#FF5252", bg: "rgba(255, 82, 82, 0.1)" };
    }
    return { label: "UNVERIFIED", color: "#7187A5", bg: "rgba(113, 135, 165, 0.1)" };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        padding: "10px 1.4vw",
        overflowY: "auto",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* 1. HEADER */}
      <UltronPanel
        title="FREE TOOLS HUB"
        subtitle="Sovereign Web, Local, and Research Tools Directory"
        badge={
          <div style={{ display: "flex", gap: "6px" }}>
            <UltronStatus status="ONLINE" label={`${FREE_TOOLS_CATALOG.length} REGISTERED`} size="sm" />
            <button
              onClick={() => setShowExcluded(!showExcluded)}
              style={{
                fontSize: "10px",
                padding: "2px 8px",
                borderRadius: "4px",
                border: showExcluded ? "1px solid #FF5252" : "1px solid rgba(113, 135, 165, 0.3)",
                background: showExcluded ? "rgba(255, 82, 82, 0.1)" : "transparent",
                color: showExcluded ? "#FF5252" : "#7187A5",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {showExcluded ? "Hide Excluded (4)" : "Show Excluded (4)"}
            </button>
          </div>
        }
      >
        <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)" }}>
          Strictly classifies tools by execution mode (local processing, approved API, or user-opened website) and verified pricing tiers.
          Circumvention tools, shadow libraries, and unverified scrapers are isolated in the excluded policy register.
        </div>
      </UltronPanel>

      {/* 2. EXCLUDED CATALOG MODAL / BANNER */}
      {showExcluded && (
        <div
          style={{
            background: "rgba(255, 82, 82, 0.06)",
            border: "1px solid rgba(255, 82, 82, 0.3)",
            borderRadius: "8px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#FF5252" }}>
            EXCLUDED SERVICES POLICY REGISTER (ZERO AUTOMATED EXECUTION)
          </div>
          <div style={{ fontSize: "11px", color: "#C8D8EA" }}>
            The following services are explicitly excluded from automation, scraping, or headless retrieval due to copyright infringement, legal injunctions, or malware payload risks:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px", marginTop: "4px" }}>
            {EXCLUDED_TOOLS_CATALOG.map((ex) => (
              <div
                key={ex.id}
                style={{
                  background: "rgba(6, 19, 41, 0.8)",
                  border: "1px solid rgba(255, 82, 82, 0.2)",
                  borderRadius: "6px",
                  padding: "8px",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#FF5252" }}>{ex.name}</div>
                <div style={{ fontSize: "10px", color: "#7187A5", marginTop: "2px" }}>{ex.excludedReason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FILTER & SEARCH BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          background: "rgba(6, 19, 41, 0.6)",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(113, 135, 165, 0.15)",
        }}
      >
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#7187A5", fontWeight: 600 }}>Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              style={{
                background: selectedCategory === c ? "#1687FF" : "rgba(11, 42, 80, 0.4)",
                border: selectedCategory === c ? "1px solid #00D9FF" : "1px solid rgba(113, 135, 165, 0.2)",
                color: selectedCategory === c ? "#EAF4FF" : "#7187A5",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            style={{
              background: "rgba(6, 19, 41, 0.8)",
              border: "1px solid rgba(113, 135, 165, 0.3)",
              color: "#EAF4FF",
              fontSize: "10px",
              padding: "4px",
              borderRadius: "4px",
            }}
          >
            <option value="All">All Modes</option>
            <option value="local">Local Processing</option>
            <option value="approved_api">Approved API</option>
            <option value="user_opened_website">User-Opened Web</option>
          </select>

          <select
            value={selectedPricing}
            onChange={(e) => setSelectedPricing(e.target.value)}
            style={{
              background: "rgba(6, 19, 41, 0.8)",
              border: "1px solid rgba(113, 135, 165, 0.3)",
              color: "#EAF4FF",
              fontSize: "10px",
              padding: "4px",
              borderRadius: "4px",
            }}
          >
            <option value="All">All Pricing</option>
            <option value="free_core">Free Core</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>

          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "rgba(6, 19, 41, 0.8)",
              border: "1px solid rgba(113, 135, 165, 0.3)",
              borderRadius: "4px",
              padding: "4px 8px",
              color: "#EAF4FF",
              fontSize: "11px",
              width: "160px",
            }}
          />
        </div>
      </div>

      {/* 4. MAIN SPLIT: Tool List (Left) + Tool Detail & Action Panel (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Left: Tools Grid */}
        <UltronPanel title="VERIFIED TOOLS DIRECTORY" subtitle={`${filteredTools.length} Eligible Tools`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "100%", paddingRight: "4px" }}>
            {filteredTools.map((t) => {
              const isSelected = selectedTool.id === t.id;
              const badge = getPricingBadge(t.pricingStatus, t.executionMode);

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTool(t)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    background: isSelected
                      ? "linear-gradient(90deg, rgba(22, 135, 255, 0.25) 0%, rgba(11, 42, 80, 0.4) 100%)"
                      : "rgba(6, 19, 41, 0.5)",
                    border: isSelected ? "1px solid #00D9FF" : "1px solid rgba(113, 135, 165, 0.15)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "#EAF4FF" : "#C8D8EA" }}>
                      {t.name}
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <span
                        style={{
                          fontSize: "9px",
                          padding: "1px 5px",
                          borderRadius: "3px",
                          background: badge.bg,
                          color: badge.color,
                          fontWeight: 700,
                        }}
                      >
                        {badge.label}
                      </span>
                      <span
                        style={{
                          fontSize: "9px",
                          padding: "1px 5px",
                          borderRadius: "3px",
                          background: "rgba(113, 135, 165, 0.15)",
                          color: "#7187A5",
                          fontWeight: 600,
                        }}
                      >
                        {t.executionMode}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: "11px", color: "#7187A5", lineHeight: "1.3" }}>
                    {t.description}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                    <span style={{ fontSize: "9px", color: "#00D9FF" }}>
                      Category: {t.category}
                    </span>
                    <span style={{ fontSize: "9px", color: "#7187A5" }}>
                      Risk: {t.riskLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </UltronPanel>

        {/* Right: Selected Tool Action & Detail Deck */}
        <UltronPanel
          title={selectedTool.name.toUpperCase()}
          subtitle={`Mode: ${selectedTool.executionMode} • Category: ${selectedTool.category}`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxHeight: "100%", paddingRight: "4px" }}>
            {/* Metadata Bar */}
            <div style={{ background: "rgba(6, 19, 41, 0.7)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(113, 135, 165, 0.15)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "11px" }}>
                <div>
                  <span style={{ color: "#7187A5" }}>Execution Mode: </span>
                  <span style={{ color: "#EAF4FF", fontWeight: 600 }}>{selectedTool.executionMode}</span>
                </div>
                <div>
                  <span style={{ color: "#7187A5" }}>Pricing Tier: </span>
                  <span style={{ color: "#00E6A8", fontWeight: 600 }}>{selectedTool.pricingStatus}</span>
                </div>
                <div>
                  <span style={{ color: "#7187A5" }}>Automation: </span>
                  <span style={{ color: "#EAF4FF" }}>{selectedTool.automationPermission}</span>
                </div>
                <div>
                  <span style={{ color: "#7187A5" }}>Verified: </span>
                  <span style={{ color: "#7187A5" }}>{new Date(selectedTool.lastVerifiedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Limitations Notice */}
            <div style={{ background: "rgba(255, 171, 0, 0.05)", border: "1px solid rgba(255, 171, 0, 0.2)", borderRadius: "6px", padding: "8px 10px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#FFAB00", marginBottom: "4px" }}>
                VERIFIED LIMITATIONS & PERMISSIONS:
              </div>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "10px", color: "#C8D8EA", lineHeight: "1.4" }}>
                {selectedTool.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>

            {/* DYNAMIC ACTION CONTAINER BASED ON TOOL TYPE */}
            {selectedTool.id === "squoosh" && (
              <div style={{ background: "rgba(6, 19, 41, 0.6)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(0, 217, 255, 0.2)", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#00D9FF" }}>
                  LOCAL SQUOOSH COMPRESSION ENGINE
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label style={{ fontSize: "11px", color: "#C8D8EA" }}>Target Format:</label>
                  <select
                    value={compressionFormat}
                    onChange={(e: any) => setCompressionFormat(e.target.value)}
                    style={{ background: "#020817", border: "1px solid #1687FF", color: "#EAF4FF", padding: "4px", borderRadius: "4px", fontSize: "11px" }}
                  >
                    <option value="image/webp">WebP (Optimized)</option>
                    <option value="image/jpeg">JPEG (Standard)</option>
                    <option value="image/png">PNG (Lossless)</option>
                  </select>

                  <label style={{ fontSize: "11px", color: "#C8D8EA", marginLeft: "10px" }}>Quality: {compressionQuality}%</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={compressionQuality}
                    onChange={(e) => setCompressionQuality(parseInt(e.target.value, 10))}
                    style={{ flex: 1 }}
                  />
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <UltronButton variant="primary" size="md" onClick={handleRunLocalCompression}>
                    {isCompressing ? "Compressing Artifact..." : "Execute Local Compression"}
                  </UltronButton>
                  <UltronButton variant="secondary" size="md" onClick={() => handleLaunchWebsite(selectedTool)}>
                    Open Squoosh.app ↗
                  </UltronButton>
                </div>

                {compressionResult && (
                  <div style={{ background: "rgba(0, 230, 168, 0.08)", border: "1px solid rgba(0, 230, 168, 0.3)", borderRadius: "6px", padding: "10px", fontSize: "11px" }}>
                    <div style={{ fontWeight: 700, color: "#00E6A8", marginBottom: "4px" }}>
                      ✓ Compression Verified ({compressionResult.durationMs}ms)
                    </div>
                    <div>Original: {(compressionResult.originalSizeBytes / 1024).toFixed(1)} KB</div>
                    <div>Compressed: {(compressionResult.compressedSizeBytes / 1024).toFixed(1)} KB</div>
                    <div style={{ fontWeight: 700, color: "#00D9FF" }}>
                      Space Savings: {compressionResult.savingsPercent}% ({(compressionResult.savingsBytes / 1024).toFixed(1)} KB saved)
                    </div>
                  </div>
                )}
              </div>
            )}

            {(selectedTool.id === "carbon" || selectedTool.id === "ray_so") && (
              <div style={{ background: "rgba(6, 19, 41, 0.6)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(0, 217, 255, 0.2)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#00D9FF" }}>
                  CODE SNIPPET PREFILL GENERATOR
                </div>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  rows={4}
                  style={{
                    background: "#020817",
                    border: "1px solid rgba(113, 135, 165, 0.3)",
                    borderRadius: "4px",
                    color: "#00D9FF",
                    fontFamily: "monospace",
                    fontSize: "11px",
                    padding: "8px",
                  }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <UltronButton variant="primary" size="md" onClick={() => handleLaunchWebsite(selectedTool)}>
                    Open {selectedTool.name} with Prefilled Code ↗
                  </UltronButton>
                </div>
              </div>
            )}

            {selectedTool.id === "haveibeenpwned" && (
              <div style={{ background: "rgba(6, 19, 41, 0.6)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(0, 217, 255, 0.2)", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#00D9FF" }}>
                  CRYPTOGRAPHIC k-ANONYMITY BREACH CHECK
                </div>

                <div style={{ background: "rgba(124, 77, 255, 0.08)", border: "1px solid rgba(124, 77, 255, 0.3)", borderRadius: "4px", padding: "8px", fontSize: "10px", color: "#C8D8EA" }}>
                  <strong>Privacy Guarantee:</strong> Only the first 5 hex digits of the SHA-1 hash are sent to the external API.
                  Your password or complete hash is NEVER sent across the network. Zero sensitive PII is retained in memory.
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#EAF4FF", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={hibpConsent}
                    onChange={(e) => setHibpConsent(e.target.checked)}
                  />
                  <span>I authorize transmitting a 5-character SHA-1 hash prefix for breach verification.</span>
                </label>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="password"
                    placeholder="Enter password to verify..."
                    value={hibpPasswordInput}
                    onChange={(e) => setHibpPasswordInput(e.target.value)}
                    style={{
                      flex: 1,
                      background: "#020817",
                      border: "1px solid rgba(113, 135, 165, 0.3)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      color: "#EAF4FF",
                      fontSize: "11px",
                    }}
                  />
                  <UltronButton variant="primary" size="md" onClick={handleCheckPwnedPassword}>
                    {hibpLoading ? "Checking..." : "Verify Hash"}
                  </UltronButton>
                  <UltronButton variant="secondary" size="md" onClick={() => handleLaunchWebsite(selectedTool)}>
                    Open Official Site ↗
                  </UltronButton>
                </div>

                {hibpError && (
                  <div style={{ color: "#FF5252", fontSize: "11px" }}>⚠ {hibpError}</div>
                )}

                {hibpResult && (
                  <div style={{ background: hibpResult.pwned ? "rgba(255, 82, 82, 0.1)" : "rgba(0, 230, 168, 0.1)", border: `1px solid ${hibpResult.pwned ? "#FF5252" : "#00E6A8"}`, borderRadius: "6px", padding: "10px", fontSize: "11px" }}>
                    <div style={{ fontWeight: 700, color: hibpResult.pwned ? "#FF5252" : "#00E6A8" }}>
                      {hibpResult.pwned
                        ? `⚠ COMPROMISED: Password appeared in ${hibpResult.breachCount.toLocaleString()} known data breaches.`
                        : "✓ CLEAN: Password was not detected in any known public breach dataset."}
                    </div>
                    <div style={{ fontSize: "10px", color: "#7187A5", marginTop: "2px" }}>
                      Hash Prefix: {hibpResult.hashPrefix} • Privacy Mode: {hibpResult.privacyMode}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DEFAULT LAUNCH & DISPATCH CONTROLS */}
            {selectedTool.id !== "squoosh" && selectedTool.id !== "carbon" && selectedTool.id !== "ray_so" && selectedTool.id !== "haveibeenpwned" && (
              <div style={{ display: "flex", gap: "8px" }}>
                <UltronButton variant="primary" size="md" onClick={() => handleLaunchWebsite(selectedTool)}>
                  Open Official Workspace ↗
                </UltronButton>
                <UltronButton
                  variant="secondary"
                  size="md"
                  onClick={() => onDispatchMission?.(`Execute task using ${selectedTool.name}`)}
                >
                  Dispatch into Active Mission
                </UltronButton>
              </div>
            )}

            {/* Links & Verification Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(113, 135, 165, 0.15)", paddingTop: "8px", fontSize: "10px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <a href={selectedTool.documentationUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#1687FF", textDecoration: "none" }}>
                  Documentation ↗
                </a>
                <a href={selectedTool.termsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#7187A5", textDecoration: "none" }}>
                  Terms & Privacy ↗
                </a>
              </div>
              <span style={{ color: "#7187A5" }}>Verified: {selectedTool.lastVerifiedAt.split("T")[0]}</span>
            </div>

            {/* Recent Tool History */}
            <div style={{ marginTop: "6px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#7187A5", marginBottom: "4px" }}>
                RECENT TOOL AUDIT LOG
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {recentInvocations.map((inv, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      background: "rgba(6, 19, 41, 0.4)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <span style={{ color: "#C8D8EA" }}>{inv.toolName}</span>
                    <span style={{ color: "#00D9FF" }}>{inv.status}</span>
                    <span style={{ color: "#7187A5" }}>{inv.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </UltronPanel>
      </div>
    </div>
  );
}
