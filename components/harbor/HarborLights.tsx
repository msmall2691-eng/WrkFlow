"use client";

import { useEffect, useRef, useState } from "react";

/*
  Harbor — moorings on black water, and the arcs between them.

  **Why this exists.** Meg sent likeakinginc.com (Nov 20 2026) and asked how
  she could have art like theirs. Theirs is nine painted pieces and an mp4,
  and the system behind them is one rule: every abstract idea in the business
  is drawn as a glowing living thing on near-black. Their "global network" is
  a sphere of roots with lit nodes. Their "connection" is two trees joined by
  glowing arcs.

  Three routes were put to her: generate it, commission it, or draw it in
  code. This is the third, and it is the one that fits her best for a reason
  worth writing down: **she sells software, so art that is itself a running
  program is proof of the thing she is selling.** A painted file is a picture
  of craft. This is the craft.

  **The subject is hers, not theirs.** Her dark theme is already called
  Harbor, her location line already says Southern Maine, and one of her four
  service categories is getting your tools to talk to each other. So: moorings
  on black water, and the faint arcs between them. Same technique as the
  reference, her place, and it happens to draw the thing she does.

  **It makes no claim.** There is no number on it, no label, no count of
  anything. It is weather, not evidence. That matters because it sits on a
  page whose first rule is that nothing invents proof, and a picture is where
  a claim is easiest to smuggle in: a "network" diagram with 40 lit nodes
  would be a statement about how many clients she has. These are buoys.

  **Calm, because the last one was not.** CLAUDE.md records that Meg found
  the first V2 cut too busy, so the drift is slow enough to be noticed only
  if you look for it, there is no parallax, nothing enters or leaves, and the
  arcs breathe rather than travel.

  Two obligations this file owes the repo, both from the house rules:

  · it pauses off-screen and when the tab is hidden, like the aurora;
  · `prefers-reduced-motion` gets one static frame showing the end state,
    with every arc at full strength, rather than a dead canvas or a fade.

  There is no WebGL here on purpose. It is a 2D context doing arithmetic on a
  few dozen points, which costs nothing, has no context to lose, and needs no
  fallback path of its own.
*/

/* Her palette, from the .cp tokens. Teal leads; the other two are occasional
   so the picture reads as one colour with accents rather than as a rainbow. */
const TEAL = [45, 212, 191] as const;
const VIOLET = [139, 92, 246] as const;
const PINK = [244, 114, 182] as const;

const COUNT = 26;
/** Where the water starts. Everything floats below it. */
const HORIZON = 0.46;
/** Arcs only between moorings closer than this, in normalised units. */
const LINK_WITHIN = 0.26;
/** Hard ceiling, so a dense patch cannot turn into a cobweb. */
const MAX_LINKS = 26;

type Mooring = {
  x: number;
  y: number;
  /** 0 = far, 1 = near. Drives size, brightness and reflection length. */
  depth: number;
  hue: readonly [number, number, number];
  /** Per-light phase, so they do not pulse in unison. */
  phase: number;
  speed: number;
};

/* Deterministic layout: a seeded generator rather than Math.random, so the
   picture is the same on the server-adjacent first paint as on every reload,
   and a screenshot taken today can be compared with one taken next week. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildMoorings(): Mooring[] {
  const rnd = makeRandom(20261120);
  const out: Mooring[] = [];
  for (let i = 0; i < COUNT; i++) {
    /* Pushed toward the lower half of the frame: this is water seen at a
       shallow angle, so the far moorings bunch near the horizon line and the
       near ones spread out below it. */
    const depth = rnd();
    /* Below the horizon always, bunched close to it when far and spreading
       toward the viewer when near. The cubic keeps the far ones tight to the
       line, which is what gives the water its angle. */
    const y = HORIZON + 0.02 + Math.pow(depth, 2.2) * 0.44;
    const spread = 0.1 + depth * 0.44;
    const x = 0.5 + (rnd() - 0.5) * 2 * spread;
    const roll = rnd();
    out.push({
      x,
      y,
      depth,
      hue: roll > 0.88 ? PINK : roll > 0.72 ? VIOLET : TEAL,
      phase: rnd() * Math.PI * 2,
      speed: 0.25 + rnd() * 0.4,
    });
  }
  return out;
}

type Link = { a: number; b: number; phase: number };

function buildLinks(ms: Mooring[]): Link[] {
  const rnd = makeRandom(7731);
  const pairs: { a: number; b: number; d: number }[] = [];
  for (let i = 0; i < ms.length; i++) {
    for (let j = i + 1; j < ms.length; j++) {
      const d = Math.hypot(ms[i].x - ms[j].x, ms[i].y - ms[j].y);
      if (d < LINK_WITHIN) pairs.push({ a: i, b: j, d });
    }
  }
  /* Shortest first, so the arcs read as "these two are near each other"
     rather than as a net thrown over the whole frame. */
  pairs.sort((p, q) => p.d - q.d);
  return pairs.slice(0, MAX_LINKS).map((p) => ({ a: p.a, b: p.b, phase: rnd() * Math.PI * 2 }));
}

