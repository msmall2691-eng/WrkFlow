"use client";

import { useEffect, useRef, useState } from "react";

/*
  SelfScore — the site auditing itself. Lazily runs the Lighthouse check on the
  live URL when the footer scrolls into view, caches the score for 12h, and only
  runs in production. Renders nothing until/unless a real score comes back.
*/
const KEY = "mstudio-selfscore";
const TTL = 12 * 60 * 60 * 1000;

export default function SelfScore() {
  const [score, setScore] = useState<number | null>(null);
  const sentinel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = window.location.hostname;
    if (/^(localhost|127\.|0\.0\.0\.0)/.test(host)) return; // skip dev

    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const { v, t } = JSON.parse(raw);
        if (typeof v === "number" && Date.now() - t < TTL) {
          setScore(v);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    const el = sentinel.current;
    if (!el) return;
    let done = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting || done) return;
      done = true;
      io.disconnect();
      try {
        const res = await fetch(
          `/api/site-check?url=${encodeURIComponent("https://mlinx.studio")}&strategy=mobile`,
        );
        const data = await res.json();
        const v = data?.scores?.performance;
        if (typeof v === "number") {
          setScore(v);
          try {
            localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() }));
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore — render nothing on failure */
      }
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <span ref={sentinel} aria-hidden="true" className="block h-px w-px" />
      {score != null && (
        <a
          href="/marketplace"
          title="From one of the free tools on this site. Run it on your own."
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-base px-3 py-1.5 text-xs text-muted transition-colors hover:border-signal/50 hover:text-signal"
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
          this page: {score}/100
        </a>
      )}
    </>
  );
}
