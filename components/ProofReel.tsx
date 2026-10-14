"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { work } from "@/lib/content";

/*
  ProofReel — the right half of the hero.

  This slot used to hold the live Portland weather panel. It was the most
  prominent thing on the homepage, and it proved we can read a weather API,
  not that we can build a business a website. A prospect deciding in five
  seconds saw fog and wind speed. Now they see real shipped screens.

  Every frame, caption and host below is read from `work` in lib/content.ts —
  nothing here is written twice, and nothing is invented. The frame's address
  bar shows only a host that is genuinely serving the site (the rule at
  lib/content.ts `displayDomain`); a private system shows its tag instead, so
  the chrome never lies about where anything lives.

  Motion: this is the one looping animation on the page, and it loops only
  because it earns it (it shows the work) and because it stops —
    · an IntersectionObserver pauses it off-screen
    · hover and focus-within pause it, so a frame can be read
    · prefers-reduced-motion shows frame one and never advances
  The dots are the visitor's own control, which is the better kind of motion.
*/

const FRAMES = work.filter((w) => w.shot);
const INTERVAL_MS = 4500;

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function ProofReel() {
  const [index, setIndex] = useState(0);
  /* Paused covers all three stop conditions; `reduced` disables the timer
     outright so a reduced-motion visitor never gets a hard cut. */
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Off-screen means off. A hero that keeps crossfading while the visitor
     reads the pricing section is just burning their battery. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || FRAMES.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % FRAMES.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  if (!FRAMES.length) return null;
  const current = FRAMES[index];

  return (
    <div
      ref={frameRef}
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--panel-line)] bg-[var(--panel-bg)] shadow-[0_30px_80px_-40px_rgba(11,23,34,0.55)] backdrop-blur-md">
        {/* Minimal chrome. Three dots and the real host — no more, so it
            reads as a screen rather than a fake browser. */}
        <div className="flex items-center gap-2 border-b border-[var(--panel-line)] px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[var(--panel-faint)]/50" />
            <span className="h-2 w-2 rounded-full bg-[var(--panel-faint)]/50" />
            <span className="h-2 w-2 rounded-full bg-[var(--panel-faint)]/50" />
          </span>
          <span className="truncate font-mono text-[11px] text-[color:var(--panel-faint)]">
            {current.url ? host(current.url) : current.tag}
          </span>
        </div>

        <div className="relative aspect-[16/10]">
          {FRAMES.map((w, i) => (
            <Image
              key={w.shot}
              src={w.shot as string}
              /* Describes what the screen shows, from the real blurb. */
              alt={`${w.title} — ${w.blurb}`}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              priority={i === 0}
              className={`object-cover object-top transition-opacity duration-500 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        {/* aria-live so the caption is announced as the reel advances rather
            than silently changing under a screen reader. */}
        <p className="text-xs leading-snug text-faint" aria-live="polite">
          <span className="font-semibold text-ink/80">{current.title}</span>
          {" · "}
          {current.tag}
        </p>
        {FRAMES.length > 1 && (
          <div className="flex shrink-0 gap-1.5 pt-0.5">
            {FRAMES.map((w, i) => (
              <button
                key={w.shot}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${w.title}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-signal" : "w-1.5 bg-faint/40 hover:bg-faint"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
