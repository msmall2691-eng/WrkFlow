"use client";

import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/*
  The scene as the brief specifies it: a fixed, full-screen canvas on a
  slate-950 ground, carrying the glass storefront and the engine beneath
  it.

  **This is the standalone wrapper. The scene itself lives in
  `components/three/StorefrontEngine.tsx` and is shared.** Two entry
  points, one scene, because the homepage and the demo route want the
  same object on different grounds: the homepage has two themes and a
  pre-paint script, so its ground follows the palette; this route is
  dark by definition, so it takes the brief's `bg-slate-950` literally.
  Copying the scene to give it a second background would be the start of
  two scenes that drift, which is the failure this repo keeps recording
  about anything described in more than one place.

  `ssr: false` because three.js touches `window` on import, and a canvas
  rendered on the server is a hydration mismatch waiting to happen.
*/

const StorefrontEngine = dynamic(() => import("./three/StorefrontEngine"), {
  ssr: false,
});

export default function StorefrontEngineScene() {
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    /*
      WebGL is checked before the chunk is requested: a machine that
      cannot draw the scene should not pay to download three.js to find
      out. The probe context is released immediately, because browsers
      allow only a handful of live contexts and the real one does not
      exist yet.
    */
    let ok = false;
    try {
      const probe = document.createElement("canvas");
      const gl =
        probe.getContext("webgl2") ??
        probe.getContext("webgl") ??
        probe.getContext("experimental-webgl");
      ok = !!gl;
      (gl as WebGLRenderingContext | null)
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext();
    } catch {
      ok = false;
    }
    if (!ok) return;

    /*
      One reader for the motion preference, subscribed rather than
      sampled. Reading it once at mount is the bug that took three rounds
      of review to clear on the previous hero: turning the setting on with
      the page open is the moment it matters most.
    */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(reduced.matches);
    sync();
    reduced.addEventListener("change", sync);
    setReady(true);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950"
    >
      {ready ? (
        <Canvas
          /* `still` is reduced motion: draw once and hold, rather than
             show nothing. The fallback shows the end state. */
          frameloop={still ? "demand" : "always"}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          camera={{ fov: 42, position: [0, 3.2, 7.5], near: 0.1, far: 60 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <StorefrontEngine still={still} />
        </Canvas>
      ) : null}
    </div>
  );
}
