"use client";

import { useEffect } from "react";

/*
  The one controller behind the approved homepage's motion.

  The design shipped as a single IIFE at the bottom of its HTML file, and
  this is that script with three things changed, each for a reason this
  repo has already paid for:

  **One: the reveals use `[data-reveal]`, not a class that hides by
  default.** The mockup's `.rv` sets `opacity: 0` in plain CSS, so a
  visitor whose script never arrives gets a column of blanks with the
  content sitting right there in the document. That has happened here
  (#155) and the fix is in `app/globals.css` and `app/layout.tsx`: the
  hidden state is gated on `html[data-js]`, and a four-second watchdog
  removes that attribute unless a controller says it is alive. Setting
  `data-reveal-ready` below is what that watchdog waits for, so it is the
  first thing this does — before anything that could throw.

  **Two: playback is a function of three conditions and one function owns
  the answer.** `MovingChapter` shipped with an observer that could stop a
  clip and never start it again: switch tabs with it on screen, come back,
  and it sat there frozen claiming to be a loop. The mockup's script has
  exactly that shape. Reconciling intersection, the motion preference and
  tab visibility in one place is the correction that was made there and in
  `HeroLoop`, and this is the same function.

  **Three: `prefers-reduced-motion` pauses rather than removes.** The
  mockup deletes the video element outright. CSS already hides it
  (`globals.css`), and pausing is what stops the decode the visitor asked
  to avoid; removing a node React rendered also means it can never come
  back if they change the preference while the page is open, which is a
  request rather than a setting read once. `HeroLoop` settled this for the
  previous hero and the answer has not changed.
*/
export default function StageMotion() {
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(".stage");
    if (!stage) return;

    /* Tell the watchdog in `app/layout.tsx` the controller is alive, so it
       does not fail every reveal open at four seconds. */
    document.documentElement.setAttribute("data-reveal-ready", "");

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const teardown: Array<() => void> = [];
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");
    const pending = () =>
      Array.from(stage.querySelectorAll("[data-reveal]:not([data-revealed])"));

    /* ── sections arriving ─────────────────────────────────────────── */
    if (mq.matches || !("IntersectionObserver" in window)) {
      /* Visible immediately: no transition to cancel and no observer to
         wait on. The CSS says the same thing independently. */
      pending().forEach(reveal);
    } else {
      const ro = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            reveal(e.target);
            /* Each one fires once. A section that re-animates every time
               it scrolls back is what makes a long page feel seasick. */
            ro.unobserve(e.target);
          }
        },
        /* The design's own margin. Its threshold was 0.08, which a
           taller-than-viewport block can take a while to satisfy; 0.01
           reveals a few pixels earlier and cannot leave anything hidden. */
        { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
      );
      pending().forEach((el) => ro.observe(el));
      teardown.push(() => ro.disconnect());

      /* Asking for no motion mid-visit should not leave the rest of the
         page waiting on scroll to become readable. */
      const onPrefReveal = () => {
        if (mq.matches) pending().forEach(reveal);
      };
      mq.addEventListener("change", onPrefReveal);
      teardown.push(() => mq.removeEventListener("change", onPrefReveal));
    }

    /* ── anything that loops stops when it cannot be seen ──────────── */
    const clips: { v: HTMLVideoElement; on: boolean }[] = [];
    for (const wrap of stage.querySelectorAll<HTMLElement>("[data-vid]")) {
      const v = wrap.querySelector("video");
      if (v) clips.push({ v, on: false });
    }

    function reconcile() {
      for (const c of clips) {
        if (c.on && !mq.matches && !document.hidden) {
          /* `preload="none"` means the browser has already decided not to
             fetch; changing the attribute alone does not start it, which
             is how a clip sits at readyState 0 showing its poster for
             ever. Only the start section's clip is in that state — the
             hero loads itself. */
          if (c.v.preload === "none") {
            c.v.preload = "auto";
            c.v.load();
          }
          void c.v.play().catch(() => {
            /* Autoplay refused: a policy, a data saver, or a codec this
               browser cannot take. The poster is the whole fallback and
               it is a real frame of the clip. */
          });
        } else {
          c.v.pause();
        }
      }
    }

    if (clips.length && "IntersectionObserver" in window) {
      const vo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const c = clips.find((x) => x.v === e.target);
            if (c) c.on = e.isIntersecting;
          }
          reconcile();
        },
        { threshold: 0 },
      );
      for (const c of clips) vo.observe(c.v);
      mq.addEventListener("change", reconcile);
      document.addEventListener("visibilitychange", reconcile);
      teardown.push(() => {
        vo.disconnect();
        mq.removeEventListener("change", reconcile);
        document.removeEventListener("visibilitychange", reconcile);
      });
    }

    /* ── the two CSS loops, which run only while on screen ─────────── */
    if ("IntersectionObserver" in window) {
      const lo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) e.target.classList.toggle("vis", e.isIntersecting);
        },
        { threshold: 0 },
      );
      for (const el of stage.querySelectorAll(".float, .scrollcue")) lo.observe(el);
      teardown.push(() => lo.disconnect());
    }

    return () => {
      for (const off of teardown) off();
    };
  }, []);

  return null;
}
