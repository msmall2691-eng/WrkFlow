"use client";

import { useEffect, useRef, useState } from "react";
import BookCall from "../BookCall";
import PanelHeader from "../panel/PanelHeader";
import ProofStrip from "../ProofStrip";

/*
  The dive, driven by the scroll.

  Meg's ask, in order: the hero is the top of the ocean with the light
  shafts, and the further you scroll the further down you go. So the page
  does not play a descent at you, it hands you one. The camera's depth is
  your scroll position, and it stops when you stop.

  **What makes scroll-scrubbing work is the encode, not the code.** The
  clip as it came out of a normal encode had exactly one keyframe in ten
  seconds, measured, which means every seek decodes from frame zero and
  the whole thing stutters. `public/ocean/dive.mp4` is re-encoded with
  `-g 12 -keyint_min 12 -sc_threshold 0`: a keyframe every half second, 41
  of them, so a seek lands near one and decodes a handful of frames. That
  cost about 600 KB at 1080p and it is the entire difference between this
  feeling like a camera and feeling broken.

  **It is graded.** As shot the clip is bright daylight blue and would
  have fought a near-black site. Brightness down, contrast and curve up,
  blue into the shadows. Baked into the file rather than a CSS filter,
  which would cost a compositing pass every frame for something static.

  **Three ways out, and each keeps the page whole:**

   · `prefers-reduced-motion` and `navigator.connection.saveData` get the
     poster, no `<video>` element at all, and the section collapses to one
     ordinary screen rather than a long pinned track. Nothing to fetch and
     no scroll distance spent on an effect they will not see;
   · if metadata never loads, the poster is what stays on screen, because
     it is a real `<img>` underneath rather than the video's own poster
     attribute;
   · the copy, both calls to action and the proof numbers are server
     rendered and never move, so the page sells with no JavaScript at all.

  **The track length was a budget and is now a reading of the footage**,
  because the budget stopped applying to it. CLAUDE.md records that this
  page was rebuilt as a storefront after Meg said it was "hard to see what
  is for sale that's tangible", and `the shop is on the homepage, near the
  top` fails if the shelf passes five screens at 390px. While the phone was
  pinned too, a long dive was spent out of exactly that allowance. The
  phone now gets the clip rather than the pin, so the guard measures a page
  with no track in it, and the desktop track is free to be as long as the
  descent needs. See the note on the track itself for what 320vh buys.
*/

/*
  **Three modes, and which one you get is measured rather than assumed.**

   · `scrub` — a pinned 320vh track where your scroll is the camera's
     depth. Pointer devices only.
   · `play`  — on a phone: no pin, one screen, a short clip plays once and
     holds. **A different file, deliberately.** `dive.mp4` is 2.7 MB
     because it carries a keyframe every half second so it can be scrubbed;
     a phone is not scrubbing it, so sending it there was 2.7 MB spent on a
     property nobody was using. The phone gets the first 4.6 seconds at
     840 KB in AV1, 796 KB in H.265, 1.4 MB in H.264.
   · `still` — reduced motion or Save-Data: the poster, and no `<video>`
     element at all.

  **The phone does not get the pinned dive, and that is the honest call
  rather than a shortcut.** Twice now the guard `the shop is on the
  homepage, near the top` has failed on this section: a flat 170vh put the
  shelf 5.14 screens down at 390px, and trimming to 150vh plus adding the
  creature art put it back to 5.11. The ceiling is five, and CLAUDE.md
  records why it exists, because this page was rebuilt as a storefront when
  it was "hard to see what is for sale that's tangible".

  Shaving the track to fit would have bought a worse version of the effect
  at the price of the thing the page is for. Pinning a section and taking
  the scroll away is also disliked most on exactly the device that was
  paying for it. So the phone gets the clip, not the pin, and the whole
  allowance goes back to the shop.
*/
type Mode = "scrub" | "play" | "still";

