# ULTRON OS — Comprehensive Interaction Audit

**Directive Requirement 1**  
**Audit Standard**: Every visible interactive element (button, link, input, tab, icon) must have a deterministic route, action, API call, state mutation, modal, or explicit disabled/unavailable state. No dead buttons are permitted in ULTRON OS.

---

## Interactive Elements Audit Matrix

| Element | Location | Current Behavior | Expected Behavior | Implementation | API | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **System Online Badge** | Header (Top Right) | Opens System Health Overview | Display real-time operational status and open diagnostic subsystem inspect view | `onClick={() => onOpenSystemHealth()}` | `/api/health` | **ACTIVE** |
| **Background Intelligence Pill** | Header (Center) | Shows live scan status & opens pipeline modal | Live telemetry of last scan, next scan, signals, verified counts, and manual scan trigger | `UltronHeader.tsx` + `showResearchModal` | `/api/intelligence/status`, `/api/intelligence/scan` | **ACTIVE** |
| **Connected Devices Button** | Header (Right) | Opens Connected Devices Dialog | Displays host, mobile companion, and sovereign cloud node status | `UltronHeader.tsx` + `showDevicesModal` | Local Telemetry | **ACTIVE** |
| **Operator Profile Button** | Header (Right) | Opens Operator Clearance Dialog | Displays user credentials, clearance level (Level 5), and zero-trust policies | `UltronHeader.tsx` + `showProfileModal` | Local Enclave | **ACTIVE** |
| **Home Nav Icon** | NavRail (Left) | Switches view to Command Center | Switches active module to Home overview | `setActiveNav("home")` | Client Router | **ACTIVE** |
| **Missions Nav Icon** | NavRail (Left) | Switches view to Missions Module | Opens DAG scheduling, task trees, trace logs, and approval gates | `setActiveNav("missions")` | `/core/missions` | **ACTIVE** |
| **Brain Nav Icon** | NavRail (Left) | Switches view to Brain Module | Opens durable memory matrix, vector queries, and fact promotion | `setActiveNav("brain")` | `/core/memory` | **ACTIVE** |
| **Agents Nav Icon** | NavRail (Left) | Switches view to Agents Module | Opens 10 cognitive specialists roster, roles, and tool permissions | `setActiveNav("agents")` | `/core/conductor` | **ACTIVE** |
| **Tools Nav Icon** | NavRail (Left) | Switches view to Tools Module | Opens 11 controlled tool definitions and parameter sandbox | `setActiveNav("tools")` | `/core/tools` | **ACTIVE** |
| **World Nav Icon** | NavRail (Left) | Switches view to World Module | Opens external telemetry ledger (NORAD ISS, USGS, CoinGecko, Meteo) | `setActiveNav("world")` | External APIs | **ACTIVE** |
| **System Nav Icon** | NavRail (Left) | Switches view to System Module | Opens 13 subsystem diagnostics and doctor integrity checks | `setActiveNav("system")` | `/api/health` | **ACTIVE** |
| **Active Missions Tab** | Missions & Chat (Left) | Toggles active missions list | Shows filtered list of active running missions | `setActiveTab("missions")` | State | **ACTIVE** |
| **Chat Tab** | Missions & Chat (Left) | Toggles conversational chat stream | Shows conversational turn stream with model badges | `setActiveTab("chat")` | State | **ACTIVE** |
| **+ New Mission Button** | Missions & Chat (Left) | Opens New Mission Dialog | Opens modal allowing user to specify objective, category, and launch | `setShowNewMissionModal(true)` | `/api/research/mission` | **ACTIVE** |
| **Mission Item Card** | Missions & Chat (Left) | Selects active mission | Updates active mission ID and highlights workflow graph | `onSelectMission(id)` | State | **ACTIVE** |
| **Chat Mini Input & Send** | Missions & Chat (Left) | Submits text to conversational stream | Dispatches user message, triggers kernel or research mission | `handleSend()` | `/api/voice/chat` | **ACTIVE** |
| **Pipeline Workflow Node** | Agent Workflow (Center) | Opens Node Inspector Drawer | Shows assigned task, start time, tools, and execution status | `setSelectedNode(node)` | State | **ACTIVE** |
| **Live Badge** | Agent Workflow (Center) | Shows live stream indicator | Indicates active real-time SSE stream | Tooltip / State | `/api/events` | **ACTIVE** |
| **Total Agents Metric Tile** | Agent Workflow (Center) | Opens Specialist Agents Modal | Displays full roster of 10 configured specialist agents | `setActiveMetricModal("agents")` | `/core/conductor` | **ACTIVE** |
| **Active Tasks Metric Tile** | Agent Workflow (Center) | Opens Active Tasks Modal | Displays running parallel DAG tasks | `setActiveMetricModal("tasks")` | State | **ACTIVE** |
| **Completed Today Tile** | Agent Workflow (Center) | Opens Completed Milestones Modal | Displays completed tasks and turnaround metrics | `setActiveMetricModal("completed")` | State | **ACTIVE** |
| **System Load Metric Tile** | Agent Workflow (Center) | Opens System Load Modal | Displays performance latency, throughput, and memory stats | `setActiveMetricModal("load")` | `/api/health` | **ACTIVE** |
| **3D Earth Surface** | Global Intelligence Globe | Computes Lat/Lon on click via raycasting | Triggers real Earth Location Pipeline (weather, news, events) | Raycaster + `triggerLocationPipeline` | `/api/location/resolve` | **ACTIVE** |
| **Globe Layer Buttons (8)** | Globe (Left Filter Bar) | Filters active intelligence layers | Filters news, weather, markets, tech, security, geopolitics | `setActiveLayer(layer.id)` | State | **ACTIVE** |
| **Globe Hotspot Shortcuts** | Globe (Left Filter Bar) | Flies camera to city & resolves location | Smooth camera re-orientation and location pipeline trigger | `flyToCoordinates(lat, lon)` | `/api/location/resolve` | **ACTIVE** |
| **Globe Zoom In (+)** | Globe Toolbar (Bottom) | Zooms camera closer to Earth | Decreases camera distance (clamped to 1.3) | `handleZoomIn()` | Three.js Camera | **ACTIVE** |
| **Globe Zoom Out (−)** | Globe Toolbar (Bottom) | Zooms camera further out | Increases camera distance (clamped to 4.5) | `handleZoomOut()` | Three.js Camera | **ACTIVE** |
| **Globe Reset Rotation** | Globe Toolbar (Bottom) | Centers view on Dubai prime zone | Resets rotation angles and camera distance | `handleResetRotation()` | Three.js Group | **ACTIVE** |
| **Globe 3D Tilt Toggle** | Globe Toolbar (Bottom) | Toggles oblique isometric tilt | Toggles pitch angle between flat and oblique | `handleTilt()` | Three.js Group | **ACTIVE** |
| **Location Card Close (×)** | Floating Location Card | Closes floating location preview | Hides location card from globe overlay | `setShowLocationDetails(false)` | State | **ACTIVE** |
| **Location View Details →** | Floating Location Card | Opens Full Location Details Modal | Displays live weather, regional news headlines, and camera status | `setShowLocationModal(true)` | `/api/location/resolve` | **ACTIVE** |
| **Globe Settings Gear (⚙)** | Globe Header (Right) | Opens Earth & Maps Settings Modal | Displays active 3D engine mode, Maps API state, raycaster | `setShowEarthSettingsModal(true)` | State | **ACTIVE** |
| **Live Activity View All →** | Live Activity Panel | Switches active view to System Module | Navigates to full diagnostic activity view | `setActiveNav("system")` | Nav Router | **ACTIVE** |
| **Subsystem Health Items (12)** | System Health Panel | Opens Subsystem Detail Modal | Shows latency, message, and diagnostic probe time | `setSelectedSubsystem(detail)` | `/api/health` | **ACTIVE** |
| **Oracle VIEW SOURCES** | Ultron Oracle Panel | Opens Oracle Verified Sources Modal | Lists primary sources with external links, snippets, authority | `setShowSourcesModal(true)` | `/api/oracle` | **ACTIVE** |
| **Oracle INVESTIGATE** | Ultron Oracle Panel | Dispatches investigation mission | Prompts research engine to deep-dive into active signal | `onActionInvestigate()` | `/api/research/mission` | **ACTIVE** |
| **Oracle CREATE MISSION** | Ultron Oracle Panel | Compiles & launches mission | Creates actionable mission from oracle insight | `onActionCreateMission()` | `/api/research/mission` | **ACTIVE** |
| **Top News Tab** | Global News Panel | Displays top 5-7 ranked stories | Filters to verified top stories ranked by importance & recency | `setActiveTab("top")` | `/api/news?limit=7` | **ACTIVE** |
| **All News Tab** | Global News Panel | Displays full news stream | Displays all collected regional & domain news items | `setActiveTab("all")` | `/api/news?filter=all` | **ACTIVE** |
| **News Story Card Click** | Global News Panel | Flies Earth to story coordinates | Selects story, updates location state, and re-centers 3D Earth | `onSelectStory(story)` | `/api/location/resolve` | **ACTIVE** |
| **View All News → Link** | Global News Panel | Opens Full News Feed Modal | Comprehensive modal with search by headline, domain, location | `setShowAllNewsModal(true)` | `/api/news` | **ACTIVE** |
| **Glowing Microphone Button** | Command Bar (Bottom) | Starts/stops speech recognition | Uses Web Speech API to transcribe operator voice commands | `toggleMic()` | Web Speech API | **ACTIVE** |
| **File Attachment Button** | Command Bar (Bottom) | Opens system file picker | Attaches document/data files as context to prompt | `fileInputRef.current.click()` | Native DOM | **ACTIVE** |
| **Voice Audio Synth Toggle** | Command Bar (Bottom) | Mutes/unmutes voice engine | Controls spoken voice synthesis audio output | `toggleVoiceSynth()` | `UltronVoiceEngine` | **ACTIVE** |
| **Command Submit Button** | Command Bar (Bottom) | Executes user command / mission | Submits text/voice input to kernel or research pipeline | `handleSubmit()` | `/api/voice/chat`, `/api/research/mission` | **ACTIVE** |
| **Approval Modal Approve** | Approval Modal Dialog | Approves gated high-risk action | Unblocks policy gate and continues mission execution | `handleApproveGate(gateId)` | `MissionManager.approveGate` | **ACTIVE** |
| **Approval Modal Deny** | Approval Modal Dialog | Denies gated action | Rejects policy gate and halts sensitive execution | `handleDenyGate(gateId)` | State | **ACTIVE** |
| **Approval Modal Close (×)** | Approval Modal Dialog | Closes approval inspection modal | Closes modal dialog without action | `setShowApprovalModal(false)` | State | **ACTIVE** |

---

## Non-Implemented & Unavailable State Protections

1. **Surveillance Cameras**: As mandated by Directive Section 3 & 12, surveillance video sources are not fabricated. All camera indicators strictly display:  
   `CAMERAS: NO AUTHORIZED SOURCES AVAILABLE`.
2. **Social Research Providers**: Providers without configured API keys (X, Reddit, TikTok, LinkedIn, Facebook, Instagram) strictly report `NOT CONFIGURED` rather than faking search results.
3. **External Distributed Cache**: Remote Redis cluster displays `NOT CONFIGURED` with local in-memory LRU fallback.
4. **Google Maps 3D Platform JS API**: When `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is not present, the system cleanly and transparently executes high-precision WebGL 3D Earth with authentic Open-Meteo and OpenStreetMap Nominatim reverse geocoding.