export default function HarborLights({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [still, setStill] = useState(false);
  const running = useRef(true);

  useEffect(() => {
    const el = canvas.current;
    const box = host.current;
    if (!el || !box) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const quiet = reduced.matches;
    setStill(quiet);

    const ctx = el.getContext("2d", { alpha: true });
    if (!ctx) return;

    const moorings = buildMoorings();
    const links = buildLinks(moorings);

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const r = box.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    const rgba = (c: readonly [number, number, number], a: number) =>
      `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

    const draw = (t: number) => {
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);

      /* The water: a plane under the horizon, barely lighter than the sky
         above it. Without this the lights read as lanterns hanging in a void
         rather than as moorings floating on something. */
      const water = ctx.createLinearGradient(0, h * HORIZON, 0, h);
      water.addColorStop(0, "rgba(45, 212, 191, 0.05)");
      water.addColorStop(0.35, "rgba(45, 212, 191, 0.022)");
      water.addColorStop(1, "rgba(139, 92, 246, 0.03)");
      ctx.fillStyle = water;
      ctx.fillRect(0, h * HORIZON, w, h * (1 - HORIZON));

      /* The fog bank sitting on the line itself, widest at the centre, which
         is what hides where the far moorings stop. */
      const fog = ctx.createLinearGradient(0, h * (HORIZON - 0.1), 0, h * (HORIZON + 0.08));
      fog.addColorStop(0, "rgba(45, 212, 191, 0)");
      fog.addColorStop(0.5, "rgba(140, 200, 215, 0.055)");
      fog.addColorStop(1, "rgba(45, 212, 191, 0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, h * (HORIZON - 0.1), w, h * 0.18);

      /* Arcs under the lights, so a mooring always reads as brighter than
         the line leaving it. */
      for (const l of links) {
        const a = moorings[l.a];
        const b = moorings[l.b];
        const breathe = quiet ? 1 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.00022 + l.phase));
        const near = (a.depth + b.depth) / 2;
        const alpha = (0.05 + near * 0.1) * breathe;
        const ax = a.x * w;
        const ay = a.y * h;
        const bx = b.x * w;
        const by = b.y * h;
        /* Bowed upward, away from the water, which is what makes them read
           as arcs over a surface instead of chords through a cloud. */
        const lift = Math.hypot(bx - ax, by - ay) * 0.3;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo((ax + bx) / 2, (ay + by) / 2 - lift, bx, by);
        ctx.strokeStyle = rgba(TEAL, alpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (const m of moorings) {
        const x = m.x * w;
        /* The whole drift: a few pixels of rise and fall, slower for the far
           ones. Nothing travels, nothing enters frame. */
        const bob = quiet ? 0 : Math.sin(t * 0.0004 * m.speed + m.phase) * (1 + m.depth * 2.5);
        const y = m.y * h + bob;
        const pulse = quiet ? 1 : 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(t * 0.0009 * m.speed + m.phase));
        const r = Math.min(3.1, 1.0 + m.depth * 2.1) * pulse;
        const bright = (0.3 + m.depth * 0.55) * pulse;

        /* Reflection first: a soft vertical smear below, longer and fainter
           for the near moorings, which is what sells it as water. */
        const refLen = (12 + m.depth * 52) * pulse;
        const ref = ctx.createLinearGradient(x, y, x, y + refLen);
        ref.addColorStop(0, rgba(m.hue, bright * 0.3));
        ref.addColorStop(1, rgba(m.hue, 0));
        ctx.fillStyle = ref;
        ctx.fillRect(x - r * 0.9, y, r * 1.8, refLen);

        /* Halo, then the light itself. */
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 9);
        halo.addColorStop(0, rgba(m.hue, bright * 0.5));
        halo.addColorStop(1, rgba(m.hue, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, r * 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba([235, 255, 252], Math.min(1, bright + 0.3));
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    const tick = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || quiet) return;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    if (!resize()) {
      /* The container can still be unsized on the first pass; the observer
         below fires as soon as it is not. */
    }
    /* Under reduced motion this is the whole animation: one frame, at a time
       chosen so every arc is at full strength rather than mid-breath. The end
       state, which is the house rule, not a frozen first frame. */
    draw(0);

    const ro = new ResizeObserver(() => {
      if (resize()) draw(performance.now());
    });
    ro.observe(box);

    const io = new IntersectionObserver(
      ([e]) => {
        running.current = e.isIntersecting;
        if (e.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(box);

    const vis = () => {
      if (document.hidden) stop();
      else if (running.current) start();
    };
    document.addEventListener("visibilitychange", vis);

    const onMotion = () => window.location.reload();
    reduced.addEventListener("change", onMotion);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      reduced.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    /* No `relative` here: the caller owns positioning. Hardcoding it and
       then being handed `absolute inset-0` produced "relative absolute",
       where the winner is decided by the order of Tailwind's own CSS rather
       than by the order they are written, and the host collapsed to half
       height. The canvas fills whatever box it is given. */
    <div ref={host} aria-hidden="true" className={className}>
      <canvas ref={canvas} className="block h-full w-full" />
      <span className="sr-only">
        {still ? "A still harbor scene." : "A slowly moving harbor scene."}
      </span>
    </div>
  );
}
