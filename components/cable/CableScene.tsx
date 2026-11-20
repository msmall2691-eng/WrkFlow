"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Vector3,
  type ShaderMaterial,
} from "three";
import type { CableStage } from "@/lib/cable";

/*
  Follow the Cable — the scene.

  **Procedural, not assets.** Granite, the groove, the fiber and the glass
  are all geometry and shaders, as the spec asks for a first pass. Nothing
  here loads a texture, so the whole scene is the code that draws it and
  there is no image to wait on after the chunk arrives.

  **Three.js is back, and that is a real cost worth naming.** It was
  removed earlier the same day with the particle wordmark, which took the
  homepage from 4,317 KB of JavaScript to 435 KB. This re-adds `three` and
  `@react-three/fiber` and deliberately **not** `drei` or `postprocessing`:
  the camera move is twenty lines of lerp, and a bloom pass on a scene
  whose whole subject is one thin emissive line is the wrong trade. The
  module is loaded by `next/dynamic` from the hero, so the headline, the
  buttons and the still frame are on screen before any of it is requested.

  **The quality rules live here**, one place to audit rather than four:

    · capped at devicePixelRatio 1.75;
    · `frameloop` drops to "demand" the moment the camera has settled and
      no pulse is running, so a still scene costs nothing;
    · pauses entirely off-screen and on a hidden tab;
    · the canvas is `pointer-events: none`, so page scroll and every HTML
      control underneath keep working at every stage. The spec requires
      scrolling past the hero to be possible throughout, and the surest way
      to guarantee that is for the canvas to never receive a pointer at all.
*/

/* The cable's path, in slab space. The slab lies in XZ with the camera low
   and to the left, so the cable runs left to right across the frame and the
   seam cuts it near the middle. */
const SEAM_X = 0.6;
const SPLIT = new Vector3(2.6, 0.045, 0);

const TRUNK = new CatmullRomCurve3([
  new Vector3(-9.0, 0.045, 2.2),
  new Vector3(-5.6, 0.045, 1.75),
  new Vector3(-2.4, 0.045, 1.15),
  new Vector3(SEAM_X, 0.045, 0.52),
  new Vector3(1.7, 0.045, 0.2),
  SPLIT,
]);

const BRANCH_BRING = new CatmullRomCurve3([
  SPLIT,
  new Vector3(3.9, 0.045, -0.7),
  new Vector3(5.6, 0.045, -2.0),
  new Vector3(8.4, 0.045, -3.0),
]);

const BRANCH_KEEP = new CatmullRomCurve3([
  SPLIT,
  new Vector3(3.9, 0.045, 0.8),
  new Vector3(5.6, 0.045, 2.1),
  new Vector3(8.4, 0.045, 3.2),
]);

/* Where the camera sits and what it looks at, per stage. `travel` is not
   here: it is the journey to `split`, and the rig interpolates it. */
const SHOTS: Record<Exclude<CableStage, "travel">, { pos: Vector3; at: Vector3 }> = {
  rest: { pos: new Vector3(-5.2, 0.95, 4.3), at: new Vector3(-1.4, 0.05, 1.0) },
  /*
    **These three look along the cable, not across it, and that is a fix
    rather than a taste.** A high shot placed near the seam puts the camera
    almost on top of the slot between the two slabs, and a 0.2-wide slot
    seen from directly above fans out in perspective into a black wedge
    across the whole frame. Sighting down +x from well before the seam
    foreshortens the slot back into the thin dark line it is, and has the
    happy second effect of making the two branches, which diverge in z,
    spread symmetrically left and right.

    The two branch shots share a camera position and differ only in aim, so
    moving between them is a pan rather than a flight back across the seam.
  */
  split: { pos: new Vector3(-4.6, 2.2, 0.15), at: new Vector3(6.5, 0.0, 0.1) },
  bring: { pos: new Vector3(-1.1, 1.9, 0.9), at: new Vector3(7.4, 0.0, -2.5) },
  keep: { pos: new Vector3(-1.1, 1.9, 0.9), at: new Vector3(7.4, 0.0, 2.7) },
};

