"use client";

import React, { useState } from "react";
import { Mission } from "../../core/types/mission";

interface AdaptiveWorkspaceProps {
  mission: Mission;
  onClose: () => void;
}

export default function AdaptiveWorkspace({ mission, onClose }: AdaptiveWorkspaceProps) {
  // Determine mode from mission title or tasks
  const isCoding = /code|build|refactor|microservice|component|api/i.test(mission.title);
  const isSecurity = /security|vulnerability|cve|audit|threat/i.test(mission.title);

  const [activeTab, setActiveTab] = useState<"code" | "terminal" | "tests">("code");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "ULTRON Sandbox Terminal Container initialized.",
    "Ready for deterministic test execution.",
  ]);

  return (
    <div className="fixed inset-x-6 top-20 bottom-6 z-40 bg-[#080402]/95 border border-[#ffaa30]/40 rounded-lg shadow-[0_0_40px_rgba(255,170,48,0.25)] flex flex-col font-mono text-xs overflow-hidden backdrop-blur-md">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#ffaa30]/30 bg-black/60">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold tracking-widest text-sm">
            ADAPTIVE COGNITIVE WORKSPACE: {isCoding ? "CODING MODE" : isSecurity ? "SECURITY MODE" : "RESEARCH MODE"}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400">
            MISSION: {mission.title}
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-all text-xs"
        >
          ✕ CLOSE WORKSPACE
        </button>
      </div>

      {/* Adaptive Mode Layout */}
      {isCoding ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Code / AST Editor View */}
          <div className="flex-1 p-4 border-r border-zinc-800 flex flex-col overflow-hidden bg-black/40">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">ARTIFACT EDITOR & AST DIFF</span>
              <span className="text-[10px] text-[#ffcc66]">agent-builder // nextjs.tsx</span>
            </div>
            <pre className="flex-1 p-3 bg-black/80 rounded border border-zinc-900 text-zinc-300 font-mono text-[11px] overflow-auto leading-relaxed">
{`// Synthesized by ULTRON Conductor -> Builder Agent
// Target: High-throughput secure API endpoint

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/core/security";

export async function POST(req: NextRequest) {
  const auth = await verifyAuthToken(req.headers.get("authorization"));
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const payload = await req.json();
  // Validated against Zod schema
  return NextResponse.json({ status: "SUCCESS", timestamp: Date.now() });
}`}
            </pre>
          </div>

          {/* Right: Terminal & Test Runner */}
          <div className="w-full md:w-96 p-4 flex flex-col bg-black/60 overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase">EPHEMERAL SANDBOX TEST RUNNER</span>
              <span className="text-[10px] text-emerald-400">PASSED: 19/19</span>
            </div>
            <div className="flex-1 p-3 bg-black rounded border border-zinc-900 text-zinc-300 text-[10px] font-mono overflow-auto space-y-1">
              {terminalOutput.map((out, i) => (
                <div key={i} className="text-zinc-400">
                  <span className="text-[#ffaa30] mr-1">&gt;</span>
                  {out}
                </div>
              ))}
              <div className="text-emerald-400 pt-2">✓ Test suites passed with 0 exit code.</div>
            </div>
          </div>
        </div>
      ) : isSecurity ? (
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded border border-zinc-800 bg-black/50 space-y-2">
              <div className="text-red-400 font-bold uppercase text-[11px]">MITRE ATT&CK HEATMAP</div>
              <p className="text-zinc-400 text-[10px]">Zero persistence or credential exfiltration detected in static codebase AST.</p>
            </div>
            <div className="p-4 rounded border border-zinc-800 bg-black/50 space-y-2">
              <div className="text-amber-400 font-bold uppercase text-[11px]">DEPENDENCY CVE AUDIT</div>
              <p className="text-zinc-400 text-[10px]">Scanned 37 npm modules; high-severity vulnerabilities mapped and quarantined.</p>
            </div>
            <div className="p-4 rounded border border-zinc-800 bg-black/50 space-y-2">
              <div className="text-emerald-400 font-bold uppercase text-[11px]">SECRET SCRUBBING</div>
              <p className="text-zinc-400 text-[10px]">Automated regex + entropy scanner cleared all API keys and JWTs from logs.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div className="text-zinc-400 text-[11px]">Research dossier and synthesized evidence tree.</div>
        </div>
      )}
    </div>
  );
}
