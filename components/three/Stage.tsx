"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";

/*
  Loaded lazily so a route that never shows the storefront never
  downloads gsap, postprocessing, the transmission material or `<Html>`,
  and never registers a scroll plugin.

  **It is worth saying what this is NOT, because I argued the opposite
  for an hour.** I believed a static import here had broken twelve tests
  across the demos, the case study, the nav and the contact form. It had
  not. Those failures were seven stray `next-server` processes I had left
  running, which starved the machine: `pkill -f "next start"` kills the
  npx wrapper and leaves the server child alive, and they had been piling
  up all session. On an idle machine the same tree passes 48/48 in 42s.

  So this is an ordinary and correct piece of code splitting, kept on its
  own merits, and not the fix for a bug that never existed. Recorded
  because a confident wrong diagnosis in a comment is worse than no
  comment: the next person would optimise against a ghost.
*/
const StorefrontEngine = lazy(() => import("./StorefrontEngine"));
import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  MathUtils,
  Points,
} from "three";
import { useStageTheme, type StageTheme } from "./useStageTheme";

/*
  The stage: one 3D space that sits behind the whole site.

  **Why one canvas and not an effect per page.** Meg asked for "immersive
  background interactive 3d ... for the entire site". A scene per section
  reads as a page with effects bolted on; a single space that persists
  while the content moves through it reads as a place. That is the whole
  difference between this and the thing she has twice said she did not
  want.

  It is deliberately quiet. CLAUDE.md records that the first cut of the V2
  homepage was too busy and that one orchestrated moment per page is the
  budget. So this does not compete with the content: it is depth, a slow
  drift, and a response to the pointer. The loud moment stays the hero.

  Everything it draws is geometry and the site's own colour tokens. No
  textures, no models, no photographs are loaded here, so it adds no
  network weight beyond its own code.
*/

/** Motes in the volume. Low enough to cost nothing on an integrated GPU. */
const MOTE_COUNT = 420;

/*
  A field of motes in a slab of space, drifting upward and wrapping.

  Points rather than instanced meshes: there are hundreds of them, they are
  round blurs rather than objects, and a single draw call is the difference
  between this being free and this being a frame-rate decision.
*/
function Motes({ theme }: { theme: StageTheme }) {
  const ref = useRef<Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(MOTE_COUNT * 3);
    const drift = new Float32Array(MOTE_COUNT);
    for (let i = 0; i < MOTE_COUNT; i += 1) {
      positions[i * 3] = MathUtils.randFloatSpread(26);
      positions[i * 3 + 1] = MathUtils.randFloat(-4, 10);
      positions[i * 3 + 2] = MathUtils.randFloat(-18, 4);
      drift[i] = MathUtils.randFloat(0.08, 0.26);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("aDrift", new BufferAttribute(drift, 1));
    return g;
  }, []);

  /* Dispose explicitly: a geometry built in a memo is not garbage until
     three is told, and this component outlives several route changes. */
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const points = ref.current;
    if (!points) return;
    const pos = points.geometry.getAttribute("position") as BufferAttribute;
    const drift = points.geometry.getAttribute("aDrift") as BufferAttribute;
    /* Clamp delta so a backgrounded tab returning does not teleport every
       mote through the ceiling in one frame. */
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < pos.count; i += 1) {
      let y = pos.getY(i) + drift.getX(i) * dt;
      if (y > 10) y = -4;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      {/*
        Additive in Harbor so motes read as light in a dark room; normal in
        Daylight, where additive on cream washes out to nothing. Same
        geometry, two readings of it, which is the theme rule applied to a
        blend mode rather than to a colour.
      */}
      <pointsMaterial
        size={theme.dark ? 0.035 : 0.028}
        sizeAttenuation
        color={theme.ink}
        transparent
        opacity={theme.dark ? 0.5 : 0.28}
        blending={theme.dark ? AdditiveBlending : undefined}
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ still, rich }: { still: boolean; rich: boolean }) {
  const theme = useStageTheme();
  const group = useRef<Group>(null);
  const { scene, gl, invalidate } = useThree();

  /*
    Fog AND clear colour follow the page's ground, re-applied on every
    theme change.

    **The clear colour was set once in `onCreated` and that was a bug of
    exactly the kind this file's theme hook exists to prevent.** It is a
    copy held by the renderer, so switching to Harbor left the canvas
    clearing to Daylight cream while the site's text went light: a cream
    page with near-white headings, caught by looking at a screenshot
    rather than by any test. Same shape as #148's frozen `fillStyle`, one
    layer down in the stack.
  */
  useEffect(() => {
    scene.fog?.color.copy(theme.ground);
    gl.setClearColor(theme.ground, 1);
    invalidate();
  }, [scene, gl, invalidate, theme]);

  return (
    <group ref={group}>
      <fog attach="fog" args={[`#${theme.ground.getHexString()}`, 10, 34]} />
      {/* Atmosphere everywhere; the storefront only where it sells. */}
      <Motes theme={theme} />
      {rich ? (
        <Suspense fallback={null}>
          <StorefrontEngine still={still} />
        </Suspense>
      ) : null}
    </group>
  );
}

export default function Stage({ still = false }: { still?: boolean }) {
  const pathname = usePathname();
  /*
    **No software-renderer gate here, and that is deliberate.**

    One was added when the twelve failures above looked like a frame-rate
    problem: it skipped the scene on SwiftShader and llvmpipe. The
    failures turned out to be stray processes, so the gate was protecting
    nothing, and it had a real cost: headless Chromium reports exactly
    those renderers, so it would have quietly excluded the showpiece from
    every CI run. A gate that makes a feature untestable is worse than no
    gate when the thing it guards against has not been measured.

    If a real device measurement later says a weak GPU struggles, it
    comes back with that measurement attached.
  */
  const rich = pathname === "/" && !still;

  return (
    <Canvas
      /*
        `still` is reduced motion, and it renders rather than renders
        nothing. CLAUDE.md's rule is that the fallback shows the END state,
        not a blank: somebody who cannot have animation should still get the
        space, just held. "demand" draws once and then only when asked.
      */
      frameloop={still ? "demand" : "always"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      camera={{ fov: 42, position: [0, 0.6, 6.5], near: 0.1, far: 60 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene still={still} rich={rich} />
    </Canvas>
  );
}