const GRANITE_VERT = `
varying vec3 vWorld;
varying vec3 vNrm;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vNrm = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

/* Charcoal granite: value-noise mottling at two scales, plus sparse bright
   specks for mica that only show where the grazing light reaches. The light
   falls off across X so the left of the slab is lit and the right sinks,
   which is what keeps the type side quiet. */
const GRANITE_FRAG = `
precision highp float;
varying vec3 vWorld;
varying vec3 vNrm;
uniform vec3 uLightDir;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = vWorld.xz * 1.7;
  float grain = fbm(p * 2.3);
  float coarse = fbm(p * 0.55);
  vec3 base = mix(vec3(0.052, 0.052, 0.062), vec3(0.17, 0.167, 0.188), grain * 0.72 + coarse * 0.34);

  float graze = max(dot(normalize(vNrm), normalize(uLightDir)), 0.0);
  float falloff = smoothstep(10.0, -8.0, vWorld.x);
  vec3 col = base * (0.22 + 1.05 * graze * falloff);

  /* Mica, round and fine. The first pass thresholded a whole noise cell,
     which drew square confetti the size of gravel; this takes the distance
     to each cell's centre so a fleck is a speck. */
  vec2 cell = p * 140.0;
  vec2 ci = floor(cell);
  vec2 cf = fract(cell) - 0.5;
  float m = hash(ci);
  float flake = smoothstep(0.993, 1.0, m) * smoothstep(0.4, 0.02, length(cf));
  col += flake * (0.3 + 1.2 * falloff) * vec3(0.86, 0.85, 0.96);

  /* No hard horizon: the slab fades into the dark rather than ending in a
     visible straight edge against nothing. */
  float far = smoothstep(7.0, 30.0, length(vWorld - cameraPosition));
  col = mix(col, vec3(0.028, 0.028, 0.036), far);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const FIBER_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/* The core reads violet at rest; the pulse is a travelling teal gaussian in
   the tube's own length coordinate, so it runs inside the fiber rather than
   over it. */
const FIBER_FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uPulse;
uniform float uOn;
uniform float uTail;
uniform vec3 uCore;
uniform vec3 uHot;

