"use client";

import React, { useEffect, useState } from "react";
import UltronPanel from "../common/UltronPanel";
import UltronButton from "../common/UltronButton";
import { ConversationMessage, ActiveEntity } from "@/core/voice/conversationSession";
import { UltronVoiceEngine } from "@/lib/voiceEngine";

interface VoiceSessionPanelProps {
  onClose: () => void;
}

export default function VoiceSessionPanel({ onClose }: VoiceSessionPanelProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [entities, setEntities] = useState<ActiveEntity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/voice/session");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.session.messages || []);
        setEntities(data.session.activeEntities || []);
      }
    } catch (e) {
      console.warn("Failed to load voice session:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInterrupt = () => {
    UltronVoiceEngine.getInstance().interruptSpeech();
  };

  const handleClearContext = async () => {
    try {
      await fetch("/api/voice/session", { method: "DELETE" });
      setMessages([]);
      setEntities([]);
    } catch (e) {
      console.warn("Failed to clear session context:", e);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "420px",
        maxWidth: "90vw",
        zIndex: 100,
        background: "var(--ultron-panel-elevated)",
        borderLeft: "1px solid var(--ultron-border-active)",
        boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--ultron-font)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          borderBottom: "1px solid var(--ultron-border)",
        }}
      >
        <div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ultron-cyan)", letterSpacing: "1px" }}>
            VOICE CONVERSATION SESSION
          </div>
          <div style={{ fontSize: "11px", color: "var(--ultron-text-muted)" }}>
            GEMINI COGNITION & TOOL CALLING TRACE
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--ultron-text-secondary)",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Active Entities Strip (Section 18) */}
      {entities.length > 0 && (
        <div
          style={{
            padding: "8px 20px",
            background: "rgba(99, 232, 255, 0.05)",
            borderBottom: "1px solid var(--ultron-border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "10px", color: "var(--ultron-cyan)", fontWeight: 700 }}>
            ENTITIES:
          </span>
          {entities.map((e, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "10px",
                padding: "2px 6px",
                background: "rgba(99, 232, 255, 0.12)",
                color: "var(--ultron-text-primary)",
                borderRadius: "4px",
                border: "1px solid rgba(99, 232, 255, 0.2)",
              }}
            >
              {e.name}
            </span>
          ))}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {loading && messages.length === 0 ? (
          <div style={{ color: "var(--ultron-text-muted)", fontSize: "12px", textAlign: "center", marginTop: "40px" }}>
            INITIALIZING VOICE CONTEXT...
          </div>
        ) : messages.length <= 1 ? (
          <div style={{ color: "var(--ultron-text-muted)", fontSize: "12px", textAlign: "center", marginTop: "40px" }}>
            NO CONVERSATION LOGGED YET.
            <div style={{ marginTop: "6px", fontSize: "11px" }}>
              Press [ 🎙 TALK TO ULTRON ] or type a command to begin.
            </div>
          </div>
        ) : (
          messages
            .filter((m) => m.role !== "system")
            .map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background:
                    msg.role === "user"
                      ? "rgba(99, 232, 255, 0.12)"
                      : "rgba(10, 15, 38, 0.9)",
                  border:
                    msg.role === "user"
                      ? "1px solid rgba(99, 232, 255, 0.4)"
                      : "1px solid rgba(99, 232, 255, 0.2)",
                  color: "var(--ultron-text-primary)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: msg.role === "user" ? "var(--ultron-cyan)" : "var(--ultron-violet)",
                    marginBottom: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{msg.role === "user" ? "OPERATOR" : "ULTRON"}</span>
                  <span style={{ color: "var(--ultron-text-muted)", fontWeight: 400 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>

                <div>{msg.content}</div>

                {/* Tool calls indicator */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "6px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      fontSize: "11px",
                      color: "var(--ultron-warning)",
                    }}
                  >
                    ⚙ Tool Executed: {msg.toolCalls.map((t) => t.toolName).join(", ")}
                  </div>
                )}
              </div>
            ))
        )}
      </div>

      {/* Footer Controls */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--ultron-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--ultron-bg-secondary)",
        }}
      >
        <UltronButton
          variant="secondary"
          size="sm"
          onClick={handleInterrupt}
          title="Interrupt ongoing speech playback"
        >
          ⏹ INTERRUPT
        </UltronButton>

        <UltronButton
          variant="secondary"
          size="sm"
          onClick={handleClearContext}
          title="Purge session conversational history"
        >
          🗑 CLEAR CONTEXT
        </UltronButton>
      </div>
    </div>
  );
}
