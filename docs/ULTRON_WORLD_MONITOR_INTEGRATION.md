# ULTRON — World Monitor Integration Architecture

## 1. Executive Summary & Upstream Reference

ULTRON integrates with **World Monitor** as an external Open-Source Intelligence (OSINT) and geospatial intelligence workspace.

- **Upstream Repository**: [`koala73/worldmonitor`](https://github.com/koala73/worldmonitor)
- **Official Hosted Application**: `https://worldmonitor.app/`
- **Official API Base**: `https://api.worldmonitor.app`
- **Official MCP Endpoint**: `https://worldmonitor.app/mcp`
- **Upstream License**: **GNU Affero General Public License v3.0 (AGPL-3.0-only)**

---

## 2. Browser Security & Framing Analysis (Phase 1)

Empirical HTTP response header audit on `https://worldmonitor.app`:
```http
HTTP/2 200
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: frame-ancestors 'self' https://www.worldmonitor.app https://tech.worldmonitor.app
```

### Architectural Policy:
1. **Zero Framing Tampering**: The upstream host explicitly enforces `X-Frame-Options: SAMEORIGIN` and CSP `frame-ancestors 'self'`. ULTRON **strictly forbids** reverse-proxy framing, stripping security headers, or disabling browser sandboxes.
2. **Tactical Launch Deck**: ULTRON provides an informative tactical launch deck with direct `"Open World Monitor in New Tab"` deep-links.
3. **Dedicated Workspace**: Navigating to `/world-monitor` opens an isolated intelligence deck within the ULTRON shell without altering the default home command center or replacing the existing Global Intelligence 3D Earth view.

---

## 3. Server-Side Native Intelligence Connector

ULTRON establishes server-side communication through `core/worldmonitor/worldMonitorService.ts`:

### 3.1 Anonymous Quota-Free Discovery (`get_sources`)
- The MCP `get_sources` discovery endpoint is public, anonymous, and quota-free.
- Automatically discovers categorized feeds across:
  - **Conflict**: Institute for the Study of War (ISW), ACLED
  - **Geopolitics**: Live Universal Awareness Map (Liveuamap)
  - **Maritime**: Global AIS Navigation Radar (MarineTraffic)
  - **Aviation**: ADSB Flight Vector Radar (Flightradar24)
  - **Climate**: NOAA Planetary Atmospheric & Oceanic Observatories
  - **Energy**: US EIA Strategic Petroleum & Gas Reserves
  - **Cyber**: CISA Known Exploited Vulnerabilities (KEV) Catalog

### 3.2 Credential Gating & Authentication
- Public discovery functions without credentials.
- Restricted real-time feeds (e.g. raw conflict feeds, high-frequency AIS transponders, military ADSB) require the `WORLDMONITOR_API_KEY` environment variable.
- If unconfigured, the UI truthfully displays **"CREDENTIALS REQUIRED"**; it never invents or fabricates live event data.

---

## 4. AGPL-3.0-Only Licensing Compliance (Phase 2)

### 4.1 Strict Source Code Isolation
- World Monitor source code is **never vendored, copied, or compiled** into ULTRON's proprietary binaries or client bundles.
- All integration occurs strictly over documented network boundaries via standard JSON-RPC 2.0 MCP and REST interfaces.

### 4.2 Optional Containerized Self-Hosting
Organizations requiring on-premises intelligence deployments can deploy World Monitor as an isolated microservice:
```bash
# 1. Clone independently
git clone https://github.com/koala73/worldmonitor.git worldmonitor-svc
cd worldmonitor-svc

# 2. Build and run isolated container
docker build -t worldmonitor:latest .
docker run -d --name worldmonitor-node -p 8080:8080 worldmonitor:latest

# 3. Configure ULTRON .env
WORLDMONITOR_MCP_URL=http://localhost:8080/mcp
WORLDMONITOR_API_BASE_URL=http://localhost:8080/api
```

---

## 5. Intelligence Provenance & Telemetry

Every imported record retains strict provenance metadata:
- **Provider**: World Monitor
- **Geographical Scope**: e.g., Global Chokepoints, Eastern Europe, Middle East
- **Update Frequency**: Sub-hourly, Daily, or Periodic
- **Freshness Status**: `VERIFIED_FRESH` vs `PERIODIC`
- **Verification Status**: `AUTHENTICATED` vs `UNAUTHENTICATED_OPEN_ACCESS`
- **Timestamps**: Publication timestamp and retrieval timestamp
