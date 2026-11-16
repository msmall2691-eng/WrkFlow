"use client";

import { useEffect, useRef } from "react";

/*
  BlueprintCanvas: the moving background of the homepage opening.

  A drafting sheet on near-black (it began as blueprint navy). Line by line, a web page gets drawn on
  it: the browser frame, the nav, the headline, the button, the cards, with
  dimension ticks and small labels the way a real drawing carries them. When
  one sheet is finished it holds, fades, and the next one is drawn (a
  contractor site, a booking app, a quote form), because those are the three
  things the studio actually sells.

  It is the homepage's one orchestrated moment (CLAUDE.md: motion should show
  a system working). Rules it keeps:
    - prefers-reduced-motion draws the finished first sheet once, still.
    - It stops drawing when it is off screen or the tab is hidden.
    - Only the canvas repaints; nothing in the layout moves.
*/

type Shape =
  | { k: "rect"; x: number; y: number; w: number; h: number; hi?: boolean; fill?: boolean }
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; dash?: boolean }
  | { k: "text"; x: number; y: number; t: string; hi?: boolean }
  | { k: "dim"; x1: number; x2: number; y: number; t: string };

// Coordinates are fractions of the sheet (0..1 across, 0..1 down).
const SHEETS: Shape[][] = [
  // 1. A contractor website.
  [
    { k: "rect", x: 0, y: 0, w: 1, h: 1 },
    { k: "line", x1: 0, y1: 0.07, x2: 1, y2: 0.07 },
    { k: "rect", x: 0.04, y: 0.022, w: 0.1, h: 0.026 },
    { k: "line", x1: 0.6, y1: 0.035, x2: 0.66, y2: 0.035 },
    { k: "line", x1: 0.69, y1: 0.035, x2: 0.75, y2: 0.035 },
    { k: "rect", x: 0.84, y: 0.018, w: 0.12, h: 0.034, hi: true },
    { k: "rect", x: 0.04, y: 0.12, w: 0.92, h: 0.36, fill: true },
    { k: "line", x1: 0.08, y1: 0.22, x2: 0.5, y2: 0.22 },
    { k: "line", x1: 0.08, y1: 0.27, x2: 0.42, y2: 0.27 },
    { k: "line", x1: 0.08, y1: 0.32, x2: 0.3, y2: 0.32, dash: true },
    { k: "rect", x: 0.08, y: 0.38, w: 0.16, h: 0.05, hi: true },
    { k: "text", x: 0.08, y: 0.17, t: "HERO · H1" },
    { k: "text", x: 0.26, y: 0.415, t: "REQUEST A QUOTE", hi: true },
    { k: "rect", x: 0.04, y: 0.53, w: 0.28, h: 0.24 },
    { k: "rect", x: 0.36, y: 0.53, w: 0.28, h: 0.24 },
    { k: "rect", x: 0.68, y: 0.53, w: 0.28, h: 0.24 },
    { k: "text", x: 0.06, y: 0.81, t: "ROOFING" },
    { k: "text", x: 0.38, y: 0.81, t: "SIDING" },
    { k: "text", x: 0.7, y: 0.81, t: "ADDITIONS" },
    { k: "line", x1: 0.04, y1: 0.9, x2: 0.96, y2: 0.9, dash: true },
    { k: "dim", x1: 0, x2: 1, y: 1.05, t: "1440" },
  ],
  // 2. A booking app.
  [
    { k: "rect", x: 0, y: 0, w: 1, h: 1 },
    { k: "rect", x: 0, y: 0, w: 0.2, h: 1, fill: true },
    { k: "line", x1: 0.03, y1: 0.08, x2: 0.15, y2: 0.08 },
    { k: "line", x1: 0.03, y1: 0.16, x2: 0.13, y2: 0.16 },
    { k: "line", x1: 0.03, y1: 0.22, x2: 0.14, y2: 0.22 },
    { k: "line", x1: 0.03, y1: 0.28, x2: 0.12, y2: 0.28 },
    { k: "text", x: 0.25, y: 0.08, t: "SCHEDULE · THIS WEEK" },
    { k: "line", x1: 0.24, y1: 0.12, x2: 0.97, y2: 0.12 },
    { k: "line", x1: 0.385, y1: 0.12, x2: 0.385, y2: 0.95, dash: true },
    { k: "line", x1: 0.53, y1: 0.12, x2: 0.53, y2: 0.95, dash: true },
    { k: "line", x1: 0.675, y1: 0.12, x2: 0.675, y2: 0.95, dash: true },
    { k: "line", x1: 0.82, y1: 0.12, x2: 0.82, y2: 0.95, dash: true },
    { k: "rect", x: 0.25, y: 0.18, w: 0.12, h: 0.14, fill: true },
    { k: "rect", x: 0.4, y: 0.36, w: 0.12, h: 0.2, hi: true },
    { k: "rect", x: 0.545, y: 0.2, w: 0.12, h: 0.12, fill: true },
    { k: "rect", x: 0.69, y: 0.5, w: 0.12, h: 0.18, fill: true },
    { k: "rect", x: 0.835, y: 0.28, w: 0.12, h: 0.14 },
    { k: "text", x: 0.405, y: 0.6, t: "BOOKED", hi: true },
    { k: "dim", x1: 0.24, x2: 0.97, y: 1.05, t: "5 DAYS" },
  ],
  // 3. A quote form.
  [
    { k: "rect", x: 0.18, y: 0, w: 0.64, h: 1 },
    { k: "text", x: 0.22, y: 0.08, t: "INSTANT QUOTE" },
    { k: "line", x1: 0.22, y1: 0.14, x2: 0.62, y2: 0.14 },
    { k: "rect", x: 0.22, y: 0.2, w: 0.17, h: 0.09, hi: true },
    { k: "rect", x: 0.415, y: 0.2, w: 0.17, h: 0.09 },
    { k: "rect", x: 0.61, y: 0.2, w: 0.17, h: 0.09 },
    { k: "text", x: 0.235, y: 0.33, t: "REPAIR" },
    { k: "line", x1: 0.22, y1: 0.42, x2: 0.78, y2: 0.42 },
    { k: "rect", x: 0.48, y: 0.405, w: 0.03, h: 0.03, hi: true },
    { k: "text", x: 0.22, y: 0.39, t: "SQUARES" },
    { k: "rect", x: 0.22, y: 0.5, w: 0.56, h: 0.18, fill: true },
    { k: "line", x1: 0.26, y1: 0.58, x2: 0.56, y2: 0.58 },
    { k: "text", x: 0.26, y: 0.545, t: "ESTIMATE" },
    { k: "rect", x: 0.22, y: 0.76, w: 0.56, h: 0.08, hi: true },
    { k: "text", x: 0.39, y: 0.81, t: "SEND MY QUOTE", hi: true },
    { k: "dim", x1: 0.18, x2: 0.82, y: 1.05, t: "PLUG-IN" },
  ],
];

