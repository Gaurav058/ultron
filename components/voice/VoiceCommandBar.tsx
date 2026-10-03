"use client";

import React, { useEffect, useState } from "react";
import VoiceWaveform from "./VoiceWaveform";
import { UltronVoiceEngine, VoiceState } from "@/lib/voiceEngine";
import UltronButton from "../common/UltronButton";

interface VoiceCommandBarProps {
  onTranscriptReceived?: (transcript: string) => void;
  onOpenSessionDrawer?: () => void;
}

export default function VoiceCommandBar({
  onTranscriptReceived,
  onOpenSessionDrawer,
}: VoiceCommandBarProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("IDLE");
  const [waveformData, setWaveformData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const engine = UltronVoiceEngine.getInstance();
    setVoiceState(engine.getState());

    engine.setListeners({
      onStateChange: (state) => setVoiceState(state),
      onWaveformData: (data) => setWaveformData(data),
      onTranscript: (text) => onTranscriptReceived?.(text),
    });

    return () => {
      // Don't fully cleanup on every unmount so active listening persists across quick switches
    };
  }, [onTranscriptReceived]);

  const handleToggle = () => {
    const engine = UltronVoiceEngine.getInstance();
    engine.toggleListening();
  };

  // State text and styling mapping per Section 17
  const getStateConfig = () => {
    switch (voiceState) {
      case "LISTENING":
        return {
          label: "◉ LISTENING...",
          bg: "rgba(99, 232, 255, 0.15)",
          border: "rgba(99, 232, 255, 0.6)",
          color: "#63E8FF",
          glow: "0 0 16px rgba(99, 232, 255, 0.3)",
        };
      case "THINKING":
        return {
          label: "◉ ULTRON IS THINKING...",
          bg: "rgba(141, 117, 255, 0.18)",
          border: "rgba(141, 117, 255, 0.6)",
          color: "#8D75FF",
          glow: "0 0 16px rgba(141, 117, 255, 0.3)",
        };
      case "SPEAKING":
        return {
          label: "◉ ULTRON IS SPEAKING...",
          bg: "rgba(95, 240, 160, 0.15)",
          border: "rgba(95, 240, 160, 0.6)",
          color: "#5FF0A0",
          glow: "0 0 16px rgba(95, 240, 160, 0.3)",
        };
      case "EXECUTING":
        return {
          label: "◉ EXECUTING TASK...",
          bg: "rgba(255, 209, 102, 0.18)",
          border: "rgba(255, 209, 102, 0.6)",
          color: "#FFD166",
          glow: "0 0 16px rgba(255, 209, 102, 0.3)",
        };
      case "WAITING_FOR_APPROVAL":
        return {
          label: "◉ APPROVAL REQUIRED",
          bg: "rgba(255, 102, 122, 0.2)",
          border: "rgba(255, 102, 122, 0.7)",
          color: "#FF667A",
          glow: "0 0 16px rgba(255, 102, 122, 0.35)",
        };
      case "ERROR":
        return {
          label: "⚠ VOICE ERROR",
          bg: "rgba(255, 102, 122, 0.2)",
          border: "rgba(255, 102, 122, 0.6)",
          color: "#FF667A",
          glow: "none",
        };
      case "IDLE":
      default:
        return {
          label: "○ TALK TO ULTRON",
          bg: "rgba(7, 11, 28, 0.94)",
          border: "rgba(99, 232, 255, 0.25)",
          color: "#EAF2FF",
          glow: "none",
        };
    }
  };

  const config = getStateConfig();
  const isActive = voiceState === "LISTENING" || voiceState === "SPEAKING" || voiceState === "THINKING";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <button
        type="button"
        id="btn-talk-to-ultron"
        aria-label="Talk to ULTRON"
        onClick={handleToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          height: "44px",
          padding: "0 16px",
          background: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: "8px",
          color: config.color,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: config.glow,
          outline: "none",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--ultron-cyan)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = config.border;
        }}
      >
        <span style={{ fontSize: "14px" }}>{config.label.slice(0, 1)}</span>
        <span>{config.label.slice(2)}</span>

        <VoiceWaveform
          active={isActive}
          waveformData={waveformData}
          color={config.color}
          barsCount={12}
        />
      </button>

      {onOpenSessionDrawer && (
        <UltronButton
          type="button"
          variant="secondary"
          onClick={onOpenSessionDrawer}
          title="Open Conversation Transcript"
          style={{
            height: "44px",
            minWidth: "44px",
            padding: "0",
            fontSize: "14px",
            borderRadius: "8px",
          }}
        >
          💬
        </UltronButton>
      )}
    </div>
  );
}
