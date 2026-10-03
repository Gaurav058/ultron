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

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    setExecutionResult(null);

    if (tool.id === "web_search") {
      setInputPayload(JSON.stringify({ query: "Gemini Live Voice Architecture", maxResults: 3 }, null, 2));
    } else if (tool.id === "filesystem") {
      setInputPayload(JSON.stringify({ path: "core", operation: "list" }, null, 2));
    } else if (tool.id === "code_execution") {
      setInputPayload(JSON.stringify({ language: "typescript", code: "console.log('ULTRON KERNEL VERIFIED');" }, null, 2));
    } else if (tool.id === "repository") {
      setInputPayload(JSON.stringify({ command: "status" }, null, 2));
    } else if (tool.id === "database") {
      setInputPayload(JSON.stringify({ collection: "durable_facts", filter: { scope: "PROJECT" } }, null, 2));
    } else if (tool.id === "browser") {
      setInputPayload(JSON.stringify({ url: "https://ai.google.dev" }, null, 2));
    } else if (tool.id === "shell") {
      setInputPayload(JSON.stringify({ command: "git rev-parse --short HEAD" }, null, 2));
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
      {/* Tools Header (Section 10) */}
      <UltronPanel
        title="TOOL REGISTRY"
        subtitle="Controlled Sovereign Tool Execution Layer"
        badge={<UltronStatus status="ONLINE" label={`${tools.length} REGISTERED`} size="sm" />}
      >
        <div style={{ fontSize: "11px", color: "var(--ultron-text-secondary)" }}>
          Policy-governed tool invocation harness. Arbitrary shell access is strictly forbidden; all high-impact actions mandate human approval and cryptographic audit tracing.
        </div>
      </UltronPanel>

      {/* Main Grid: Tool Registry List (Left) + Tool Inspector & Execution Sandbox (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", flex: 1, minHeight: 0 }}>
        {/* Left: Tools Catalog */}
        <UltronPanel title="CANONICAL TOOL INVENTORY" subtitle="11 Bounded System Interfaces">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "100%", paddingRight: "4px" }}>
            {tools.map((tool) => {
              const isSelected = selectedTool.id === tool.id;
              const isOnline = tool.status === "ONLINE";

              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "6px",
                    background: isSelected ? "rgba(99, 232, 255, 0.08)" : "var(--ultron-panel)",
                    border: isSelected ? "1px solid var(--ultron-border-active)" : "1px solid var(--ultron-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: isSelected ? "var(--ultron-cyan)" : "var(--ultron-text-primary)" }}>
                      {tool.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--ultron-text-muted)", marginTop: "2px" }}>
                      Category: {tool.category} • Perm: {tool.permission}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "2px 5px",
                        borderRadius: "3px",
                        background:
                          tool.riskLevel === "CRITICAL"
                            ? "rgba(255, 102, 122, 0.15)"
                            : tool.riskLevel === "HIGH"
                            ? "rgba(255, 209, 102, 0.15)"
                            : "rgba(95, 240, 160, 0.15)",
                        color:
                          tool.riskLevel === "CRITICAL"
                            ? "var(--ultron-error)"
                            : tool.riskLevel === "HIGH"
                            ? "var(--ultron-warning)"
                            : "var(--ultron-success)",
                        fontWeight: 700,
                      }}
                    >
                      {tool.riskLevel}
                    </span>
                    <UltronStatus
                      status={isOnline ? "ONLINE" : "ERROR"}
                      label={tool.status}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </UltronPanel>

        {/* Right: Selected Tool Inspector & Execution Sandbox */}
        <UltronPanel
          title={selectedTool.name}
          subtitle={`Category: ${selectedTool.category} | Risk: ${selectedTool.riskLevel}`}
          badge={<UltronStatus status={selectedTool.status === "ONLINE" ? "ONLINE" : "ERROR"} label={selectedTool.status} size="sm" />}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", height: "100%", overflowY: "auto", paddingRight: "4px" }}>
            <div style={{ fontSize: "12px", color: "var(--ultron-text-secondary)", lineHeight: 1.4 }}>
              {selectedTool.description}
            </div>

            {/* Metadata Badges (Section 10: Status, Risk level, Permission, Authentication, Last execution, Execution count, Availability) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
                padding: "8px",
                borderRadius: "6px",
                background: "var(--ultron-bg-secondary)",
                border: "1px solid var(--ultron-border)",
                fontSize: "11px",
              }}
            >
              <div>
                <span style={{ color: "var(--ultron-text-muted)" }}>PERMISSION: </span>
                <span style={{ color: "var(--ultron-text-primary)", fontWeight: 600 }}>{selectedTool.permission}</span>
              </div>
              <div>
                <span style={{ color: "var(--ultron-text-muted)" }}>AUTHENTICATION: </span>
                <span style={{ color: selectedTool.authentication === "NOT_CONFIGURED" ? "var(--ultron-error)" : "var(--ultron-cyan)", fontWeight: 600 }}>
                  {selectedTool.authentication}
                </span>
              </div>
              <div>
                <span style={{ color: "var(--ultron-text-muted)" }}>AVAILABILITY: </span>
                <span style={{ color: selectedTool.availability === "NOT_CONFIGURED" ? "var(--ultron-error)" : "var(--ultron-success)", fontWeight: 600 }}>
                  {selectedTool.availability}
                </span>
              </div>
              <div>
                <span style={{ color: "var(--ultron-text-muted)" }}>INVOCATION COUNT: </span>
                <span style={{ color: "var(--ultron-text-primary)", fontWeight: 600 }}>{selectedTool.executionCount}</span>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <span style={{ color: "var(--ultron-text-muted)" }}>LAST RUN: </span>
                <span style={{ color: "var(--ultron-text-secondary)", fontFamily: "var(--ultron-font-mono)" }}>
                  {selectedTool.lastExecution ? new Date(selectedTool.lastExecution).toLocaleString() : "NOT CONFIGURED"}
                </span>
              </div>
            </div>

            {/* Approval Requirement Banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 10px",
                borderRadius: "5px",
                background: "rgba(99, 232, 255, 0.04)",
                border: "1px solid var(--ultron-border)",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "var(--ultron-text-muted)" }}>APPROVAL GATE REQUIRED:</span>
              <span style={{ fontWeight: 600, color: selectedTool.requiresApproval ? "var(--ultron-warning)" : "var(--ultron-success)" }}>
                {selectedTool.requiresApproval ? "YES (HIGH-RISK HUMAN APPROVAL REQUIRED)" : "NO (AUTOMATED EXECUTION)"}
              </span>
            </div>

            {/* Parameter JSON Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "10px", color: "var(--ultron-text-muted)", textTransform: "uppercase" }}>PARAMETERS (JSON)</span>
              <textarea
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "11px",
                  borderRadius: "5px",
                  background: "var(--ultron-panel)",
                  color: "var(--ultron-text-primary)",
                  border: "1px solid var(--ultron-border)",
                  fontFamily: "var(--ultron-font-mono)",
                  resize: "vertical",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <UltronButton
                variant="primary"
                size="md"
                onClick={handleExecute}
                disabled={isExecuting || selectedTool.status === "NOT_CONFIGURED"}
              >
                {selectedTool.status === "NOT_CONFIGURED"
                  ? "NOT CONFIGURED"
                  : isExecuting
                  ? "EXECUTING IN SANDBOX..."
                  : "EXECUTE CONTROLLED TOOL ➔"}
              </UltronButton>
            </div>

            {/* Execution Result */}
            {executionResult && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "8px",
                  borderRadius: "5px",
                  background: "var(--ultron-bg)",
                  border: "1px solid var(--ultron-border-active)",
                  fontSize: "10px",
                  fontFamily: "var(--ultron-font-mono)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "var(--ultron-cyan)", fontWeight: 700 }}>
                    EXECUTION RESULT ({executionResult.executionDurationMs}ms)
                  </span>
                  <UltronStatus
                    status={executionResult.success ? "ONLINE" : "ERROR"}
                    label={executionResult.success ? "SUCCESS" : "POLICY BLOCKED"}
                    size="sm"
                  />
                </div>
                <pre style={{ color: "var(--ultron-text-primary)", whiteSpace: "pre-wrap", maxHeight: "120px", overflowY: "auto" }}>
                  {JSON.stringify(executionResult.outputData || executionResult.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </UltronPanel>
      </div>
    </div>
  );
}
