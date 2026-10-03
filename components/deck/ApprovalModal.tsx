"use client";

import React from "react";
import { PolicyGate } from "../../core/types/mission";

interface ApprovalModalProps {
  gate: PolicyGate;
  onApprove: (gateId: string) => void;
  onDeny: (gateId: string) => void;
  onClose: () => void;
}

export default function ApprovalModal({
  gate,
  onApprove,
  onDeny,
  onClose,
}: ApprovalModalProps) {
  const isCritical = gate.riskLevel === "CRITICAL";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl border border-amber-500/60 bg-[#0a0502] rounded-lg shadow-[0_0_40px_rgba(255,170,48,0.3)] overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-amber-500/30 bg-amber-500/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-400 font-bold tracking-wider uppercase text-sm">
              HUMAN-IN-THE-LOOP APPROVAL REQUIRED
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isCritical ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
          }`}>
            RISK: {gate.riskLevel}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-zinc-300">
          <div>
            <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">PROPOSED ACTION</div>
            <div className="text-amber-200 font-semibold text-sm bg-black/50 p-2.5 rounded border border-amber-500/20">
              {gate.action}
            </div>
          </div>

          <div>
            <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">TARGET ASSET / SCOPE</div>
            <div className="text-zinc-100 bg-black/40 p-2 rounded border border-zinc-800">
              {gate.target}
            </div>
          </div>

          <div>
            <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">OPERATIONAL JUSTIFICATION</div>
            <p className="text-zinc-300 leading-relaxed bg-black/30 p-2.5 rounded border border-zinc-800">
              {gate.reason}
            </p>
          </div>

          <div>
            <div className="text-zinc-500 uppercase tracking-widest text-[10px] mb-1">EXPECTED SYSTEM RESULT</div>
            <div className="text-emerald-400 bg-black/40 p-2 rounded border border-emerald-500/20">
              ✓ {gate.expectedResult}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
            <span>REQUESTED BY: {gate.requestedBy}</span>
            <span>POLICY: ZERO-TRUST LEAST PRIVILEGE</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-amber-500/30 bg-black/60">
          <button
            onClick={() => {
              onDeny(gate.id);
              onClose();
            }}
            className="px-4 py-2 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-700 transition-all tracking-wider"
          >
            [DENY ACTION]
          </button>
          <button
            onClick={() => {
              onApprove(gate.id);
              onClose();
            }}
            className="px-6 py-2 rounded font-bold text-black bg-[#ffaa30] hover:bg-[#ffcc66] shadow-[0_0_20px_rgba(255,170,48,0.5)] transition-all tracking-wider"
          >
            [AUTHORIZE & EXECUTE]
          </button>
        </div>
      </div>
    </div>
  );
}
