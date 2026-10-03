"use client";

import React, { useEffect, useRef } from "react";

interface VoiceWaveformProps {
  active: boolean;
  waveformData?: Uint8Array | null;
  color?: string;
  barsCount?: number;
}

export default function VoiceWaveform({
  active,
  waveformData,
  color = "#63E8FF",
  barsCount = 16,
}: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = Math.floor(width / barsCount) - 2;

    for (let i = 0; i < barsCount; i++) {
      let barHeight = 4; // Baseline idle height

      if (active) {
        if (waveformData && waveformData.length > 0) {
          const sampleIndex = Math.floor((i / barsCount) * waveformData.length);
          const val = waveformData[sampleIndex] || 0;
          barHeight = Math.max(4, (val / 255) * height);
        } else {
          // Subtle synthetic undulating wave if raw audio data not hooked
          const t = Date.now() / 250;
          barHeight = Math.max(4, Math.sin(t + i * 0.4) * (height / 2.5) + height / 2.5);
        }
      }

      const x = i * (barWidth + 2);
      const y = (height - barHeight) / 2;

      ctx.fillStyle = active ? color : "rgba(99, 232, 255, 0.25)";
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }, [active, waveformData, color, barsCount]);

  return (
    <canvas
      ref={canvasRef}
      width={72}
      height={20}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        opacity: active ? 1 : 0.4,
        transition: "opacity 0.2s ease",
      }}
    />
  );
}
