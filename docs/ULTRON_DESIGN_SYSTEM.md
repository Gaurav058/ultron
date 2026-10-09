# ULTRON OS — Sovereign Design System Specification
**Document ID**: `docs/ULTRON_DESIGN_SYSTEM.md`  
**Version**: 2.0 Production  
**Status**: ACTIVE  

---

## 1. Design Direction & Aesthetic Principles

The ULTRON design system balances four primary operational aesthetics:
1. **Modern Aerospace Mission Control**: High information density, high legibility, crisp boundary contrast, and purposeful status signals.
2. **Professional Geospatial Intelligence Software**: Rich spatial overlays, tabular data synchronizations, and source-attributed event streams.
3. **Disciplined AI Agent Orchestration**: Multi-stage DAG task visualizations, human-in-the-loop policy gates, and verification ledgers.
4. **Restrained Futuristic Visual Language**: Minimalist dark mode with deep navy/slate hues, electric cyan accents, and zero purposeless decorative gaming distractions.

---

## 2. Consolidated Design Tokens

All tokens are defined in [`app/globals.css`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/app/globals.css) and exposed as CSS variables:

### 2.1 Color Palette
| CSS Variable | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| `--ultron-bg-main` | `#020817` | Canvas root background |
| `--ultron-bg-secondary`| `#030D1F` | Workspace sub-surfaces & app shell |
| `--ultron-bg-panel` | `#061329` | Base card and panel surfaces |
| `--ultron-bg-elevated` | `#08172D` | Headers, drawers, and modal overlays |
| `--ultron-bg-hover` | `#0B1D38` | Interactive row & button hover state |
| `--ultron-border` | `#0B2A50` | Standard component border |
| `--ultron-border-strong` | `#123F70` | Active, focused, or elevated border |
| `--ultron-primary` | `#00D9FF` | Primary active accent, telemetry, focus |
| `--ultron-blue` | `#1687FF` | Primary actions, navigation selection |
| `--ultron-purple` | `#7C4DFF` | Autonomous agent / neural processing |
| `--ultron-success` | `#00E6A8` | Online, verified, and passing states |
| `--ultron-warning` | `#FFB020` | Stale data, cautionary risk, approval gates |
| `--ultron-error` | `#FF4D67` | Offline, error, or prohibited states |
| `--ultron-text-primary`| `#EAF4FF` | Primary headings and prominent text |
| `--ultron-text-secondary`| `#C8D8EA`| Body text and descriptions |
| `--ultron-text-muted` | `#7187A5` | Metadata, timestamps, and secondary captions |

### 2.2 4px Spacing Scale
- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `20px`
- `--space-6`: `24px`
- `--space-8`: `32px`

### 2.3 Radii Scale
- `--radius-xs`: `3px` (mini tags & pills)
- `--radius-sm`: `4px` (buttons, inputs)
- `--radius-md`: `6px` (cards, list items)
- `--radius-lg`: `8px` (panels, workspaces)
- `--radius-xl`: `12px` (drawers, modals)
- `--radius-full`: `9999px` (circular pills & avatars)

### 2.4 Typography & Numerals
- **Display & Interface**: `Inter, system-ui, -apple-system, sans-serif`
- **Monospace Telemetry**: `'JetBrains Mono', Courier New, monospace`
- **Tabular Numerals**: `font-variant-numeric: tabular-nums` enforced on all timestamps, coordinates, latencies, and metrics to prevent layout shifts.

---

## 3. Shared Reusable Component Catalog

All components are located in [`components/common/`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/):

| Component | File | Responsibilities |
| :--- | :--- | :--- |
| `PageHeader` | [`PageHeader.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/PageHeader.tsx) | Page titles, subtitles, breadcrumbs, badges, and top-level workspace action bars. |
| `SectionHeader` | [`SectionHeader.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/SectionHeader.tsx) | Uppercase section titles, count badges, and sub-actions. |
| `StatusIndicator`| [`StatusIndicator.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/StatusIndicator.tsx) | Online/offline/running state dots with glowing status rings. |
| `MetricValue` | [`MetricValue.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/MetricValue.tsx) | Formatted key performance metrics with trend arrows and tabular numerals. |
| `FilterBar` | [`FilterBar.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/FilterBar.tsx) | Multi-category tag switchers with counts and active states. |
| `SearchInput` | [`SearchInput.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/SearchInput.tsx) | Search text input with icon and one-click clear button. |
| `DataTable` | [`DataTable.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/DataTable.tsx) | Responsive tabular listing with header sorting and hover rows. |
| `EventList` | [`EventList.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/EventList.tsx) | Event cards with category colored tags, locations, and timestamps. |
| `SourceAttribution`| [`SourceAttribution.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/SourceAttribution.tsx) | Provider attribution, verification badge, and direct source external link. |
| `FreshnessIndicator`| [`FreshnessIndicator.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/FreshnessIndicator.tsx) | Standardized live/recent/periodic/stale/cached badges. |
| `LoadingState` | [`LoadingState.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/LoadingState.tsx) | Spinner loader with configurable messages. |
| `EmptyState` | [`EmptyState.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/EmptyState.tsx) | Dashed container with icon, message, and action CTA. |
| `ErrorState` | [`ErrorState.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/ErrorState.tsx) | Error alert banner with retry callback and technical details. |
| `StaleDataBanner`| [`StaleDataBanner.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/StaleDataBanner.tsx) | Cautionary banner indicating cached data. |
| `ConfirmationDialog`| [`ConfirmationDialog.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/ConfirmationDialog.tsx) | Modal dialog for policy approval gates and destructive confirmations. |
| `Drawer` | [`Drawer.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/Drawer.tsx) | Accessible sliding panel (Esc-key listener, backdrop blur). |
| `Tooltip` | [`Tooltip.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/Tooltip.tsx) | Contextual micro-tooltip on hover and focus. |
| `Toast` | [`Toast.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/Toast.tsx) | Auto-dismissing feedback alert notifications. |
| `ResponsivePanel`| [`ResponsivePanel.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/ResponsivePanel.tsx) | Modular card container with header, subtitle, actions, and scrollable body. |
| `UltronButton` | [`UltronButton.tsx`](file:///C:/Users/user/.gemini/antigravity-ide/scratch/ultron/components/common/UltronButton.tsx) | Standard button with primary, secondary, danger, and ghost variants. |
