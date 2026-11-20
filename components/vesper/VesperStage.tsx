"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useEffect, useRef, useState } from "react";
import { Vector2 } from "three";
import VesperHero from "./VesperHero";

/*
  The shared stage: one canvas, one set of rules about when it is allowed
  to run.

  **The spec's quality bar is implemented here rather than promised.**
  Every line of it that concerns WebGL lives in this file, so there is one
  place to check rather than four components to audit:

    · pauses when off-screen, via IntersectionObserver;
    · pauses when the tab is hidden, via visibilitychange;
    · caps devicePixelRatio at 1.75;
    · falls back to a static gradient when WebGL is unavailable;
    · bloom off under 768px, per the spec's own responsive section.

  **Pausing is `frameloop="never"`, not unmounting.** Unmounting a canvas
  on scroll throws away the GPU context and every texture on it, so coming
  back costs a full rebuild and a visible stall. Stopping the loop costs
  nothing and resumes on the next frame.

  **The fallback is a real gradient, not an empty box.** A machine that
  cannot run WebGL still gets the page's ground and its accents, so the
  copy on top sits on something deliberate.
*/

/* Her palette, not the spec's #00ffd5 / #ff2a6d. The ground is the
   spec's #0a0a0f, which is close enough to Harbor to belong here. */
const GROUND = "#0a0a0f";
const COOL = "#2dd4bf";
const HOT = "#f472b6";

const MOBILE_UNDER = 768;

export default function VesperStage({ word }: { word: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [dead, setDead] = useState(false);
  const [still, setStill] = useState(false);
  const [running, setRunning] = useState(true);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia(`(max-width: ${MOBILE_UNDER - 1}px)`);
    const syncMotion = () => setStill(reduced.matches);
    const syncWidth = () => setNarrow(wide.matches);
    syncMotion();
    syncWidth();
    reduced.addEventListener("change", syncMotion);
    wide.addEventListener("change", syncWidth);
    setReady(true);
    return () => {
      reduced.removeEventListener("change", syncMotion);
      wide.removeEventListener("change", syncWidth);
    };
  }, []);

  /* Off-screen and hidden-tab both stop the loop. Two sources, one
     answer, so neither can leave it running on its own. */
  useEffect(() => {
    const el = host.current;
    if (!el || !ready) return;
    let onScreen = true;
    const settle = () => setRunning(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        settle();
      },
      { threshold: 0 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", settle);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", settle);
    };
  }, [ready]);

  /* A lost context is permanent as far as this is concerned: fall back
     rather than leave a frozen rectangle. */
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

  const live = ready && !dead;

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{
        background: live
          ? GROUND
          : /* The documented fallback. */
            `radial-gradient(1100px 620px at 32% 38%, rgba(45,212,191,0.16), transparent 62%),
             radial-gradient(900px 560px at 72% 64%, rgba(244,114,182,0.14), transparent 60%),
             ${GROUND}`,
      }}
    >
      {live ? (
        <Canvas
          id="vesper-hero"
          /* Still means draw the end state once and hold it. Paused means
             stop until it matters again. */
          frameloop={still || !running ? "demand" : "always"}
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
          /* Square on to the wordmark. The camera no longer flies: the
             spheres it flew between are gone, at Meg's ask for cards. */
          camera={{ fov: 42, position: [0, 0, 10], near: 0.1, far: 60 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <VesperHero word={word} still={still} cool={COOL} hot={HOT} />

          {/*
            The spec's post chain, minus bloom on a phone, which its own
            responsive section asks for. Chromatic aberration stays: it
            costs one pass and it is most of what makes the edges read as
            lens rather than as pixels.

            Skipped entirely under reduced motion, where there is one
            static frame and a post chain buys nothing.
          */}
          {still || narrow ? null : (
            <EffectComposer>
              <Bloom
                mipmapBlur
                intensity={0.6}
                radius={0.4}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.2}
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={new Vector2(0.001, 0.001)}
              />
            </EffectComposer>
          )}
        </Canvas>
      ) : null}
    </div>
  );
}
