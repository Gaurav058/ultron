# ULTRON OS — INFINITY INTELLIGENCE: MCP TOOL FABRIC SPECIFICATION
**Document Version:** 2.0.0-TOOL-SPEC  
**Classification:** Typed Tool Contract & Execution Gateway  
**Date:** October 3, 2026  
**Author:** Staff Software Engineer & Security Architect  

---

## 1. MCP Standard Compliance
Every tool integrated into ULTRON OS implements a typed Model Context Protocol (MCP) contract specifying:
- Name and descriptive summary
- JSON Schema for input parameters and return payloads
- Risk tier classification (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- Idempotency status
- Timeout & retry policy
- Explicit Human-in-the-Loop approval requirement

---

## 2. Risk Classification Matrix (`core/tools/toolRegistry.ts`)

| Risk Tier | Policy & Execution Behavior | Examples |
|---|---|---|
| **LOW** | Automated execution; logged to audit stream. | Read telemetry, web search, read file, list directory. |
| **MEDIUM** | Sandboxed execution; rate-limited and logged. | In-browser code evaluation, temporary scratchpad writes. |
| **HIGH** | Halted for human approval via `ApprovalModal`; blocked by default. | Overwriting source files, executing terminal commands, sending external emails. |
| **CRITICAL** | Zero-bypass human cryptographic approval gate. | Production deployment, secret rotation, financial/destructive mutations. |

---

## 3. Registered Tool Catalog

### `system_telemetry`
- **Scope:** Read hardware & subsystem vitals.
- **Risk:** `LOW` (No side-effects).
- **Schema:** `{ probeType: "all" | "cpu" | "memory" | "network" }`
- **Output:** `{ cpuPercent: number, memUsedMb: number, networkKbps: number, health: string }`

### `web_browser_search`
- **Scope:** Real-time web evidence retrieval.
- **Risk:** `LOW`.
- **Schema:** `{ query: string, maxResults?: number }`
- **Output:** `{ results: { title: string, url: string, snippet: string }[] }`

### `read_filesystem_artifact`
- **Scope:** Read workspace code & configuration.
- **Risk:** `LOW`.
- **Schema:** `{ path: string }`
- **Output:** `{ content: string, lineCount: number }`

### `sandbox_code_exec`
- **Scope:** Execute test code in isolated browser sandbox.
- **Risk:** `MEDIUM`.
- **Schema:** `{ language: "javascript" | "typescript", code: string, timeoutMs: number }`
- **Output:** `{ stdout: string[], status: "SUCCESS" | "ERROR", executionTimeMs: number }`

### `write_filesystem_artifact`
- **Scope:** Mutate project files.
- **Risk:** `HIGH` (Requires human approval gate).
- **Schema:** `{ path: string, content: string, overwrite: boolean }`
- **Output:** `{ success: boolean, bytesWritten: number, hash: string }`

### `cloud_deploy_trigger`
- **Scope:** Trigger Vercel / Cloudflare edge deployment.
- **Risk:** `CRITICAL` (Requires explicit user confirmation).
- **Schema:** `{ targetEnvironment: "production" | "preview", commitHash: string }`
- **Output:** `{ deploymentUrl: string, buildId: string, status: string }`
