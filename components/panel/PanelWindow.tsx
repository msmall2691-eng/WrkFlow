"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { work, type WorkItem } from "@/lib/content";

/*
  PanelWindow — the right half of the homepage panel: real shipped screens in
  a browser frame, one tab per system.

  Every frame, title, caption and address is read from `work` in
  lib/content.ts. Nothing here is a mock or sample data: the address bar shows
  a host only when that host really serves the site (`displayDomain` / `url`),
  and a private system shows its tag instead.

  Motion, per the motion system in globals.css:
    · advances every 5s, only while on screen, never while hovered or focused
    · the tab's progress bar is a scaleX transform, restarted per frame
    · reduced motion: frame one, no auto-advance; the tabs still work
    · the frame tilts toward the pointer through --px/--py from PanelStage
*/

// Client work first: a stranger's first frame should be a site I built for
// someone else, not my own cleaning company (Meg, Nov 1).
const PICK = ["The Remote Admin", "Nash Construction", "linx", "Instant Estimate"];
const FRAMES: WorkItem[] = PICK.map((t) => work.find((w) => w.title === t)).filter(
  (w): w is WorkItem => Boolean(w?.shot),
);
const INTERVAL_MS = 5000;

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function PanelWindow() {
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState<readonly number[]>([0]);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduce, setReduce] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    setIndex(i);
    setShown((s) => (s.includes(i) ? s : [...s, i]));
  };

  useEffect(() => {
    if (reduce || paused || !visible || FRAMES.length < 2) return;
    const t = setTimeout(() => go((index + 1) % FRAMES.length), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, visible, reduce]);

  if (FRAMES.length === 0) return null;
  const active = FRAMES[index];
  const address = active.displayDomain ?? (active.url ? host(active.url) : active.tag);
  const running = !reduce && !paused && visible;

  return (
    <div
      ref={ref}
      className="flex min-w-0 flex-col gap-2.5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <figure className="cp-tile cp-tilt relative m-0 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[color:var(--cp-line)] px-4 py-2.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="ml-3 min-w-0 flex-1 truncate rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-[color:var(--cp-faint)]">
            {address}
          </span>
        </div>

        <div className="relative aspect-[16/10] w-full bg-black/40 lg:aspect-auto lg:h-[clamp(200px,calc(100svh-610px),360px)]">
          {FRAMES.map((f, i) =>
            shown.includes(i) ? (
              <Image
                key={f.title}
                src={f.shot!}
                alt={`${f.title}: ${f.blurb}`}
                fill
                sizes="(min-width: 1024px) 56vw, 100vw"
                priority={i === 0}
                className={`object-cover object-top transition-opacity duration-300 ease-[var(--ease-out-expo)] ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null,
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#08070c]/90 to-transparent"
          />
        </div>

        <figcaption className="flex items-end justify-between gap-4 px-4 pb-3.5 pt-3">
          <span className="min-w-0">
            <span className="block text-[15px] font-semibold text-[color:var(--cp-ink)]">{active.title}</span>
            <span className="mt-0.5 line-clamp-1 block text-[13px] text-[color:var(--cp-muted)]">
              {active.replaced ?? active.blurb}
            </span>
          </span>
          {active.caseStudy ? (
            <Link
              href={`/work/${active.caseStudy}`}
              className="shrink-0 text-[13px] font-medium text-[color:var(--cp-violet-ink)] transition-opacity duration-150 hover:opacity-80"
            >
              Case study →
            </Link>
          ) : null}
        </figcaption>
      </figure>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Shipped systems">
        {FRAMES.map((f, i) => {
          const on = i === index;
          return (
            <button
              key={f.title}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={`Show ${f.title}`}
              onClick={() => go(i)}
              className={`relative min-h-11 overflow-hidden rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-150 ${
                on
                  ? "border-[color:var(--cp-violet-line)] bg-[color:var(--cp-violet-wash)] text-[color:var(--cp-ink)]"
                  : "border-[color:var(--cp-line)] bg-white/[0.02] text-[color:var(--cp-muted)] hover:text-[color:var(--cp-ink)]"
              }`}
            >
              {f.title}
              {on ? (
                <span
                  key={`${index}-${running}`}
                  aria-hidden="true"
                  className={`cp-progress absolute inset-x-0 bottom-0 h-0.5 ${running ? "is-running" : ""}`}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
