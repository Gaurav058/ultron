# ULTRON — Function Calling & Tool Execution

## 1. Zero-Trust Tool Architecture
ULTRON exposes 14 canonical tools to the Gemini API via official function declarations. The model requests actions, but the ULTRON Tool Router validates schema, enforces zero-trust permission rules, checks human approval requirements, and executes tools safely.

```
Gemini Model
    │
    ▼
Function Call Request
    │
    ▼
ULTRON Tool Router
    │
    ├── Schema Validation (Type, bounds, enum checks)
    ├── Permission Gate (Zero-Trust RBAC & human confirmation)
    ├── Parallel Execution Harness (Promise.all() for independent tools)
    └── Telemetry & Latency Profiling (tool_started, tool_completed, tool_failed)
    │
    ▼
Actual Execution & Result
    │
    ▼
Model Response Turn
```

## 2. 14 Canonical Tools
1. `create_mission`: Instantiates an autonomous DAG mission in the conductor engine.
2. `search_web`: Live search query across authorized domains.
3. `open_url`: Navigates to a URL and fetches sanitized Markdown content.
4. `read_file`: Reads authorized files within the sandbox filesystem.
5. `write_file`: Writes content to workspace files with audit trail.
6. `search_memory`: Semantic and keyword retrieval across episodic memory tiers.
7. `remember`: Commits persistent user preferences or strategic facts.
8. `run_tests`: Executes automated unit and integration tests.
9. `inspect_repository`: Git status, commit history, and directory tree analysis.
10. `create_document`: Compiles structured Markdown reports.
11. `create_pdf`: Generates PDF documents from mission findings.
12. `get_system_status`: Gathers runtime diagnostics, memory usage, and doctor reports.
13. `send_email`: Dispatches notifications (requires human approval).
14. `create_calendar_event`: Schedules deadlines and calendar items.

## 3. Parallel Execution (Section 11)
When Gemini returns multiple independent tool calls (e.g. `search_company_A`, `search_company_B`):
- ULTRON detects dependencies between calls.
- Independent calls execute concurrently via `Promise.all()`.
- Dependent calls (e.g. `create_file` followed by `read_file`) execute strictly sequentially.
