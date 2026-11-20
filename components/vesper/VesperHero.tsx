"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  Color,
  BufferGeometry,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import { wordPoints } from "@/lib/wordPoints";

/*
  The particle wordmark.

  Built from the Vesper Studio prompt, licensed to Meg's AnimatedWebs
  account. Two substitutions, for the reasons recorded on the film strip
  before it: the word is her own mark rather than "Vesper", and the
  accents stay in her palette family. Everything else here is the spec —
  120k points, 1.2px, coloured by velocity, assembling over 2.5s on the
  spec's own easing curve, with a cursor attractor of radius 150px and
  strength 0.03.

  **The particles are the one thing on this page that is not evidence,
  and that is fine as long as it stays that way.** It draws a word, not a
  claim: no counts, no logos, no invented screens. The rule it has to keep
  is the one about numbers, and it quotes none.

  **Position is computed on the GPU and never read back.** The vertex
  shader mixes start into target by one uniform and adds drift; the CPU
  touches three floats a frame (progress, time, cursor) regardless of
  whether there are forty thousand points or a hundred and twenty. The
  obvious version updates a Float32Array of 360,000 floats every frame on
  the main thread and drops to single figures on a laptop.
*/

/* The spec's counts, and its breakpoint. */
const COUNT_DESKTOP = 120_000;
const COUNT_MOBILE = 40_000;
const MOBILE_UNDER = 768;

/* The spec's assembly: 2.5s on cubic-bezier(0.16, 1, 0.3, 1). */
const ASSEMBLE_MS = 2500;

/*
  Where the wordmark sits, baked into the geometry rather than applied as
  a transform on the points.

  **A transform would break the cursor attractor.** The shader works in
  the geometry's own space; the cursor arrives in world space. Put a
  scale and an offset on the `<points>` and the two stop agreeing, so the
  particles are pulled toward a spot that is not where the pointer is.
  Folding it into the vertex data keeps one space for everything.

  The offset is right-of-centre because the copy owns the left column on
  this page, the same division the film strip and the hero before it use.
*/
const PLACE_X = 1.25;
const PLACE_Y = -0.05;
/* On the spline, three units in front of where the camera starts, so
   the word is the first thing seen and is flown past rather than cut. */
const PLACE_Z = 7;
const PLACE_SCALE = 0.75;

/* The spec's attractor, in CSS pixels and in strength. */
const ATTRACT_RADIUS_PX = 150;
const ATTRACT_STRENGTH = 0.03;

/*
  cubic-bezier(0.16, 1, 0.3, 1) evaluated for y given x, by bisection.

  Written out rather than approximated with an easing library, because
  this exact curve is what makes the assembly land the way the spec
  describes: almost all of the travel in the first third, then a long
  settle. A generic "easeOutExpo" is close and visibly not it.
*/
function bezier(x: number): number {
  const cx = 3 * 0.16;
  const bx = 3 * (0.3 - 0.16) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * 1;
  const by = 3 * (1 - 1) - cy;
  const ay = 1 - cy - by;
  let t = x;
  for (let i = 0; i < 8; i += 1) {
    const fx = ((ax * t + bx) * t + cx) * t - x;
    const d = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(d) < 1e-6) break;
    t -= fx / d;
  }
  t = Math.max(0, Math.min(1, t));
  return ((ay * t + by) * t + cy) * t;
}

