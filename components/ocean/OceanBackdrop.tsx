"use client";

import { useEffect, useRef, useState } from "react";

/*
  The whole page is the dive.

  **This is Meg's correction, and it is a different thing from what the
  hero was doing.** The hero scrubbed a clip inside its own pinned track:
  the descent began at the top of the page and was finished before the
  second section, and from there the ocean was gone. What she asked for is
  the ocean *behind everything*, still descending while you read, so the
  page is one continuous fall from the surface to the floor. So the video
  leaves the hero and becomes the page's ground, and the hero becomes
  ordinary content sitting on it.

  **The clock is the document, not a section.** Scroll progress is measured
  across the whole scrollable height, so the last frame lands at the foot of
  the page rather than a screen and a half in. On this homepage that is
  roughly 1200px of scroll per second of footage: one screen of reading
  advances the camera about three quarters of a second, which is slow enough
  to read as drift rather than as playback, and is the point. Her words,
  earlier: "the further we scroll it goes into the bottom of ocean floor."

  **It is Harbor only, and that is a decision rather than an omission.**
  CLAUDE.md records why this site went light: Meg's buyers are contractors,
  admin firms and service businesses, and near-black read to them as a
  developer tool rather than as somebody who would build their business a
  site. A dark ocean rolling behind cream content would be the same mistake
  with a bigger surface. Daylight therefore keeps its flat cream ground and
  this renders nothing at all, which is one `display: none` in globals.css
  rather than a second palette to maintain. Harbor is where the dive lives.

  **Three modes, measured rather than assumed**, the same three the hero
  used and for the same reasons:

   · `scrub` — the video, fixed, its playhead tied to the page. Pointer
     devices at 768px and up.
   · `still` — the poster, fixed. Phones, `prefers-reduced-motion`, and
     Save-Data. A phone gets this rather than the video deliberately: a
     fixed, scrubbing video behind a scrolling document is the most
     expensive thing this site could ask a phone to do, and the still
     keeps the whole effect of being underwater for 131KB and no decoding.
   · nothing at all, if the browser cannot run the effect. The page has its
     own colours underneath and loses only the picture.

  **The scrim is not decoration, it is what keeps the shop legible.** This
  page exists because Meg said it was "hard to see what is for sale that's
  tangible", and prices over moving water would undo that more thoroughly
  than any layout. The wash sits above the video and below every section,
  and it deepens with depth: lighter at the top where the hero wants the
  surface visible, heaviest further down where the shelf, the prices and
  the form are.
*/
type Mode = "scrub" | "still";

export default function OceanBackdrop() {
  const video = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const sync = () => {
      if (reduced.matches || conn?.saveData) setMode("still");
      else setMode(wide.matches ? "scrub" : "still");
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
    const v = video.current;
    if (!v || mode !== "scrub") return;

    /* Priming: a paused video that has never played will not paint a
       seeked frame on some browsers, so play once and stop at once. From
       then on it is a filmstrip to index into. */
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

      /*
        **The depth is published before it is used, and that is what makes
        it testable.** The suite's Chromium is a plain build with no H.264,
        so `dive.mp4` never decodes there: `networkState` sits at
        NETWORK_NO_SOURCE and `duration` is NaN for as long as you wait,
        measured. Every assertion about the playhead is therefore
        unwritable in this repo's tests, which would leave the one promise
        that matters — that the clock is the document and not a section —
        guarded by nothing.

        So the progress lands on the element as a number. It is the same
        value the seek uses, written on the way past, and a test can read
        it with no codec at all. It is also the first thing to look at when
        this misbehaves in a real browser.
      */
      if (root.current) root.current.dataset.diveProgress = want.toFixed(3);

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
      /* The whole document, not a section: this is the difference between
         a hero effect and a page that keeps descending. */
      const span = document.documentElement.scrollHeight - window.innerHeight;
      want = span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0;
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

  return (
    <div
      ref={root}
      aria-hidden="true"
      /* `ocean-backdrop` is the hook globals.css uses to switch the whole
         thing off in Daylight. Fixed and behind everything; the content
         wrapper on the page carries the matching `relative z-10`. */
      className="ocean-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/ocean/surface-poster.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      {mode === "scrub" ? (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src="/ocean/dive.mp4"
          muted
          playsInline
          preload="auto"
        />
      ) : null}

      {/*
        The wash, and both it and the file under it are measurements.

        **The page went black below the hero, and the scrim was not the
        cause.** `dive.mp4` had been graded down hard when it was a hero
        element: the note on the old hero said the clip "as shot is bright
        daylight blue and would have fought a near-black site", which was
        true of a video playing *behind* a page and is the opposite of what
        is wanted from a video that *is* one. Measured against the Firefly
        master the grade had cost more than half the light, mean luma 83 to
        92 down to 42 to 53. A scrim composites to `(1-a)·L + a·7`, so on
        top of that there was almost nothing left to reveal: at 0.78 over
        luma 30 the result is 12, and `#08070c` is 7. The ocean was there
        and arithmetically invisible.

        The file is re-encoded from Meg's master with the grade reduced to
        a touch of contrast and saturation, so it now means luma 86. Same
        bytes as the crushed version (CRF 32 at 1080p, 2.7MB, checked 1:1
        against the master for banding) and nearly twice the light, which
        is a better trade than any scrim value could have been.

        **Darkening belongs here rather than in the file**, which is the
        lesson worth keeping: a scrim is one number to change, it can
        differ per theme, and it can be undone. A baked grade is none of
        those, and it quietly set the ceiling for every later decision.

        **The gradient is weighted rather than even, and that is the real
        trade in this effect.** Bright water and small text are in direct
        tension: measured at an even wash, a violet link over a lit patch
        of water came out at 4.16:1 where 14px needs 4.5. Violet on teal is
        the worst pairing the palette can produce, and it is exactly what
        the shop's links are.

        So the light is spent where there is no body text and withheld
        where there is. The hero is one screen of large type over its own
        left-hand gradient, so it can afford a 0.5 wash and is the most
        ocean on the page. Everything below it is cards, prices and links
        at 14px, and takes 0.74 and then 0.8. The dive is still running the
        whole way down and still visibly water, it is simply dimmest where
        somebody is reading rather than looking.

        The honest alternative, if the water should be brighter further
        down, is a local backing behind each text block so the scrim can
        come off the gaps between them. That is a bigger change than this
        one and it is Meg's call, not a default.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.5)_0%,rgba(5,7,11,0.62)_18%,rgba(5,7,11,0.74)_38%,rgba(5,7,11,0.8)_100%)]" />
    </div>
  );
}
