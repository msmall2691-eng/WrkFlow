"use client";

import { useEffect, useRef } from "react";

/*
  A section arriving, rather than simply being there.

  **CLAUDE.md used to forbid this outright** — "one orchestrated moment
  per page; no fade-up on every section" — and the rule was written when
  Meg found the first V2 cut too busy. She has since asked for the
  opposite, in those words: the site should move the way
  likeakinginc.com does, where roughly a third of the elements carry an
  animation or a transition. This is her call on her own rule, and the
  guide is updated to match rather than left to contradict the page.

  What the old rule was *right* about is kept, because it is engineering
  rather than taste:

  * **Transform and opacity only.** No height, no top, no filter. Those
    are the two properties a compositor can animate without laying the
    page out again.
  * **One easing curve and one duration** for every reveal, so a page of
    them reads as one system instead of a dozen separate ideas.
  * **It fires once.** A section that re-animates every time it scrolls
    back into view is the thing that makes a long page feel seasick, and
    it is the most common way this effect is done badly.

  **The observer is disconnected after the first intersection**, not left
  watching. On a page with a dozen reveals that is a dozen observers
  retired rather than retained for the life of the document.

  **Reduced motion is handled by making the element visible immediately
  and never observing at all** — no transition to cancel, no class to
  wait for, no chance of a section that stays at `opacity: 0` because an
  observer never fired. A visitor who refuses motion must never be the
  one who cannot read the page, which is the failure mode that matters
  far more than the effect itself.
*/
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds, for staggering siblings. Keep it small: this is a
      section arriving, not a sequence the visitor has to wait through. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Tell the watchdog in `app/layout.tsx` that the controller is alive,
       so it does not fail the reveals open at four seconds. Set on the
       first mount of any Reveal on the page. */
    document.documentElement.setAttribute("data-reveal-ready", "");

    /* Visible first, animated second. If anything below throws or never
       fires, the content is already readable. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-revealed", "");
      return;
    }

    /* Already on screen at load: reveal without waiting for a scroll that
       may never come. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
