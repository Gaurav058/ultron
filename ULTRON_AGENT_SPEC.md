# ULTRON OS — INFINITY INTELLIGENCE: AGENT ROSTER & COORDINATION SPECIFICATION
**Document Version:** 2.0.0-AGENT-SPEC  
**Classification:** Distributed Agent Coordination Architecture  
**Date:** October 3, 2026  
**Author:** Staff Agent Systems Engineer  

---

## 1. Conductor & Specialist Topology
ULTRON coordinates specialized agents through a hierarchical Conductor-Worker pattern governed by Directed Acyclic Graph (DAG) task scheduling:

```
                          +-------------------+
                          |     USER INTENT   |
                          +---------|---------+
                                    v
                          +-------------------+
                          |  CONDUCTOR AGENT  |
                          |  (Orchestrator)   |
                          +---------|---------+
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
| RESEARCHER AGENT  |     |   BUILDER AGENT   |     |  DESIGNER AGENT   |
| (Evidence & Web)  |     | (Code & Scaffolds)|     | (Interface & UX)  |
+---------|---------+     +---------|---------+     +---------|---------+
          |                         |                         |
          v                         v                         v
+-------------------+     +-------------------+     +-------------------+
| SECURITY SENTINEL |     |  DEVELOPER AGENT  |     |   DEVOPS AGENT    |
| (Policy & Gates)  |     | (System Wiring)   |     | (Build & Deploy)  |
+---------|---------+     +---------|---------+     +---------|---------+
          |                         |                         |
          +-------------------------+-------------------------+
                                    |
                                    v
                          +-------------------+
                          |  REALITY CHECKER  |
                          | (Empirical Audit) |
                          +---------|---------+
                                    v
                          +-------------------+
                          |   MEMORY CURATOR  |
                          | (L4 Vector Store) |
                          +-------------------+
```

---

## 2. Agent Registry Contracts (`core/conductor/agentRoster.ts`)

| Agent ID | Codename | Role & Responsibilities | Allowed Tool Scopes | Output Schema |
|---|---|---|---|---|
| `agent-conductor` | **CONDUCTOR** | Master DAG planning, mission dispatch, dependency resolution. | `system_telemetry`, `read_memory`, `dispatch_task` | `DAGTaskGraph` |
| `agent-researcher` | **RESEARCHER** | Fact retrieval, external documentation, market/tech analysis. | `web_search`, `read_url`, `read_filesystem`, `grep_search` | `EvidenceLedger[]` |
| `agent-builder` | **BUILDER** | Solution architecture, scaffold generation, modular design. | `write_filesystem`, `read_filesystem`, `sandbox_exec` | `SourceArtifact[]` |
| `agent-designer` | **DESIGNER** | Visual design systems, layout constraints, CSS tokens. | `read_filesystem`, `generate_image`, `diff_patch` | `DesignTokens` |
| `agent-developer` | **DEVELOPER** | Core logic implementation, API endpoints, state synchronizers. | `write_filesystem`, `diff_patch`, `sandbox_exec` | `CodePatch` |
| `agent-reality-checker` | **REALITY CHECKER** | Empirical verification, syntax testing, policy compliance. | `sandbox_exec`, `test_runner`, `diff_verifier` | `VerificationReport` |
| `agent-memory-curator` | **MEMORY CURATOR** | Memory governance, promotion to L4 Durable Fact Store. | `read_memory`, `write_memory`, `vector_embed` | `MemoryNode` |
| `agent-security` | **SECURITY SENTINEL** | Zero-trust perimeter check, secrets scanner, policy approval. | `audit_logger`, `policy_evaluator`, `secret_scanner` | `PolicyGateResult` |
| `agent-devops` | **DEVOPS** | CI/CD build pipelines, environment variables, Vercel deploys. | `build_runner`, `deploy_probe`, `container_exec` | `DeploymentStatus` |
| `agent-analyst` | **ANALYST** | Performance diagnostics, telemetry evaluation, latency audit. | `telemetry_reader`, `metric_aggregator` | `TelemetryReport` |

---

## 3. Strict Operating Invariants
1. **Least-Privilege Tool Scopes:** No agent has unrestricted tool execution. Each agent is constrained to its designated whitelist.
2. **Deterministic Lifecycle:** Agent states strictly cycle through `IDLE` -> `READY` -> `RUNNING` -> `VERIFYING` -> `IDLE`.
3. **No Unaudited Output:** All agent deliverables must be validated by the Reality Checker before presentation or memory persistence.
