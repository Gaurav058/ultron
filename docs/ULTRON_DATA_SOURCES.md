# ULTRON OS — Data Source Directory & Policy Catalog
**Document ID**: `docs/ULTRON_DATA_SOURCES.md`  
**Status**: ACTIVE  
**Last Verified**: October 2026  

---

## 1. Data Sourcing Architecture & Integrity Principles

ULTRON’s native Global Intelligence pipeline ingests verifiable, attributable real-world telemetry from official government feeds, satellite observatories, and documented public endpoints.

### Key Operational Rules:
1. **Zero Fabrication Policy**: ULTRON never synthesizes fictitious disaster alerts, artificial military movements, or fake seismic events.
2. **Transparent Freshness**: Feeds are labeled with honest data states (`LIVE`, `RECENT`, `PERIODIC`, `CACHED`, `STALE`).
3. **SSRF Guard**: Every outbound URL is audited by `SSRFGuard` to prevent private subnet and cloud metadata traversal.
4. **Resilience & Circuit Breaking**: All feeds employ request deduplication, in-memory TTL caching, and automatic circuit breakers.

---

## 2. Live Data Source Catalog

### 2.1 USGS Earthquake Hazards Program
- **Endpoint**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson`
- **Data Format**: GeoJSON FeatureCollection with point coordinates (`[longitude, latitude, depth]`).
- **Authentication**: None required (anonymous public access).
- **Rate Limits**: Recommended max 1 request per minute; ULTRON caches with a 3-minute TTL.
- **Update Frequency**: Sub-minute near real-time updates.
- **Attribution**: United States Geological Survey (USGS).
- **License / Terms**: U.S. Government work in the public domain. Commercial reuse permitted with source attribution.
- **Fallback Behavior**: In-memory stale cache served if network times out.

### 2.2 NASA EONET (Earth Observatory Natural Event Tracker)
- **Endpoint**: `https://eonet.gsfc.nasa.gov/api/v3/events?limit=25&status=open`
- **Data Format**: JSON (Open Events with geometry objects and category taxonomies).
- **Authentication**: None required (public NASA API).
- **Rate Limits**: Max 1 request every 60 seconds; ULTRON caches with a 5-minute TTL.
- **Update Frequency**: Sub-hourly passes matching NASA orbital satellite observations.
- **Attribution**: NASA Goddard Space Flight Center / Earth Observatory.
- **License / Terms**: NASA Open Data Policy (Public Domain).
- **Fallback Behavior**: Stale cached natural event records served on circuit breaker trip.

### 2.3 CISA Known Exploited Vulnerabilities (KEV) Catalog
- **Endpoint**: `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json`
- **Data Format**: JSON array of CVE vulnerability records with remediation requirements.
- **Authentication**: None required (public government feed).
- **Rate Limits**: 1 request every 10 minutes; ULTRON caches with a 10-minute TTL.
- **Update Frequency**: Daily or upon emergency advisory releases.
- **Attribution**: Cybersecurity and Infrastructure Security Agency (CISA).
- **License / Terms**: U.S. Government Public Domain.
- **Fallback Behavior**: Cached vulnerability database served on network partition.

### 2.4 Open-Meteo Planetary Atmospheric Grid
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Data Format**: JSON (Hourly & Current Weather variables).
- **Authentication**: None required for standard open access (non-commercial/attribution).
- **Rate Limits**: 10,000 daily calls; ULTRON limits queries to active location viewports.
- **Update Frequency**: Hourly numerical weather prediction model runs.
- **Attribution**: Open-Meteo.com (CC BY 4.0).
- **License / Terms**: Free for open use with attribution; commercial subscription available.
- **Fallback Behavior**: Retains last confirmed meteorological observation.

### 2.5 Strategic Maritime Navigation Radar
- **Telemetry Type**: Fixed strategic choke points and international shipping corridors.
- **Key Points**: Strait of Hormuz, Bab-el-Mandeb, Suez Canal, Strait of Malacca, Bosphorus, Panama Canal.
- **Data Format**: Normalized geospatial coordinates with tactical risk assessments.
- **Attribution**: International Maritime Organization (IMO) / Open Marine Notices.
- **License / Terms**: Public navigational guidance.

### 2.6 Have I Been Pwned (HIBP) Password Range API
- **Endpoint**: `https://api.pwnedpasswords.com/range/{5-char-sha1-prefix}`
- **Data Format**: Plaintext hash suffixes with breach frequency counts.
- **Authentication**: Free public k-Anonymity range API (Zero API key required).
- **Privacy Mode**: Strictly mathematical k-Anonymity; only 5 characters of SHA-1 hash transmitted. Plaintext credentials never leave client browser.
- **Attribution**: Troy Hunt / Have I Been Pwned.
- **Terms**: Free for authorized user queries. Zero PII stored in memory or disk.

### 2.7 World Monitor MCP Protocol
- **Endpoint**: `https://worldmonitor.app/mcp`
- **Data Format**: JSON-RPC 2.0 (`tools/call`, `tools/list`).
- **Authentication**: Anonymous public quota-free access for `get_sources`. Restricted real-time feeds require `WORLDMONITOR_API_KEY`.
- **License Boundaries**: GNU AGPL-3.0-only; accessed strictly across independent network boundaries.
