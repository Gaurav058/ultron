"use client";

import React, { useState } from "react";

interface LogLine {
  text: string;
  type: "info" | "error" | "log";
}

export default function ModuleLab() {
  const [lang, setLang] = useState("js");
  const [code, setCode] = useState(`// JARVIS Code Lab — execute live in this session
// Try this, sir:

const greet = (name) => \`Welcome, \${name}. Systems online.\`;
console.log(greet("Stark"));

// Statistical operations
const data = [42, 17, 88, 23, 91, 5, 67];
const stats = {
  count: data.length,
  sum: data.reduce((a, b) => a + b, 0),
  avg: data.reduce((a, b) => a + b, 0) / data.length,
  max: Math.max(...data),
  min: Math.min(...data),
};
console.log("Statistical Summary:", stats);
`);
  const [logs, setLogs] = useState<LogLine[]>([
    { text: "Awaiting execution...", type: "info" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const executeCode = () => {
    setLogs([{ text: `▶ Executing ${lang.toUpperCase()} ...`, type: "info" }]);

    if (lang === "js") {
      const originalLog = console.log;
      const captured: string[] = [];

      console.log = (...args: any[]) => {
        captured.push(
          args
            .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
            .join(" ")
        );
        originalLog(...args);
      };

      try {
        const executor = new Function(code);
        executor();
        console.log = originalLog;

        const logLines = captured.map((line) => ({ text: line, type: "log" as const }));
        setLogs((prev) => [
          ...prev,
          ...logLines,
          { text: "✓ EXECUTION COMPLETE", type: "info" as const }
        ]);
      } catch (e: any) {
        console.log = originalLog;
        setLogs((prev) => [
          ...prev,
          { text: `✗ ERROR: ${e.message}`, type: "error" as const }
        ]);
      }
    } else {
      const lines = code.split("\n");
      const prints = lines.filter((l) => /print\(/.test(l));
      
      if (prints.length === 0) {
        setLogs((prev) => [
          ...prev,
          { text: "✓ Simulation complete — no print output captured.", type: "info" }
        ]);
      } else {
        const simulated: LogLine[] = [];
        prints.forEach((p) => {
          const match = p.match(/print\((.*)\)/);
          if (match) {
            const rawVal = match[1].trim().replace(/^["'`]|["'`]$/g, "");
            simulated.push({ text: rawVal, type: "log" });
          }
        });
        setLogs((prev) => [
          ...prev,
          ...simulated,
          { text: "✓ SIMULATION COMPLETE", type: "info" }
        ]);
      }
    }
  };

  const handleAIGenerate = async () => {
    const prompt = window.prompt("Describe what you want to build:", "Fibonacci sequence generator");
    if (!prompt) return;

    setIsLoading(true);
    setLogs([{ text: "⌬ JARVIS generating script via AI...", type: "info" }]);

    try {
      const system =
        "You are JARVIS. Generate a raw, clean JavaScript code snippet answering the user request. Output ONLY JavaScript code. Do not include markdown wraps (like ```javascript) or comments outside of the code block. Start directly with code.";

      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            { role: "system", content: system },
            { role: "user", content: `Write a Javascript code block to accomplish: ${prompt}` },
          ],
          private: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        let content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          content = content.replace(/^```javascript\n/, "").replace(/^```js\n/, "").replace(/```$/, "");
          setCode(content);
          setLogs([{ text: "✓ Script generated successfully.", type: "info" }]);
          setIsLoading(false);
          return;
        }
      }
    } catch (e: any) {
      console.warn("AI generation failed:", e);
    }
    setIsLoading(false);
    setLogs([{ text: "✗ AI generation failed. Offline matrix state active.", type: "error" }]);
  };

  return (
    <div className="lab-container">
      <div className="lab-toolbar">
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="js">JavaScript</option>
          <option value="py">Python (sim)</option>
        </select>
        <button className="chat-btn" style={{ color: "#ffc837" }} onClick={executeCode}>
          ▶ EXECUTE
        </button>
        <button className="chat-btn" onClick={handleAIGenerate} disabled={isLoading}>
          ⌬ AI: Generate
        </button>
        <button
          className="chat-btn"
          onClick={() => {
            setCode("");
            setLogs([{ text: "Awaiting execution...", type: "info" }]);
          }}
        >
          Clear
        </button>
        <span style={{ marginLeft: "auto", fontSize: "9px", opacity: 0.5, fontStyle: "italic" }}>
          // SANDBOX HOST
        </span>
      </div>

      <div className="lab-main">
        <textarea
          className="lab-editor"
          spellCheck="false"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="lab-output">
          <div className="label">// OUTPUT</div>
          {logs.map((log, idx) => (
            <div key={idx} className={log.type}>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
