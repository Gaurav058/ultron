# ULTRON OS — Native World Monitor Workspace Architecture
**Document ID**: `docs/ULTRON_WORLD_MONITOR_ARCHITECTURE.md`  
**Route**: `/world-monitor`  
**Status**: ACTIVE  

---

## 1. Architectural Overview

The native **World Monitor Workspace** is rendered directly inside the sovereign ULTRON application shell, providing an integrated geospatial intelligence deck. Users inspect planetary telemetry, filter multi-domain event layers, correlate real-world crises, and launch autonomous multi-agent investigations without leaving the ULTRON interface.

```
+---------------------------------------------------------------------------------------+
|                                    ULTRON HEADER                                      |
+-----------+-------------------------------------------------------------+-------------+
| SIDEBAR   |                      WORKSPACE HEADER                       | TIME/LAYERS |
| (NavRail) | "GLOBAL INTELLIGENCE — Attributable Geospatial Telemetry"   | 24h / 7d    |
+-----------+-------------------------------------------------------------+-------------+
| Command   |                                                             | EVENT FEED  |
| Missions  |            INTERACTIVE GEOSPATIAL MAP SURFACE               | & DRAWER    |
| Agents    |                                                             |             |
| Memory    |  • Photorealistic 3D Earth / Google 3D Maps Engine          | • Event 1   |
| Global    |  • Marker clustering with severity & category colors        | • Event 2   |
| WorldMon  |  • Smooth Camera FlyTo / Pitch / Tilt / Reset Controls      | • Event 3   |
| Tools     |  • Layer visibility toggles (Disaster, Maritime, etc.)      |             |
| System    |                                                             | [Investigate|
|           |                                                             |  w/ ULTRON] |
+-----------+-------------------------------------------------------------+-------------+
|                                BOTTOM COMMAND COMPOSER                                |
+---------------------------------------------------------------------------------------+
```

---

## 2. Core Functional Components

### 2.1 Workspace Header
- **Title**: `GLOBAL INTELLIGENCE`
- **Telemetry Indicators**: Freshness (`LIVE STREAM` vs `RECENT`), active event count, last refresh timestamp, and provider connectivity indicator.
- **Actions**:
  - `Force Refresh`: Triggers bounded cache revalidation.
  - `Search Location / Event`: Instant search across title, location, category, and source.
  - `Time Horizon Selector`: `Latest Available`, `Past 24 Hours`, `Past 7 Days`, `All Records`.

### 2.2 Interactive Geospatial Map Surface
- Uses the existing Google Maps Platform 3D Earth engine (`<gmp-map-3d>`) with hybrid satellite/boundaries rendering.
- Features real verified markers placed at exact latitude/longitude coordinates.
- **Synchronized Map Controls**:
  - Reset View (returns to global orbital overview).
  - Tilt / Pitch Control (shifts between top-down 2D nadir and tactical 45° 3D perspective).
  - Geolocation ("My Location") with authentic browser permission checks.
  - Coordinate Telemetry: live display of cursor/center latitude and longitude.

### 2.3 10-Layer Intelligence Registry
The workspace provides 10 toggleable intelligence layers:
1. `Geopolitical Events`: Diplomatic shifts, border disputes, treaty declarations.
2. `Conflict & Security`: Armed conflict, tactical movements, and frontline tracking.
3. `Natural Disasters & Earthquakes`: USGS sub-minute global seismic events (M2.5+).
4. `Weather & Environmental`: NASA EONET satellite observations of wildfires and severe storms.
5. `Aviation Telemetry`: Airspace restrictions and transponder vectors.
6. `Maritime Radar`: Strategic choke points (Hormuz, Bab-el-Mandeb, Suez, Malacca, Bosphorus).
7. `Economic & Market Signals`: Strategic energy and petroleum reserves (EIA).
8. `Cybersecurity`: CISA Known Exploited Vulnerabilities catalog.
9. `Technology & AI Signals`: Compute cluster launches and frontier model intelligence.
10. `ULTRON Missions & Targets`: Active multi-agent mission investigation sites.

### 2.4 Synchronized Event Feed & Inspection Drawer
- **Bidirectional Focus**:
  - Clicking a marker on the 3D Earth opens the Event Detail side drawer and highlights the item in the list.
  - Clicking an item in the list executes a smooth camera `flyTo` centering the map on the event coordinates.
- **Event Detail Drawer**:
  - Event title, category badge, and severity indicator (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  - Coordinates and geographical region.
  - Source attribution with verified badge and direct external link.
  - Summary of observations and atomic claims.
  - Related reports and corroborating sources.
  - **"Investigate with ULTRON" CTA**: Passes structured event context to the mission engine.

---

## 3. Investigation Workflow

When the operator clicks **"Investigate with ULTRON"**:
1. Structured context is packaged:
   ```json
   {
     "eventId": "usgs-nc75091234",
     "title": "M5.8 Earthquake — Northern California",
     "category": "DISASTER",
     "coordinates": { "lat": 40.32, "lon": -124.89 },
     "sourceUrl": "https://earthquake.usgs.gov/earthquakes/event/nc75091234",
     "eventTime": "2026-10-09T12:30:00Z"
   }
   ```
2. The mission manager compiles a 4-stage DAG pipeline:
   - **Stage 1 (Architect)**: Scope reconnaissance & source validation.
   - **Stage 2 (Security)**: Evidence corroboration & permission gating.
   - **Stage 3 (Researcher/Builder)**: Multi-source fact verification and fact vs inference separation.
   - **Stage 4 (Reality Checker)**: Citation audit and permanent ledger storage.
3. The mission is registered in `MissionManager`, displays in the workflow DAG, and streams updates to the operator.
