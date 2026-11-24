"use client";

import { useEffect, useRef, useState } from "react";
import BookCall from "../BookCall";
import PanelHeader from "../panel/PanelHeader";
import ProofStrip from "../ProofStrip";

/*
  The dive.

  Meg shot this in Adobe Firefly and asked for the ocean floor as the site's
  world: an ecosystem where everything lives together, and the deep dive as
  the feeling of going down to see what actually runs underneath.

  **It plays once and holds. It does not loop**, and that is a measurement
  rather than a preference: the first and last frames of her clip differ by
  16/255 per channel, so a loop would visibly jump. It is also the better
  reading. The shot is a descent, so you go down, you arrive, and you stay
  there. The last frame is the resting state of the page.

  **Three ways this refuses to cost somebody their data:**

   · the poster is 45 KB of WebP and carries the first paint on its own, so
     the headline and buttons never wait on video;
   · `prefers-reduced-motion` gets the poster and no video at all. Not a
     paused video, no video: `preload="none"` and nothing to fetch;
   · `navigator.connection.saveData` is honoured the same way. Somebody on a
     metered plan gets the still.

  It also pauses off-screen and on a hidden tab, because a 14-second video
  playing to nobody is just battery.

  **The source was 20 MB at 11.7 Mbps**, which is a mastering bitrate, not a
  web one. `public/ocean/dive.mp4` is 1.65 MB at 720p. Dark gradient is the
  worst case for compression banding and this footage is almost entirely
  dark gradient, so the encode was checked frame against frame with the
  master before it was accepted, not trusted from its file size.

  **This replaces the Cable hero, and three.js leaves with it again** — the
  second time in four days. The ocean is video and CSS; nothing here needs a
  GPU or a 936 KB library.
*/

export default function OceanHero() {
  const host = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  /* null until we know: rendering the <video> at all is the decision. */
  const [motion, setMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const allowed = !reduced.matches && !conn?.saveData;
    setMotion(allowed);

    const sync = () => setMotion(!reduced.matches && !conn?.saveData);
    reduced.addEventListener("change", sync);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  /* Off-screen and hidden-tab both stop playback. One answer from two
     sources, so neither can leave it running on its own. */
  useEffect(() => {
    const el = host.current;
    const v = video.current;
    if (!el || !v || !motion) return;

    let onScreen = true;
    const settle = () => {
      if (onScreen && !document.hidden) void v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        settle();
      },
      { threshold: 0 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", settle);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", settle);
    };
  }, [motion]);

  return (
    <section
      ref={host}
      className="cp-night relative isolate overflow-hidden bg-[#05070b]"
      aria-labelledby="hero-heading"
    >
      <div aria-hidden="true" className="absolute inset-0">
        {/* The poster is the element, always. The video lies on top of it
            when it is allowed to, so there is never a frame of nothing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ocean/dive-poster.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        {motion ? (
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            poster="/ocean/dive-poster.webp"
            src="/ocean/dive.mp4"
            muted
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : null}
      </div>

      {/* Legibility. The footage has bright light shafts through the middle,
          so the copy side needs a real scrim rather than a tint. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.86)_0%,rgba(5,7,11,0.6)_40%,rgba(5,7,11,0.92)_100%)] md:bg-[linear-gradient(to_right,rgba(5,7,11,0.95)_0%,rgba(5,7,11,0.84)_34%,rgba(5,7,11,0.3)_70%,rgba(5,7,11,0.55)_100%)]"
      />

      <div className="relative">
        <PanelHeader />
      </div>

      <div className="relative mx-auto flex min-h-[86svh] w-full max-w-6xl flex-col justify-between gap-10 px-6 pb-10 pt-14">
        <div className="flex flex-1 flex-col justify-center">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            [ Custom software · Southern Maine · clients anywhere ]
          </p>

          <h1
            id="hero-heading"
            className="m-0 mt-6 max-w-[16ch] text-[clamp(2.5rem,5.4vw,4.6rem)] font-semibold leading-[0.95] tracking-tight text-[#EDEBE6]"
          >
            <span className="block font-display">Software that</span>
            <span className="mt-1 block font-serif font-normal italic">
              runs real businesses<span className="text-[#2dd4bf]">.</span>
            </span>
          </h1>

          <p className="m-0 mt-7 max-w-[40ch] text-[1rem] leading-relaxed text-white/70">
            Websites, web apps and custom tools for small businesses. Built to
            bring work in, and to cut the manual parts out.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <BookCall
              where="hero"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2dd4bf] px-6 text-[14px] font-semibold text-[#05070b] no-underline transition-transform duration-150 hover:-translate-y-0.5"
            >
              Start a project <span aria-hidden="true">→</span>
            </BookCall>
            {/* **This stays pointed at the shop, and a test enforces it.**
                It was briefly "Take the dive" aimed at #reef, and
                `the shop is on the homepage, near the top` failed on it,
                correctly: Meg rebuilt this page as a storefront because
                it was "hard to see what is for sale that's tangible", and
                the guard that encodes it requires the hero's own button
                to reach the shelf from the first screen. The reef is the
                very next section, so scrolling finds it; the shop is the
                thing that needs the shortcut. */}
            <a
              href="#shelf"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-[14px] font-medium text-[#EDEBE6] no-underline transition-colors duration-150 hover:border-white/60"
            >
              See everything, with prices
            </a>
          </div>
        </div>

        <ProofStrip />
      </div>
    </section>
  );
}
