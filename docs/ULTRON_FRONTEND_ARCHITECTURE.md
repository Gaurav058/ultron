# ULTRON FRONTEND ARCHITECTURE SPECIFICATION
**Version:** 3.0.0-PROD  
**Target:** ULTRON Intelligence Operating System Command Center  
**Visual Reference:** `input_file_0.png`  
**Base Route:** `/` (Primary Command Center)

---

## 1. System Overview & Visual Hierarchy
The ULTRON OS frontend is engineered as a high-density, low-latency intelligence operating system command center. It strictly avoids generic SaaS dashboard patterns, consumer chatbot interfaces, and static decorative mockups.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP HEADER (60px)                                                                      │
│ [Logo + ULTRON OS]                 [● SYSTEM ONLINE | DEVICES]   [GAURAV]   [10:42]    │
├────┬────────────────────────┬──────────────────────────────────────────┬───────────────┤
│    │                        │ AGENT WORKFLOW PIPELINE                  │ ULTRON ORACLE │
│ R  │ MISSIONS & CHAT        │ [Request]→[Conductor]→[Parallel Nodes]→  │ [Glyph/Quote] │
│ A  │ [Tabs: Missions/Chat]  │ →[Verifier]→[Memory]→[Mission]           │ [System Info] │
│ I  │ [+ New Mission]        ├──────────────────────────────────────────┼───────────────┤
│ L  │ Active Mission Cards   │ GLOBAL INTELLIGENCE      │ LIVE ACTIVITY │ GLOBAL NEWS   │
│    │ Recent Chat Stream     │ [3D Earth Canvas]        │ [Event Feed]  │ [Tabs: Top/All│
│    │ Mini Input             │ [Layers + Dubai Intel]   │ SYSTEM HEALTH │ 5 Top Stories]│
├────┴────────────────────────┴──────────────────────────┴───────────────┴───────────────┤
│ BOTTOM FIXED COMMAND BAR [Mic | "Ask ULTRON to research, build..." | Attach | Voice | Send] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Tokens & Color Specifications
Derived from Section 2 of the Strict UI Implementation Directive:

| Token Name | Hex / CSS Value | Semantic Role |
| :--- | :--- | :--- |
| `--ultron-bg` | `#020817` | Canvas root background |
| `--ultron-bg-secondary` | `#030D1F` | Deep header and recessed surface |
| `--ultron-panel` | `rgba(6, 19, 41, 0.86)` | Primary glass/metal panels |
| `--ultron-panel-2` | `#08172D` | Elevated cards and popovers |
| `--ultron-panel-hover`| `#0B1D38` | Hover interactive surfaces |
| `--ultron-border` | `#0B2A50` | Default panel and divider borders |
| `--ultron-border-bright`| `#123F70` | Focus and active borders |
| `--ultron-cyan` | `#00D9FF` | Primary telemetry, running states |
| `--ultron-blue` | `#1687FF` | Brand accent, active tabs |
| `--ultron-purple` | `#7C4DFF` | Planning and memory states |
| `--ultron-green` | `#00E6A8` | Online, completed, success states |
| `--ultron-amber` | `#FFB020` | Waiting, policy approval, warnings |
| `--ultron-red` | `#FF4D67` | Failed, alert, error states |
| `--ultron-white` | `#EAF4FF` | Primary technical titles and values |
| `--ultron-text` | `#C8D8EA` | Standard body and label text |
| `--ultron-muted` | `#7187A5` | Secondary timestamps and captions |
| `--ultron-dim` | `#435873` | Inactive icons and grid lines |

---

## 3. Component Architecture

### 3.1 Layout Layer (`components/layout/`)
- **`UltronHeader.tsx`**: 60px fixed header with ULTRON OS delta emblem, real-time clock, connected device telemetry, and Operator profile (`GAURAV / PRIME USER`).
- **`IconNavRail.tsx`**: 56px vertical navigation strip with active pill indicators (`Home`, `Missions`, `Brain`, `Agents`, `Tools`, `World`, `System`).

