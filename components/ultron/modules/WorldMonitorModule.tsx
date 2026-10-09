"use client";

import React, { useEffect, useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import {
  WorldMonitorProviderStatus,
  IntelligenceSourceItem,
  IntelligenceProvenance,
} from "@/core/worldmonitor/worldMonitorService";

export interface WorldMonitorModuleProps {
  onDispatchMission?: (prompt: string) => void;
}

export default function WorldMonitorModule({ onDispatchMission }: WorldMonitorModuleProps) {
  const [providerStatus, setProviderStatus] = useState<WorldMonitorProviderStatus | null>(null);
  const [sources, setSources] = useState<IntelligenceSourceItem[]>([]);
  const [provenance, setProvenance] = useState<IntelligenceProvenance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"workspace" | "sources" | "selfhost">("workspace");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [statusRes, sourcesRes] = await Promise.all([
          fetch("/api/world-monitor/status"),
          fetch("/api/world-monitor/sources"),
        ]);

        if (statusRes.ok) {
          const s = await statusRes.json();
          setProviderStatus(s);
        }

        if (sourcesRes.ok) {
          const d = await sourcesRes.json();
          setSources(d.sources || []);
          setProvenance(d.provenance || null);
        }
      } catch (err) {
        console.error("Error loading World Monitor data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const categories = ["All", "Conflict", "Geopolitics", "Maritime", "Aviation", "Climate", "Energy", "Cyber"];

  const filteredSources = sources.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      searchFilter === "" ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.geographicalScope.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      {/* 1. TOP HEADER & TELEMETRY */}
      <UltronPanel
        title="WORLD MONITOR WORKSPACE"
        subtitle="Global Open-Source Intelligence (OSINT) & Geospatial Radar"
        badge={
          <div style={{ display: "flex", gap: "6px" }}>
            <UltronStatus
              status={providerStatus?.hasApiKey ? "ONLINE" : "STANDBY"}
              label={providerStatus?.hasApiKey ? "AUTHENTICATED" : "CREDENTIALS REQUIRED"}
              size="sm"
            />
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(0, 217, 255, 0.3)",
                color: "#00D9FF",
                background: "rgba(0, 217, 255, 0.08)",
                fontWeight: 600,
              }}
            >
              MCP ANONYMOUS
            </span>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(124, 77, 255, 0.3)",
                color: "#7C4DFF",
                background: "rgba(124, 77, 255, 0.08)",
                fontWeight: 600,
              }}
            >
              AGPL-3.0 ISOLATED
            </span>
          </div>
        }
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)", maxWidth: "800px" }}>
            Isolated intelligence workspace connecting official World Monitor public discovery endpoints without embedding
            restrictions. Live conflict data, geopolitical risks, and maritime/aviation transponder feeds are monitored across sovereign boundaries.
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveTab("workspace")}
              style={{
                background: activeTab === "workspace" ? "rgba(0, 217, 255, 0.15)" : "transparent",
                border: activeTab === "workspace" ? "1px solid #00D9FF" : "1px solid rgba(113, 135, 165, 0.3)",
                color: activeTab === "workspace" ? "#EAF4FF" : "#7187A5",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tactical Launch
            </button>
            <button
              onClick={() => setActiveTab("sources")}
              style={{
                background: activeTab === "sources" ? "rgba(0, 217, 255, 0.15)" : "transparent",
                border: activeTab === "sources" ? "1px solid #00D9FF" : "1px solid rgba(113, 135, 165, 0.3)",
                color: activeTab === "sources" ? "#EAF4FF" : "#7187A5",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Discovered Sources ({sources.length})
            </button>
            <button
              onClick={() => setActiveTab("selfhost")}
              style={{
                background: activeTab === "selfhost" ? "rgba(0, 217, 255, 0.15)" : "transparent",
                border: activeTab === "selfhost" ? "1px solid #00D9FF" : "1px solid rgba(113, 135, 165, 0.3)",
                color: activeTab === "selfhost" ? "#EAF4FF" : "#7187A5",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Self-Host / Architecture
            </button>
          </div>
        </div>
      </UltronPanel>

      {/* 2. TAB CONTENT */}
      {activeTab === "workspace" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px", flex: 1 }}>
          {/* Left: Launch Panel & Framing Architecture */}
          <UltronPanel title="TACTICAL LAUNCH DECK" subtitle="Official World Monitor Application Host">
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  background: "rgba(6, 19, 41, 0.7)",
                  border: "1px solid rgba(22, 135, 255, 0.25)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px" }}>🌐</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#EAF4FF" }}>
                      worldmonitor.app
                    </div>
                    <div style={{ fontSize: "11px", color: "#7187A5" }}>
                      Upstream Host: Cloudflare Protected • Official Web Application
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(255, 171, 0, 0.08)",
                    border: "1px solid rgba(255, 171, 0, 0.3)",
                    borderRadius: "6px",
                    padding: "10px",
                    fontSize: "11px",
                    color: "#FFAB00",
                    lineHeight: "1.4",
                  }}
                >
                  <strong>Framing Policy Verification:</strong> The official host specifies{" "}
                  <code>X-Frame-Options: SAMEORIGIN</code> and CSP{" "}
                  <code>frame-ancestors 'self'</code>. In accordance with ULTRON Production Directives, iframe bypass tricks are strictly prohibited to preserve browser sandbox security.
                </div>

                <div style={{ fontSize: "12px", color: "#C8D8EA", lineHeight: "1.5" }}>
                  World Monitor provides an independent multi-layer visualization suite featuring real-time military radar, satellite fire maps, naval AIS tracking, and geopolitical event streams.
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                  <a
                    href="https://worldmonitor.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <UltronButton variant="primary" size="md">
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>Open World Monitor in New Tab</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </span>
                    </UltronButton>
                  </a>

                  <a
                    href="https://github.com/koala73/worldmonitor"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <UltronButton variant="secondary" size="md">
                      View Upstream Repository
                    </UltronButton>
                  </a>
                </div>
              </div>

              {/* Mission Dispatch Trigger */}
              <div
                style={{
                  background: "rgba(6, 19, 41, 0.5)",
                  border: "1px solid rgba(113, 135, 165, 0.2)",
                  borderRadius: "8px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#00D9FF" }}>
                  DEEP RECONNAISSANCE MISSION TEMPLATES
                </div>
                <div style={{ fontSize: "11px", color: "#7187A5" }}>
                  Synthesize open OSINT data directly into ULTRON's autonomous mission DAG pipeline:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <button
                    onClick={() =>
                      onDispatchMission?.(
                        "Investigate Black Sea maritime shipping corridors and naval activity"
                      )
                    }
                    style={{
                      background: "rgba(11, 42, 80, 0.6)",
                      border: "1px solid rgba(0, 217, 255, 0.3)",
                      color: "#EAF4FF",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Black Sea Corridors
                  </button>
                  <button
                    onClick={() =>
                      onDispatchMission?.(
                        "Analyze Bab-el-Mandeb and Red Sea maritime transit disruption signals"
                      )
                    }
                    style={{
                      background: "rgba(11, 42, 80, 0.6)",
                      border: "1px solid rgba(0, 217, 255, 0.3)",
                      color: "#EAF4FF",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Red Sea Transit Risk
                  </button>
                  <button
                    onClick={() =>
                      onDispatchMission?.(
                        "Cross-reference global seismic activity with energy infrastructure hubs"
                      )
                    }
                    style={{
                      background: "rgba(11, 42, 80, 0.6)",
                      border: "1px solid rgba(0, 217, 255, 0.3)",
                      color: "#EAF4FF",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Seismic vs Energy Nodes
                  </button>
                </div>
              </div>
            </div>
          </UltronPanel>

          {/* Right: Real Connector Health & Telemetry */}
          <UltronPanel title="NATIVE CONNECTOR TELEMETRY" subtitle="MCP Protocol Status & Provenance">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <div style={{ background: "rgba(6, 19, 41, 0.6)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(113, 135, 165, 0.15)" }}>
                  <div style={{ fontSize: "10px", color: "#7187A5" }}>MCP DISCOVERY ENDPOINT</div>
                  <div style={{ fontSize: "11px", color: "#00D9FF", fontWeight: 600, wordBreak: "break-all" }}>
                    {providerStatus?.endpoint || "https://worldmonitor.app/mcp"}
                  </div>
                </div>

                <div style={{ background: "rgba(6, 19, 41, 0.6)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(113, 135, 165, 0.15)" }}>
                  <div style={{ fontSize: "10px", color: "#7187A5" }}>AUTH STATUS</div>
                  <div style={{ fontSize: "11px", color: providerStatus?.hasApiKey ? "#00E6A8" : "#FFAB00", fontWeight: 700 }}>
                    {providerStatus?.authenticationStatus || "CREDENTIALS_REQUIRED"}
                  </div>
                </div>

                <div style={{ background: "rgba(6, 19, 41, 0.6)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(113, 135, 165, 0.15)" }}>
                  <div style={{ fontSize: "10px", color: "#7187A5" }}>QUOTA STATUS</div>
                  <div style={{ fontSize: "11px", color: "#EAF4FF", fontWeight: 600 }}>
                    {providerStatus?.quotaStatus || "ANONYMOUS_QUOTA_FREE"}
                  </div>
                </div>

                <div style={{ background: "rgba(6, 19, 41, 0.6)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(113, 135, 165, 0.15)" }}>
                  <div style={{ fontSize: "10px", color: "#7187A5" }}>ROUNDTRIP LATENCY</div>
                  <div style={{ fontSize: "11px", color: "#00E6A8", fontWeight: 600 }}>
                    {providerStatus?.latencyMs ? `${providerStatus.latencyMs} ms` : "Verified"}
                  </div>
                </div>
              </div>

              {/* Permitted vs Restricted Operations */}
              <div style={{ background: "rgba(6, 19, 41, 0.4)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(113, 135, 165, 0.15)" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#EAF4FF", marginBottom: "6px" }}>
                  OPERATIONAL CAPABILITIES BREAKDOWN
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <span style={{ color: "#00E6A8" }}>✓</span>
                    <span style={{ color: "#EAF4FF" }}>Public Discovery (get_sources):</span>
                    <span style={{ color: "#7187A5" }}>Active & Quota-Free</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <span style={{ color: "#00E6A8" }}>✓</span>
                    <span style={{ color: "#EAF4FF" }}>Direct Workspace Launch:</span>
                    <span style={{ color: "#7187A5" }}>Active (New Tab)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <span style={{ color: "#FFAB00" }}>⚠</span>
                    <span style={{ color: "#EAF4FF" }}>Restricted Feeds (Conflict/AIS/ADSB):</span>
                    <span style={{ color: "#FFAB00" }}>Requires WORLDMONITOR_API_KEY</span>
                  </div>
                </div>
              </div>

              {/* Provenance Box */}
              {provenance && (
                <div style={{ background: "rgba(6, 19, 41, 0.4)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(0, 217, 255, 0.2)" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#00D9FF", marginBottom: "4px" }}>
                    DATA PROVENANCE & FRESHNESS
                  </div>
                  <div style={{ fontSize: "10px", color: "#7187A5", lineHeight: "1.4" }}>
                    Provider: {provenance.provider} • Scope: {provenance.geographicalScope} • Freshness: {provenance.freshnessStatus} • Retrieved: {new Date(provenance.retrievedAt).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          </UltronPanel>
        </div>
      )}

      {/* 3. SOURCES TAB */}
      {activeTab === "sources" && (
        <UltronPanel title="DISCOVERED OSINT SOURCES" subtitle={`${filteredSources.length} Monitored Feeds`}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Filter Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    style={{
                      background: selectedCategory === c ? "#1687FF" : "rgba(11, 42, 80, 0.5)",
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

              <input
                type="text"
                placeholder="Search feeds, domains, regions..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  background: "rgba(6, 19, 41, 0.8)",
                  border: "1px solid rgba(113, 135, 165, 0.3)",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  color: "#EAF4FF",
                  fontSize: "11px",
                  width: "220px",
                }}
              />
            </div>

            {/* Sources Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "8px" }}>
              {filteredSources.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: "rgba(6, 19, 41, 0.7)",
                    border: "1px solid rgba(113, 135, 165, 0.2)",
                    borderRadius: "6px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#EAF4FF" }}>{s.name}</div>
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        background: "rgba(0, 217, 255, 0.1)",
                        color: "#00D9FF",
                        fontWeight: 600,
                      }}
                    >
                      {s.category}
                    </span>
                  </div>

                  <div style={{ fontSize: "10px", color: "#7187A5" }}>
                    Scope: {s.geographicalScope} • Update: {s.updateFrequency}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        color: s.accessRequirement === "PUBLIC_FREE" ? "#00E6A8" : "#FFAB00",
                        fontWeight: 600,
                      }}
                    >
                      {s.accessRequirement === "PUBLIC_FREE" ? "● OPEN FREE" : "▲ SUBSCRIPTION"}
                    </span>

                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "10px",
                        color: "#1687FF",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Open Provider ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </UltronPanel>
      )}

      {/* 4. SELF-HOST & ARCHITECTURE TAB */}
      {activeTab === "selfhost" && (
        <UltronPanel title="SELF-HOSTED DEPLOYMENT & AGPL-3.0 GOVERNANCE" subtitle="Phase 2 Deployment Architecture">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px", color: "#C8D8EA" }}>
            <div style={{ background: "rgba(124, 77, 255, 0.08)", border: "1px solid rgba(124, 77, 255, 0.3)", borderRadius: "6px", padding: "12px" }}>
              <div style={{ fontWeight: 700, color: "#7C4DFF", marginBottom: "4px" }}>
                AGPL-3.0-Only Licensing Compliance Guarantee:
              </div>
              <div>
                The World Monitor codebase is licensed under <strong>GNU Affero General Public License v3.0</strong>.
                To preserve ULTRON's sovereign proprietary application architecture:
              </div>
              <ul style={{ paddingLeft: "18px", marginTop: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>World Monitor source code is <strong>never vendored or compiled</strong> into ULTRON binaries.</li>
                <li>All interactions occur strictly across network boundaries over documented REST and MCP APIs.</li>
                <li>Self-hosted deployments must run as isolated containerized microservices in their own network namespace.</li>
              </ul>
            </div>

            <div style={{ background: "rgba(6, 19, 41, 0.8)", border: "1px solid rgba(113, 135, 165, 0.2)", borderRadius: "6px", padding: "12px" }}>
              <div style={{ fontWeight: 700, color: "#EAF4FF", marginBottom: "6px" }}>
                Optional Docker Standalone Deployment:
              </div>
              <pre
                style={{
                  background: "#020817",
                  padding: "10px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#00D9FF",
                  overflowX: "auto",
                }}
              >
{`# 1. Clone World Monitor separately
git clone https://github.com/koala73/worldmonitor.git worldmonitor-svc
cd worldmonitor-svc

# 2. Build and launch isolated container
docker build -t worldmonitor:latest .
docker run -d --name worldmonitor-node -p 8080:8080 worldmonitor:latest

# 3. Configure ULTRON environment in .env
WORLDMONITOR_MCP_URL=http://localhost:8080/mcp
WORLDMONITOR_API_BASE_URL=http://localhost:8080/api`}
              </pre>
            </div>
          </div>
        </UltronPanel>
      )}
    </div>
  );
}