const VERT = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uCursor;
  uniform float uAttractR;
  uniform float uAttractK;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aStart;
  attribute vec3 aTarget;
  attribute float aSeed;

  varying float vSpeed;

  /* Simplex-ish value noise. Cheap on purpose: this runs 120,000 times a
     frame and only has to look organic, not be correct. */
  vec3 drift(vec3 p, float t) {
    return vec3(
      sin(p.x * 0.5 + t * 0.7 + p.z),
      cos(p.y * 0.5 + t * 0.6 + p.x),
      sin(p.z * 0.5 + t * 0.5 + p.y)
    );
  }

  void main() {
    vec3 base = mix(aStart, aTarget, uProgress);

    /* The spec's organic drift, faded out as the word assembles so the
       letterform is readable at rest and alive on the way in. */
    vec3 d = drift(base * 0.5 + aSeed, uTime) * 0.2 * (1.0 - uProgress * 0.82);
    vec3 pos = base + d;

    /* The cursor attractor, applied in world space. */
    vec3 toCursor = uCursor - pos;
    float dist = length(toCursor);
    float pull = uAttractK * max(0.0, 1.0 - dist / uAttractR);
    pos += normalize(toCursor + 1e-6) * pull * dist;

    /* Speed drives the colour. Travel still to come plus the drift is a
       good enough stand-in for velocity without storing one per point. */
    vSpeed = clamp(length(d) * 1.6 + pull * 7.0 + (1.0 - uProgress) * 0.35, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    /*
      **The spec says 1.2px and means 1.2px.** A perspective divisor here
      (multiplying by 12.0 / -mv.z) looks like the right instinct and is
      not: at this
      camera distance it made every point about seven pixels across, so
      120,000 of them overdrew a 565x190 wordmark into a solid white slab
      with additive blending on top. The letters were unreadable and
      nothing had gone wrong anywhere that a test could see.

      Points are a fixed size in CSS pixels, scaled only by the device
      ratio. Depth is carried by the colour and the drift instead.
    */
    gl_PointSize = uSize * uPixelRatio;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uCool;
  uniform vec3 uHot;
  varying float vSpeed;

  void main() {
    /* Round points. A square particle at 1.2px reads as grit. */
    vec2 c = gl_PointCoord - 0.5;
    float r = dot(c, c);
    if (r > 0.25) discard;

    vec3 col = mix(uCool, uHot, vSpeed);
    /* Soft edge, and dimmer at the rim so a dense cluster still has
       structure instead of blowing out to a flat sheet. */
    float a = smoothstep(0.25, 0.02, r);
    /*
      Low per-point alpha, because the picture is built by DENSITY rather
      than by each point being visible. At 0.85 with additive blending any
      pixel carrying more than one particle saturates to white, which is
      the same blob by a second route.
    */
    gl_FragColor = vec4(col, a * 0.22);
  }
`;

export default function VesperHero({
  word,
  still,
  cool,
  hot,
}: {
  word: string;
  still: boolean;
  cool: string;
  hot: string;
}) {
  const points = useRef<Points>(null);
  const { size, viewport, invalidate } = useThree();
  const started = useRef<number | null>(null);
  const cursor = useRef(new Vector3(0, 0, 0));
  const wanted = useRef(new Vector3(0, 0, 0));

  const count = size.width < MOBILE_UNDER ? COUNT_MOBILE : COUNT_DESKTOP;

  /*
    **Wait for the webfont before rasterising the word.** `document.fonts`
    resolves when the faces the page asked for are actually available;
    sampling before that rasterises the fallback, so the particles spell
    the mark in Arial and then never update, because the geometry is
    built once. One await, and the shape is the real one.
  */
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let live = true;
    const done = () => {
      if (live) setFontsReady(true);
    };
    if (typeof document === "undefined" || !document.fonts) {
      done();
    } else {
      document.fonts.ready.then(done).catch(done);
    }
    return () => {
      live = false;
    };
  }, []);

  const geometry = useMemo(() => {
    if (!fontsReady) return null;
    const cloud = wordPoints(word, count, {
      font: "var(--font-space-grotesk), sans-serif",
      weight: 700,
    });
    if (cloud.count === 0) return null;

    const g = new BufferGeometry();
    const start = new Float32Array(count * 3);
    const seed = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      /*
        The cloud starts as a loose shell rather than a cube, so the
        assembly reads as a gathering rather than as a box collapsing.
      */
      const a = (i / count) * Math.PI * 2 * 97.3;
      const z = (i / count) * 2 - 1;
      const r = Math.sqrt(1 - z * z) * (2.6 + (i % 7) * 0.12);
      start[i * 3] = Math.cos(a) * r + PLACE_X;
      start[i * 3 + 1] = Math.sin(a) * r * 0.62 + PLACE_Y;
      start[i * 3 + 2] = z * 2.2 + PLACE_Z;
      seed[i] = (i % 211) * 0.0297;
    }

    /* `position` exists only because three requires it; the shader reads
       aStart and aTarget and ignores it. */
    g.setAttribute("position", new BufferAttribute(start.slice(), 3));
    g.setAttribute("aStart", new BufferAttribute(start, 3));
    /* Scale and place the letterform cloud in the same pass. */
    const target = cloud.positions;
    for (let i = 0; i < count; i += 1) {
      target[i * 3] = target[i * 3] * PLACE_SCALE + PLACE_X;
      target[i * 3 + 1] = target[i * 3 + 1] * PLACE_SCALE + PLACE_Y;
      target[i * 3 + 2] = target[i * 3 + 2] * PLACE_SCALE + PLACE_Z;
    }
    g.setAttribute("aTarget", new BufferAttribute(target, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 1));
    return g;
  }, [word, count, fontsReady]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uCursor: { value: new Vector3(999, 999, 999) },
          uAttractR: { value: 1 },
          uAttractK: { value: ATTRACT_STRENGTH },
          uSize: { value: 1.2 },
          uPixelRatio: { value: 1 },
          uCool: { value: null },
          uHot: { value: null },
        },
      }),
    [],
  );

  /* Colours come in as props so the one place that decides the palette is
     the page, not this file. */
  useEffect(() => {
    material.uniforms.uCool.value = new Color(cool);
    material.uniforms.uHot.value = new Color(hot);
    invalidate();
  }, [material, cool, hot, invalidate]);

  useEffect(() => {
    return () => {
      geometry?.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  /*
    The attractor reads the pointer in world units, which is what makes
    "radius 150px" mean 150px at every window size: the viewport's world
    width divided by its pixel width is the conversion, and it changes
    when the window does.
  */
  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      const el = document.getElementById("vesper-hero");
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      wanted.current.set((nx * viewport.width) / 2, (ny * viewport.height) / 2, 0);
    };
    const onLeave = () => wanted.current.set(999, 999, 999);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [still, viewport.width, viewport.height]);

  useFrame((state, delta) => {
    const u = material.uniforms;

    /*
      Reduced motion gets the end state: assembled, no drift, no
      attractor. The rule is that the fallback shows what the animation
      was travelling toward, and here that is the word.
    */
    if (still) {
      u.uProgress.value = 1;
      u.uTime.value = 0;
      u.uCursor.value.set(999, 999, 999);
      return;
    }

    if (started.current === null) started.current = state.clock.elapsedTime;
    const t = (state.clock.elapsedTime - started.current) * 1000;
    u.uProgress.value = bezier(Math.min(1, t / ASSEMBLE_MS));
    u.uTime.value = state.clock.elapsedTime;

    /* The spec's 0.1 cursor lerp, frame-rate corrected so it settles at
       the same speed on a 120Hz screen as on a 60Hz one. */
    const k = 1 - Math.pow(1 - 0.1, Math.min(delta, 0.05) * 60);
    cursor.current.lerp(wanted.current, k);
    u.uCursor.value.copy(cursor.current);

    const perPx = viewport.width / size.width;
    u.uAttractR.value = ATTRACT_RADIUS_PX * perPx;
    u.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 1.75);
  });

  if (!geometry) return null;
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
