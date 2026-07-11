"use client";

import { useEffect, useRef, useState } from "react";

/*
  CountUp — a decorative count-up-on-scroll flourish. It must NEVER be the
  only source of a displayed number: the initial render (SSR, no-JS,
  crawlers, a screenshot taken before the animation runs) always shows the
  real `value` — this used to default to 0 and only correct itself once an
  IntersectionObserver fired and a 900ms animation finished, which is how a
  page load, a bot, or a quick glance could see a literal "$0" on the
  pricing cards. The animation is now purely cosmetic: it resets to 0 and
  counts back up ONLY once it's confirmed on-screen, never on first paint.
*/
export default function CountUp({
  value,
  duration = 900,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [n, setN] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  // Keep in sync if the real value changes later (e.g. the founding price
  // reverting to full price once spots run out).
  useEffect(() => {
    if (!played.current) setN(value);
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || played.current) return;
        played.current = true;
        setN(0);
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(p < 1 ? Math.round(value * eased) : value);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}
