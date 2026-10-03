"use client";

import React, { useRef, useState } from "react";
import UltronButton from "../common/UltronButton";
import VoiceCommandBar from "../voice/VoiceCommandBar";
import VoiceSessionPanel from "../voice/VoiceSessionPanel";

export interface BottomCommandBarProps {
  onSubmitIntent: (text: string) => void;
  isProcessing?: boolean;
}

export default function BottomCommandBar({
  onSubmitIntent,
  isProcessing = false,
}: BottomCommandBarProps) {
  const [input, setInput] = useState("");
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      setInput((prev) => (prev ? `${prev} [Attachment: ${file.name}]` : `Ingest [Attachment: ${file.name}]`));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSubmitIntent(input.trim());
    setInput("");
    setAttachmentName(null);
  };

  return (
    <div
      className="command-bar-wrapper"
      style={{
        width: "100%",
        padding: "6px 1.4vw",
        position: "relative",
        zIndex: 10,
        fontFamily: "var(--ultron-font)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {/* Hidden file input for attachment button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Section 2: [ 🎙 TALK TO ULTRON ] persistent voice button */}
        <VoiceCommandBar
          onTranscriptReceived={(transcript) => {
            setInput(transcript);
          }}
          onOpenSessionDrawer={() => setShowSessionPanel((prev) => !prev)}
        />

        {/* Section 2: [ Ask ULTRON to research, build, analyze... ] */}
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="text"
            id="input-ultron-command"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ULTRON to research, build, analyze, automate..."
            style={{
              width: "100%",
              height: "44px",
              background: "var(--ultron-panel)",
              color: "var(--ultron-text-primary)",
              border: "1px solid var(--ultron-border)",
              borderRadius: "8px",
              padding: "0 14px",
              fontSize: "13px",
              fontFamily: "var(--ultron-font)",
              outline: "none",
              transition: "all 0.25s ease",
              boxShadow: "var(--ultron-shadow)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--ultron-border-active)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(99, 232, 255, 0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--ultron-border)";
              e.currentTarget.style.boxShadow = "var(--ultron-shadow)";
            }}
          />

          {attachmentName && (
            <div
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "10px",
                color: "var(--ultron-cyan)",
                background: "rgba(99, 232, 255, 0.12)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(99, 232, 255, 0.3)",
              }}
            >
              📎 {attachmentName}
            </div>
          )}
        </div>

        {/* Attachment Button */}
        <UltronButton
          type="button"
          variant="secondary"
          onClick={handleAttachmentClick}
          title="Attach file / data"
          style={{
            height: "44px",
            minWidth: "44px",
            padding: "0",
            fontSize: "16px",
            borderRadius: "8px",
          }}
        >
          📎
        </UltronButton>

        {/* Send Button */}
        <UltronButton
          type="submit"
          id="btn-transmit-command"
          variant="primary"
          disabled={!input.trim() || isProcessing}
          title="Send command"
          style={{
            height: "44px",
            minWidth: "90px",
            fontSize: "13px",
            fontWeight: 700,
            borderRadius: "8px",
            letterSpacing: "0.8px",
          }}
        >
          {isProcessing ? "THINKING..." : "TRANSMIT ➔"}
        </UltronButton>
      </form>

      {/* Voice Transcript Drawer / Session Panel */}
      {showSessionPanel && (
        <VoiceSessionPanel onClose={() => setShowSessionPanel(false)} />
      )}
    </div>
  );
}
