"use client";

import { useEffect, useRef } from "react";

/*
  Structured grid hero background. A faint engineering grid with accent-colored
  "data pulses" travelling along the lines — reads as systems/automation without
  being busy. GPU-light: a single 2D canvas, capped pulse count, dpr-aware,
  pauses off-screen, honors prefers-reduced-motion.

  Accent-aware: reads --color-signal from CSS and re-reads on the custom
  "accentchange" event, so the preview AccentSwitcher updates it live.
*/

type Pulse = {
  axis: "h" | "v";
  idx: number; // grid line index
  pos: number; // 0..1 along the line
  speed: number;
  len: number; // trail length as fraction of the line
};

const GRID = 54;

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let pulses: Pulse[] = [];
    let raf = 0;
    let running = true;
    let accent = "#3b8cff";

    const readAccent = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-signal")
        .trim();
      if (v) accent = v;
    };

    const spawn = (): Pulse => {
      const axis: "h" | "v" = Math.random() < 0.5 ? "h" : "v";
      const idx =
        axis === "h"
          ? Math.floor(Math.random() * (rows + 1))
          : Math.floor(Math.random() * (cols + 1));
      return {
        axis,
        idx,
        pos: Math.random(),
        speed: 0.0022 + Math.random() * 0.004,
        len: 0.08 + Math.random() * 0.13,
      };
    };

    const seed = () => {
      const count = Math.min(16, Math.max(6, Math.floor((width * height) / 80000)));
      pulses = Array.from({ length: count }, spawn);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / GRID);
      rows = Math.ceil(height / GRID);
      seed();
    };

    const drawGrid = () => {
      ctx.strokeStyle = "rgba(24,24,27,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) {
        ctx.moveTo(x * GRID + 0.5, 0);
        ctx.lineTo(x * GRID + 0.5, height);
      }
      for (let y = 0; y <= rows; y++) {
        ctx.moveTo(0, y * GRID + 0.5);
        ctx.lineTo(width, y * GRID + 0.5);
      }
      ctx.stroke();
    };

    const drawPulse = (p: Pulse) => {
      const isH = p.axis === "h";
      const lineLen = isH ? width : height;
      const headPx = p.pos * lineLen;
      const tailPx = (p.pos - p.len) * lineLen;
      const fixed = p.idx * GRID + 0.5;

      const x0 = isH ? tailPx : fixed;
      const y0 = isH ? fixed : tailPx;
      const x1 = isH ? headPx : fixed;
      const y1 = isH ? fixed : headPx;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, accent);

      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.65;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Bright head node.
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x1, y1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        p.pos += p.speed;
        drawPulse(p);
        if (p.pos - p.len > 1.1) pulses[i] = spawn();
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    readAccent();
    resize();

    if (reduced) {
      // Static grid only.
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      return () => {};
    }

    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    const onAccent = () => readAccent();
    window.addEventListener("resize", onResize);
    window.addEventListener("accentchange", onAccent);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(frame);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("accentchange", onAccent);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
