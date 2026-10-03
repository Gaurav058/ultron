"use client";

import React, { useState } from "react";
import { ToolRegistry } from "../../core/tools/toolRegistry";
import { ToolDefinition, ToolExecutionResult } from "../../core/types/tool";

export default function PillarTools() {
  const tools = ToolRegistry.getTools();
  const [selectedTool, setSelectedTool] = useState<ToolDefinition>(tools[0]);
  const [inputPayload, setInputPayload] = useState<string>("{\n  \"query\": \"Next.js 16 App Router best practices\"\n}");
  const [executionResult, setExecutionResult] = useState<ToolExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    setExecutionResult(null);

    // Provide default template payload
    if (tool.id === "browser_search") {
      setInputPayload(JSON.stringify({ query: "AI cognitive architecture patterns", maxResults: 5 }, null, 2));
    } else if (tool.id === "filesystem_inspector") {
      setInputPayload(JSON.stringify({ path: "core/types", operation: "list" }, null, 2));
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
      // For testing in UI console, set approvedBy if required
      approvedBy: selectedTool.requiresApproval ? "user-admin" : undefined,
    });

    setExecutionResult(res);
    setIsExecuting(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] mt-[60px] p-6 font-mono text-xs text-zinc-200 bg-[#050302] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_24px_rgba(255,170,48,0.1)] mb-6">
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#ffaa30] flex items-center gap-2">
            <span>MCP TOOL REGISTRY & SANDBOX CONTAINERS</span>
            <span className="text-zinc-500 font-normal">| LEAST-PRIVILEGE ACCESS</span>
          </h1>
          <p className="text-zinc-400 text-[11px] mt-1">
            Deterministic external interfaces governed by Model Context Protocol (MCP). Automated secret scrubbing and execution sandboxing.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs">
          <span className="text-zinc-400">TOOLS REGISTERED: </span>
          <span className="text-emerald-400 font-bold">{tools.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tool Catalog */}
        <div className="space-y-3">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest pb-1 border-b border-zinc-800">
            REGISTERED TOOL DEFINITIONS
          </div>
          {tools.map((tool) => {
            const isSelected = selectedTool.id === tool.id;
            return (
              <div
                key={tool.id}
                onClick={() => handleSelectTool(tool)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#ffaa30] bg-[#ffaa30]/10 shadow-[0_0_16px_rgba(255,170,48,0.2)]"
                    : "border-zinc-800/80 bg-black/50 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-zinc-100 text-xs">{tool.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    tool.riskLevel === "HIGH"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {tool.riskLevel}
                  </span>
                </div>
                <p className="text-zinc-400 text-[10px] line-clamp-2">{tool.description}</p>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-2 border-t border-zinc-800/50 mt-2">
                  <span>CATEGORY: {tool.category}</span>
                  <span>APPROVAL: {tool.requiresApproval ? "REQUIRED" : "AUTO"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Interactive Execution Console */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-lg border border-[#ffaa30]/30 bg-black/70 shadow-[0_0_20px_rgba(255,170,48,0.1)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h2 className="text-sm font-bold text-zinc-100">{selectedTool.name}</h2>
                <div className="text-[10px] text-zinc-400">ID: {selectedTool.id}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                RATE LIMIT: {selectedTool.rateLimitPerMinute}/MIN
              </span>
            </div>

            {/* Parameters Schema */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">
                INPUT PARAMETERS SCHEMA
              </div>
              <div className="space-y-1.5">
                {selectedTool.parameters.map((param) => (
                  <div key={param.name} className="flex items-center justify-between text-[11px] bg-zinc-900/60 p-2 rounded border border-zinc-800">
                    <div>
                      <span className="text-amber-300 font-bold">{param.name}</span>
                      <span className="text-zinc-500 text-[10px] ml-2">({param.type})</span>
                      <span className="text-zinc-400 text-[10px] ml-2">— {param.description}</span>
                    </div>
                    {param.required && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-red-500/20 text-red-400 rounded">
                        REQUIRED
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input JSON Editor */}
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                EXECUTION PAYLOAD (JSON)
              </div>
              <textarea
                value={inputPayload}
                onChange={(e) => setInputPayload(e.target.value)}
                rows={4}
                className="w-full p-2.5 bg-black border border-zinc-800 rounded font-mono text-zinc-200 text-xs focus:outline-none focus:border-[#ffaa30]"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="px-6 py-2 bg-[#ffd166]/15 hover:bg-[#ffd166]/25 border border-[#ffd166]/40 text-[#ffd166] font-bold rounded shadow-[0_0_15px_rgba(255,209,102,0.2)] transition-all"
              >
                {isExecuting ? "EXECUTING IN SANDBOX..." : "[RUN TOOL EXECUTION]"}
              </button>
            </div>
          </div>

          {/* Execution Output Stream */}
          {executionResult && (
            <div className="p-4 rounded-lg border border-zinc-800 bg-black/60 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  VERIFIED EXECUTION RESULT
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  executionResult.success ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {executionResult.success ? "SUCCESS" : "ERROR"} ({executionResult.executionDurationMs}ms)
                </span>
              </div>
              <pre className="text-[11px] text-zinc-300 bg-black/80 p-3 rounded border border-zinc-900 overflow-x-auto">
                {JSON.stringify(executionResult.outputData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