const PRINT = "237, 235, 230"; // --bp-paper: the lines
const HI = "0, 224, 255"; // --bp-cyan: the one accent

export default function BlueprintCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let start = performance.now();

    const DRAW = 4200;
    const HOLD = 2600;
    const FADE = 700;
    const CYCLE = DRAW + HOLD + FADE;

    function resize() {
      const r = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sheetRect() {
      // Right-hand side on wide screens, so the wordmark bottom-left stays clear.
      if (w >= 1024) {
        // Kept above the h1 block in the lower right: never taller than 44% of
        // the screen, whatever the width.
        const sh = Math.min(h * 0.44, Math.min(w * 0.5, 760) * 0.66);
        const sw = sh / 0.66;
        return { x: w - sw - w * 0.06, y: h * 0.13, w: sw, h: sh };
      }
      // Phones: a fainter sheet behind the text (see `faint` below), under the log.
      const sw = w * 0.86;
      return { x: w * 0.07, y: Math.max(170, h * 0.22), w: sw, h: sw * 0.7 };
    }

    function grid() {
      ctx!.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx!.strokeStyle = x % 120 === 0 ? `rgba(${PRINT},0.05)` : `rgba(${PRINT},0.018)`;
        ctx!.beginPath();
        ctx!.moveTo(x + 0.5, 0);
        ctx!.lineTo(x + 0.5, h);
        ctx!.stroke();
      }
      for (let y = 0; y < h; y += 24) {
        ctx!.strokeStyle = y % 120 === 0 ? `rgba(${PRINT},0.05)` : `rgba(${PRINT},0.018)`;
        ctx!.beginPath();
        ctx!.moveTo(0, y + 0.5);
        ctx!.lineTo(w, y + 0.5);
        ctx!.stroke();
      }
    }

    function partialPath(points: [number, number][], p: number) {
      // Draw a polyline up to fraction p of its total length.
      let total = 0;
      for (let i = 1; i < points.length; i++) {
        total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      }
      let left = total * p;
      ctx!.beginPath();
      ctx!.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length && left > 0; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        const seg = Math.hypot(bx - ax, by - ay);
        const t = Math.min(1, left / seg);
        ctx!.lineTo(ax + (bx - ax) * t, ay + (by - ay) * t);
        left -= seg;
      }
      ctx!.stroke();
    }

    function drawSheet(shapes: Shape[], progress: number, alpha: number) {
      const s = sheetRect();
      const X = (v: number) => s.x + v * s.w;
      const Y = (v: number) => s.y + v * s.h;
      const n = shapes.length;
      ctx!.font = `500 ${Math.max(9, Math.round(s.w / 70))}px ui-monospace, "JetBrains Mono", monospace`;
      shapes.forEach((sh, i) => {
        // Each shape owns a slice of the drawing time, overlapping its neighbours.
        const a = i / n;
        const b = Math.min(1, (i + 2.2) / n);
        const p = Math.max(0, Math.min(1, (progress - a) / (b - a)));
        if (p <= 0) return;
        const hi = "hi" in sh && sh.hi;
        const rgb = hi ? HI : PRINT;
        ctx!.strokeStyle = `rgba(${rgb},${(hi ? 0.95 : 0.55) * alpha})`;
        ctx!.fillStyle = `rgba(${rgb},${0.85 * alpha})`;
        ctx!.lineWidth = hi ? 1.6 : 1.15;
        ctx!.setLineDash([]);
        if (sh.k === "rect") {
          const x = X(sh.x), y = Y(sh.y), rw = sh.w * s.w, rh = sh.h * s.h;
          if (sh.fill && p >= 1) {
            ctx!.fillStyle = `rgba(${rgb},${0.06 * alpha})`;
            ctx!.fillRect(x, y, rw, rh);
          }
          if (hi && p >= 1) {
            ctx!.fillStyle = `rgba(${rgb},${0.14 * alpha})`;
            ctx!.fillRect(x, y, rw, rh);
          }
          partialPath([[x, y], [x + rw, y], [x + rw, y + rh], [x, y + rh], [x, y]], p);
        } else if (sh.k === "line") {
          if (sh.dash) ctx!.setLineDash([5, 5]);
          partialPath([[X(sh.x1), Y(sh.y1)], [X(sh.x2), Y(sh.y2)]], p);
        } else if (sh.k === "text") {
          ctx!.globalAlpha = p * alpha * (hi ? 1 : 0.75);
          ctx!.fillText(sh.t, X(sh.x), Y(sh.y));
          ctx!.globalAlpha = 1;
        } else if (sh.k === "dim") {
          const y = Y(sh.y);
          ctx!.strokeStyle = `rgba(${PRINT},${0.5 * alpha})`;
          partialPath([[X(sh.x1), y], [X(sh.x2), y]], p);
          ctx!.beginPath();
          ctx!.moveTo(X(sh.x1), y - 6);
          ctx!.lineTo(X(sh.x1), y + 6);
          ctx!.moveTo(X(sh.x2), y - 6);
          ctx!.lineTo(X(sh.x2), y + 6);
          ctx!.stroke();
          ctx!.globalAlpha = p * alpha * 0.7;
          const tw = ctx!.measureText(sh.t).width;
          ctx!.fillStyle = `rgba(${PRINT},1)`;
          ctx!.fillText(sh.t, (X(sh.x1) + X(sh.x2)) / 2 - tw / 2, y - 8);
          ctx!.globalAlpha = 1;
        }
      });
    }

    function frame(now: number) {
      const t = now - start;
      const cycle = Math.floor(t / CYCLE);
      const inCycle = t % CYCLE;
      const sheet = SHEETS[cycle % SHEETS.length];
      const progress = Math.min(1, inCycle / DRAW);
      const eased = 1 - Math.pow(1 - progress, 2);
      const alpha = inCycle > DRAW + HOLD ? 1 - (inCycle - DRAW - HOLD) / FADE : 1;
      ctx!.clearRect(0, 0, w, h);
      grid();
      drawSheet(sheet, eased, Math.max(0, alpha) * (w < 1024 ? 0.45 : 1));
      if (visible) raf = requestAnimationFrame(frame);
    }

    function still() {
      ctx!.clearRect(0, 0, w, h);
      grid();
      drawSheet(SHEETS[0], 1, w < 1024 ? 0.45 : 1);
    }

    resize();
    if (reduce) {
      still();
    } else {
      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) still();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && document.visibilityState === "visible";
      if (!reduce && visible && !was) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    function onVis() {
      const was = visible;
      visible = document.visibilityState === "visible";
      if (!reduce && visible && !was) {
        start = performance.now() - DRAW; // resume on a finished sheet, not mid-line
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