void main() {
  float along = vUv.x;
  float d = along - uPulse;
  float head = exp(-d * d * 420.0);
  float tail = d < 0.0 ? exp(d * 9.0) * 0.5 : 0.0;
  float g = (head + tail * uTail) * uOn;
  vec3 col = uCore + uHot * g * 2.6;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

function Granite() {
  const lightDir = useMemo(() => new Vector3(-0.75, 0.45, 0.5), []);
  const uniforms = useMemo(() => ({ uLightDir: { value: lightDir } }), [lightDir]);

  /* Two slabs with a gap, not one slab with a drawn line: the seam has to
     have depth, because the whole point of the shot is light crossing it. */
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9 + SEAM_X, 0, 0]}>
        <planeGeometry args={[18, 26]} />
        <shaderMaterial
          vertexShader={GRANITE_VERT}
          fragmentShader={GRANITE_FRAG}
          uniforms={uniforms}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[9 + SEAM_X + 0.22, 0, 0]}>
        <planeGeometry args={[18, 26]} />
        <shaderMaterial
          vertexShader={GRANITE_VERT}
          fragmentShader={GRANITE_FRAG}
          uniforms={uniforms}
        />
      </mesh>
      {/* The gap itself, dropped below the surface so it reads as a cut
          rather than a painted stripe. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[SEAM_X + 0.11, -0.13, 0]}>
        <planeGeometry args={[0.2, 26]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

function Groove({ curve }: { curve: CatmullRomCurve3 }) {
  return (
    <mesh position={[0, -0.012, 0]}>
      <tubeGeometry args={[curve, 160, 0.03, 10, false]} />
      <meshBasicMaterial color="#07070a" side={BackSide} />
    </mesh>
  );
}

function Fiber({
  curve,
  tint,
  pulse,
  on,
  tail,
}: {
  curve: CatmullRomCurve3;
  tint: string;
  pulse: React.RefObject<number>;
  on: React.RefObject<number>;
  tail: number;
}) {
  const mat = useRef<ShaderMaterial>(null);
  const glow = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uPulse: { value: 0 },
      uOn: { value: 0 },
      uTail: { value: tail },
      uCore: { value: new Color(tint).multiplyScalar(0.42) },
      uHot: { value: new Color("#2dd4bf") },
    }),
    [tint, tail],
  );
  const glowUniforms = useMemo(
    () => ({
      uPulse: { value: 0 },
      uOn: { value: 0 },
      uTail: { value: tail },
      uCore: { value: new Color(tint).multiplyScalar(0.07) },
      uHot: { value: new Color("#2dd4bf").multiplyScalar(0.33) },
    }),
    [tint, tail],
  );

  useFrame(() => {
    const p = pulse.current ?? 0;
    const o = on.current ?? 0;
    if (mat.current) {
      mat.current.uniforms.uPulse.value = p;
      mat.current.uniforms.uOn.value = o;
    }
    if (glow.current) {
      glow.current.uniforms.uPulse.value = p;
      glow.current.uniforms.uOn.value = o;
    }
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 240, 0.0085, 8, false]} />
        <shaderMaterial
          ref={mat}
          vertexShader={FIBER_VERT}
          fragmentShader={FIBER_FRAG}
          uniforms={uniforms}
        />
      </mesh>
      {/* A wider additive sleeve for the bloom, which keeps the glow tight
          to the fiber instead of washing the stone. */}
      <mesh>
        <tubeGeometry args={[curve, 240, 0.034, 8, false]} />
        <shaderMaterial
          ref={glow}
          vertexShader={FIBER_VERT}
          fragmentShader={FIBER_FRAG}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function EtchedGlass() {
  /*
    **Additively blended, and that is a bug fix rather than a style.** The
    first version was a 7.2 x 6.4 alpha-blended quad lying just above the
    slab. Seen from the wide shot, which sights almost along it, it covered
    most of the frame and rendered as a hard black wedge across the stone —
    found by bisecting the scene one object at a time, because the edges
    were too straight to be shading.

    Additive blending makes that failure unrepresentable: this layer can
    only ever add light, so however the camera meets it, it cannot darken
    the granite underneath. It is also smaller now, and sits where the
    split actually is rather than spanning the whole right of the slab.
  */
  return (
    <group position={[4.4, 0.24, 0.1]} rotation={[-Math.PI / 2, 0, -0.05]}>
      <mesh>
        <planeGeometry args={[5.0, 4.4]} />
        <meshBasicMaterial
          color="#39506b"
          transparent
          opacity={0.1}
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      {/* The etched edge: the one hard highlight that says "glass" rather
          than "haze". A four-segment ring is a square outline. */}
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[2.44, 2.48, 4]} />
        <meshBasicMaterial
          color="#b9c8d8"
          transparent
          opacity={0.22}
          side={DoubleSide}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* The camera. One critically-damped move per stage change, which is what
   makes it read as a guided shot rather than a drift. */
const TRAVEL_SECONDS = 3.1;

function Rig({
  stage,
  still,
  onSettled,
  onTravelEnd,
}: {
  stage: CableStage;
  still: boolean;
  onSettled: () => void;
  onTravelEnd: () => void;
}) {
  const { camera } = useThree();
  const target = useRef(new Vector3());
  const look = useRef(new Vector3());
  const settled = useRef(false);
  const t = useRef(0);
  const scratch = useRef(new Vector3());

  const shot = SHOTS[stage === "travel" ? "split" : stage];

  useEffect(() => {
    settled.current = false;
    t.current = 0;
    if (!still) return;
    /* Reduced motion: no travel at all. Cut to the composed state, which is
       the spec's "switch between composed still states and skip the camera
       travel". The branch reveal still happens; only the journey is cut. */
    camera.position.copy(shot.pos);
    look.current.copy(shot.at);
    camera.lookAt(shot.at);
    onSettled();
    if (stage === "travel") onTravelEnd();
  }, [stage, still, camera, shot, onSettled, onTravelEnd]);

  useFrame((_, dt) => {
    if (still) return;
    const step = Math.min(dt, 0.05);

    /*
      **Travel actually follows the cable.** Lerping straight from the rest
      shot to the wide shot would cut across the slab and miss the seam,
      which is the one moment the whole scene exists to show. So the camera
      rides the trunk curve itself, a little above and behind the fiber,
      looking at a point further along it, and only then hands over to the
      ordinary damped move into the wide shot.
    */
    if (stage === "travel") {
      t.current = Math.min(1, t.current + step / TRAVEL_SECONDS);
      /* Ease in and out, so it does not start or stop abruptly. */
      const e = t.current < 0.5
        ? 2 * t.current * t.current
        : 1 - Math.pow(-2 * t.current + 2, 2) / 2;
      const here = TRUNK.getPointAt(Math.min(0.995, e * 0.92));
      const ahead = TRUNK.getPointAt(Math.min(1, e * 0.92 + 0.07));
      camera.position.set(here.x - 0.5, here.y + 0.62 + e * 1.5, here.z + 1.5 + e * 1.1);
      look.current.lerp(scratch.current.copy(ahead), 0.25);
      camera.lookAt(look.current);
      if (t.current >= 1) onTravelEnd();
      return;
    }

    const k = 1 - Math.pow(0.0016, step);
    target.current.copy(shot.pos);
    camera.position.lerp(target.current, k);
    look.current.lerp(shot.at, k);
    camera.lookAt(look.current);

    if (!settled.current && camera.position.distanceTo(shot.pos) < 0.02) {
      settled.current = true;
      onSettled();
    }
  });

  return null;
}

function Scene({
  stage,
  still,
  onSettled,
  onTravelEnd,
  pulse,
  on,
}: {
  stage: CableStage;
  still: boolean;
  onSettled: () => void;
  onTravelEnd: () => void;
  pulse: React.RefObject<number>;
  on: React.RefObject<number>;
}) {
  const showBranches = stage !== "rest";
  return (
    <>
      <Rig stage={stage} still={still} onSettled={onSettled} onTravelEnd={onTravelEnd} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-8, 3.5, 5]} intensity={0.9} />

      <Granite />
      <Groove curve={TRUNK} />
      <Fiber curve={TRUNK} tint="#8b5cf6" pulse={pulse} on={on} tail={1} />

      {showBranches ? (
        <>
          <Groove curve={BRANCH_BRING} />
          <Groove curve={BRANCH_KEEP} />
          <Fiber curve={BRANCH_BRING} tint="#2dd4bf" pulse={pulse} on={on} tail={0} />
          <Fiber curve={BRANCH_KEEP} tint="#b9a2ff" pulse={pulse} on={on} tail={0} />
        </>
      ) : null}

      <EtchedGlass />
    </>
  );
}

