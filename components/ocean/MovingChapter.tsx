"use client";

import { useEffect, useRef } from "react";

/*
  A chapter that moves: one of Meg's clips, full width, with the same
  screen of black around it that a still chapter gets.

  **This exists because she gave me nine clips and the site used one.**
  The page had a four-second hero loop and nothing else moving, which is
  tasteful and is not what she asked for: likeakinginc.com, the reference
  she keeps naming, animates a third of its elements down nineteen
  thousand pixels of page. One loop at the top is a static page with a
  video on it.

  **Nothing downloads until you are nearly there.** `preload="none"` plus
  an IntersectionObserver with a 25% root margin: a visitor who never
  scrolls past the shop pays nothing at all for these, and the three
  together are 2.7MB that arrives one clip at a time as you descend. The
  observer is also what pauses them — a chapter off screen is a decoded
  frame nobody is looking at, which on a laptop is the battery.

  **The poster is the clip's own first frame**, so the chapter reads
  correctly before the video arrives, if it never arrives, and under
  `prefers-reduced-motion`, where it is a still chapter and nothing more.
  That is the same posture as the hero: the motion is removed rather than
  paused, because a paused video has still paid for the decode.

  The still `Chapter` is not replaced. A picture is right where the page
  wants a held breath; a clip is right where it wants the ocean to be
  alive. Both keep the emptiness around them, which is the part that
  makes either one land.
*/
export default function MovingChapter({
  id,
  clip,
  poster,
  className = "",
}: {
  id: string;
  /** Path under /ocean/video, without extension. */
  clip: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    /*
      **Three things decide whether this plays, so one function owns the
      answer and every input just re-asks it.**

      The first version let the IntersectionObserver call `play()` and
      gave visibility and the motion preference a `pause()` each, which a
      review bot caught: neither of those inputs changes the
      *intersection*, so nothing ever started the clip again. Switch tabs
      with a chapter on screen and come back and it was frozen for the
      rest of the visit, still on screen, still claiming to be a looping
      video; turn reduced motion off again and it stayed stopped. Only
      scrolling it out of view and back revived it.

      It reads as two small omissions and it is really one shape error:
      playback is a function of three conditions and it was being written
      from three places that each knew one of them. `Drift` already does
      it this way in this same change, which is the tell worth keeping —
      the two halves of the page's motion disagreed about their own rule.
    */
    let onScreen = false;

    function reconcile() {
      if (!v) return;
      if (onScreen && !mq.matches && !document.hidden) {
        /* `preload` alone does not start a fetch on an element that was
           created with "none": the browser has already decided not to
           load. `load()` is what actually begins it. Without this the
           clip sat at readyState 0 for ever and the poster was all
           anyone ever saw. */
        if (v.preload !== "auto") {
          v.preload = "auto";
          v.load();
        }
        void v.play().catch(() => {
          /* Autoplay refused (a policy, a codec, a data saver). The
             poster stays, which is the whole fallback. */
        });
      } else {
        v.pause();
      }
    }

    /* Nothing is fetched until the observer says so, so this is also what
       keeps the clip off the wire for a visitor who never reaches it. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) onScreen = e.isIntersecting;
        reconcile();
      },
      { rootMargin: "25% 0px 25% 0px", threshold: 0.01 },
    );
    io.observe(v);

    /* Both of these are requests a visitor can change while the page is
       open, in either direction, which is the half that was missing. */
    mq.addEventListener("change", reconcile);
    document.addEventListener("visibilitychange", reconcile);

    return () => {
      io.disconnect();
      mq.removeEventListener("change", reconcile);
      document.removeEventListener("visibilitychange", reconcile);
    };
  }, []);

  return (
    <div
      id={id}
      aria-hidden="true"
      data-moving-chapter=""
      className={`relative w-full py-[18vh] md:py-[26vh] ${className}`}
    >
      <video
        ref={ref}
        className="block h-[42vh] w-full object-cover md:h-[62vh]"
        loop
        muted
        playsInline
        preload="none"
        poster={poster}
      >
        {/* H.264 first and WebM second, which is the opposite of the
            hero and deliberate: for these clips x264 produced the
            smaller file, and H.264 is the one format every browser that
            matters decodes. The WebM is a real fallback rather than
            decoration — some Linux builds ship without H.264, and the
            browser the test suite drives is one of them, which is how
            the missing `load()` above was caught at all. */}
        <source src={`/ocean/video/${clip}.mp4`} type="video/mp4" />
        <source src={`/ocean/video/${clip}.webm`} type="video/webm" />
      </video>
    </div>
  );
}