### 3.2 Missions & Chat (`components/missions/`)
- **`MissionsAndChatPanel.tsx`**:
  - Segmented control (`Active Missions [2]` vs `Chat`).
  - `+ New Mission` action triggering local compiler or modal.
  - Active mission cards with running status dots, percentage bars, and relative time badges.
  - Conversational `Recent Chat` stream with mission creation telemetry tags.
  - Mini inline message input field.

### 3.3 Agent Workflow Pipeline (`components/workflow/`)
- **`AgentWorkflowPipeline.tsx`**:
  - Live execution DAG rendering nodes:
    - `User Request` (entry point)
    - `Conductor` (planning state)
    - Parallel execution cluster: `Researcher` (70%), `Analyst` (50%), `Web Search` (Completed)
    - `Verifier` (evidence gate, 0%)
    - `Memory` (vector indexing)
    - `Mission` (composite outcome, 68%)
  - Live pulse animation on active edges.
  - Metric summary band below graph: `Total Agents: 10`, `Active Tasks: 3`, `Completed Today: 12`, `System Load: Normal`.
  - Node Inspector popover displaying tool inputs, started timestamps, and source counts.

### 3.4 Global Intelligence & Earth (`components/globe/`)
- **`GlobalIntelligenceGlobe.tsx`**:
  - Real WebGL 3D Earth using Three.js with realistic night atmosphere, specular shaders, city lights, and coordinate arcs.
  - Multi-layer filter dock: `All`, `News`, `Weather`, `Markets`, `Technology`, `Security`, `Geopolitical`, `Environment`.
  - Geographic marker resolution: Clicking Dubai or coordinates selects the location and animates the camera.
  - Floating Intelligence Card: Location coordinates, local weather (`32°C Partly Cloudy`), news bullet points, and facts.

### 3.5 Operational Telemetry (`components/activity/` & `components/system/`)
- **`LiveActivityPanel.tsx`**: Chronological event stream with agent source pills (`Researcher`, `Analyst`, `Conductor`, `Memory`).
- **`SystemHealthPanel.tsx`**: Status checklist covering `Core`, `API`, `Database`, `Memory`, `Agent Runtime`, `Tool Fabric`, `Event Bus`, `WebSocket`.

### 3.6 Oracle & Global News (`components/oracle/` & `components/news/`)
- **`UltronOraclePanel.tsx`**: Glowing central crystal prism glyph, AI insight quote, and operational `SYSTEM INFORMATION` breakdown (`Gemini 1.5 Pro` / active model, `2M tokens`, `Gemini Live`, `Production`).
- **`GlobalNewsPanel.tsx`**: Filterable tabs (`Top News`, `All News`), 5 compact tech/AI story cards with thumbnail previews. Clicking stories with coordinates centers the 3D globe.

### 3.7 Unified Command Bar (`components/command/`)
- **`UltronCommandBar.tsx`**: Fixed bottom controller with glowing mic button, input field, attachment handler, and send button wired to `POST /api/voice/chat`.

---

## 4. State Management & Real-Time Event Bus
State is segmented into modular stores and backed by `UltronEventBus`:
1. `missions`: Driven by `MissionManager` and synced on every tool execution.
2. `workflowNodes`: Reacts to `AGENT_STARTED`, `AGENT_PROGRESS`, `AGENT_COMPLETED`.
3. `activityFeed`: Streams all `UltronEvent` items in real-time.
4. `selectedLocation`: Controls 3D globe camera and location intelligence panel.
5. `systemStatus`: Direct check against `/api/health/gemini` and core engines.

---

## 5. Responsive Behavior
- **Desktop (>=1400px)**: Full 3-column + left rail + bottom bar view matching `input_file_0.png`.
- **Laptop (1200px - 1399px)**: Compact padding and margins, right column scales to 280px.
- **Tablet / Small (<1200px)**: Collapsible side panels with bottom sheet drawers for inspector and news.
