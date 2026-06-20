"use client";

import { useEffect, useRef } from "react";

/*
  FooterWordmark — a giant "M STUDIO" the swell reveals through.

  A 2D canvas draws a moving accent glow, then clips it to the letterforms
  (destination-in). Fills the footer's dead middle as a signature next to
  BUILT TRUE. Accent-aware, reduced-motion → static ghost, pauses offscreen.
*/

function parse(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [22, 163, 148];
  const n = parseInt(m[1], 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}

export default function FooterWordmark({
  accentVar = "--color-signal",
  text = "M STUDIO",
  className = "",
}: {
  accentVar?: string;
  text?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(devicePixelRatio || 1, 2);

    let rgb: [number, number, number] = [22, 163, 148];
    const readAccent = () => { rgb = parse(getComputedStyle(cv).getPropertyValue(accentVar)); };
    readAccent();
    window.addEventListener("accentchange", readAccent);
    const at = setInterval(readAccent, 1500);

    let w = 0, h = 0;
    const fit = () => {
      const r = cv.getBoundingClientRect();
      w = Math.max(2, Math.floor(r.width * DPR));
      h = Math.max(2, Math.floor(r.height * DPR));
      cv.width = w; cv.height = h;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(cv);
    let vis = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0 });
    io.observe(cv);

    const rgba = (a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
    const liteA = (a: number) => `rgba(${rgb[0] + (255 - rgb[0]) * 0.55},${rgb[1] + (255 - rgb[1]) * 0.55},${rgb[2] + (255 - rgb[2]) * 0.55},${a})`;

    const drawText = () => {
      const fs = Math.min(150 * DPR, w / 5.5);
      ctx.font = `800 ${fs}px Arial, sans-serif`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      const tracking = fs * 0.1;
      const chars = [...text];
      const widths = chars.map((c) => ctx.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
      let x = w / 2 - total / 2;
      for (let i = 0; i < chars.length; i++) {
        ctx.fillText(chars[i], x, h / 2);
        x += widths[i] + tracking;
      }
    };

    const render = (ms: number) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      // faint base so glyphs have body
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(0, 0, w, h);
      // moving accent glow (additive)
      ctx.globalCompositeOperation = "lighter";
      const cx = w * (0.5 + 0.34 * Math.sin(ms * 0.0003));
      const cy = h * (0.5 + 0.45 * Math.cos(ms * 0.00041));
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.55);
      g1.addColorStop(0, rgba(0.55)); g1.addColorStop(1, rgba(0));
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
      const cx2 = w * (0.5 + 0.3 * Math.cos(ms * 0.00037));
      const g2 = ctx.createRadialGradient(cx2, h * 0.4, 0, cx2, h * 0.4, w * 0.45);
      g2.addColorStop(0, liteA(0.5)); g2.addColorStop(1, rgba(0));
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
      // clip everything to the letterforms
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "#fff";
      drawText();
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!vis || document.hidden) return;
      render(reduce ? 4000 : now - t0);
      if (reduce) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(at);
      window.removeEventListener("accentchange", readAccent);
      ro.disconnect();
      io.disconnect();
    };
  }, [accentVar, text]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", display: "block" }}
    />
  );
}
