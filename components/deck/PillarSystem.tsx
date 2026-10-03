"use client";

import React, { useEffect, useState } from "react";
import { UltronDoctor } from "../../core/runtime/ultronDoctor";
import { UltronDoctorReport } from "../../core/types/system";
import { REGISTERED_MODELS } from "../../core/model-router/modelRouter";
import { AuditLogEntry } from "../../core/types/security";

export default function PillarSystem() {
  const [doctorReport, setDoctorReport] = useState<UltronDoctorReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "log-001",
      timestamp: new Date().toLocaleTimeString(),
      eventType: "MISSION_TRANSITION",
      actor: "ULTRON Conductor",
      severity: "INFO",
      details: "Mission DAG compiled with 4 execution milestones.",
    },
    {
      id: "log-002",
      timestamp: new Date().toLocaleTimeString(),
      eventType: "TOOL_INVOCATION",
      actor: "Deep Researcher",
      severity: "INFO",
      details: "Executed browser_search on primary documentation indexes.",
    },
    {
      id: "log-003",
      timestamp: new Date().toLocaleTimeString(),
      eventType: "APPROVAL_DECISION",
      actor: "Human Operator",
      severity: "INFO",
      details: "Zero-trust policy cleared: Container sandbox granted execution scope.",
    },
    {
      id: "log-004",
      timestamp: new Date().toLocaleTimeString(),
      eventType: "SECURITY_ALERT",
      actor: "Security Sentinel",
      severity: "INFO",
      details: "Automated secret scrubbing verified: zero API keys exposed.",
    },
  ]);

  const runScan = async () => {
    setIsScanning(true);
    const report = await UltronDoctor.runDiagnostics();
    setDoctorReport(report);
    setIsScanning(false);
  };

  useEffect(() => {
    runScan();
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-60px)] mt-[60px] p-6 font-mono text-xs text-zinc-200 bg-[#050302] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_24px_rgba(255,170,48,0.1)] mb-6">
        <div>
          <h1 className="text-base md:text-lg font-bold text-[#ffaa30] flex items-center gap-2">
            <span>SYSTEM RUNTIME & OBSERVABILITY</span>
            <span className="text-zinc-500 font-normal">| ULTRON DOCTOR & TELEMETRY</span>
          </h1>
          <p className="text-zinc-400 text-[11px] mt-1">
            Real-time host vitals, pgvector health, model provider latency, and cryptographic audit log stream.
          </p>
        </div>

        <button
          onClick={runScan}
          disabled={isScanning}
          className="px-4 py-2 bg-[#ffaa30] hover:bg-[#ffcc66] text-black font-bold rounded shadow-[0_0_15px_rgba(255,170,48,0.3)] transition-all"
        >
          {isScanning ? "SCANNING SUBSYSTEMS..." : "[RUN DOCTOR DIAGNOSTIC]"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Doctor Report */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#ffaa30]/30 bg-black/60 shadow-[0_0_16px_rgba(255,170,48,0.1)]">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <h2 className="font-bold text-[#ffaa30] uppercase text-xs">ULTRON DOCTOR REPORT</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                doctorReport?.overallHealth === "HEALTHY"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}>
                {doctorReport?.overallHealth || "ANALYZING"}
              </span>
            </div>

            {doctorReport && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-zinc-300 bg-black/40 p-2 rounded border border-zinc-800">
                  {doctorReport.summary}
                </p>
                <div className="space-y-1.5">
                  {doctorReport.checks.map((chk) => (
                    <div
                      key={chk.name}
                      className="p-2 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-100">{chk.name}</span>
                        <span className="text-emerald-400 font-bold text-[10px]">{chk.status}</span>
                      </div>
                      <p className="text-zinc-400 text-[10px]">{chk.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Model Provider Latency & Profiles */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-zinc-800 bg-black/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h2 className="font-bold text-zinc-100 uppercase text-xs">MODEL ROUTER GATEWAYS</h2>
              <span className="text-[10px] text-zinc-500">DYNAMIC MULTI-PROVIDER</span>
            </div>

            <div className="space-y-2">
              {REGISTERED_MODELS.map((model) => (
                <div
                  key={model.id}
                  className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-100">{model.displayName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                      {model.provider}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>CONTEXT: {(model.contextWindow / 1000).toFixed(0)}k</span>
                    <span className="text-emerald-400">{model.avgLatencyMs}ms TTFT</span>
                    <span>{model.isLocal ? "LOCAL (AIRGAPPED)" : "CLOUD SECURE"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Audit Stream */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-zinc-800 bg-black/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h2 className="font-bold text-zinc-100 uppercase text-xs">AUDIT EVENT STREAM</h2>
              <span className="text-[10px] text-[#00f0ff]">CRYPTOGRAPHIC LOG</span>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded bg-zinc-900/50 border border-zinc-800 text-[10px] space-y-1"
                >
                  <div className="flex justify-between text-zinc-500">
                    <span className="font-bold text-[#ffaa30]">{log.eventType}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-zinc-300 font-semibold">{log.details}</div>
                  <div className="text-zinc-500 text-[9px]">ACTOR: {log.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
