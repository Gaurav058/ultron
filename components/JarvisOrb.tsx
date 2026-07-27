"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createOrbScene, type OrbSceneApi } from "@/lib/orbScene";
import { HandTracker, type TrackerStatus } from "@/lib/handTracker";
import WindowManager from "./WindowManager";
import ModuleNexus from "./ModuleNexus";
import ModuleLab from "./ModuleLab";
import ModuleOracle from "./ModuleOracle";

type CameraState = "off" | "starting" | "on" | "error";

const MODE_LABEL: Record<TrackerStatus["mode"], string> = {
  idle: "STANDBY",
  spin: "SPIN",
  zoom: "ZOOM",
};

interface FeedItem {
  ts: string;
  tag: string;
  text: string;
  isWarn?: boolean;
}

export default function JarvisOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<OrbSceneApi | null>(null);
  const trackerRef = useRef<HandTracker | null>(null);
  const recognitionRef = useRef<any>(null);

  const [camera, setCamera] = useState<CameraState>("off");
  const [status, setStatus] = useState<TrackerStatus>({ hands: 0, mode: "idle" });
  const [error, setError] = useState<string | null>(null);
  const [theme, setThemeState] = useState<"ultron" | "jarvis">("ultron");
  const [activeGesture, setActiveGesture] = useState<string>("STANDBY");

  // Voice Assistant States
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("OFF");
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // Sub-Windows state
  const [windows, setWindows] = useState({
    nexus: { isOpen: false, zIndex: 30 },
    lab: { isOpen: false, zIndex: 28 },
    oracle: { isOpen: false, zIndex: 26 },
  });

  // System Vitals State
  const [vitals, setVitals] = useState({ cpu: 42, mem: 61, power: 98.4, uptime: "00:00:00" });

  // Geo Lock Coordinates State (for voice atmospheric fetches)
  const [geo, setGeo] = useState({ latitude: 40.7128, longitude: -74.006 });

  // Live Feed alert logs
  const [feed, setFeed] = useState<FeedItem[]>([
    { ts: "15:42:08", tag: "SYS", text: "Neural cores synchronized." },
    { ts: "15:42:11", tag: "NET", text: "Quantum uplink stable." },
    { ts: "15:42:14", tag: "SEC", text: "Two anomalies dispatched.", isWarn: true },
    { ts: "15:42:18", tag: "AI", text: "4 agents idle, 1 active." },
  ]);

  // Window Focus Helpers
  const focusWindow = (id: "nexus" | "lab" | "oracle") => {
    setWindows((prev) => {
      const rest = { nexus: prev.nexus.zIndex, lab: prev.lab.zIndex, oracle: prev.oracle.zIndex };
      const sortedIds = Object.keys(rest).filter((k) => k !== id) as ("nexus" | "lab" | "oracle")[];
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: 32 },
        [sortedIds[0]]: { ...prev[sortedIds[0]], zIndex: 28 },
        [sortedIds[1]]: { ...prev[sortedIds[1]], zIndex: 26 },
      };
    });
  };

  const openWindow = (id: "nexus" | "lab" | "oracle") => {
    setWindows((prev) => ({
      ...prev,
      [id]: { isOpen: true, zIndex: 32 },
    }));
    focusWindow(id);
  };

  const closeWindow = (id: "nexus" | "lab" | "oracle") => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  };

  const anyWindowOpen = windows.nexus.isOpen || windows.lab.isOpen || windows.oracle.isOpen;

  // Speech Synthesizer Output: Rebranded for ULTRON
  const speakSynthesis = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang.startsWith("en-GB") || v.name.includes("UK English")) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 0.88; // Slightly lower voice pitch for Ultron
    utterance.rate = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  // voice assistant command actions routing
  const routeVoiceCommand = async (text: string) => {
    const t = text.toLowerCase().trim();
    if (!t) return;
    setVoiceTranscript(`"${text}"`);

    // Weather Command
    if (/weather|temperature|forecast|outside/.test(t)) {
      speakSynthesis("Analyzing atmosphere profiles, sir.");
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current_weather=true`
        );
        if (res.ok) {
          const d = await res.json();
          const temp = Math.round(d.current_weather.temperature);
          speakSynthesis(
            `Currently ${temp} degrees Celsius, with winds at ${Math.round(d.current_weather.windspeed)} kilometers per hour, sir.`
          );
        }
      } catch {
        speakSynthesis("Weather uplink degraded, sir.");
      }
      return;
    }

    // Crypto Command
    if (/bitcoin|btc|ethereum|eth|crypto/.test(t)) {
      speakSynthesis("Querying financial arrays.");
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd");
        if (res.ok) {
          const d = await res.json();
          speakSynthesis(
            `Bitcoin holds at ${Math.round(d.bitcoin.usd).toLocaleString()} dollars. Ethereum occupies ${Math.round(d.ethereum.usd).toLocaleString()} dollars, sir.`
          );
        }
      } catch {
        speakSynthesis("Market index arrays offline.");
      }
      return;
    }

    // Window Launch Commands
    if (/oracle|world|intel|global/.test(t)) {
      openWindow("oracle");
      speakSynthesis("Oracle global dashboard online, sir.");
      return;
    }
    if (/chat|nexus|conversation/.test(t)) {
      openWindow("nexus");
      speakSynthesis("Nexus chat connection active.");
      return;
    }
    if (/code|lab|editor|sandbox/.test(t)) {
      openWindow("lab");
      speakSynthesis("Code lab editor compiled.");
      return;
    }
    if (/clear desktop|close all|hide windows/.test(t)) {
      closeWindow("nexus");
      closeWindow("lab");
      closeWindow("oracle");
      speakSynthesis("Modules suspended. Desktop cleared.");
      return;
    }

    // diagnostic vitals readouts
    if (/system|status|diagnostic|health|vitals/.test(t)) {
      speakSynthesis(
        `System report: core CPU at ${vitals.cpu} percent. Quantum memory at ${vitals.mem} percent. Reactor reserves nominal, sir.`
      );
      return;
    }

    // Identity / greetings - Rebranded to ULTRON
    if (/who are you|introduce yourself|your name/.test(t)) {
      speakSynthesis("I am ULTRON. A state-of-the-art WebGL diagnostic reactor and gesture recognition matrix, sir.");
      return;
    }
    if (/hello|hi|hey|sup/.test(t)) {
      speakSynthesis("Greetings, sir. ULTRON online. Active and listening.");
      return;
    }
    if (/thank you|thanks/.test(t)) {
      speakSynthesis("Always a pleasure, sir.");
      return;
    }

    // General fallback to live Pollinations synthesis model
    speakSynthesis("Analyzing query matrix, sir.");
    setVoiceStatus("PROCESSING...");
    try {
      const sysPrompt =
        "You are ULTRON, a highly sophisticated, British-witted AI assistant inspired by Tony Stark technology, but named ULTRON. Answer concisely in 1-2 sentences. Address the user as 'sir'.";
      const res = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(text)}?system=${encodeURIComponent(sysPrompt)}`
      );
      if (res.ok) {
        const replyText = (await res.text()).trim();
        setVoiceStatus("LISTENING");
        speakSynthesis(replyText);
      }
    } catch {
      setVoiceStatus("LISTENING");
      speakSynthesis("Uplink degradation. Request timeout, sir.");
    }
  };

  // Speech Recognition Start
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser, sir.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    let isArmed = false;
    let armTimeout: any = null;

    rec.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const trans = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += trans;
        else interim += trans;
      }

      const text = (final || interim).toLowerCase().trim();
      setVoiceTranscript(final || interim || "Listening...");

      // Listen for ULTRON wake word
      if (text.includes("ultron")) {
        const idx = text.indexOf("ultron");
        const cmdAfter = text.substring(idx + 6).trim();

        if (cmdAfter) {
          if (e.results[e.results.length - 1].isFinal) {
            void routeVoiceCommand(cmdAfter);
          }
        } else {
          isArmed = true;
          setVoiceStatus("ARMED (SAY COMMAND)");
          if (armTimeout) clearTimeout(armTimeout);
          armTimeout = setTimeout(() => {
            isArmed = false;
            setVoiceStatus("LISTENING");
          }, 6000);
        }
      } else if (isArmed && e.results[e.results.length - 1].isFinal) {
        void routeVoiceCommand(text);
        isArmed = false;
        setVoiceStatus("LISTENING");
        if (armTimeout) clearTimeout(armTimeout);
      }
    };

    rec.onerror = (err: any) => {
      console.warn("Speech recognition error:", err.error);
    };

    rec.onend = () => {
      if (recognitionRef.current === rec) {
        try {
          rec.start();
        } catch {}
      }
    };

    recognitionRef.current = rec;
    rec.start();
    setVoiceEnabled(true);
    setVoiceStatus("LISTENING");
    setVoiceTranscript('Say "ULTRON" or "ULTRON [command]"...');
    speakSynthesis("Voice interface online. Ready for command input, sir.");
  };

  // Speech Recognition Stop
  const stopVoice = () => {
    setVoiceEnabled(false);
    setVoiceStatus("OFF");
    setVoiceTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    speakSynthesis("Voice interface disengaged.");
  };

  const toggleVoice = () => {
    if (voiceEnabled) stopVoice();
    else startVoice();
  };

  // Fetch coordinates on mount to support local weather functions
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeo({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        () => {}
      );
    }
  }, []);

  // System Vitals drift calculations
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const s = String(elapsed % 60).padStart(2, "0");

      setVitals((prev) => ({
        cpu: Math.min(99, Math.max(10, prev.cpu + Math.floor(Math.random() * 11) - 5)),
        mem: Math.min(95, Math.max(30, prev.mem + Math.floor(Math.random() * 7) - 3)),
        power: parseFloat((97.0 + Math.random() * 2.5).toFixed(1)),
        uptime: `${h}:${m}:${s}`,
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Feed logs creation
  useEffect(() => {
    const feedTemplates = [
      { tag: "SYS", text: "Neural core re-balanced." },
      { tag: "NET", text: "Bandwidth surge: 47Gbps" },
      { tag: "AI", text: "Pattern detected in user behavior." },
      { tag: "SEC", text: "Intrusion attempt blocked from firewall.", isWarn: true },
      { tag: "AI", text: "Knowledge graph expanded with 1,427 nodes." },
      { tag: "SYS", text: "Backup complete: 4.2TB archived." },
      { tag: "NET", text: "Satellite link re-established." },
      { tag: "SEC", text: "Anomaly resolved in subsystem γ.", isWarn: true },
      { tag: "AI", text: "Agent FORGE-03 completed task chain." },
      { tag: "SYS", text: "Coolant levels nominal." },
    ];

    const interval = setInterval(() => {
      const template = feedTemplates[Math.floor(Math.random() * feedTemplates.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      setFeed((prev) => [
        { ts: timeStr, tag: template.tag, text: template.text, isWarn: template.isWarn },
        ...prev.slice(0, 4),
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // background particle animation loop
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const localParticles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 75; i++) {
      localParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.4,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      localParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = theme === "ultron"
          ? `rgba(255, 170, 0, ${0.15 + p.r / 6})`
          : `rgba(0, 229, 255, ${0.15 + p.r / 6})`;
        ctx.fill();
      });

      for (let i = 0; i < localParticles.length; i++) {
        for (let j = i + 1; j < localParticles.length; j++) {
          const dx = localParticles[i].x - localParticles[j].x;
          const dy = localParticles[i].y - localParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(localParticles[i].x, localParticles[i].y);
            ctx.lineTo(localParticles[j].x, localParticles[j].y);
            ctx.strokeStyle = theme === "ultron"
              ? `rgba(255, 170, 0, ${0.07 * (1 - dist / 110)})`
              : `rgba(0, 229, 255, ${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  // WebGL Orb Core Loader
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = createOrbScene(container);
    sceneRef.current = scene;
    return () => {
      trackerRef.current?.stop();
      trackerRef.current = null;
      scene.dispose();
      sceneRef.current = null;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "ultron" ? "jarvis" : "ultron";
      if (next === "jarvis") {
        document.body.classList.add("theme-jarvis");
      } else {
        document.body.classList.remove("theme-jarvis");
      }
      sceneRef.current?.setTheme(next);
      trackerRef.current?.setThemeColor(next);
      return next;
    });
  }, []);

  const stopGestures = useCallback(() => {
    trackerRef.current?.stop();
    trackerRef.current = null;
    setCamera("off");
    setStatus({ hands: 0, mode: "idle" });
    setActiveGesture("STANDBY");
    sceneRef.current?.setEnergySurge(false);
    sceneRef.current?.setCursor(0, 0, false);
  }, []);

  const startGestures = useCallback(async () => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay || trackerRef.current) return;

    setCamera("starting");
    setError(null);

    const tracker = new HandTracker(video, overlay, {
      onRotate: (dt, dp) => sceneRef.current?.rotateBy(dt, dp),
      onZoom: (factor) => sceneRef.current?.zoomBy(factor),
      onStatus: setStatus,
      onGesture: (gesture) => {
        setActiveGesture(gesture.toUpperCase().replace("_", " "));

        if (gesture === "peace") {
          toggleTheme();
        } else if (gesture === "open_palm") {
          sceneRef.current?.setEnergySurge(true);
        } else if (gesture === "thumbs_up") {
          sceneRef.current?.resetView();
        } else {
          sceneRef.current?.setEnergySurge(false);
        }
      },
      onPointerMove: (x, y, active) => {
        sceneRef.current?.setCursor(x, y, active);
      },
    });
    trackerRef.current = tracker;
    tracker.setThemeColor(theme);

    try {
      await tracker.start();
      setCamera("on");
    } catch (err) {
      trackerRef.current = null;
      tracker.stop();
      setCamera("error");
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "CAMERA ACCESS DENIED"
          : "TRACKING INIT FAILED",
      );
    }
  }, [theme, toggleTheme]);

  const toggleGestures = useCallback(() => {
    if (trackerRef.current) stopGestures();
    else void startGestures();
  }, [startGestures, stopGestures]);

  // keydown listeners
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case "+":
        case "=":
          sceneRef.current?.zoomIn();
          break;
        case "-":
        case "_":
          sceneRef.current?.zoomOut();
          break;
        case "r":
        case "R":
          sceneRef.current?.resetView();
          break;
        case "g":
        case "G":
          toggleGestures();
          break;
        case "t":
        case "T":
          toggleTheme();
          break;
        case "v":
        case "V":
          toggleVoice();
          break;
        case "Escape":
          closeWindow("nexus");
          closeWindow("lab");
          closeWindow("oracle");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleGestures, toggleTheme, voiceEnabled]);

  const cameraOn = camera === "on";

  return (
    <>
      <canvas
        ref={particlesCanvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div ref={containerRef} className={`orb-root${anyWindowOpen ? " dim" : ""}`} />

      <div className="overlay-vignette" />
      <div className="overlay-grain" />
      <div className="overlay-scanlines" />

      {/* Dock Controls */}
      <div className="dock">
        <button
          className={`dock-btn${windows.nexus.isOpen ? " active" : ""}`}
          onClick={() => (windows.nexus.isOpen ? closeWindow("nexus") : openWindow("nexus"))}
          title="NEXUS CHAT"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="tooltip">NEXUS // CHAT</span>
        </button>

        <button
          className={`dock-btn${windows.oracle.isOpen ? " active" : ""}`}
          onClick={() => (windows.oracle.isOpen ? closeWindow("oracle") : openWindow("oracle"))}
          title="ORACLE DATA FEEDS"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
          </svg>
          <span className="tooltip">ORACLE // LIVE DATA</span>
        </button>

        <button
          className={`dock-btn${windows.lab.isOpen ? " active" : ""}`}
          onClick={() => (windows.lab.isOpen ? closeWindow("lab") : openWindow("lab"))}
          title="CODE LAB"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="tooltip">CODE LAB</span>
        </button>

        <button className="dock-btn" style={{ opacity: 0.3 }} title="FORGE (LOCKED)">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="tooltip">FORGE // LOCKED</span>
        </button>

        <button className="dock-btn" style={{ opacity: 0.3 }} title="VAULT (LOCKED)">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span className="tooltip">VAULT // LOCKED</span>
        </button>
      </div>

      <div className="hud hud-title">U.L.T.R.O.N.</div>

      {/* Workspace Dashboard Widgets */}
      <div className="widget widget-system">
        <h4>// System</h4>
        <div className="vital">
          <span>CPU.NEURAL</span>
          <span className="v">{vitals.cpu}%</span>
        </div>
        <div className="vital-bar">
          <div style={{ width: `${vitals.cpu}%` }} />
        </div>
        <div className="vital">
          <span>MEM.QUANTUM</span>
          <span className="v">{vitals.mem}%</span>
        </div>
        <div className="vital-bar">
          <div style={{ width: `${vitals.mem}%` }} />
        </div>
        <div className="vital">
          <span>UPTIME</span>
          <span className="v">{vitals.uptime}</span>
        </div>
      </div>

      <div className="widget widget-vitals">
        <h4>// Threat Matrix</h4>
        <div className="vital">
          <span>EXTERNAL</span>
          <span className="v" style={{ color: "#00ff66" }}>CLEAR</span>
        </div>
        <div className="vital">
          <span>FIREWALL</span>
          <span className="v" style={{ color: "#00ff66" }}>ACTIVE</span>
        </div>
        <div className="vital">
          <span>ENCRYPTION</span>
          <span className="v" style={{ color: "#00ff66" }}>AES-512</span>
        </div>
        <div className="vital">
          <span>ANOMALIES</span>
          <span className="v" style={{ color: "#ffaa30" }}>2</span>
        </div>
      </div>

      <div className="widget widget-feed">
        <h4>// Live Feed</h4>
        <div style={{ maxHeight: "160px", overflow: "hidden" }}>
          {feed.map((f, idx) => (
            <div key={idx} className="feed-item">
              <span className="ts">[{f.ts}]</span>
              <span className={`tag${f.isWarn ? " warn" : ""}`}>{f.tag}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      <div className="widget widget-cmd">
        <h4>// Quick Command</h4>
        <div style={{ fontSize: "10px", lineHeight: "1.6", opacity: 0.7 }}>
          <div>→ Press <span style={{ color: "var(--color-primary)" }}>[G]</span> Hand gestures</div>
          <div>→ Press <span style={{ color: "var(--color-primary)" }}>[T]</span> Theme toggle</div>
          <div>→ Press <span style={{ color: "var(--color-primary)" }}>[V]</span> Voice assistant</div>
          <div>→ Press <span style={{ color: "var(--color-primary)" }}>[R]</span> Camera reset</div>
          <div>→ Press <span style={{ color: "var(--color-primary)" }}>[ESC]</span> Clear desktop</div>
          <div style={{ marginTop: "6px", borderTop: "1px dashed rgba(var(--color-primary-rgb), 0.2)", paddingTop: "4px" }}>
            * Use Dock indicators to activate sub-modules.
          </div>
        </div>
      </div>

      <div className="hud hud-diagnostics">
        <div>SYSTEM THEME: <span className="value">{theme.toUpperCase()}</span></div>
        <div>COORDINATION: <span className="value">{activeGesture}</span></div>
        {activeGesture === "OPEN PALM" && (
          <div className="surge-warning animate-pulse">ENERGY SURGE DETECTED</div>
        )}
      </div>

      <div className="hud hud-hint">
        <div>
          <span className="key">DRAG</span> spin&nbsp;&nbsp;
          <span className="key">SCROLL</span> zoom
        </div>
        {cameraOn ? (
          <div>
            <span className="key">PINCH</span> spin/zoom&nbsp;&nbsp;
            <span className="key">OPEN PALM</span> energy surge&nbsp;&nbsp;
            <span className="key">INDEX POINT</span> laser target&nbsp;&nbsp;
            <span className="key">PEACE</span> theme toggle&nbsp;&nbsp;
            <span className="key">THUMBS UP</span> camera reset
          </div>
        ) : (
          <div>
            <span className="key">G</span> hand gestures&nbsp;&nbsp;
            <span className="key">T</span> theme toggle&nbsp;&nbsp;
            <span className="key">V</span> voice toggle&nbsp;&nbsp;
            <span className="key">R</span> reset&nbsp;&nbsp;
            <span className="key">+/−</span> zoom
          </div>
        )}
      </div>

      <div className="hud hud-controls">
        <div className={`camera-panel${cameraOn ? " visible" : ""}`}>
          <video ref={videoRef} muted playsInline className="camera-video" />
          <canvas ref={overlayRef} width={416} height={312} className="camera-overlay" />
          <div className="camera-status">
            {status.hands > 0
              ? `${status.hands} HAND${status.hands > 1 ? "S" : ""} · ${MODE_LABEL[status.mode]}`
              : "SHOW HANDS"}
          </div>
        </div>

        {error && <div className="hud-error">{error}</div>}

        <div className="hud-row" style={{ gap: "6px" }}>
          <button
            type="button"
            className="hud-btn"
            aria-pressed={cameraOn}
            onClick={toggleGestures}
            disabled={camera === "starting"}
            style={{ flex: 1 }}
          >
            {camera === "starting" ? "INITIALIZING…" : cameraOn ? "GESTURES ON" : "GESTURES OFF"}
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={toggleVoice}
            style={{
              flex: 1,
              borderColor: voiceEnabled ? "var(--color-hot)" : "",
              color: voiceEnabled ? "var(--color-hot)" : "",
            }}
          >
            {voiceEnabled ? "VOICE: ACTIVE" : "VOICE: OFF"}
          </button>
        </div>
        <div className="hud-row">
          <button type="button" className="hud-btn" onClick={() => sceneRef.current?.zoomIn()} aria-label="Zoom in">
            +
          </button>
          <button type="button" className="hud-btn" onClick={() => sceneRef.current?.zoomOut()} aria-label="Zoom out">
            −
          </button>
          <button type="button" className="hud-btn" onClick={() => sceneRef.current?.resetView()}>
            RESET
          </button>
        </div>
      </div>

      {/* Draggable Windows */}
      <WindowManager
        id="nexus"
        title="NEXUS // CHAT"
        isOpen={windows.nexus.isOpen}
        onClose={() => closeWindow("nexus")}
        zIndex={windows.nexus.zIndex}
        onFocus={() => focusWindow("nexus")}
        defaultX={160}
        defaultY={110}
        defaultWidth={620}
        defaultHeight={480}
      >
        <ModuleNexus />
      </WindowManager>

      <WindowManager
        id="lab"
        title="CODE LAB // EVAL"
        isOpen={windows.lab.isOpen}
        onClose={() => closeWindow("lab")}
        zIndex={windows.lab.zIndex}
        onFocus={() => focusWindow("lab")}
        defaultX={220}
        defaultY={150}
        defaultWidth={640}
        defaultHeight={460}
      >
        <ModuleLab />
      </WindowManager>

      <WindowManager
        id="oracle"
        title="ORACLE // FEEDS"
        isOpen={windows.oracle.isOpen}
        onClose={() => closeWindow("oracle")}
        zIndex={windows.oracle.zIndex}
        onFocus={() => focusWindow("oracle")}
        defaultX={280}
        defaultY={80}
        defaultWidth={640}
        defaultHeight={510}
      >
        <ModuleOracle />
      </WindowManager>

      {/* Voice Assistant HUD Panel */}
      {voiceEnabled && (
        <div className={`voice-hud ${voiceStatus === "PROCESSING..." ? "processing" : "listening"}`}>
          <div className="mic-indicator" />
          <div>
            <div className="status-label">{voiceStatus}</div>
            <div className="transcript-label">{voiceTranscript}</div>
          </div>
        </div>
      )}

      {/* Bottom Ticker */}
      <div className="ticker">
        <div className="label">ULTRON//HUD</div>
        <div className="scroll">
          <div className="scroll-inner">
            <span className="hot">◆ NEURAL CORE:</span>
            <span>Operating at 99.97% stability</span>
            <span className="hot">◆ MARKETS:</span>
            <span>Nasdaq +1.2% • Crypto stable • AI sector holdings +3.8%</span>
            <span className="gold">◆ ALERT:</span>
            <span>Security scan: 0 threats localized</span>
            <span className="hot">◆ SYSTEM POWER:</span>
            <span>Active raw core efficiency at {vitals.power}%</span>
            <span className="hot">◆ TIME DECAY:</span>
            <span>Temporal decay rates nominal. Uptime index online</span>
          </div>
        </div>
      </div>
    </>
  );
}
