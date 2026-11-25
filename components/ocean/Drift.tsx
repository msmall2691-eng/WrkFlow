"use client";

import { useEffect, useRef } from "react";

/*
  The page-wide drift: slow motes moving through the dark behind everything.

  **This is the half of likeakinginc.com that is not the hero.** Measured on
  their page, 352 of 1192 elements carry an animation or transition and
  seven canvases sit behind the content. One moving hero over a page that
  is otherwise completely still is what the site had before, and it is why
  it still read as a static page with a video at the top.

  It is marine snow rather than the usual connected-dot network, because
  this ocean would actually have it: particulate drifting down through
  water with light in it. A tech-demo constellation would be a stranger's
  idea bolted onto Meg's art.

  Four things keep it from being a battery tax, and all four are the
  reason a background animation is allowed here at all:

  * **Transform-only motion in a canvas**, no layout and no paint on the
    document. The element never changes size and never moves in the flow.
  * **It stops when it cannot be seen.** `visibilitychange` pauses the
    loop on a hidden tab, which is where an ambient animation otherwise
    runs for hours in a background window.
  * **The count scales with the viewport and is capped**, so a large
    display does not quietly get a thousand particles.
  * **`prefers-reduced-motion` paints one frame and never starts the
    loop.** The field is still there, it simply holds still — the same
    posture as the hero, where the video is removed and its own frame
    remains.

  Colour comes from the `--cp-*` custom properties rather than literals,
  so Daylight gets its own palette without a second component. That is the
  token rule in CLAUDE.md, and #115 and #118 are both what happens when a
  visual is hardcoded for one ground and then shown on the other.
*/

type Mote = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  hue: string;
};

export default function Drift() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Read the palette off the document so this follows the theme. The
       fallbacks are Harbor's values, used only if the properties are
       missing — which would mean globals.css failed to load, in which
       case the colour of the motes is not the problem. */
    const css = getComputedStyle(document.documentElement);
    const pick = (name: string, fallback: string) =>
      css.getPropertyValue(name).trim() || fallback;
    const palette = [
      pick("--cp-violet-ink", "#b9a2ff"),
      pick("--cp-teal", "#2dd4bf"),
      pick("--cp-pink", "#f472b6"),
      "#ffffff",
    ];

    let motes: Mote[] = [];
    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      if (!canvas || !ctx) return;
      const ratio = dpr();
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      /* One mote per ~6000px of viewport, capped. At 1440x900 that is
         about 216; on a 4K display it stops at 320 rather than scaling to
         something that costs real frames.

         **The first version of this used 14000 and could not be seen at
         all.** 92 motes at an effective opacity of 0.04-0.21 painted
         2480 pixels out of 5.2 million — 0.05% coverage — and a
         screenshot of a dark section showed nothing whatsoever. The
         pixel count said it was painting; looking said it was not there.
         An ambient animation nobody can perceive is strictly worse than
         none, because it still costs a canvas and a frame loop. */
      const count = Math.min(320, Math.round((w * h) / 6000));
      motes = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(anywhere: boolean): Mote {
      return {
        x: Math.random() * w,
        /* New motes enter from below; the initial fill is scattered. */
        y: anywhere ? Math.random() * h : h + 10,
        r: 0.5 + Math.random() * 2.1,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.05 + Math.random() * 0.18),
        a: 0.16 + Math.random() * 0.52,
        hue: palette[Math.floor(Math.random() * palette.length)],
      };
    }

    function paint() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        ctx.globalAlpha = m.a;
        ctx.fillStyle = m.hue;
        /* A soft halo on the larger motes only. This is what makes them
           read as something alive in water rather than as dust on the
           lens, and it is why the count can stay modest: a glowing mote
           is legible where a hard 1px dot of the same opacity is not.
           Restricted by size because shadowBlur is the expensive part of
           this loop, and the small ones do not need it. */
        ctx.shadowBlur = m.r > 1.4 ? m.r * 4 : 0;
        ctx.shadowColor = m.hue;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    function step() {
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -10 || m.x < -10 || m.x > w + 10) motes[i] = spawn(false);
      }
      paint();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    size();
    paint();
    if (!reduced) start();

    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-drift=""
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
