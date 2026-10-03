"use client";

import React, { useState } from "react";
import { ToolRegistry } from "../../../core/tools/toolRegistry";
import { ToolDefinition, ToolExecutionResult } from "../../../core/types/tool";

export default function ToolsModule() {
  const tools = ToolRegistry.getTools();
  const [selectedTool, setSelectedTool] = useState<ToolDefinition>(tools[0]);
  const [inputPayload, setInputPayload] = useState<string>("{\n  \"query\": \"cognitive operating system patterns\"\n}");
  const [executionResult, setExecutionResult] = useState<ToolExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"CONNECTED" | "AVAILABLE" | "MCP" | "PERMISSIONS" | "RECENT">("CONNECTED");

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    setExecutionResult(null);

    if (tool.id === "browser_search") {
      setInputPayload(JSON.stringify({ query: "Multi-agent cognitive architecture", maxResults: 5 }, null, 2));
    } else if (tool.id === "filesystem_inspector") {
      setInputPayload(JSON.stringify({ path: "core/missions", operation: "list" }, null, 2));
    } else if (tool.id === "sandbox_terminal") {
      setInputPayload(JSON.stringify({ command: "npm test", timeoutMs: 10000 }, null, 2));
    } else if (tool.id === "security_scanner") {
      setInputPayload(JSON.stringify({ targetPath: "core" }, null, 2));
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
      alert("Invalid JSON format in parameters.");
      setIsExecuting(false);
      return;
    }

    const res = await ToolRegistry.executeTool({
      id: `inv-${Date.now()}`,
      toolId: selectedTool.id,
      callerAgentId: "user-command-deck",
      inputPayload: parsed,
      timestamp: new Date().toISOString(),
      approvedBy: selectedTool.requiresApproval ? "user-admin" : undefined,
    });

    setExecutionResult(res);
    setIsExecuting(false);
  };

  const getRiskColor = (risk: string) => {
    if (risk === "CRITICAL") return "text-[#ff667a] bg-[#ff667a]/20 border-[#ff667a]/40";
    if (risk === "HIGH") return "text-[#ffd166] bg-[#ffd166]/20 border-[#ffd166]/40";
    if (risk === "MEDIUM") return "text-[#8d75ff] bg-[#8d75ff]/20 border-[#8d75ff]/40";
    return "text-[#5ff0a0] bg-[#5ff0a0]/20 border-[#5ff0a0]/40";
  };

  return (
    <div className="flex-1 flex flex-col p-3 overflow-hidden select-none">
      {/* Top Header */}
      <div className="holo-panel p-3 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-[#63e8ff] font-bold tracking-widest uppercase">
              MCP CAPABILITY & TOOL REGISTRY
            </span>
            <span className="text-[7px] px-1.5 py-0.2 rounded bg-[#63e8ff]/20 text-[#63e8ff] border border-[#63e8ff]/30 font-mono">
              ZERO-TRUST ENFORCEMENT
            </span>
          </div>
          <div className="text-[8px] text-[#8d9ab5]">
            Model Context Protocol (MCP) tool interfaces. High and Critical risk operations require mandatory Human-in-the-Loop policy authorization.
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 bg-[#02030a]/80 p-0.5 rounded border border-[#6e8cff]/20">
          {(["CONNECTED", "AVAILABLE", "MCP", "PERMISSIONS", "RECENT"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 text-[8px] rounded transition-colors ${
                selectedCategory === cat
                  ? "bg-[#63e8ff] text-[#02030a] font-bold shadow-[0_0_8px_rgba(99,232,255,0.4)]"
                  : "text-[#8d9ab5] hover:text-[#dce4f5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Tool Catalog (Left) + Execution Sandbox (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 min-h-0 overflow-hidden">
        {/* Left Column (5 cols): Tools Catalog */}
        <div className="lg:col-span-5 holo-panel flex flex-col p-3 min-h-0 overflow-hidden">
          <div className="panel-title pb-2 mb-2 border-b border-[#6e8cff]/15 shrink-0">
            REGISTERED CAPABILITIES <span>{tools.length} TOOLS ONLINE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {tools.map((tool) => {
              const isSelected = selectedTool.id === tool.id;
              const riskTier = tool.requiresApproval ? "HIGH" : "LOW";

              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  className={`p-2 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#63e8ff]/10 border-[#63e8ff] shadow-[0_0_12px_rgba(99,232,255,0.15)]"
                      : "bg-[#030615]/70 border-[#6e8cff]/15 hover:border-[#6e8cff]/35"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-[#dce4f5]">
                      {tool.name}
                    </span>
                    <div className="flex items-center gap-1 font-mono text-[6px]">
                      <span className={`px-1 py-0.2 rounded font-bold border ${getRiskColor(riskTier)}`}>
                        RISK: {riskTier}
                      </span>
                      <span className="px-1 py-0.2 rounded bg-[#5ff0a0]/15 text-[#5ff0a0] border border-[#5ff0a0]/30">
                        ONLINE
                      </span>
                    </div>
                  </div>

                  <p className="text-[7px] text-[#8d9ab5] line-clamp-1 mb-1.5">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between text-[6px] font-mono text-[#5d6985]">
                    <span>PERM: LEVEL {tool.requiresApproval ? "4 (ADMIN)" : "2 (USER)"}</span>
                    <span>MCP PROTOCOL v1.0</span>
                    <span>LIMIT: {tool.rateLimitPerMinute}/min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Execution Sandbox & Inspection */}
        <div className="lg:col-span-7 holo-panel flex flex-col p-3 min-h-0 overflow-hidden">
          <div className="panel-title pb-2 mb-2 border-b border-[#6e8cff]/15 flex items-center justify-between shrink-0">
            <span>TOOL SANDBOX: {selectedTool.name}</span>
            <span className="text-[#63e8ff]">ID: {selectedTool.id}</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div>
              <div className="text-[7px] text-[#5d6985] font-mono uppercase mb-0.5">CAPABILITY CONTRACT</div>
              <p className="text-[8px] text-[#dce4f5]">{selectedTool.description}</p>
              {selectedTool.requiresApproval && (
                <div className="mt-1 p-1.5 rounded bg-[#ffd166]/10 border border-[#ffd166]/30 text-[7px] text-[#ffd166] flex items-center gap-1">
                  <span>⚠</span>
                  <span>MANDATORY APPROVAL: Invoking this tool creates an empirical security gate.</span>
                </div>
              )}
            </div>

            <div>
              <div className="text-[7px] text-[#5d6985] font-mono uppercase mb-1">INPUT PARAMETERS (JSON PAYLOAD)</div>
              <textarea
                rows={4}
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                className="w-full bg-[#02030a] border border-[#6e8cff]/20 p-2 text-[8px] text-[#dce4f5] font-mono rounded outline-none resize-none focus:border-[#63e8ff]"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[7px] text-[#8d9ab5] font-mono">
                CATEGORY: {selectedTool.category} | PARAMS: {selectedTool.parameters.length} | SANDBOX: ISOLATED V8
              </span>
              <button
                type="button"
                onClick={handleExecute}
                disabled={isExecuting}
                className="px-3 py-1 text-[8px] font-bold rounded bg-[#63e8ff] hover:bg-[#88f5ff] text-[#02030a] shadow-[0_0_10px_rgba(99,232,255,0.3)] transition-all cursor-pointer"
              >
                {isExecuting ? "EXECUTING SANDBOX..." : "EXECUTE IN SANDBOX"}
              </button>
            </div>

            {/* Execution Result */}
            {executionResult && (
              <div className="p-2.5 rounded bg-[#02030a] border border-[#6e8cff]/20 space-y-1">
                <div className="flex items-center justify-between text-[7px] font-mono">
                  <span className="text-[#8d9ab5]">EXECUTION STATUS:</span>
                  <span className={`font-bold ${executionResult.success ? "text-[#5ff0a0]" : "text-[#ff667a]"}`}>
                    {executionResult.success ? "SUCCESS (200 OK)" : "EXECUTION FAILED"}
                  </span>
                </div>
                <div className="text-[7px] text-[#8d9ab5] font-mono">
                  DURATION: {executionResult.executionDurationMs}ms
                </div>
                <pre className="text-[7px] text-[#63e8ff] font-mono p-2 rounded bg-black/60 overflow-x-auto max-h-36">
                  {JSON.stringify(executionResult.outputData || executionResult.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
