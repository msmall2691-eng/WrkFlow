"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
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

/** How far the camera leans toward the pointer. Small on purpose. */
const PARALLAX = 0.45;
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

/*
  The floor: concentric rings of line segments receding into the fog.

  Built by hand rather than with drei's Grid because what this wants is an
  architect's drawing fading into distance, which is the language the hero
  already speaks, and because hand-built geometry is a few dozen lines
  against a dependency with its own shader.
*/
function Floor({ theme }: { theme: StageTheme }) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    const half = 22;
    const step = 1.6;
    for (let x = -half; x <= half; x += step) {
      pts.push(x, 0, -half, x, 0, half);
    }
    for (let z = -half; z <= half; z += step) {
      pts.push(-half, 0, z, half, 0, z);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} position={[0, -3.2, -6]}>
      <lineBasicMaterial
        color={theme.line}
        transparent
        opacity={theme.dark ? 0.22 : 0.16}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/*
  Pointer parallax and scroll depth.

  The camera leans toward the pointer and dollies as the page scrolls, so
  the space has somewhere to be looked at from. Both are damped rather than
  followed, because a camera pinned to the cursor is the thing that makes a
  3D background feel cheap.

  This writes to the camera inside `useFrame` and never to React state, so
  moving the mouse across the site re-renders nothing.
*/
function Rig() {
  const { camera, size } = useThree();
  const target = useRef({ x: 0, y: 0, scroll: 0 });

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      target.current.scroll = Math.min(1, window.scrollY / max);
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((_, delta) => {
    const t = target.current;
    /* Frame-rate independent damping, so a 120Hz display and a 60Hz one
       settle at the same speed rather than one being twice as twitchy. */
    const k = 1 - Math.pow(0.0015, Math.min(delta, 0.05));
    /* Parallax is scaled down on a narrow screen: the same lean that reads
       as depth at 1440 reads as a wobble at 390. */
    const scale = size.width < 760 ? 0.35 : 1;
    camera.position.x = MathUtils.lerp(camera.position.x, t.x * PARALLAX * scale, k);
    camera.position.y = MathUtils.lerp(
      camera.position.y,
      0.6 - t.y * PARALLAX * 0.6 * scale,
      k,
    );
    camera.position.z = MathUtils.lerp(camera.position.z, 6.5 - t.scroll * 3.2, k);
    camera.lookAt(0, 0.4, -6);
  });

  return null;
}

function Scene() {
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
      <fog attach="fog" args={[`#${theme.ground.getHexString()}`, 8, 30]} />
      <ambientLight intensity={theme.dark ? 0.6 : 1.1} />
      <Floor theme={theme} />
      <Motes theme={theme} />
      <Rig />
    </group>
  );
}

export default function Stage({ still = false }: { still?: boolean }) {
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
      <Scene />
    </Canvas>
  );
}
