"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import PageHeader from "../../common/PageHeader";
import SectionHeader from "../../common/SectionHeader";
import FilterBar from "../../common/FilterBar";
import SearchInput from "../../common/SearchInput";
import FreshnessIndicator, { FreshnessLevel } from "../../common/FreshnessIndicator";
import SourceAttribution from "../../common/SourceAttribution";
import Drawer from "../../common/Drawer";
import LoadingState from "../../common/LoadingState";
import EmptyState from "../../common/EmptyState";
import ErrorState from "../../common/ErrorState";
import StaleDataBanner from "../../common/StaleDataBanner";
import UltronButton from "../../common/UltronButton";
import { IntelligenceEvent, IntelligenceLayerConfig } from "@/core/intelligence/pipeline/types";
import { SelectedLocation } from "@/types/location";

const GlobalIntelligenceGlobe = dynamic(
  () => import("../../globe/GlobalIntelligenceGlobe"),
  { ssr: false }
);

export interface WorldMonitorModuleProps {
  onDispatchMission?: (prompt: string) => void;
}

export default function WorldMonitorModule({ onDispatchMission }: WorldMonitorModuleProps) {
  // Data State
  const [events, setEvents] = useState<IntelligenceEvent[]>([]);
  const [layers, setLayers] = useState<IntelligenceLayerConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toLocaleTimeString());
  const [isStale, setIsStale] = useState(false);

  // Filters & Search
  const [activeLayerFilter, setActiveLayerFilter] = useState<string>("ALL");
  const [timeFilter, setTimeFilter] = useState<"latest" | "24h" | "7d" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspection Drawer & Selected Event
  const [selectedEvent, setSelectedEvent] = useState<IntelligenceEvent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Map Synchronization State
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
    latitude: 25.2048,
    longitude: 55.2708,
    city: "Dubai",
    country: "UAE",
    selectedAt: new Date().toISOString(),
    weather: { temperature: "32°C", condition: "Clear" },
    cameraStatus: "NO_AUTHORIZED_SOURCES",
    cameraSources: [],
  });

  const [mobileViewTab, setMobileViewTab] = useState<"map" | "feed">("map");

  // Load Layers and Events from Pipeline
  const loadData = useCallback(async (isManualRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const [eventsRes, layersRes] = await Promise.all([
        fetch(`/api/intelligence/events?time=${timeFilter}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`),
        fetch("/api/intelligence/layers"),
      ]);

      if (!eventsRes.ok) throw new Error(`Events API responded with status ${eventsRes.status}`);

      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);

      if (layersRes.ok) {
        const layersData = await layersRes.json();
        setLayers(layersData.layers || []);
      }

      setLastRefreshedAt(new Date().toLocaleTimeString());
      setIsStale(false);
    } catch (err: any) {
      console.warn("World Monitor data load error:", err);
      setError(err?.message || "Failed to acquire intelligence telemetry");
      setIsStale(true);
    } finally {
      setIsLoading(false);
    }
  }, [timeFilter, searchQuery]);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => loadData(), 60000); // 60s background refresh
    return () => clearInterval(timer);
  }, [loadData]);

  // Layer filter options
  const filterOptions = useMemo(() => {
    const opts = [
      { key: "ALL", label: "All Layers", count: events.length },
      {
        key: "DISASTER",
        label: "Seismic (USGS)",
        count: events.filter((e) => e.category === "DISASTER").length,
        color: "var(--ultron-warning)",
      },
      {
        key: "WEATHER",
        label: "Environmental (NASA)",
        count: events.filter((e) => e.category === "WEATHER").length,
        color: "var(--ultron-warning)",
      },
      {
        key: "MARITIME",
        label: "Maritime Radar",
        count: events.filter((e) => e.category === "MARITIME").length,
        color: "var(--ultron-blue)",
      },
      {
        key: "CYBER",
        label: "Cyber Defense (CISA)",
        count: events.filter((e) => e.category === "CYBER").length,
        color: "var(--ultron-purple)",
      },
      {
        key: "GEOPOLITICS",
        label: "Geopolitics",
        count: events.filter((e) => e.category === "GEOPOLITICS").length,
        color: "var(--ultron-primary)",
      },
      {
        key: "MISSIONS",
        label: "ULTRON Missions",
        count: events.filter((e) => e.category === "MISSIONS").length,
        color: "var(--ultron-success)",
      },
    ];
    return opts;
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    let result = events;
    if (activeLayerFilter !== "ALL") {
      result = result.filter((e) => e.category === activeLayerFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.sourceName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [events, activeLayerFilter, searchQuery]);

  // Handle Event Selection -> FlyTo Coordinates & Open Drawer
  const handleSelectEvent = (event: IntelligenceEvent) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);

    setSelectedLocation({
      latitude: event.latitude,
      longitude: event.longitude,
      city: event.geographicalScope?.split("/")[0]?.trim() || event.title,
      country: "Earth Sector",
      selectedAt: event.eventTime,
      insights: [
        `Category: ${event.category}`,
        `Severity: ${event.severity || "MEDIUM"}`,
        `Attributed Source: ${event.sourceName}`,
      ],
      cameraStatus: "NO_AUTHORIZED_SOURCES",
      cameraSources: [],
    });
  };

  // Handle "Investigate with ULTRON"
  const handleInvestigateEvent = (event: IntelligenceEvent) => {
    const prompt = `Investigate intelligence signal: "${event.title}" at coordinates [${event.latitude.toFixed(2)}°, ${event.longitude.toFixed(2)}°] reported by ${event.sourceName}. Corroborate source claims, separate facts from inference, and record provenance.`;
    onDispatchMission?.(prompt);
    setIsDrawerOpen(false);
  };

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
      {/* 1. WORKSPACE HEADER */}
      <PageHeader
        title="GLOBAL INTELLIGENCE"
        subtitle="A source-attributed operational view of global events, geospatial telemetry, and emerging signals across planetary boundaries."
        breadcrumbs={["ULTRON OS", "WORLD MONITOR", "NATIVE WORKSPACE"]}
        badge={
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FreshnessIndicator level={isStale ? "STALE" : "LIVE"} lastUpdated={lastRefreshedAt} />
            <span
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                borderRadius: "var(--radius-xs)",
                background: "rgba(0, 230, 168, 0.12)",
                color: "var(--ultron-success)",
                border: "1px solid rgba(0, 230, 168, 0.3)",
                fontWeight: 600,
              }}
            >
              ALL FEEDS OPERATIONAL
            </span>
          </div>
        }
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <UltronButton
              variant="secondary"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isLoading}
            >
              {isLoading ? "Acquiring..." : "Force Refresh"}
            </UltronButton>

            {/* Mobile Tab Switcher */}
            <div className="ultron-mobile-toggle" style={{ display: "none", gap: "4px" }}>
              <button
                onClick={() => setMobileViewTab("map")}
                style={{
                  padding: "4px 8px",
                  fontSize: "10px",
                  borderRadius: "var(--radius-sm)",
                  background: mobileViewTab === "map" ? "var(--ultron-blue)" : "transparent",
                  color: "var(--ultron-text-primary)",
                  border: "1px solid var(--ultron-border)",
                }}
              >
                Map
              </button>
              <button
                onClick={() => setMobileViewTab("feed")}
                style={{
                  padding: "4px 8px",
                  fontSize: "10px",
                  borderRadius: "var(--radius-sm)",
                  background: mobileViewTab === "feed" ? "var(--ultron-blue)" : "transparent",
                  color: "var(--ultron-text-primary)",
                  border: "1px solid var(--ultron-border)",
                }}
              >
                Feed ({filteredEvents.length})
              </button>
            </div>
          </div>
        }
      />

      {/* Stale Banner or Error Banner */}
      {isStale && (
        <StaleDataBanner
          cachedAt={lastRefreshedAt}
          sourceName="USGS / NASA / Maritime Open Telemetry"
          onRefresh={() => loadData(true)}
        />
      )}
      {error && !isStale && (
        <ErrorState
          title="Telemetry Connection Failed"
          message={error}
          onRetry={() => loadData(true)}
        />
      )}

      {/* 2. CONTROLS BAR: Layers + Time Horizon + Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          padding: "8px 12px",
          background: "var(--ultron-bg-panel)",
          border: "1px solid var(--ultron-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <FilterBar
          options={filterOptions}
          activeKey={activeLayerFilter}
          onChange={setActiveLayerFilter}
          size="sm"
        />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e: any) => setTimeFilter(e.target.value)}
            style={{
              background: "rgba(3, 13, 31, 0.8)",
              border: "1px solid var(--ultron-border)",
              color: "var(--ultron-text-primary)",
              fontSize: "10px",
              padding: "4px 8px",
              borderRadius: "var(--radius-sm)",
              outline: "none",
            }}
          >
            <option value="latest">Latest Horizon (&lt;6h)</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="all">All Available</option>
          </select>

          {/* Search */}
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Filter location or event..."
            width="200px"
          />
        </div>
      </div>

      {/* 3. MAIN WORKSPACE VIEWPORT (Desktop Split: Map Left/Center + Feed Right) */}
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "10px",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Left/Center: NATIVE INTERACTIVE MAP SURFACE */}
        <div
          style={{
            flex: "1 1 65%",
            display: mobileViewTab === "feed" ? "none" : "flex",
            flexDirection: "column",
            background: "var(--ultron-bg-panel)",
            border: "1px solid var(--ultron-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <GlobalIntelligenceGlobe
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onInvestigateLocation={(loc) => {
              const prompt = `Investigate geospatial anomaly at Sector [${loc.latitude.toFixed(2)}°, ${loc.longitude.toFixed(2)}°] (${loc.city || "Coordinates"}).`;
              onDispatchMission?.(prompt);
            }}
          />
        </div>

        {/* Right: SYNCHRONIZED EVENT FEED PANEL */}
        <div
          style={{
            flex: "1 1 35%",
            maxWidth: "460px",
            minWidth: "320px",
            display: mobileViewTab === "map" ? "flex" : "flex",
            flexDirection: "column",
            background: "var(--ultron-bg-panel)",
            border: "1px solid var(--ultron-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid var(--ultron-border)",
              background: "var(--ultron-bg-elevated)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SectionHeader
              title="SYNCHRONIZED FEED"
              count={filteredEvents.length}
              style={{ borderBottom: "none", marginBottom: 0, padding: 0 }}
            />
            <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)" }}>
              Click to FlyTo
            </span>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {isLoading && events.length === 0 ? (
              <LoadingState message="Connecting multi-domain intelligence feeds..." />
            ) : filteredEvents.length === 0 ? (
              <EmptyState
                title="No Events Found"
                description={`No real-world events detected matching active layer "${activeLayerFilter}" in time frame.`}
              />
            ) : (
              filteredEvents.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => handleSelectEvent(evt)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: isSelected
                        ? "linear-gradient(90deg, rgba(22, 135, 255, 0.25) 0%, rgba(11, 42, 80, 0.45) 100%)"
                        : "rgba(6, 19, 41, 0.7)",
                      border: isSelected
                        ? "1px solid var(--ultron-primary)"
                        : "1px solid rgba(11, 42, 80, 0.6)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "var(--ultron-bg-hover)";
                        e.currentTarget.style.borderColor = "rgba(0, 217, 255, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "rgba(6, 19, 41, 0.7)";
                        e.currentTarget.style.borderColor = "rgba(11, 42, 80, 0.6)";
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: isSelected ? "var(--ultron-text-primary)" : "var(--ultron-text-secondary)",
                          lineHeight: 1.3,
                        }}
                      >
                        {evt.title}
                      </div>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "1px 5px",
                          borderRadius: "var(--radius-xs)",
                          background: "rgba(0, 217, 255, 0.12)",
                          color: "var(--ultron-primary)",
                          border: "1px solid rgba(0, 217, 255, 0.25)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {evt.category}
                      </span>
                    </div>

                    <div style={{ fontSize: "11px", color: "var(--ultron-text-muted)", lineHeight: 1.3, marginTop: "2px" }}>
                      {evt.summary.slice(0, 120)}...
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "10px",
                        color: "var(--ultron-text-muted)",
                        marginTop: "4px",
                      }}
                    >
                      <span>
                        📍 [{evt.latitude.toFixed(2)}°, {evt.longitude.toFixed(2)}°]
                      </span>
                      <span style={{ fontVariantNumeric: "tabular-nums" }}>
                        {new Date(evt.eventTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div style={{ fontSize: "9px", color: "var(--ultron-text-muted)", opacity: 0.8 }}>
                      Source: {evt.sourceName}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 4. EVENT DETAIL SIDE DRAWER (Phase 4.D) */}
      {selectedEvent && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedEvent.title}
          subtitle={`Category: ${selectedEvent.category} • Location: [${selectedEvent.latitude.toFixed(2)}°, ${selectedEvent.longitude.toFixed(2)}°]`}
          badge={
            <span
              style={{
                fontSize: "9px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "var(--radius-xs)",
                background:
                  selectedEvent.severity === "CRITICAL"
                    ? "rgba(255, 77, 103, 0.2)"
                    : selectedEvent.severity === "HIGH"
                    ? "rgba(255, 176, 32, 0.2)"
                    : "rgba(0, 217, 255, 0.2)",
                color:
                  selectedEvent.severity === "CRITICAL"
                    ? "var(--ultron-error)"
                    : selectedEvent.severity === "HIGH"
                    ? "var(--ultron-warning)"
                    : "var(--ultron-primary)",
              }}
            >
              {selectedEvent.severity || "MEDIUM"} PRIORITY
            </span>
          }
          width="440px"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Event Summary */}
            <div
              style={{
                background: "var(--ultron-bg-main)",
                border: "1px solid var(--ultron-border)",
                borderRadius: "var(--radius-md)",
                padding: "12px",
                fontSize: "12px",
                color: "var(--ultron-text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {selectedEvent.summary}
            </div>

            {/* Source Attribution Box */}
            <SourceAttribution
              sourceName={selectedEvent.sourceName}
              sourceUrl={selectedEvent.sourceUrl}
              verified={selectedEvent.verificationStatus === "VERIFIED"}
              publishedAt={new Date(selectedEvent.publishedAt).toLocaleTimeString()}
              geographicalScope={selectedEvent.geographicalScope}
            />

            {/* Telemetry Matrix */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                fontSize: "11px",
              }}
            >
              <div
                style={{
                  background: "var(--ultron-bg-elevated)",
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--ultron-border)",
                }}
              >
                <div style={{ color: "var(--ultron-text-muted)", fontSize: "10px" }}>EVENT TIME</div>
                <div style={{ color: "var(--ultron-text-primary)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {new Date(selectedEvent.eventTime).toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  background: "var(--ultron-bg-elevated)",
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--ultron-border)",
                }}
              >
                <div style={{ color: "var(--ultron-text-muted)", fontSize: "10px" }}>COORDINATES</div>
                <div style={{ color: "var(--ultron-primary)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {selectedEvent.latitude.toFixed(4)}°, {selectedEvent.longitude.toFixed(4)}°
                </div>
              </div>
            </div>

            {/* INVESTIGATION CTA (Phase 4.G) */}
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px",
                background: "rgba(22, 135, 255, 0.08)",
                border: "1px solid rgba(0, 217, 255, 0.3)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ultron-primary)" }}>
                AUTONOMOUS MULTI-AGENT INVESTIGATION
              </div>
              <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)", lineHeight: 1.4 }}>
                Dispatch a real mission through ULTRON's DAG engine. Agents will validate source corroboration, separate reported facts from inference, and commit findings to long-term memory.
              </div>

              <UltronButton
                variant="primary"
                size="md"
                onClick={() => handleInvestigateEvent(selectedEvent)}
              >
                Investigate with ULTRON ↗
              </UltronButton>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
