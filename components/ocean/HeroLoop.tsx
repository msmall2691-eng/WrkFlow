"use client";

import { useEffect, useRef } from "react";

/*
  The hero's looping clip, with something watching whether anybody can
  see it.

  **It exists because the hero was the one piece of motion on this page
  breaking the page's own rule.** CLAUDE.md: anything that loops stops
  when it cannot be seen. `Drift` pauses on a hidden tab, `MovingChapter`
  gates on intersection and visibility, and the hero — the largest and
  most expensive of the three, a full-bleed video — was a plain
  `<video autoPlay loop>` in a server component with no controller at
  all. On a 15-screen page it is off screen for almost the whole visit
  and it kept decoding the entire time, relying on whatever throttling
  the browser felt like applying. A review bot found it; the rule it
  breaks was already written down.

  **Being markup was the reason, and it was a good reason until it was
  not.** A video that autoplays needs no JavaScript, so `OceanHero` could
  stay a server component and the hero could cost nothing in the bundle.
  That is still true of the *element*; it stopped being true of the
  *policy*, so only the element moved into a client component and the
  rest of the hero is untouched and still server-rendered.

  **`autoPlay` stays, deliberately.** It is what plays the clip for a
  visitor whose JavaScript never arrives, which is the same fail-open
  posture as the reveal watchdog in `app/layout.tsx`: without script the
  page is the page with motion, not the page with a dead video on it.
  The controller below only ever takes playback away and gives it back.

  Three conditions decide whether this plays and one function owns the
  answer, which is the shape `MovingChapter` was corrected to in this
  same change after it turned out to be able to stop and not start.
*/
export default function HeroLoop() {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let onScreen = true;

    function reconcile() {
      if (!v) return;
      if (onScreen && !mq.matches && !document.hidden) {
        void v.play().catch(() => {
          /* Autoplay refused (a policy, a codec, a data saver). The
             poster underneath is the whole fallback, and it is a real
             frame of this clip rather than a different picture. */
        });
      } else {
        v.pause();
      }
    }

    /*
      `.hero-motion` is already `display: none` under `reduce`, and that
      is not the same as stopped: a hidden media element keeps its
      timeline running, which is exactly the decode CLAUDE.md says a
      visitor asking for no motion should not be paying for. Pausing it
      as well is what makes the written intent true.
    */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) onScreen = e.isIntersecting;
        reconcile();
      },
      /* No margin and a threshold of zero: the hero is a whole screen, so
         the moment any sliver of it is showing it should be running, and
         the moment none of it is it should not. */
      { threshold: 0 },
    );
    io.observe(v);

    mq.addEventListener("change", reconcile);
    document.addEventListener("visibilitychange", reconcile);

    return () => {
      io.disconnect();
      mq.removeEventListener("change", reconcile);
      document.removeEventListener("visibilitychange", reconcile);
    };
  }, []);

  return (
    <video
      ref={ref}
      data-hero-loop=""
      className="hero-motion absolute inset-0 h-full w-full object-cover object-center"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster="/ocean/video/reef-hud-poster.webp"
      aria-hidden="true"
    >
      {/* WebM first: smaller, and the only one some test browsers
          decode. Safari and iOS take the H.264 and will autoplay
          nothing else. */}
      <source src="/ocean/video/reef-hud.webm" type="video/webm" />
      <source src="/ocean/video/reef-hud.mp4" type="video/mp4" />
    </video>
  );
}
