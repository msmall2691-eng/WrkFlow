"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/*
  Everything that has to be true before any 3D code is downloaded, let
  alone drawn.

  **The scene is not on the critical path and must never become it.** The
  import below is dynamic with `ssr: false`, so three.js and the scene are
  a separate chunk fetched after the page is interactive. The homepage's
  First Load JS is the number this whole piece of work is judged on, and
  it is recorded in the PR for exactly that reason.

  **Reduced motion is honored by going still, not by going blank.** The
  rule in CLAUDE.md is that the fallback shows the end state. So the scene
  still renders, held on one frame, and the preference has ONE reader here
  which it passes down. That is the correction from #148, where the same
  question was asked in four places and three of the answers went stale,
  found over three rounds of review.
*/

const Stage = dynamic(() => import("./Stage"), { ssr: false });

/**
 * Can this browser actually draw the scene?
 *
 * Asked once, on the client, before the chunk is requested. A machine
 * that cannot do WebGL should not pay to download three.js to find out.
 * Software rendering and blocklisted drivers both land here, which is the
 * same population that wants the CSS fallback anyway.
 */
function canRender(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    /* Release it immediately: a browser allows a small number of live
       contexts, and the real one has not been created yet. */
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function StageMount() {
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);
  const [dead, setDead] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canRender()) return;

    /*
      One reader for the motion preference, subscribed for changes rather
      than sampled at mount. Turning reduced motion on with the page open
      is the moment it matters most, and the version of this that reads it
      once is the bug that took three review rounds to clear in #148.
    */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setStill(reduced.matches);
    syncMotion();
    reduced.addEventListener("change", syncMotion);

    setReady(true);
    return () => reduced.removeEventListener("change", syncMotion);
  }, []);

  /*
    A lost context is permanent as far as this component is concerned:
    unmount rather than show a frozen or black rectangle. The page
    underneath is complete without it, which is the point of building the
    scene as a background rather than as content.
  */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const onLost = (e: Event) => {
      e.preventDefault();
      setDead(true);
    };
    el.addEventListener("webglcontextlost", onLost, true);
    return () => el.removeEventListener("webglcontextlost", onLost, true);
  }, [ready]);

  /*
    Tell the stylesheet the stage is really here, which is what lets `.cp`
    go transparent. Set only when mounted and cleared on unmount or a lost
    context, so the page never ends up transparent with nothing behind it.
  */
  useEffect(() => {
    const on = ready && !dead;
    const root = document.documentElement;
    if (on) root.dataset.stage = "on";
    else delete root.dataset.stage;
    return () => {
      delete root.dataset.stage;
    };
  }, [ready, dead]);

  if (dead) return null;

  return (
    <div
      ref={host}
      aria-hidden="true"
      /*
        Behind everything, ignoring the pointer, and clipped. `fixed` so the
        space stays put while the content scrolls through it, which is what
        makes it read as one place rather than a decoration attached to the
        top of a page.
      */
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {ready ? <Stage still={still} /> : null}
    </div>
  );
}
