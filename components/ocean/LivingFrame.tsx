"use client";

import { useEffect, useRef, useState } from "react";
import { FRAME_SHELL } from "./CastFrame";

/*
  A CastFrame that moves.

  **The reef, actually alive**, which is Meg's ask: the section arguing that
  an ecosystem runs unsupervised was making that argument with a photograph.
  This is her own `Shot_01`, the footage the four cast stills were cut from,
  running as a slow loop.

  **It is not on the pinned map, and that is a finding rather than a
  preference.** The obvious place for this was behind the reef annotations
  on the homepage, and it cannot go there. `Shot_01` is a continuous
  push-in: it opens on the composed reef that `reef.webp` is frame 0 of,
  travels past the octopus and the turtle, and ends out in open water with
  a shark. Checked frame by frame across all fourteen seconds, there is no
  window where it holds still. Pins are placed in percentages against a
  fixed composition, so on moving footage every one of them drifts off its
  creature within a second or two — and `lib/reef.ts` is explicit that a pin
  pointing at empty water is worse than no pin. So the map keeps its still
  and the motion goes to a band that annotates nothing.

  **The loop is seamless because the file is cut that way, not because the
  browser is kind.** `loop` restarts at frame 0, and frame 0 of a travelling
  shot looks nothing like frame 14, so a plain loop jumps hard every pass.
  The file crossfades its own tail back over its head: the blend comes
  first, ending on the head at 1.5s, and the body runs from 1.5s to the
  point the tail was taken from. Both joins are then continuous, and the
  poster is the loop's own first frame so starting playback is not a cut
  either.

  **It pauses off-screen, which CLAUDE.md requires of anything that loops**,
  and it never mounts at all under `prefers-reduced-motion` — the poster is
  a real `<img>` underneath, so that path shows the reef rather than a hole.
  There is no `play` promise to chase on first paint: the observer starts it
  when it is actually in view.
*/
export default function LivingFrame({
  video,
  poster,
  alt,
  aspect = "aspect-[21/9]",
  className = "",
  priority = false,
}: {
  /** The loop. Cut to be seamless; see above. */
  video: string;
  /** The loop's own first frame. */
  poster: string;
  alt: string;
  aspect?: string;
  className?: string;
  /*
    Load the poster eagerly because this frame is the first image on its
    page. Off by default and deliberately so: the lazy poster is right
    for a band further down, and a page with two eager heroes has none.

    **It exists because swapping a `CastFrame` for a `LivingFrame`
    silently dropped it.** `CastFrame` takes `priority`, /tools passed
    it, and the comment there spelled out why — "genuinely the first
    image on the page and nothing else competes with it here". This
    component had no such prop, so the swap turned the page's largest
    element into a lazy load and nothing failed: the build was clean,
    the suite was green, and the only symptom was a slower first paint
    on one page. The prop the old component had was load-bearing, and
    not checking for that is the seam-check rule this repo already
    writes down.
  */
  priority?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const sync = () => setMoving(!reduced.matches && !conn?.saveData);
    sync();
    reduced.addEventListener("change", sync);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = host.current;
    const v = film.current;
    if (!el || !v || !moving) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !document.hidden) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [moving]);

  return (
    <figure ref={host} className={`m-0 ${className}`}>
      <div className={`${FRAME_SHELL} ${aspect}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
        {moving ? (
          <video
            ref={film}
            className="absolute inset-0 h-full w-full object-cover"
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : null}
      </div>
    </figure>
  );
}
