"use client";

import { useEffect, useRef } from "react";

/*
  BlueprintRise — a plan on paper that stands up into a building as you
  scroll.

  **Meg asked for this directly**: "3D scenes, particles, moving fog, a
  blueprint rising into a building, scroll-driven stages." She had asked
  before and been talked out of it, which was the wrong call twice over:
  how her own studio looks is her decision, and the blueprint is the one
  image on the list that is actually about her work rather than about
  looking expensive. Her buyers are contractors, rental owners and service
  businesses. A drawing that becomes the thing it describes is what she
  sells to them, and it is a metaphor they already live in.

  **No library, no WebGL, no photographs.** Real CSS 3D: the floor plan is
  an SVG lying on a plane, each wall is a `<div>` stood up on its own base
  edge with `rotateZ(θ) rotateX(-90deg)`, and the roof is a plane pushed up
  by `translateZ`. That keeps it a few KB instead of the ~600KB three.js
  would cost on the one page every visitor loads, and it means the whole
  thing inherits the site's own tokens, so it is right in Daylight and in
  Harbor without a second palette.

  **It is drawn in ink on paper, not neon on black.** The obvious blueprint
  is white-on-blue, which is the look CLAUDE.md already records as reading
  "developer tool" to the people buying here. Navy lines on cream is an
  architect's drawing, which is the same idea wearing the clothes her
  buyers trust.

  **Scroll drives it, React does not re-render.** One rAF-throttled
  listener writes four stage numbers as CSS custom properties on the root
  and CSS does the rest. Re-rendering a component sixty times a second to
  move a transform is how a scene like this becomes the reason a phone gets
  hot.

  Stages, each a 0-to-1 number so CSS can interpolate anything from it:

    --tilt   the paper tips back into perspective
    --rise   walls stand up off their own footprint
    --light  roof settles, windows warm, fog lifts

  **Reduced motion gets the finished building, not the blank paper.** The
  end state is the point; a visitor who cannot have animation should not be
  the one left looking at an empty sheet. Same reasoning as the landing
  page's own reduced-motion rule, which opens its card on the final frame.
*/

/** The plan, in its own 400x280 space. Walls are segments on the floor. */
const PLAN_W = 400;
const PLAN_H = 280;

type Seg = { x1: number; y1: number; x2: number; y2: number; interior?: boolean };

const WALLS: Seg[] = [
  { x1: 0, y1: 0, x2: PLAN_W, y2: 0 },
  { x1: PLAN_W, y1: 0, x2: PLAN_W, y2: PLAN_H },
  { x1: PLAN_W, y1: PLAN_H, x2: 0, y2: PLAN_H },
  { x1: 0, y1: PLAN_H, x2: 0, y2: 0 },
  { x1: 248, y1: 0, x2: 248, y2: 168, interior: true },
  { x1: 248, y1: 168, x2: PLAN_W, y2: 168, interior: true },
];

/** Lit openings, as a fraction along a wall. */
const WINDOWS: { wall: number; at: number; w: number }[] = [
  { wall: 0, at: 0.18, w: 0.14 },
  { wall: 0, at: 0.46, w: 0.14 },
  { wall: 1, at: 0.3, w: 0.18 },
  { wall: 2, at: 0.22, w: 0.16 },
  { wall: 2, at: 0.58, w: 0.12 },
  { wall: 3, at: 0.42, w: 0.2 },
];

const WALL_H = 86;

