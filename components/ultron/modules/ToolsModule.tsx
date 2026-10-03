"use client";

import React, { useState } from "react";
import UltronPanel from "../../common/UltronPanel";
import UltronStatus, { UltronStatusType } from "../../common/UltronStatus";
import UltronButton from "../../common/UltronButton";
import { ToolRegistry } from "../../../core/tools/toolRegistry";
import { ToolDefinition, ToolExecutionResult } from "../../../core/types/tool";

export default function ToolsModule() {
  const tools = ToolRegistry.getTools();
  const [selectedTool, setSelectedTool] = useState<ToolDefinition>(tools[0]);
  const [inputPayload, setInputPayload] = useState<string>("{\n  \"query\": \"cognitive operating system patterns\"\n}");
  const [executionResult, setExecutionResult] = useState<ToolExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Integrations & MCP Subsystems
  const integrations = [
    { name: "Local Filesystem MCP Server", type: "MCP", status: "ONLINE" as UltronStatusType, risk: "HIGH", permissions: "Scoped Workspace Read/Write" },
    { name: "Browser & Web Search Gateway", type: "INTEGRATION", status: "ONLINE" as UltronStatusType, risk: "LOW", permissions: "Outbound HTTPS GET" },
    { name: "Isolated Sandbox Terminal Exec", type: "MCP", status: "ONLINE" as UltronStatusType, risk: "CRITICAL", permissions: "Subprocess Spawner with Timeout" },
    { name: "Reality Checker AST & Code Linter", type: "CORE", status: "ONLINE" as UltronStatusType, risk: "LOW", permissions: "Read-Only AST Parsing" },
    { name: "Vector Vector-DB & Memory Bridge", type: "INTEGRATION", status: "ONLINE" as UltronStatusType, risk: "MEDIUM", permissions: "Vector Store Insert & Query" },
    { name: "Security Policy Enforcement Interceptor", type: "MCP", status: "ONLINE" as UltronStatusType, risk: "CRITICAL", permissions: "Pre-execution Gate Interception" },
  ];

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    setExecutionResult(null);

    if (tool.id === "browser_search") {
      setInputPayload(JSON.stringify({ query: "Cognitive agent OS", maxResults: 3 }, null, 2));
    } else if (tool.id === "filesystem_inspector") {
      setInputPayload(JSON.stringify({ path: "core", operation: "list" }, null, 2));
    } else if (tool.id === "sandbox_terminal") {
      setInputPayload(JSON.stringify({ command: "echo 'ULTRON KERNEL OPERATIONAL'", timeoutMs: 5000 }, null, 2));
    } else {
      setInputPayload("{}");
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    let parsed: any = {};
    try {
      parsed = JSON.parse(inputPayload);
    } catch {
      alert("Invalid JSON parameters");
      setIsExecuting(false);
      return;
    }

    const res = await ToolRegistry.executeTool({
      id: `inv-${Date.now()}`,
      toolId: selectedTool.id,
      callerAgentId: "operator-command",
      inputPayload: parsed,
      timestamp: new Date().toISOString(),
      approvedBy: selectedTool.requiresApproval ? "operator" : undefined,
    });

    setExecutionResult(res);
    setIsExecuting(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        padding: "10px 1.4vw",
        overflow: "hidden",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* Tools Header (Section 21: Title: TOOL FABRIC) */}
      <UltronPanel
        title="TOOL FABRIC"
        subtitle="Model Context Protocol (MCP) & System Integrations"
        badge={<UltronStatus status="ONLINE" label={`${tools.length} TOOLS READY`} size="sm" />}
      >
        <div style={{ fontSize: "11px", color: "#AAB8D4" }}>
          Decoupled tool invocation engine. All high-risk MCP operations are strictly isolated, sandbox-bound, and require cryptographic policy authorization before execution.
        </div>
      </UltronPanel>

      {/* Main Grid: Integrations List (Left) + Tool Inspector & Runner (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Left: Tools & Integrations Catalog */}
        <UltronPanel title="MCP & INTEGRATION REGISTRY" subtitle="Active Interfaces">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "100%" }}>
            {integrations.map((integ) => (
              <div
                key={integ.name}
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  background: "rgba(105, 150, 255, 0.03)",
                  border: "1px solid rgba(105, 150, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#EAF2FF" }}>
                    {integ.name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#71809D", marginTop: "1px" }}>
                    Type: {integ.type} • Perm: {integ.permissions}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "9px",
                      padding: "2px 5px",
                      borderRadius: "3px",
                      background:
                        integ.risk === "CRITICAL"
                          ? "rgba(255, 102, 122, 0.15)"
                          : integ.risk === "HIGH"
                          ? "rgba(255, 209, 102, 0.15)"
                          : "rgba(95, 240, 160, 0.15)",
                      color:
                        integ.risk === "CRITICAL"
                          ? "#FF667A"
                          : integ.risk === "HIGH"
                          ? "#FFD166"
                          : "#5FF0A0",
                      fontWeight: 700,
                    }}
                  >
                    {integ.risk}
                  </span>
                  <UltronStatus status={integ.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </UltronPanel>

        {/* Right: Selected Tool Playground & Execution Output */}
        <UltronPanel
          title={selectedTool.name}
          subtitle={`Risk: ${selectedTool.riskLevel}`}
          badge={<UltronStatus status="ONLINE" label="READY" size="sm" />}
          actions={
            <div style={{ display: "flex", gap: "4px" }}>
              {tools.map((t) => (
                <UltronButton
                  key={t.id}
                  size="sm"
                  variant={selectedTool.id === t.id ? "primary" : "secondary"}
                  onClick={() => handleSelectTool(t)}
                >
                  {t.name.split(" ")[0]}
                </UltronButton>
              ))}
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", overflowY: "auto" }}>
            <div style={{ fontSize: "12px", color: "#C9D5EA" }}>
              {selectedTool.description}
            </div>

            {/* Permissions & Risk Warning */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 10px",
                borderRadius: "5px",
                background: "rgba(99, 232, 255, 0.04)",
                border: "1px solid rgba(105, 150, 255, 0.15)",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "#71809D" }}>APPROVAL REQUIRED:</span>
              <span style={{ fontWeight: 600, color: selectedTool.requiresApproval ? "#FFD166" : "#5FF0A0" }}>
                {selectedTool.requiresApproval ? "YES (HUMAN-IN-THE-LOOP)" : "NO (AUTOMATED RUN)"}
              </span>
            </div>

            {/* Parameter JSON Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "10px", color: "#8FA3C5", textTransform: "uppercase" }}>PARAMETERS (JSON)</span>
              <textarea
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "11px",
                  borderRadius: "5px",
                  fontFamily: "var(--font-mono)",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <UltronButton
                variant="primary"
                size="md"
                onClick={handleExecute}
                disabled={isExecuting}
              >
                {isExecuting ? "EXECUTING IN SANDBOX..." : "EXECUTE TOOL ➔"}
              </UltronButton>
            </div>

            {/* Execution Result */}
            {executionResult && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "8px",
                  borderRadius: "5px",
                  background: "rgba(4, 7, 18, 0.95)",
                  border: "1px solid rgba(105, 150, 255, 0.20)",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#63E8FF", fontWeight: 700 }}>EXECUTION RESULT ({executionResult.executionDurationMs}ms)</span>
                  <UltronStatus status={executionResult.success ? "ONLINE" : "ERROR"} label={executionResult.success ? "SUCCESS" : "ERROR"} size="sm" />
                </div>
                <pre style={{ color: "#C9D5EA", whiteSpace: "pre-wrap", maxHeight: "120px", overflowY: "auto" }}>
                  {JSON.stringify(executionResult.outputData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </UltronPanel>
      </div>
    </div>
  );
}
