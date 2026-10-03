/**
 * ULTRON COMMAND BAR
 * Directive Sections 1, 8, 21
 * Interactive command bar supporting text input, speech-to-text, file attachment,
 * audio telemetry synthesis toggle, and reactive state management.
 */

"use client";

import React, { useState, useRef } from "react";
import { UltronVoiceEngine } from "@/lib/voiceEngine";

export interface UltronCommandBarProps {
  onSubmit: (command: string) => void;
  isProcessing?: boolean;
}

export default function UltronCommandBar({
  onSubmit,
  isProcessing = false,
}: UltronCommandBarProps) {
  const [inputVal, setInputVal] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [voiceSynthActive, setVoiceSynthActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;

    let finalCommand = inputVal.trim();
    if (attachedFiles.length > 0) {
      finalCommand += ` [Attached Context: ${attachedFiles.join(", ")}]`;
    }

    onSubmit(finalCommand);
    setInputVal("");
    setAttachedFiles([]);
  };

  const toggleMic = () => {
    if (typeof window === "undefined") return;

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Web Speech API is not supported in this browser. Please type commands directly.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (evt: any) => {
        const transcript = evt.results[0][0].transcript;
        setInputVal(transcript);
        setIsRecording(false);
        onSubmit(transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((f) => f.name);
      setAttachedFiles((prev) => [...prev, ...fileNames]);
    }
  };

  const toggleVoiceSynth = () => {
    setVoiceSynthActive((prev) => {
      const next = !prev;
      if (!next) {
        UltronVoiceEngine.getInstance().stop();
      }
      return next;
    });
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "4px 8px",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        multiple
      />

      {/* GLOWING MICROPHONE BUTTON */}
      <button
        type="button"
        onClick={toggleMic}
        title={isRecording ? "Listening... Click to stop" : "Start Voice Direct Command"}
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: isRecording
            ? "linear-gradient(135deg, #FF4D67 0%, #FFB020 100%)"
            : "linear-gradient(135deg, #1687FF 0%, #00D9FF 100%)",
          border: isRecording ? "1px solid #FF4D67" : "1px solid #00D9FF",
          boxShadow: isRecording
            ? "0 0 16px rgba(255, 77, 103, 0.6)"
            : "0 0 16px rgba(0, 217, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          color: "#EAF4FF",
          transition: "all 0.2s ease",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>

      {/* COMMAND INPUT BOX */}
      <form
        onSubmit={handleSubmit}
        className="ultron-panel-base"
        style={{
          flex: 1,
          height: "44px",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: "10px",
          borderRadius: "22px",
          background: "rgba(6, 19, 41, 0.95)",
        }}
      >
        {/* Attachment chips */}
        {attachedFiles.map((fn, idx) => (
          <span
            key={idx}
            style={{
              background: "rgba(22, 135, 255, 0.2)",
              border: "1px solid #00D9FF",
              borderRadius: "4px",
              padding: "1px 6px",
              fontSize: "9.5px",
              color: "#00D9FF",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            📎 {fn.slice(0, 15)}
            <span
              onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
              style={{ cursor: "pointer", fontWeight: 700 }}
            >
              ×
            </span>
          </span>
        ))}

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            isProcessing
              ? "ULTRON executing research pipeline..."
              : isRecording
              ? "Listening to speech input..."
              : "Ask ULTRON to research, build, analyze, automate... (e.g. 'Research AI startups in Dubai')"
          }
          disabled={isProcessing}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#EAF4FF",
            fontSize: "12.5px",
            fontFamily: "var(--ultron-font)",
          }}
        />

        {/* RIGHT CONTROLS: Attachment, Voice waveform toggle, Send button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Attachment */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach data file / document"
            style={{
              background: "transparent",
              border: "none",
              color: attachedFiles.length > 0 ? "#00D9FF" : "#7187A5",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>

          {/* Voice Waveform toggle */}
          <button
            type="button"
            onClick={toggleVoiceSynth}
            title={voiceSynthActive ? "Voice Audio Response: ON (Click to mute)" : "Voice Audio Response: MUTED"}
            style={{
              background: "transparent",
              border: "none",
              color: voiceSynthActive ? "#00E6A8" : "#435873",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="9" x2="4" y2="15" />
              <line x1="8" y1="5" x2="8" y2="19" />
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="16" y1="7" x2="16" y2="17" />
              <line x1="20" y1="10" x2="20" y2="14" />
            </svg>
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isProcessing || (!inputVal.trim() && attachedFiles.length === 0)}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: inputVal.trim() ? "#1687FF" : "transparent",
              border: "none",
              color: inputVal.trim() ? "#EAF4FF" : "#435873",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: inputVal.trim() ? "pointer" : "default",
              transition: "all 0.15s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
