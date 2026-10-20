"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
  Mounts its children once they are near the viewport, and not before.

  This exists for the two decorative canvases. Both already pause their
  animation off-screen, which is the right behaviour and was not enough: the
  pause only parks the frame loop. Mounting still creates the context and,
  for the aurora, compiles a WebGL program — synchronous main-thread work
  that ran during hydration, while the hero was trying to paint. The
  homepage's LCP is a screenshot that finishes downloading at 95ms and then
  waits over two seconds for a free main thread, so anything that can be
  taken out of that window should be.

  Both canvases sit well below the fold, so for a visitor who never scrolls
  this is work that never needed to happen at all.

  Deliberately plain: no placeholder, no height reservation, no fade. These
  children are `aria-hidden` decoration layered behind real content in an
  absolutely-positioned box, so arriving late shifts nothing (CLS stays 0)
  and announces nothing. `rootMargin` starts the work before the visitor
  gets there, so by the time the section is on screen it is already drawing.

  Not a substitute for the children's own guards — they keep their
  reduced-motion and off-screen handling, since this only decides when they
  first exist.
*/
export default function WhenNear({
  children,
  /* One viewport of lead time: enough to be ready, late enough to miss load. */
  rootMargin = "200px",
}: {
  children: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /*
      No IntersectionObserver means show it: this is progressive
      enhancement for *when*, never *whether*. Same reason there is no
      no-JS story to write here — without JS the canvases would not draw
      anyway, and what they draw is ornament.
    */
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        /* One-way: once mounted it stays, so scrolling past and back does
           not recompile a shader. */
        io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  /*
    The sentinel fills its positioned ancestor instead of being a 1px marker.
    It was `sr-only` first, which never fired: that class clips the box to
    nothing, and a zero-area element is not reliably reported as
    intersecting, so the canvases never mounted at all. Filling the section
    is also more accurate about what we are waiting for, which is the
    section arriving, not a point in it.

    `inset-0` with `pointer-events-none` inside the `relative` wrapper these
    decorations already live in: no layout effect, nothing clickable, and
    nothing for a screen reader.
  */
  return (
    <>
      <span
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      />
      {near ? children : null}
    </>
  );
}
