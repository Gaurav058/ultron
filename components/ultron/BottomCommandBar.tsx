"use client";

import React, { useState } from "react";

interface BottomCommandBarProps {
  onSubmitIntent: (text: string) => void;
  isProcessing?: boolean;
}

export default function BottomCommandBar({
  onSubmitIntent,
  isProcessing = false,
}: BottomCommandBarProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([40, 75, 50, 90, 60, 30, 80, 45]);

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Browser speech recognition unavailable.");
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (e: any) => {
        const trans = Array.from(e.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setInput(trans);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSubmitIntent(input.trim());
    setInput("");
  };

  return (
    <div className="w-full select-none font-mono">
      <form
        onSubmit={handleSubmit}
        className="relative bg-[#060a1c]/90 border border-[#00d9ff]/30 hover:border-[#00d9ff]/60 focus-within:border-[#00d9ff] focus-within:shadow-[0_0_30px_rgba(0,217,255,0.25)] rounded-[4px] p-2 lg:p-2.5 backdrop-blur-xl transition-all duration-300 flex items-center justify-between gap-3"
      >
        {/* Left: Indicator & Voice Microphone Waveform */}
        <div className="flex items-center gap-2.5 shrink-0 pl-1">
          <button
            type="button"
            onClick={toggleVoice}
            className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-500/20 border border-red-500 text-red-400 animate-pulse shadow-[0_0_15px_#ef4444]"
                : "bg-white/[0.04] border border-white/[0.08] text-[#00d9ff] hover:bg-[#00d9ff]/15"
            }`}
            title="Toggle Voice Engine"
          >
            🎙
          </button>

          {/* Dynamic Audio Waveform */}
          <div className="hidden sm:flex items-center gap-0.5 h-5 px-1">
            {waveformBars.map((height, i) => (
              <span
                key={i}
                className={`w-[2px] rounded-full transition-all duration-300 ${
                  isListening
                    ? "bg-[#00d9ff] animate-pulse"
                    : "bg-[#8493b2]/40"
                }`}
                style={{
                  height: isListening ? `${Math.max(20, (height + Math.random() * 50) % 100)}%` : "30%",
                }}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <span className="font-['Rajdhani',sans-serif] text-[10px] font-bold text-[#00d9ff] tracking-widest uppercase block leading-none">
              ULTRON COMMAND
            </span>
            <span className="text-[8px] text-[#8493b2] tracking-wider uppercase">
              {isListening ? "LISTENING..." : isProcessing ? "EXECUTING..." : "AWAITS INTENT"}
            </span>
          </div>
        </div>

        {/* Center: Omni-Intent Input Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak, type, think, create... 'Build AETHORA AI Platform', 'Audit CVEs'..."
            className="w-full bg-transparent px-2 py-1.5 text-zinc-100 placeholder-[#8493b2]/60 text-xs focus:outline-none font-mono"
          />
        </div>

        {/* Right: Action Buttons & Transmit */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          <button
            type="button"
            onClick={() => setInput("Build AETHORA AI Platform with multimodal Conductor and Reality Checker")}
            className="hidden xl:inline-block px-2 py-1 text-[9px] rounded bg-white/[0.04] border border-white/[0.08] text-[#8493b2] hover:text-zinc-200"
          >
            [EXAMPLE INTENT]
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-1.5 rounded bg-gradient-to-r from-[#00d9ff] to-[#88f5ff] text-black font-['Rajdhani',sans-serif] font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_20px_#00d9ff] transition-all duration-300 disabled:opacity-50"
          >
            {isProcessing ? "PROCESSING..." : "TRANSMIT ➔"}
          </button>
        </div>
      </form>
    </div>
  );
}
