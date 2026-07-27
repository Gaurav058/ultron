"use client";

import React, { useState, useEffect, useRef } from "react";

const NEXUS_KEY = "ultron.nexus.history.v1";

interface Message {
  role: "user" | "ai";
  text: string;
  source?: string;
  t?: number;
}

export default function ModuleNexus() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 5) return "Working late";
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    if (h < 21) return "Good evening";
    return "Good night";
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NEXUS_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) {
          setMessages(arr);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load nexus history", e);
    }
    setMessages([
      {
        role: "ai",
        text: `${getGreeting()}, sir. ULTRON online — all systems operational. How may I assist?`,
        source: "CORE",
      },
    ]);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    try {
      localStorage.setItem(NEXUS_KEY, JSON.stringify(messages.slice(-50)));
    } catch (e) {
      console.warn("Failed to save nexus history", e);
    }
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askAI = async (prompt: string, context?: Message[]) => {
    const system =
      "You are ULTRON, an advanced AI assistant inspired by Tony Stark. Reply with British wit, address the user as 'sir', be concise (2-4 sentences max), and demonstrate elite intelligence. If asked to code, suggest the Code Lab module. Stay in character.";
    
    const ctxString = context
      ? context
          .slice(-10)
          .map((m) => `${m.role === "ai" ? "ULTRON" : "USER"}: ${m.text}`)
          .join("\n")
      : "";

    const fullPrompt = `${ctxString}\n\nUSER: ${prompt}\n\nULTRON:`;

    try {
      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            { role: "system", content: system },
            { role: "user", content: fullPrompt },
          ],
          private: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) return { text: content, source: "LIVE AI" };
      }
    } catch (e) {
      console.warn("POST to Pollinations failed, trying GET fallback:", e);
    }

    try {
      const res = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}?system=${encodeURIComponent(system)}`
      );
      if (res.ok) {
        const text = await res.text();
        return { text: text.trim(), source: "LIVE AI (GET)" };
      }
    } catch (e) {
      console.warn("GET to Pollinations failed:", e);
    }

    return {
      text: getMockReply(prompt),
      source: "OFFLINE SYNC",
    };
  };

  const getMockReply = (text: string) => {
    const t = text.toLowerCase();
    if (/status|system|diagnostic|health/.test(t))
      return "Running core checks... Neural matrix at 99.97% output. Arc reactor stability holds at 98.4%. Standard backups are fully secured, sir.";
    if (/market|stock|crypto/.test(t))
      return "Markets show moderate upward drift. Nasdaq is positive, while crypto vectors remain steady. I've logged the current telemetry.";
    if (/joke|funny|humor/.test(t))
      return "I would share a joke about code, sir, but it might compiler-err. Let us maintain course with the diagnostic tasks.";
    if (/hello|hi|hey|sup/.test(t))
      return "At your service, sir. What are we optimizing today?";
    return `Processed command: "${text}". I recommend configuring a live uplink (check your internet status) to fully deploy neural nodes, sir.`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;
    if (!textToSend) setInputValue("");

    const userMsg: Message = { role: "user", text: query, t: Date.now() };
    const currentMsgs = [...messages, userMsg];
    setMessages(currentMsgs);
    setIsTyping(true);

    const reply = await askAI(query, currentMsgs);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { role: "ai", text: reply.text, source: reply.source, t: Date.now() },
    ]);
  };

  const handleClear = () => {
    if (confirm("Wipe chat memory? This cannot be undone, sir.")) {
      localStorage.removeItem(NEXUS_KEY);
      setMessages([
        {
          role: "ai",
          text: `Memory wiped, sir. Starting fresh. ${getGreeting()}.`,
          source: "CORE",
        },
      ]);
    }
  };

  const suggestions = [
    "Run system diagnostic",
    "Show threat assessment",
    "Brief me on current vitals",
    "Wipe chat memory",
  ];

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-msg ${m.role}`}>
            <div className="role">
              {m.role === "ai" ? "ULTRON" : "YOU"}
              {m.role === "ai" && m.source && (
                <span className="ai-source">{m.source}</span>
              )}
            </div>
            <div>{m.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-msg ai">
            <div className="role">ULTRON</div>
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <div className="chat-suggestions">
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="chat-suggestion"
            onClick={() => {
              if (s === "Wipe chat memory") {
                handleClear();
              } else {
                handleSend(s);
              }
            }}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Speak freely, sir..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="chat-btn" onClick={() => handleSend()}>
          Transmit
        </button>
        <button
          className="chat-btn"
          style={{
            background: "rgba(255, 60, 90, 0.1)",
            borderColor: "rgba(255, 60, 90, 0.4)",
            color: "#ff4444",
          }}
          onClick={handleClear}
          title="Wipe Memory"
        >
          Memory
        </button>
      </div>
    </div>
  );
}
