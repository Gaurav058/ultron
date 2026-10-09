# ULTRON Integration Plan: World Monitor + Free Web Tools Hub

## 1. Executive Summary & Repository Audit

### 1.1 Repository Architecture Discovered
- **Framework**: Next.js 16.2.10 (Turbopack, App Router, React 19, TypeScript 5.9).
- **Routing**: Next.js App Router (`app/` directory). Primary workspace entry points exist at `app/page.tsx`, `app/missions/page.tsx`, `app/world/page.tsx`, `app/brain/page.tsx`, `app/agents/page.tsx`, `app/tools/page.tsx`, and `app/system/page.tsx`.
- **Navigation & Layout**:
  - `UltronShell.tsx`: Central coordinator managing active module state (`activeNav`), real-time SSE stream (`/api/events`), chat messages, backend missions, workflow DAG nodes, and primary workspace views.
  - `IconNavRail.tsx`: Persistent vertical navigation rail with icon buttons and active state indicator.
  - `UltronHeader.tsx`: Global system header displaying subsystem status, background intelligence pill, and telemetry counters.
- **Styling System**: Bespoke command-center design system using CSS variables (`--ultron-*`), dark mode palette (`#020817`, `#061329`, `#08172D`, `#0B2A50`, `#00D9FF`, `#1687FF`, `#7C4DFF`, `#00E6A8`, `#EAF4FF`), and responsive layouts.
- **Mission & Agent Architecture**:
  - `core/missions/missionManager.ts`: Durable DAG mission manager with task states (`QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, `AWAITING_APPROVAL`), approval gates, and event bus pub/sub.
  - `core/types/tool.ts` & `core/tools/toolRegistry.ts`: Initial 11-tool registry managing system, filesystem, browser, sandbox, and repository tools.
- **State Management**: React state, custom event bus (`core/events/eventBus.ts`), local storage, and server-sent events (`/api/events`).
- **Deployment Platform**: Vercel production deployment (`https://ultron-beta-ecru.vercel.app`), containerized Node.js runtime.

---

## 2. World Monitor Integration Findings & Strategy

### 2.1 Empirical Framing Analysis
Direct inspection of `https://worldmonitor.app` HTTP response headers:
```http
HTTP/2 200
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: frame-ancestors 'self' https://www.worldmonitor.app https://tech.worldmonitor.app ...
```
- **Conclusion**: The official hosted application (`https://worldmonitor.app`) explicitly forbids third-party origin iframe embedding via both `X-Frame-Options: SAMEORIGIN` and `CSP frame-ancestors`.
- **Architectural Decision**: In strict accordance with Directive Section 3 (Phase 1), ULTRON will **not** attempt proxy workarounds, CORS bypasses, or iframe tampering. Instead, the dedicated `/world-monitor` workspace will provide:
  1. An informative, command-deck launch panel with an "Open World Monitor in New Tab" primary action.
  2. Clear architectural explanation that World Monitor is an independent external intelligence workspace.
  3. A native server-side connector executing official, public, quota-free discovery operations (`get_sources` via MCP/REST).
  4. Real status indicators: displaying authenticated vs unauthenticated states, permitted operations, and credential-gated restrictions without fabricating live feeds.

### 2.2 Licensing & AGPL-3.0 Considerations (Phase 2)
- **Upstream License**: The World Monitor repository (`https://github.com/koala73/worldmonitor`) is licensed under **GNU Affero General Public License v3.0 (AGPL-3.0-only)**.
- **Legal Safeguards**:
  - The World Monitor codebase will **not** be vendored, copied, or statically linked into ULTRON's proprietary codebase.
  - ULTRON interacts solely as an independent network client via documented public REST/MCP endpoints (`https://worldmonitor.app/mcp`, `https://api.worldmonitor.app`).
  - Self-hosted deployment instructions will be documented as an optional, independently containerized microservice deployed in an isolated container/VPC, maintaining strict network separation.

---

## 3. Tool Registry & Initial Catalog Strategy

### 3.1 Typed Tool Registry Specification
Extend `core/types/tool.ts` and `core/tools/toolRegistry.ts` to include:
- `executionMode`: `"local"` | `"approved_api"` | `"user_opened_website"`
- `pricingStatus`: `"free_core"` | `"freemium"` | `"paid"` | `"unverified"`
- `subscriptionRequiredForIntendedUse`: boolean
- `automationPermission`: `"approved"` | `"user_interaction_required"` | `"unverified"`
- `inputSchema` & `outputSchema`: Structured JSON schemas
- `requiredPermissions`: String array (e.g. `["filesystem:read"]`, `["external_network:transfer"]`)
- `supportedPlatforms`: String array
- `availabilityStatus`: `"AVAILABLE"` | `"RESTRICTED"` | `"REQUIRES_CREDENTIAL"` | `"EXCLUDED"`
- `limitations`: String array detailing actual free-tier restrictions
- `lastVerifiedAt`: ISO timestamp
- `termsUrl` & `documentationUrl`: Direct URLs
- `healthStatus`: `"OPERATIONAL"` | `"DEGRADED"` | `"UNAVAILABLE"` | `"UNKNOWN"`

### 3.2 Registered Tool Classifications
1. **Squoosh**: `local`, `free_core`, `approved`. Local in-browser/server image compression with exact byte measurements.
2. **Photopea**: `user_opened_website`, `free_core`, `user_interaction_required`. Launch editor & return artifact.
3. **remove.bg**: `user_opened_website`, `freemium` (1 free preview, API/HD requires paid subscription).
4. **Cleanup.pictures**: `user_opened_website`, `freemium` (free standard resolution, Pro for HD).
5. **Unscreen**: `user_opened_website`, `freemium` (video background removal; redirected to Canva video tooling).
6. **Carbon**: `user_opened_website`, `free_core`, `user_interaction_required` (prefilled code URI `?code=...`).
7. **Ray.so**: `user_opened_website`, `free_core`, `user_interaction_required` (prefilled base64 code URI).
8. **Shots.so**: `user_opened_website`, `freemium`, `user_interaction_required`.
9. **Smartmockups**: `user_opened_website`, `freemium` (redirected to Canva mockup suite).
10. **AlternativeTo**: `approved_api` / `user_opened_website`, `free_core`, `approved`. Comparison & alternative discovery.
11. **Internet Archive**: `approved_api`, `free_core`, `approved`. Public metadata & CDX search.
12. **Project Gutenberg**: `approved_api`, `free_core`, `approved`. Public-domain catalog search via Gutendex API.
13. **JustWatch**: `user_opened_website`, `freemium`, `user_interaction_required`. Streaming search.
14. **WolframAlpha**: `user_opened_website` / `approved_api` (with AppID), `freemium`. Computational knowledge.
15. **Open Culture**: `user_opened_website`, `free_core`, `user_interaction_required`. Educational catalog.
16. **Have I Been Pwned**: `approved_api`, `free_core`, `user_interaction_required`. Informed confirmation before query, no PII storage.
17. **Excluded Services**: `12ft.io`, `LibGen`, `Sci-Hub`, `PDF Drive` cataloged with explicit `EXCLUDED` status and legal/safety rationale; no automated execution.

---

## 4. Security & Safety Architecture

1. **SSRF Protection**: Server-side URL requests will be filtered by `SSRFGuard`:
   - Blocking IPv4 loopback (`127.0.0.0/8`, `0.0.0.0/8`).
   - Blocking RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
   - Blocking cloud metadata addresses (`169.254.169.254`).
   - Blocking IPv6 link-local and loopback (`::1`, `fe80::/10`).
2. **Sensitive Data Consent**: Tools transferring PII (e.g. Have I Been Pwned) require an explicit user confirmation modal explaining external data transfer before dispatch.
3. **Secret Redaction**: Any API credentials (`WORLDMONITOR_API_KEY`, etc.) are held server-side, never exposed to `NEXT_PUBLIC_*` or logged in plain text.
4. **Execution Sandboxing**: Image compression runs client-side or through bounded memory buffers with strict file size caps (max 15MB).

---

## 5. Implementation Sequence

1. **Phase 1: Navigation & Routing Foundations**:
   - Update `IconNavRail.tsx` with dedicated "World Monitor" (globe icon) and "Free Tools" (wrench icon) destinations.
   - Update `UltronShell.tsx` to handle `activeNav === "world-monitor"` and `activeNav === "tools"`.
   - Create Next.js App Router pages: `app/world-monitor/page.tsx` and ensure `app/tools/page.tsx` mounts properly for direct URL refresh.
2. **Phase 2: Tool Registry & Initial Catalog**:
   - Define comprehensive `ToolRegistryItem` types in `core/types/tool.ts`.
   - Populate `core/tools/freeToolsCatalog.ts` with all 20+ audited tools, execution modes, pricing statuses, limitations, and verification dates.
   - Implement `core/tools/imageCompressor.ts` providing real local image compression with before/after byte measurements.
   - Implement `core/tools/securityChecker.ts` providing HIBP k-Anonymity password check / breach discovery with user consent.
3. **Phase 3: World Monitor Connector & Workspace**:
   - Create `core/worldmonitor/worldMonitorService.ts` implementing server-side public MCP `get_sources` discovery and API health telemetry.
   - Create API route `/api/world-monitor/sources` and `/api/world-monitor/status`.
   - Build `components/ultron/modules/WorldMonitorModule.tsx` with launch panel, live source discovery, data freshness checks, and credentials requirements notice.
4. **Phase 4: Free Tools Hub Workspace UI**:
   - Build `components/ultron/modules/FreeToolsHubModule.tsx` with search, category filtering, execution mode filtering, pricing badges, tool inspector modal, and functional execution actions.
   - Integrate with ULTRON mission engine: dispatching "Run Tool" to active mission DAG.
5. **Phase 5: Automated Tests & Validation**:
   - Unit and integration tests for route rendering, tool filters, image compression, security guards, and error handling.
   - Validate with `npx tsc --noEmit` and `npm run build`.
6. **Phase 6: Documentation Delivery**:
   - `docs/ULTRON_WORLD_MONITOR_INTEGRATION.md`
   - `docs/ULTRON_FREE_TOOLS.md`
   - `docs/ULTRON_TOOL_SECURITY.md`
   - Final Delivery Report.
