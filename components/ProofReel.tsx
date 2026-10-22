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
  /*
    Which frames exist in the DOM.

    All of them used to, stacked and crossfaded by opacity, which meant the
    first paint of the homepage waited behind seven screenshots instead of
    one. Lighthouse called 81 KiB of that waste and it also cost six image
    decodes on the main thread during hydration, which is exactly when the
    hero is trying to paint.

    So frames mount as they are needed and then stay: the set only grows,
    because a frame that has been shown has to remain for the crossfade out
    of it, and by the time the reel has cycled the visitor has been here
    long enough that nothing is competing with load.
  */
  const [shown, setShown] = useState<readonly number[]>([0]);
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

  /*
    Keep the mounted set one frame ahead of what is showing, so a crossfade
    never waits on a download. The first pass of this effect adds frame two
    after hydration rather than during it.
  */
  useEffect(() => {
    if (FRAMES.length < 2) return;
    const next = (index + 1) % FRAMES.length;
    setShown((prev) =>
      prev.includes(index) && prev.includes(next)
        ? prev
        : [...new Set([...prev, index, next])],
    );
  }, [index]);

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
          {FRAMES.map((w, i) =>
            !shown.includes(i) ? null : (
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
            ),
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col items-start gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        {/* aria-live so the caption is announced as the reel advances rather
            than silently changing under a screen reader. */}
        <p className="text-xs leading-snug text-faint" aria-live="polite">
          <span className="font-semibold text-ink/80">{current.title}</span>
          {" · "}
          {current.tag}
        </p>
        {FRAMES.length > 1 && (
          /*
            The dot is the look; the button is the target.

            These used to be 6px buttons, which is a fine dot and a bad
            touch target: WCAG 2.5.8 asks for 24px, and Lighthouse scored
            the homepage down for it. So the button is 24x24 with
            transparent padding and the span inside keeps the exact dot it
            always had. Nothing moves visually.

            The row stacks under the caption below `sm`. Seven 24px targets
            are 168px wide, which would otherwise squeeze the caption into
            four lines on a phone and make the hero taller than leaving the
            dots their own line does.
          */
          <div className="-mx-1.5 flex shrink-0">
            {FRAMES.map((w, i) => (
              <button
                key={w.shot}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${w.title}`}
                aria-current={i === index}
                className="group flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-5 bg-signal"
                      : "w-1.5 bg-faint/40 group-hover:bg-faint"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