export default function CableScene({
  stage,
  onReady,
  onTravelEnd,
}: {
  stage: CableStage;
  onReady?: () => void;
  /** Fired when the ride along the cable reaches the split. */
  onTravelEnd: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [still, setStill] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  const pulse = useRef(0);
  const on = useRef(0);

  /* **Two separate reasons to keep rendering, and both must be false before
     the loop stops.** The first cut had one `busy` flag that the camera
     cleared on arrival, which was wrong in a way that only shows on screen:
     the camera settles in about 0.9s and the pulse runs for 2.2s, so the
     flag went false mid-pulse, `frameloop` dropped to "demand", and the
     pulse went on updating a uniform nothing was drawing. The light simply
     stopped halfway down the fiber. */
  const [pulsing, setPulsing] = useState(true);
  const [camSettled, setCamSettled] = useState(false);
  const settled = useCallback(() => setCamSettled(true), []);

  /* Held in a ref so an inline `onReady` from the parent cannot re-trigger
     the arrival pulse on every render. */
  const ready = useRef(onReady);
  useEffect(() => {
    ready.current = onReady;
  }, [onReady]);

  /* WebGL probe and the motion preference, before anything mounts a canvas:
     the hero has already drawn its still, so there is nothing to flash. */
  useEffect(() => {
    let ok = false;
    try {
      const probe = document.createElement("canvas");
      const gl =
        probe.getContext("webgl2") ??
        probe.getContext("webgl") ??
        probe.getContext("experimental-webgl");
      ok = !!gl;
      (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      ok = false;
    }
    if (!ok) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(reduced.matches);
    setLive(true);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el || !live) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    const vis = () => setOnScreen(!document.hidden && !!el.getBoundingClientRect().height);
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [live]);

  /* The arrival pulse, and one on every stage change after it: the spec asks
     for a single soft pulse toward the seam on arrival, then a settle. */
  useEffect(() => {
    if (!live) return;
    setCamSettled(false);
    if (still) {
      /* Reduced motion: the pulse is a position, not a journey. */
      on.current = 1;
      pulse.current = 0.42;
      setPulsing(false);
      ready.current?.();
      return;
    }
    let raf = 0;
    const started = performance.now();
    const DUR = 2200;
    on.current = 1;
    setPulsing(true);
    const step = (t: number) => {
      const k = Math.min(1, (t - started) / DUR);
      /* Ease out, and stop short of the end so it reads as reaching the seam
         rather than running off the slab. */
      pulse.current = (1 - Math.pow(1 - k, 2.4)) * 0.92;
      if (k < 1) raf = requestAnimationFrame(step);
      else setPulsing(false);
    };
    raf = requestAnimationFrame(step);
    ready.current?.();
    return () => cancelAnimationFrame(raf);
  }, [live, still, stage]);

  if (!live) return <div ref={host} className="absolute inset-0" />;

  /* "always" only while something is actually moving. Once the camera has
     arrived AND the pulse has finished, the scene renders on demand, which
     is the spec's idle pause. Off-screen and reduced motion stop it too. */
  const running = onScreen && !still && (pulsing || !camSettled || stage === "travel");

  return (
    <div ref={host} className="pointer-events-none absolute inset-0">
      <Canvas
        frameloop={running ? "always" : "demand"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 38, position: [-5.2, 0.95, 4.3], near: 0.1, far: 90 }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Scene
          stage={stage}
          still={still}
          onSettled={settled}
          onTravelEnd={onTravelEnd}
          pulse={pulse}
          on={on}
        />
      </Canvas>
    </div>
  );
}
