"use client";

import { useEffect, useRef } from "react";

/*
  Systems Field — a calm, interactive "connected systems" background.

  A slow constellation of nodes linked by hairline edges, with small signal
  "pulses" that travel from node to node along the graph — like jobs moving
  through an automation. Reads as workflows / systems / connection rather than
  decoration, and stays dark so overlaid text is highly readable.

  Interactive like the chrome: the field swells toward the cursor (a smooth
  lens bulge), a soft hot-spot glows under the pointer, the cursor links to
  nearby nodes, and clicks send expanding ripples that push the network. A
  gentle chromatic shift (blue → indigo → cyan) keeps it alive without noise.

  Canvas 2D, no dependencies. DPR-capped, pauses off-screen, honors
  prefers-reduced-motion (draws a single still frame).
*/

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { from: number; to: number; p: number; speed: number; life: number };
type Ripple = { x: number; y: number; t0: number };

// Subtle chromatic hue (degrees) by position + slow time. Centered on ion blue.
function hueAt(x: number, y: number, t: number) {
  return 222 + Math.sin(x * 0.005 + t * 0.3) * 16 + Math.cos(y * 0.006 - t * 0.2) * 8;
}

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
    const start = performance.now();

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let ripples: Ripple[] = [];
    const LINK_DIST = 150;

    // Smoothed pointer for a weighted, chrome-like feel.
    const mouse = { x: -9999, y: -9999, active: false };
    const sm = { x: -9999, y: -9999 };

    const build = () => {
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
      pulses.push({ from, to, p: 0, speed: 0.006 + Math.random() * 0.006, life: 0 });
    };

    // Render-time displacement: cursor lens bulge + click ripple waves.
    // Base node positions never change, so the graph stays stable — only the
    // drawing swells, exactly like the chrome shader's pointer bulge.
    const displace = (x: number, y: number, now: number): [number, number] => {
      let ox = x;
      let oy = y;

      if (sm.active) {
        const dx = x - sm.x;
        const dy = y - sm.y;
        const d = Math.hypot(dx, dy) + 1e-3;
        const f = Math.exp(-(d * d) / (2 * 95 * 95)); // gaussian falloff
        const push = 30 * f; // swell outward from the cursor
        ox += (dx / d) * push;
        oy += (dy / d) * push;
      }

      for (const r of ripples) {
        const age = now - r.t0;
        const dx = x - r.x;
        const dy = y - r.y;
        const d = Math.hypot(dx, dy) + 1e-3;
        const radius = age * 260;
        const band = Math.exp(-((d - radius) * (d - radius)) / (2 * 42 * 42));
        const amp = 34 * band * Math.exp(-age * 1.4);
        ox += (dx / d) * amp;
        oy += (dy / d) * amp;
      }
      return [ox, oy];
    };

    let lastSpawn = 0;
    const MAX_PULSES = 7;

    const draw = (nowMs: number) => {
      const now = (nowMs - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Weighted pointer follow.
      if (mouse.active) {
        if (sm.x < -9000) {
          sm.x = mouse.x;
          sm.y = mouse.y;
        }
        sm.x += (mouse.x - sm.x) * 0.12;
        sm.y += (mouse.y - sm.y) * 0.12;
      }
      (sm as { active: boolean }).active = mouse.active;

      ripples = ripples.filter((r) => now - r.t0 < 3.2);

      // Drift nodes; wrap softly.
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // Precompute displaced render coords.
      const dxs = new Float32Array(nodes.length);
      const dys = new Float32Array(nodes.length);
      for (let i = 0; i < nodes.length; i++) {
        const [px, py] = displace(nodes[i].x, nodes[i].y, now);
        dxs[i] = px;
        dys[i] = py;
      }

      // Edges — connectivity from base coords, drawn at displaced coords.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const d = Math.sqrt(d2);
          let alpha = (1 - d / LINK_DIST) * 0.17;

          const mx = (nodes[i].x + nodes[j].x) / 2;
          const my = (nodes[i].y + nodes[j].y) / 2;
          if (sm.active) {
            const md = Math.hypot(mx - sm.x, my - sm.y);
            if (md < 170) alpha += (1 - md / 170) * 0.28;
          }

          const h = hueAt(mx, my, now);
          ctx.strokeStyle = `hsla(${h}, 85%, 66%, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dxs[i], dys[i]);
          ctx.lineTo(dxs[j], dys[j]);
          ctx.stroke();
        }
      }

      // Cursor links to nearby nodes — the "you connect to the system" feel.
      if (sm.active) {
        for (let i = 0; i < nodes.length; i++) {
          const md = Math.hypot(nodes[i].x - sm.x, nodes[i].y - sm.y);
          if (md > 175) continue;
          const a = (1 - md / 175) * 0.5;
          const h = hueAt(nodes[i].x, nodes[i].y, now);
          ctx.strokeStyle = `hsla(${h}, 90%, 72%, ${a})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sm.x, sm.y);
          ctx.lineTo(dxs[i], dys[i]);
          ctx.stroke();
        }
      }

      // Nodes.
      for (let i = 0; i < nodes.length; i++) {
        let glow = 0.5;
        if (sm.active) {
          const md = Math.hypot(nodes[i].x - sm.x, nodes[i].y - sm.y);
          if (md < 175) glow += (1 - md / 175) * 0.6;
        }
        const h = hueAt(nodes[i].x, nodes[i].y, now);
        ctx.fillStyle = `hsla(${h}, 90%, 74%, ${0.4 + glow * 0.35})`;
        ctx.beginPath();
        ctx.arc(dxs[i], dys[i], nodes[i].r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft chromatic hot-spot under the cursor (additive).
      if (sm.active) {
        ctx.globalCompositeOperation = "lighter";
        const h = hueAt(sm.x, sm.y, now);
        const g = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, 150);
        g.addColorStop(0, `hsla(${h}, 95%, 70%, 0.18)`);
        g.addColorStop(1, `hsla(${h}, 95%, 70%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sm.x, sm.y, 150, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      // Click ripple rings.
      for (const r of ripples) {
        const age = now - r.t0;
        const radius = age * 260;
        const a = 0.28 * Math.exp(-age * 1.4);
        if (a < 0.01) continue;
        const h = hueAt(r.x, r.y, now);
        ctx.strokeStyle = `hsla(${h}, 90%, 72%, ${a})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Signal pulses — travel an edge, then hop to a neighbor.
      if (!reduced && nowMs - lastSpawn > 520 && pulses.length < MAX_PULSES) {
        spawnPulse();
        lastSpawn = nowMs;
      }

      const next: Pulse[] = [];
      for (const pu of pulses) {
        const a = nodes[pu.from];
        const b = nodes[pu.to];
        if (!a || !b) continue;
        pu.p += pu.speed;
        pu.life += 1;

        if (pu.p >= 1) {
          const [bx, by] = displace(b.x, b.y, now);
          const h = hueAt(b.x, b.y, now);
          ctx.fillStyle = `hsla(${h}, 95%, 78%, 0.95)`;
          ctx.beginPath();
          ctx.arc(bx, by, 3.2, 0, Math.PI * 2);
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

        const bx = a.x + (b.x - a.x) * pu.p;
        const by = a.y + (b.y - a.y) * pu.p;
        const txb = a.x + (b.x - a.x) * Math.max(0, pu.p - 0.12);
        const tyb = a.y + (b.y - a.y) * Math.max(0, pu.p - 0.12);
        const [x, y] = displace(bx, by, now);
        const [tx, ty] = displace(txb, tyb, now);

        const h = hueAt(bx, by, now);
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, `hsla(${h}, 95%, 75%, 0)`);
        grad.addColorStop(1, `hsla(${h}, 95%, 78%, 0.9)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
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

    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      ripples.push({ x, y, t0: (performance.now() - start) / 1000 });
      if (ripples.length > 6) ripples.shift();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

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
      for (let i = 0; i < 4; i++) spawnPulse();
      draw(start);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
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