export default function OceanHero() {
  const track = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  /* null until we know: the mode decides both the element and the height. */
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const sync = () => {
      if (reduced.matches || conn?.saveData) setMode("still");
      else setMode(wide.matches ? "scrub" : "play");
    };
    sync();
    reduced.addEventListener("change", sync);
    wide.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      wide.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = track.current;
    const v = video.current;
    if (!el || !v || mode !== "scrub") return;

    /* Priming: a paused video that has never played will not paint a
       seeked frame on some mobile browsers, so play once and stop at
       once. From then on it is a filmstrip to index into. */
    let primed = false;
    const prime = () => {
      if (primed) return;
      primed = true;
      void v
        .play()
        .then(() => v.pause())
        .catch(() => {});
    };
    v.addEventListener("loadedmetadata", prime, { once: true });
    if (v.readyState >= 1) prime();

    let raf = 0;
    let want = 0;
    let shown = -1;

    const apply = () => {
      raf = 0;
      const d = v.duration;
      if (!d || Number.isNaN(d)) return;
      const t = want * d;
      /* A seek costs more than it is worth below about half a frame. */
      if (Math.abs(t - shown) < 1 / 48) return;
      shown = t;
      try {
        v.currentTime = t;
      } catch {
        /* Seeking before the buffer is ready throws on some browsers; the
           next scroll tries again. */
      }
    };

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      want = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", prime);
    };
  }, [mode]);

  /* The phone path: play it once, then hold, and stop when off-screen. */
  useEffect(() => {
    const v = video.current;
    const el = track.current;
    if (!v || !el || mode !== "play") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || document.hidden) v.pause();
        else if (v.paused && !v.ended) void v.play().catch(() => {});
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  return (
    <section
      className="cp-night relative isolate bg-[#05070b]"
      aria-labelledby="hero-heading"
    >
      {/*
        **The track length is how fast the dive goes, and 170vh was too
        fast to read as a dive at all.** Measured: the sticky child is one
        viewport tall, so the scrubbable distance is the track minus a
        screen, which at 170vh is 0.7 screens. The whole ten-second descent
        was therefore spent in about 630px at a 900px viewport, roughly one
        trackpad swipe, and the surface, the mid-water and the floor went
        past in a single gesture. The camera was there; nobody had time to
        notice it was a camera.

        At 320vh the scrubbable distance is 2.2 screens, which is about
        196px of scroll per second of footage. That is slow enough to stop
        partway and look, which is the whole point of handing somebody the
        camera rather than playing a descent at them.

        **It costs nothing against the shop's depth budget, which is why it
        is affordable.** `the shop is on the homepage, near the top` runs at
        390px, and at 390px this is `play` mode with no pinned track at all,
        so the measured depth of `#shelf` is unchanged. The budget was the
        reason the phone stopped getting the pin in the first place, and
        this is that decision paying out: the desktop can afford a real dive
        precisely because the phone is not buying it.
      */}
      <div ref={track} className={mode === "scrub" ? "relative h-[320vh]" : "relative"}>
        <div className="sticky top-0 flex h-svh min-h-[34rem] flex-col overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ocean/surface-poster.webp"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
            {/*
              **`muted` is set on the element, not written as a prop.**
              React does not reflect `muted` into the rendered HTML, which
              was found by dumping the element rather than by reading about
              it: the tag came out as `<video ... autoplay preload=...>`
              with no `muted` anywhere, so the phone's clip was asking to
              autoplay with sound and getting refused. The ref callback
              sets the property directly, before the browser ever considers
              playing it.
            */}
            {mode === "scrub" ? (
              <video
                ref={video}
                className="absolute inset-0 h-full w-full object-cover"
                src="/ocean/dive.mp4"
                muted
                playsInline
                preload="auto"
              />
            ) : mode === "play" ? (
              <video
                ref={(el) => {
                  video.current = el;
                  if (el) el.muted = true;
                }}
                key="play"
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                autoPlay
                preload="auto"
              >
                <source src="/ocean/surface.av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
                <source src="/ocean/surface.h265.mp4" type='video/mp4; codecs="hvc1"' />
                <source src="/ocean/surface.mp4" type="video/mp4" />
              </video>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.8)_0%,rgba(5,7,11,0.52)_38%,rgba(5,7,11,0.95)_100%)] md:bg-[linear-gradient(to_right,rgba(5,7,11,0.95)_0%,rgba(5,7,11,0.82)_34%,rgba(5,7,11,0.28)_70%,rgba(5,7,11,0.5)_100%)]"
          />
          {/* The last stretch sinks to the reef's own ground, so leaving the
              dive reads as going further down rather than as a section end. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(to_bottom,rgba(5,7,11,0)_0%,rgba(5,7,11,0.85)_62%,#05070b_100%)]"
          />

          <div className="relative">
            <PanelHeader />
          </div>

          <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-12 pt-4">
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              [ Custom software · Southern Maine · clients anywhere ]
            </p>

            {/*
              **`font-display` is on the h1 itself, not only on the spans.**
              The two child spans set `font-display` and `font-serif`, so the
              h1 had no face of its own and inherited Inter from the body:
              measured, this heading reported `Inter` as its computed family
              while looking correct, because every glyph on screen belongs to
              a span. Any direct text added here later would have rendered in
              the body face for no visible reason. The serif span still
              overrides it.

              This hero stays bespoke rather than moving to StackedHeading:
              it is the one heading on the site set over video, in its own
              fixed near-white against the dive rather than a theme token,
              with a two-face composition and the teal full stop. That is a
              designed exception, and the type scale it is an exception to is
              now written down in one place.
            */}
            <h1
              id="hero-heading"
              className="m-0 mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,5.4vw,4.6rem)] font-semibold leading-[0.95] tracking-tight text-[#EDEBE6]"
            >
              <span className="block font-display">Software that</span>
              <span className="mt-1 block font-serif font-normal italic">
                runs real businesses<span className="text-[#2dd4bf]">.</span>
              </span>
            </h1>

            <p className="m-0 mt-7 max-w-[40ch] text-[1rem] leading-relaxed text-white/70">
              Websites, web apps and custom tools for small businesses. Built
              to bring work in, and to cut the manual parts out.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <BookCall
                where="hero"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2dd4bf] px-6 text-[14px] font-semibold text-[#05070b] no-underline transition-transform duration-150 hover:-translate-y-0.5"
              >
                Start a project <span aria-hidden="true">→</span>
              </BookCall>
              {/* Stays pointed at the shop, and a test enforces it: this
                  page exists because it was hard to see what was for sale. */}
              <a
                href="#shelf"
                className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-[14px] font-medium text-[#EDEBE6] no-underline transition-colors duration-150 hover:border-white/60"
              >
                See everything, with prices
              </a>
            </div>

            {mode === "scrub" ? (
              <p
                aria-hidden="true"
                className="m-0 mt-9 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/35"
              >
                Scroll to descend
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-10">
        <ProofStrip />
      </div>
    </section>
  );
}
