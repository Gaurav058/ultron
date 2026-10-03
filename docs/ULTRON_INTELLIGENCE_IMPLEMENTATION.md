# ULTRON OS — Real Intelligence Operating System Implementation

## 1. Architecture Overview

ULTRON OS has been upgraded from a conversational interface into a **true intelligence operating system**. The system decouples interactive client surfaces from persistent, autonomous backend intelligence loops.

```
                              ┌──────────────────────────────────┐
                              │     OPERATOR / WEB INTERFACE     │
                              │  (Command, Globe, Oracle, News)  │
                              └────────────────┬─────────────────┘
                                               │
                                 Real-time SSE (/api/events)
                                               │
                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ULTRON BACKEND KERNEL                                │
│                                                                                        │
│   ┌──────────────────────────┐    ┌──────────────────────────┐    ┌────────────────┐   │
│   │   Background Scheduler   │───▶│ GlobalIntelligenceEngine │───▶│ Multi-Source   │   │
│   │   (Hourly Autonomous)    │    │ (12 Adaptive Domains)    │    │ Claim Verifier │   │
│   └──────────────────────────┘    └──────────────────────────┘    └───────┬────────┘   │
│                 ▲                                                         │            │
│                 │                                                         ▼            │
│   ┌─────────────┴────────────┐                                    ┌────────────────┐   │
│   │   News Research Pipeline │                                    │ Memory Engine  │   │
│   │   (Fetch/Dedupe/Rank)    │                                    │ (Vector Graph) │   │
│   └──────────────────────────┘                                    └────────────────┘   │
│                 ▲                                                                      │
│                 │                                                                      │
│   ┌─────────────┴────────────┐    ┌──────────────────────────┐                         │
│   │  Earth Location Pipeline │◀───│ Google Maps & Open-Meteo │                         │
│   │  (Lat/Lon Resolver)      │    │ Live Telemetry Service   │                         │
│   └──────────────────────────┘    └──────────────────────────┘                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Intelligence Providers

### 2.1 Google Search Grounding (`GoogleSearchProvider`)
- Utilizes the official `@google/genai` SDK with native `{ googleSearch: {} }` grounding tools.
- Preserves full **provenance**, capturing source title, URL, snippets, grounding chunks, and verbatim citations.
- Extracts verifiable claims and named entities into structured intelligence signals.
- Invariant: If Google Search fails or GEMINI_API_KEY is missing, reports `SEARCH UNAVAILABLE` with zero hallucinated fallback.

### 2.2 YouTube Data API Adapter (`YouTubeResearchAdapter`)
- Integrates with official YouTube Data API v3 (`video`, `channel`, `playlist` search).
- Stores video ID, title, channel, publication date, thumbnail, and relevance.
- Invariant: If `YOUTUBE_API_KEY` is not present, reports `YOUTUBE SOURCE UNAVAILABLE`. Never scrapes HTML directly.

### 2.3 Social Research Providers (`SocialProviderRegistry`)
- Unified interface: `SocialResearchProvider { search(query): Promise<ResearchResult[]>; getStatus(): Promise<ProviderStatus>; }`
- Pluggable adapters for: **YouTube**, **X (Twitter)**, **Reddit**, **LinkedIn**, **Instagram**, **Facebook**, **TikTok**.
- Strict Non-Fabrication Rule: Unconfigured providers strictly report `NOT CONFIGURED` and are never queried.

---

## 3. Background Hourly Scheduler (`BackgroundIntelligenceScheduler`)

- **Autonomous Execution**: Runs inside the server process independently of open browser tabs.
- **Schedule**: Executes the mission `GLOBAL_INTELLIGENCE_SCAN` every hour (3600000 ms).
- **Workflow Pipeline**:
  ```
  Scheduler → Conductor → Researcher → Google Search Grounding → YouTube
  → Source Normalization → Analyst → Verifier → Memory Promotion → Oracle Update → News Update
  ```
- **State Persistence**: Serializes state to `data/intelligence_signals.json`, `data/research_history.json`, and `data/top_news.json`. When the browser is closed and reopened, complete research history is immediately restored.

---

## 4. Adaptive Research Domains (`AdaptiveDomainService`)

Rather than blindly querying everything, research is guided by server-side domain configurations across 12 distinct sectors:
1. **AI** (Frequency: 60m, Priority: HIGH)
2. **WORLD** (Frequency: 60m, Priority: HIGH)
3. **TECHNOLOGY** (Frequency: 60m, Priority: HIGH)
4. **BUSINESS** (Frequency: 120m, Priority: MEDIUM)
5. **SCIENCE** (Frequency: 120m, Priority: MEDIUM)
6. **CYBERSECURITY** (Frequency: 60m, Priority: HIGH)
7. **SPACE** (Frequency: 180m, Priority: STANDARD)
8. **AUTOMOTIVE** (Frequency: 180m, Priority: STANDARD)
9. **INDIA** (Frequency: 60m, Priority: HIGH)
10. **UAE** (Frequency: 60m, Priority: HIGH)
11. **STARTUPS** (Frequency: 120m, Priority: MEDIUM)
12. **SOFTWARE** (Frequency: 60m, Priority: HIGH)

---

## 5. News Research Pipeline (`NewsResearchService`)

Executes an 8-stage pipeline to generate **TOP NEWS** (5-7 stories) rather than an unfiltered firehose:
1. **FETCH**: Queries live Google Search Grounding and authoritative RSS feeds.
2. **NORMALIZE**: Harmonizes timestamps, descriptions, and source metadata.
3. **DEDUPLICATE**: Clusters similar headlines and purges duplicate URLs.
4. **CLASSIFY**: Tags articles into domains (AI, Tech, Science, Business, Security, World).
5. **EXTRACT CLAIMS**: Isolates verifiable factual assertions from article summaries.
6. **GEOLOCATE**: Extracts physical coordinates, cities, and countries.
7. **VERIFY**: Evaluates claims against source authority scores.
8. **SCORE & STORE**: Ranks using composite formula:
   $$\text{Score} = (\text{Recency} \times 0.20) + (\text{Importance} \times 0.25) + (\text{Source Quality} \times 0.20) + (\text{Verification} \times 0.20) + (\text{Geo} \times 0.15)$$

---

## 6. Verification Service (`VerificationService`)

All claims and signals undergo rigorous cross-source validation:
- **Authority Weighting**: High weights for institutional sources (Reuters: 0.95, Nature: 0.98, NASA: 0.98, CISA: 0.95, Bloomberg: 0.92).
- **Contradiction Detection**: Flags mutually exclusive claims or disputed assertions.
- **States**:
  - `VERIFIED`: Multiple independent authoritative sources corroborate the claim.
  - `PARTIALLY_VERIFIED`: Single primary source identified; awaiting corroboration.
  - `CONFLICTING`: Contradictory reporting detected.
  - `UNVERIFIED`: Insufficient ground-truth data available.

---

## 7. Memory Promotion (`MemoryEngine`)

- **Signal vs. Memory**: Raw news and unverified data remain **Signals**.
- **Promotion Threshold**: Only signals with `verificationStatus === "VERIFIED"` and confidence score $\ge 0.85$ are promoted into durable knowledge entities.
- Non-promoted signals remain in the ephemeral signal ledger.

---

## 8. Real Earth & Location Pipeline (`LocationPipelineService`)

- **Interactive 3D Surface**: High-precision Three.js globe with inverse spherical raycasting converts canvas clicks into exact $(\text{latitude}, \text{longitude})$ coordinates.
- **Google Maps 3D Platform JS API**: Supported via `<gmp-map-3d>` when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is provided.
- **Location Pipeline**:
  $$\text{Click} \longrightarrow (\text{Lat}, \text{Lon}) \longrightarrow \text{Reverse Geocoder} \longrightarrow \begin{cases} \text{Open-Meteo Live Meteorology} \\ \text{Top Regional News Headlines} \\ \text{Geopolitical Events Ledger} \\ \text{Authorized Cameras Verification} \end{cases} \longrightarrow \text{Location Card}$$
- **Zero Fabrication**: If no camera source is authorized, strictly returns:  
  `CAMERAS: NO AUTHORIZED SOURCES AVAILABLE`.

---

## 9. API Requirements & Endpoints

| Endpoint | Method | Function |
| :--- | :--- | :--- |
| `/api/health` | GET | Comprehensive real-time health checks for all 13 subsystems |
| `/api/events` | GET | Server-Sent Events (SSE) live push stream for all system transitions |
| `/api/news` | GET, POST | Top news retrieval (5-7 stories) & manual pipeline execution |
| `/api/location/resolve` | GET | Runs full location pipeline for `lat` and `lon` query parameters |
| `/api/oracle` | GET | Returns current verified intelligence insight, confidence, and sources |
| `/api/intelligence/status`| GET | Real-time status of background hourly research engine |
| `/api/intelligence/scan` | POST | Triggers immediate manual or scheduled intelligence scan |
| `/api/intelligence/signals`| GET | Returns verified intelligence signals |
| `/api/research/mission` | POST | Dispatches dedicated research mission (e.g. `RESEARCH_AI_STARTUPS_DUBAI`) |
| `/api/metrics/cost` | GET | Daily, monthly, and all-time token, request, and cost analytics |

---

## 10. Cost Control & Telemetry (`UsageTracker`)

- Automatically tracks:
  - Gemini model requests
  - Search grounding requests
  - Maps geocoding calls
  - YouTube Data API calls
  - Input & output token counts
  - Autonomous background scan count
  - Research execution duration (ms)
- Accurately computes daily and monthly estimated cost in USD.
- **Zero Secret Exposure**: Sanitizes all responses to ensure API keys are never leaked to client telemetry.

---

## 11. Known Limitations & Fallback Behaviors

1. **Camera Surveillance**: Public surveillance camera feeds require explicit municipality authorization. The system defaults to `NO_AUTHORIZED_SOURCES` until cryptographic credentials are provided.
2. **Social Media APIs**: Providers like X and LinkedIn require authenticated developer bearer tokens. When absent, the system displays `NOT CONFIGURED` with zero synthetic fallback.
3. **Rate Limits**: The system includes exponential backoff with jitter on Gemini and external APIs to avoid 429 quota exhaustion.
