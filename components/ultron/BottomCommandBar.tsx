"use client";

import React, { useRef, useState } from "react";
import UltronButton from "../common/UltronButton";

export interface BottomCommandBarProps {
  onSubmitIntent: (text: string) => void;
  isProcessing?: boolean;
}

export default function BottomCommandBar({
  onSubmitIntent,
  isProcessing = false,
}: BottomCommandBarProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleVoice = () => {
    if (typeof window === "undefined") return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Browser speech recognition is not supported in this browser. Please type your command.");
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

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.start();
    } catch {
      setIsListening(false);
    }
  };

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

        {/* Left: Input container with exact Section 17 styling */}
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ULTRON to research, build, analyze, automate..."
            style={{
              width: "100%",
              height: "44px",
              background: "rgba(5, 8, 20, 0.95)",
              color: "#EAF2FF",
              border: "1px solid rgba(99, 232, 255, 0.25)",
              borderRadius: "8px",
              padding: "0 14px",
              fontSize: "13px",
              fontFamily: "var(--ultron-font)",
              outline: "none",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(99, 232, 255, 0.60)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(99, 232, 255, 0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(99, 232, 255, 0.25)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.4)";
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
                color: "#63E8FF",
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

        {/* Voice Button */}
        <UltronButton
          type="button"
          variant={isListening ? "primary" : "secondary"}
          onClick={toggleVoice}
          title={isListening ? "Listening... Click to stop" : "Voice Input"}
          style={{
            height: "44px",
            minWidth: "44px",
            padding: "0",
            fontSize: "16px",
            borderRadius: "8px",
          }}
        >
          {isListening ? "●" : "🎙"}
        </UltronButton>

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
          variant="primary"
          disabled={!input.trim() || isProcessing}
          title="Send command"
          style={{
            height: "44px",
            minWidth: "80px",
            fontSize: "13px",
            fontWeight: 700,
            borderRadius: "8px",
            letterSpacing: "0.8px",
          }}
        >
          {isProcessing ? "TRANSMITTING..." : "TRANSMIT ➔"}
        </UltronButton>
      </form>
    </div>
  );
}