function seg(s: Seg) {
  const dx = s.x2 - s.x1;
  const dy = s.y2 - s.y1;
  return { len: Math.hypot(dx, dy), deg: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/** 0 before `from`, 1 after `to`, eased in between. */
function stage(p: number, from: number, to: number) {
  const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return t * t * (3 - 2 * t); // smoothstep, so nothing starts or stops abruptly
}

export default function BlueprintRise() {
  const root = useRef<HTMLDivElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);

  /* Scroll -> four stage numbers, written straight to CSS. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;

    const settle = () => {
      /*
        The finished building, held still. See the header note.

        It cancels any queued frame, because an `apply` already scheduled
        would otherwise land a moment later and undo this.
      */
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      el.style.setProperty("--tilt", "1");
      el.style.setProperty("--rise", "1");
      el.style.setProperty("--light", "1");
    };

    if (reduced.matches) {
      settle();
      return;
    }

    const apply = () => {
      frame = 0;
      /*
        Checked here, not only at mount, because the preference can be
        turned on while the page is open and that is exactly the moment it
        matters most: somebody switching it on mid-page is doing it because
        the motion is bothering them.

        Settling in the `change` handler alone was not enough. The scroll
        and resize listeners stay bound, so the next scroll called this and
        wrote intermediate stages straight back over the settled ones, and
        because these are inline properties they beat the reduced-motion
        CSS. The building carried on moving with the setting enabled.
      */
      if (reduced.matches) {
        settle();
        return;
      }
      /*
        Measured against the TALL outer section, never against this element.

        The scene lives inside a wrapper that is `sticky` on large screens,
        so once it pins, its own rect stops moving and progress freezes at
        whatever it was when it stuck. The outer `.bp-track` keeps
        travelling, and the difference between the two is exactly the
        scroll the stages are supposed to consume: the building finishes
        while it is still on screen instead of while it is leaving.
      */
      const track = el.closest(".bp-track") ?? el;
      const box = track.getBoundingClientRect();
      /*
        Pinned, the travel is the part of the section that scrolls past
        before its bottom reaches the bottom of the screen, which is what
        the pin costs. Unpinned, that figure is wrong and can be nearly
        zero: the hero is then only a little taller than the viewport, so
        `height - innerHeight` collapses and the whole four-stage build
        fires within a few pixels of scroll. Measured on an iPhone 13 it
        was 240px, and on a taller phone or with shorter content it reaches
        the floor of 1 and snaps straight to the finished building.

        So there is a floor of six tenths of a screen. On a pinned desktop
        the real travel is larger and wins; everywhere else the stages get
        a scroll-through range somebody can actually watch.
      */
      const travel = Math.max(window.innerHeight * 0.6, box.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -box.top / travel));
      el.style.setProperty("--tilt", stage(p, 0.08, 0.46).toFixed(4));
      el.style.setProperty("--rise", stage(p, 0.34, 0.76).toFixed(4));
      el.style.setProperty("--light", stage(p, 0.62, 1).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const onPref = () => (reduced.matches ? settle() : apply());
    reduced.addEventListener("change", onPref);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", onPref);
    };
  }, []);

  /* Dust in the light. Paused off-screen and under reduced motion, because
     a canvas that keeps painting behind a scrolled-past hero is a battery
     cost nobody can see. */
  useEffect(() => {
    const cv = dust.current;
    const el = root.current;
    if (!cv || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const motes = Array.from({ length: 44 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.00018,
      vy: -0.00006 - Math.random() * 0.00012,
      a: 0.12 + Math.random() * 0.3,
    }));

    const size = () => {
      const b = cv.getBoundingClientRect();
      w = Math.max(1, b.width);
      h = Math.max(1, b.height);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    let raf = 0;
    let running = false;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -0.05) m.y = 1.05;
        if (m.x < -0.05) m.x = 1.05;
        if (m.x > 1.05) m.x = -0.05;
        ctx.globalAlpha = m.a;
        ctx.beginPath();
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    /* `fill` comes from CSS so the motes follow the theme rather than
       being a hardcoded colour, which is the failure this repo has shipped
       twice. */
    const paint = () => {
      ctx.fillStyle = getComputedStyle(cv).color || "#1e2a44";
    };
    paint();

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(el);

    const onVis = () => (document.hidden ? stop() : io.takeRecords(), undefined);
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => {
      size();
      paint();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={root} className="bp" aria-hidden="true">
      {/* Fog: three slow, very soft drifts. Transform and opacity only. */}
      <span className="bp-fog bp-f1" />
      <span className="bp-fog bp-f2" />
      <span className="bp-fog bp-f3" />

      <canvas ref={dust} className="bp-dust" />

      <div className="bp-stage">
        <div className="bp-floor" style={{ width: PLAN_W, height: PLAN_H }}>
          {/* The drawing itself, lying on the paper. */}
          <svg className="bp-plan" viewBox={`-30 -30 ${PLAN_W + 60} ${PLAN_H + 60}`}>
            <defs>
              <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect
              className="bp-gridfill"
              x={-30}
              y={-30}
              width={PLAN_W + 60}
              height={PLAN_H + 60}
              fill="url(#bp-grid)"
            />
            {/*
              The plan inks itself in on load, not on scroll, and that is a
              correction rather than a preference. Driven by scroll it was
              the fourth stage of four, so the hero opened on an empty
              sheet: the first thing every visitor saw was blank paper and
              a headline. The drawing is the still image this section needs
              at rest; scroll is for standing it up.

              One dasharray longer than any segment, so a shared keyframe
              can draw them all and each finishes when its own length runs
              out. No per-line arithmetic and no custom property to
              register.
            */}
            {WALLS.map((s, i) => (
              <line
                key={i}
                className={`bp-line${s.interior ? " bp-line-in" : ""}`}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              />
            ))}
            {/* Dimension marks, the detail that makes it read as a drawing
                rather than as a rectangle. */}
            <g className="bp-dim">
              <line x1={0} y1={-16} x2={PLAN_W} y2={-16} />
              <line x1={0} y1={-21} x2={0} y2={-11} />
              <line x1={PLAN_W} y1={-21} x2={PLAN_W} y2={-11} />
              <line x1={-16} y1={0} x2={-16} y2={PLAN_H} />
              <line x1={-21} y1={0} x2={-11} y2={0} />
              <line x1={-21} y1={PLAN_H} x2={-11} y2={PLAN_H} />
            </g>
          </svg>

          {WALLS.map((s, i) => {
            const { len, deg } = seg(s);
            return (
              <div
                key={i}
                className={`bp-wall${s.interior ? " bp-wall-in" : ""}`}
                /*
                  The rotation is handed to CSS as a variable rather than
                  written as a finished `transform`, because CSS has to
                  compose it with the rise. `rotateX(90deg)`, not -90: the
                  floor is tipped by a positive rotateX, which puts its
                  local +Z up the screen, and +90 is what sends the wall's
                  height to +Z. -90 lays every wall out flat the wrong way
                  and reads as a bug in the geometry.
                */
                style={
                  {
                    left: s.x1,
                    top: s.y1,
                    width: len,
                    height: WALL_H,
                    "--rot": `${deg}deg`,
                  } as React.CSSProperties
                }
              >
                {WINDOWS.filter((o) => o.wall === i).map((o, n) => (
                  <span
                    key={n}
                    className="bp-win"
                    style={{ left: `${o.at * 100}%`, width: `${o.w * 100}%` }}
                  />
                ))}
              </div>
            );
          })}

          <div className="bp-roof" style={{ width: PLAN_W, height: PLAN_H }} />
        </div>
      </div>
    </div>
  );
}
