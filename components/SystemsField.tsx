"use client";

import { useEffect, useRef } from "react";

/*
  Systems Field — a calm, interactive "connected systems" background.

  A slow constellation of nodes linked by hairline edges, with small signal
  "pulses" that travel from node to node along the graph — like jobs moving
  through an automation. Reads as workflows / systems / connection rather than
  decoration, and stays dark + quiet so overlaid text is highly readable.

  Canvas 2D, no dependencies. DPR-capped, pauses off-screen, honors
  prefers-reduced-motion (draws a single still frame). On-brand ion-blue.
*/

const SIGNAL = "37, 99, 235"; // --color-signal (#2563eb) as rgb
const SIGNAL_LIGHT = "138, 169, 255"; // lighter ion blue for pulses

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { from: number; to: number; p: number; speed: number; life: number };

export default function SystemsField({
  className = "",
  density = 1,
}: {
  className?: string;
  /** Multiplier on node count — lower is sparser/calmer. */
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const densityRef = useRef(density);
  densityRef.current = density;

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
    let raf = 0;
    let running = true;

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    const LINK_DIST = 150; // px — connect nodes closer than this
    const mouse = { x: -9999, y: -9999, active: false };

    const build = () => {
      // Node count scales with area, capped for calm + perf.
      const target = Math.round(
        Math.min(78, Math.max(26, (width * height) / 24000)) *
          densityRef.current,
      );
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1.1 + Math.random() * 1.6,
      }));
      pulses = [];
    };

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth ?? window.innerWidth;
      height = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    // Neighbors of a node within LINK_DIST (used to route pulses along edges).
    const neighbors = (i: number, exclude = -1) => {
      const a = nodes[i];
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i || j === exclude) continue;
        const dx = nodes[j].x - a.x;
        const dy = nodes[j].y - a.y;
        if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) out.push(j);
      }
      return out;
    };

    const spawnPulse = () => {
      if (nodes.length < 2) return;
      const from = (Math.random() * nodes.length) | 0;
      const ns = neighbors(from);
      if (!ns.length) return;
      const to = ns[(Math.random() * ns.length) | 0];
      pulses.push({
        from,
        to,
        p: 0,
        speed: 0.006 + Math.random() * 0.006, // calm travel
        life: 0,
      });
    };

    let lastSpawn = 0;
    const MAX_PULSES = 7;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Move nodes slowly; wrap softly at the edges.
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // Edges — opacity falls off with distance; brighten near the cursor.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const d = Math.sqrt(d2);
          let alpha = (1 - d / LINK_DIST) * 0.18;

          if (mouse.active) {
            const mx = (a.x + b.x) / 2 - mouse.x;
            const my = (a.y + b.y) / 2 - mouse.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < 160) alpha += (1 - md / 160) * 0.22;
          }

          ctx.strokeStyle = `rgba(${SIGNAL}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes — soft dots, a touch brighter near the cursor.
      for (const n of nodes) {
        let glow = 0.5;
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const md = Math.sqrt(dx * dx + dy * dy);
          if (md < 160) glow += (1 - md / 160) * 0.5;
        }
        ctx.fillStyle = `rgba(${SIGNAL_LIGHT}, ${0.35 + glow * 0.35})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Signal pulses — travel an edge, then hop to a neighbor (data flowing).
      if (!reduced && now - lastSpawn > 520 && pulses.length < MAX_PULSES) {
        spawnPulse();
        lastSpawn = now;
      }

      const next: Pulse[] = [];
      for (const pu of pulses) {
        const a = nodes[pu.from];
        const b = nodes[pu.to];
        if (!a || !b) continue;
        pu.p += pu.speed;
        pu.life += 1;

        if (pu.p >= 1) {
          // Arrived — flash the node, then continue to a fresh neighbor.
          ctx.fillStyle = `rgba(${SIGNAL_LIGHT}, 0.9)`;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 3.2, 0, Math.PI * 2);
          ctx.fill();

          const ns = neighbors(pu.to, pu.from);
          if (ns.length && pu.life < 600 && Math.random() < 0.86) {
            next.push({
              from: pu.to,
              to: ns[(Math.random() * ns.length) | 0],
              p: 0,
              speed: pu.speed,
              life: pu.life,
            });
          }
          continue;
        }

        const x = a.x + (b.x - a.x) * pu.p;
        const y = a.y + (b.y - a.y) * pu.p;

        // Comet trail.
        const tx = a.x + (b.x - a.x) * Math.max(0, pu.p - 0.12);
        const ty = a.y + (b.y - a.y) * Math.max(0, pu.p - 0.12);
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, `rgba(${SIGNAL_LIGHT}, 0)`);
        grad.addColorStop(1, `rgba(${SIGNAL_LIGHT}, 0.9)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 255, 255, 0.95)`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        next.push(pu);
      }
      pulses = next;

      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active =
        mouse.x >= 0 &&
        mouse.y >= 0 &&
        mouse.x <= rect.width &&
        mouse.y <= rect.height;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduced) raf = requestAnimationFrame(draw);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    if (reduced) {
      // Seed a few static pulses so the still frame still reads as a system.
      for (let i = 0; i < 4; i++) spawnPulse();
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  );
}
