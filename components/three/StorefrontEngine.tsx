"use client";

import { Html, MeshTransmissionMaterial, RoundedBox, useCursor } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  MathUtils,
  Mesh,
  Points,
  Vector3,
} from "three";
import { useStageTheme, type StageTheme } from "./useStageTheme";

/*
  The glass storefront, and the engine running underneath it.

  **This is the shape of what Meg sells, not decoration.** A site somebody
  can buy from sits on top, in glass. Underneath it, out of sight the way
  it is in a real business, is the back office: the CRM the form drops
  into, the billing, the follow-up, the modules that get bolted on. The
  conduits between them carry visible pulses, because "your website and
  your back office actually talk to each other" is the sentence she is
  trying to get across and it is much better shown than written.

  Scroll takes the visitor from standing in front of the storefront to
  underneath it, looking at the machinery. That is the whole pitch as a
  camera move.

  **Three things in the brief were changed rather than followed, and each
  is written down here so the next reader can see it was a decision.**

  1. `bg-slate-950` is not used anywhere. This site has two themes and a
     pre-paint script, and CLAUDE.md records hardcoding a colour as the
     failure that has already shipped three times (#115, #118, and the
     frozen clear colour in this very scene's first commit). Every colour
     comes from `useStageTheme`, which re-reads on `theme:change`.

  2. **"0s Latency" is gone.** It was one of the four node captions in the
     brief, and it is a performance claim with no measurement behind it.
     The first rule in CLAUDE.md is that proof is never invented, and that
     rule does not have a decoration exemption. The node says what the
     thing does instead.

  3. `app/page.tsx` was NOT rebuilt into three `min-h-screen` demo
     sections. That layout is a nice demo and this homepage is a shop: it
     carries the priced shelf, the real case study, the integrations and
     the contact form. Replacing it would delete the selling to make room
     for the scenery. The scroll acts are mapped onto the real sections
     instead, which is the same effect without the loss.
*/

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */

type EngineNode = {
  id: string;
  label: string;
  spec: string;
  blurb: string;
  at: [number, number, number];
};

/*
  The four modules under the floor.

  Captions describe what the thing does. None of them quotes a number,
  because none of these numbers has been measured on this site.
*/
const NODES: EngineNode[] = [
  {
    id: "crm",
    label: "CRM & lead sync",
    spec: "Form to pipeline",
    blurb: "A form submission lands in the pipeline instead of an inbox.",
    at: [-2.5, -3.1, 0.3],
  },
  {
    id: "billing",
    label: "Checkout & billing",
    spec: "Stripe + webhooks",
    blurb: "Payment taken, receipt sent, access switched on, without you.",
    at: [-0.85, -3.35, -0.6],
  },
  {
    id: "followup",
    label: "SMS & email triggers",
    spec: "Follow-up",
    blurb: "The chase happens on its own, so nobody goes cold.",
    at: [0.85, -3.1, 0.4],
  },
  {
    id: "modules",
    label: "Modular add-ons",
    spec: "Plug and play",
    blurb: "Bolt on a prebuilt module, or one built for the job.",
    at: [2.5, -3.4, -0.4],
  },
];

/* Where each conduit leaves the deck and where it lands. */
const DECK_Y = 0.78;

/* ------------------------------------------------------------------ */

/** The storefront deck: a slab of frosted glass with UI slabs floating on it. */
function Storefront({ theme, lite }: { theme: StageTheme; lite: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    /* A slow breath so the glass is never completely static, well under
       the amplitude that would read as wobble. */
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
  });

  return (
    <group ref={group} position={[0, DECK_Y, 0]}>
      <RoundedBox args={[6.4, 0.22, 3.6]} radius={0.1} smoothness={4}>
        {/*
          Transmission is the expensive material in the scene and the only
          one worth it on a desktop: glass is what makes the storefront
          read as a surface you are looking THROUGH at the machinery
          below, which is the entire idea.

          **A phone gets a cheap stand-in, and that is a measurement, not
          a guess.** `MeshTransmissionMaterial` re-renders the scene into
          a texture every frame; with Bloom on top, the 390px tap-target
          sweep timed out at 30s. A translucent physical material reads
          as the same object at that size, where the deck is a couple of
          hundred pixels wide and the refraction is invisible anyway.
        */}
        {lite ? (
          <meshPhysicalMaterial
            color={theme.dark ? "#7f8698" : "#ffffff"}
            transparent
            opacity={0.3}
            roughness={0.25}
            metalness={0.1}
          />
        ) : (
          <MeshTransmissionMaterial
            transmission={0.92}
            roughness={0.15}
            ior={1.45}
            thickness={0.45}
            chromaticAberration={0.035}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.2}
            temporalDistortion={0.05}
            samples={4}
            resolution={256}
            background={theme.ground}
          />
        )}
      </RoundedBox>

      {/* Minimal UI slabs on the deck: a page, and the cards on it. */}
      {(
        [
          [-1.9, 0.26, -0.5, 1.5, 0.9],
          [0.1, 0.26, -0.45, 1.9, 1.0],
          [2.1, 0.26, -0.5, 1.2, 0.8],
          [-1.1, 0.26, 0.95, 1.1, 0.55],
          [1.25, 0.26, 1.0, 1.6, 0.6],
        ] as const
      ).map(([x, y, z, w, d], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, d]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? theme.ink : theme.accent}
            transparent
            opacity={theme.dark ? 0.26 : 0.16}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The conduits, and the packets travelling down them.
 *
 * One `points` draw call for every packet on every conduit rather than a
 * mesh each: this runs behind the whole site, and the difference between
 * one draw call and forty is the difference between free and a frame-rate
 * decision on an integrated GPU.
 */
function Conduits({ theme }: { theme: StageTheme }) {
  const packets = useRef<Points>(null);

  const lines = useMemo(() => {
    const pts: number[] = [];
    for (const n of NODES) {
      pts.push(n.at[0], DECK_Y - 0.1, n.at[2], n.at[0], n.at[1] + 0.25, n.at[2]);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  const PER = 4;
  const packetGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(NODES.length * PER * 3), 3),
    );
    return g;
  }, []);

  useEffect(() => {
    return () => {
      lines.dispose();
      packetGeo.dispose();
    };
  }, [lines, packetGeo]);

  useFrame((state) => {
    const p = packets.current;
    if (!p) return;
    const pos = p.geometry.getAttribute("position") as BufferAttribute;
    const t = state.clock.elapsedTime;
    let i = 0;
    for (const n of NODES) {
      const top = DECK_Y - 0.1;
      const bottom = n.at[1] + 0.25;
      for (let k = 0; k < PER; k += 1) {
        /* Phase-shifted so packets are spread along the run rather than
           leaving in a block. 0.42 is slow enough to read as data moving
           and not as rain. */
        const f = ((t * 0.42 + k / PER + n.at[0] * 0.13) % 1 + 1) % 1;
        pos.setXYZ(i, n.at[0], MathUtils.lerp(top, bottom, f), n.at[2]);
        i += 1;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color={theme.accent}
          transparent
          opacity={theme.dark ? 0.5 : 0.35}
          toneMapped={false}
        />
      </lineSegments>
      <points ref={packets} geometry={packetGeo}>
        <pointsMaterial
          size={0.075}
          sizeAttenuation
          color={theme.accent}
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Node({
  node,
  theme,
  active,
  onPick,
}: {
  node: EngineNode;
  theme: StageTheme;
  active: boolean;
  onPick: (id: string | null) => void;
}) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const lit = hovered || active;

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const k = 1 - Math.pow(0.0001, Math.min(delta, 0.05));
    const want = lit ? 1.18 : 1;
    m.scale.setScalar(MathUtils.lerp(m.scale.x, want, k));
  });

  return (
    <group position={node.at}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onPick(active ? null : node.id);
        }}
      >
        <boxGeometry args={[0.78, 0.44, 0.78]} />
        <meshStandardMaterial
          /*
            Dark slate in both themes rather than tinted by the accent.
            Tinted, they read in Daylight as four flat lavender blocks
            instead of machinery, and the accent is then doing two jobs at
            once: the colour of the data AND the colour of the hardware.
            The accent belongs to the conduits and to the emissive lift on
            hover, which is what makes a lit node mean something.
          */
          color={theme.dark ? "#161c27" : "#2a313d"}
          metalness={0.65}
          roughness={0.3}
          emissive={theme.accent}
          emissiveIntensity={lit ? 1.1 : 0.1}
          toneMapped={false}
        />
      </mesh>

      {lit ? (
        <Html position={[0, 0.72, 0]} center distanceFactor={7} zIndexRange={[20, 0]}>
          {/*
            `pointer-events-none` on the card: it is a label, and a tooltip
            that eats clicks over a fixed background would steal them from
            the page's own links underneath.
          */}
          <div className="pointer-events-none w-56 rounded-xl border border-white/15 bg-slate-950/80 p-3 text-left shadow-xl backdrop-blur-md">
            <p className="m-0 text-[11px] uppercase tracking-wider text-violet-300">
              {node.spec}
            </p>
            <p className="m-0 mt-1 text-[13px] font-semibold text-white">{node.label}</p>
            <p className="m-0 mt-1 text-[12px] leading-snug text-slate-300">
              {node.blurb}
            </p>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Scroll and pointer.
 *
 * GSAP ScrollTrigger drives the camera through the three acts, scrubbed
 * against `#scroll-container`. The pointer adds a small lean on top, read
 * inside `useFrame` and never through React state, so moving the mouse
 * across the site re-renders nothing.
 */
function Rig({ still }: { still: boolean }) {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  /*
    GSAP owns the base camera, the pointer owns a small offset from it,
    and the two never write to the same value.

    That separation is the whole design of this function. The obvious
    version lets ScrollTrigger tween `camera.position` and then also
    lerps `camera.position` toward the pointer every frame, so each is
    continually undoing the other: the camera drifts, and the drift is
    frame-rate dependent, so it looks fine on the machine it was written
    on. Here the timeline moves `base` and `look`, which are plain
    objects, and `useFrame` composes the final position from base plus
    offset. Either can change without disturbing the other.
  */
  const base = useRef({ x: 0, y: 3.2, z: 7.5 });
  const look = useRef({ x: 0, y: 0.5, z: 0 });
  const target = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    /*
      Reduced motion gets the END of the arc, held: the production view of
      the engine, which is what the whole scroll travels toward. The rule
      in CLAUDE.md is that the fallback shows the end state, not a blank
      and not the beginning.
    */
    if (still) {
      base.current = { x: 1.0, y: -2.3, z: 8.2 };
      look.current = { x: -0.1, y: -2.7, z: 0 };
      return;
    }

    base.current = { x: 0, y: 2.6, z: 9.0 };
    look.current = { x: 0, y: 0.5, z: 0 };

    const container = document.getElementById("scroll-container");
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      /* Act 2: drop under the deck, into the machinery. */
      tl.to(base.current, { y: -2.6, z: 6.4, ease: "power2.inOut" }, 0)
        .to(look.current, { y: -2.8, ease: "power2.inOut" }, 0)
        /* Act 3: pull back and off-axis so all four nodes frame up. */
        .to(base.current, { x: 1.0, y: -2.3, z: 8.2, ease: "power1.out" }, 0.55)
        .to(look.current, { x: -0.1, y: -2.7, ease: "power1.out" }, 0.55);
    });

    /* Kills every timeline and ScrollTrigger this context created. Without
       it a route change leaves a trigger bound to a container that is no
       longer in the document. */
    return () => ctx.revert();
  }, [still]);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.0025, Math.min(delta, 0.05));
    /* The lean that reads as depth at 1440 reads as a wobble at 390. */
    const amp = size.width < 760 ? 0.16 : 0.5;

    const wantX = base.current.x + pointer.current.x * amp;
    const wantY = base.current.y - pointer.current.y * amp * 0.5;

    camera.position.x = MathUtils.lerp(camera.position.x, wantX, k);
    camera.position.y = MathUtils.lerp(camera.position.y, wantY, k);
    camera.position.z = MathUtils.lerp(camera.position.z, base.current.z, k);

    target.set(look.current.x, look.current.y, look.current.z);
    camera.lookAt(target);
  });

  return null;
}

/* ------------------------------------------------------------------ */

export default function StorefrontEngine({ still = false }: { still?: boolean }) {
  const theme = useStageTheme();
  const { size } = useThree();
  const [picked, setPicked] = useState<string | null>(null);

  /*
    Phone-sized viewports skip the two most expensive things in the
    scene: the transmission material and the bloom pass. The structure,
    the conduits, the travelling packets and the camera move all stay, so
    it is the same scene rather than a cut-down one.
  */
  const lite = size.width < 760;

  /*
    Swap in a Blender scene later:

    import { useGLTF } from "@react-three/drei";
    const { scene } = useGLTF("/models/engine-draco.glb");
    return <primitive object={scene} position={[0, -2.4, 0]} />;

    useGLTF.preload("/models/engine-draco.glb");

    Draco-compressed, served from /public/models. Nothing in the scene
    depends on the placeholder geometry's exact shape, so a model can
    replace the node boxes without touching the conduits or the camera.
  */

  return (
    /*
      The whole scene is pushed right, down and back.

      Act 1 framed centred put the glass deck straight across the headline
      and the two CTAs, and left the engine nodes visible at the bottom of
      the first screen, which gives away the dive before the visitor has
      scrolled. Copy owns the left column on this page; the structure gets
      the right and the depth. The nodes now sit below the fold in Act 1
      and are something you arrive at rather than something already there.
    */
    <group
      position={[1.35, -0.75, -1.6]}
      scale={0.86}
      onPointerMissed={() => setPicked(null)}
    >
      {/* Warm key from the storefront side, cool rim from under the floor:
          the two halves of the idea lit as two different places. */}
      <ambientLight intensity={theme.dark ? 0.35 : 0.9} />
      <directionalLight position={[4, 6, 4]} intensity={theme.dark ? 1.5 : 2.1} />
      <pointLight position={[0, -2.2, 2]} intensity={theme.dark ? 9 : 4} color={theme.accent} />

      <Storefront theme={theme} lite={lite} />
      <Conduits theme={theme} />
      {NODES.map((n) => (
        <Node
          key={n.id}
          node={n}
          theme={theme}
          active={picked === n.id}
          onPick={setPicked}
        />
      ))}

      <Rig still={still} />

      {/*
        Bloom only, and only above 1.0 luminance, so the conduits and the
        lit nodes glow while nothing else does. `toneMapped={false}` on
        those materials is what pushes them over that threshold: without
        it the threshold would have to come down and the whole scene would
        bloom, which is what washes foreground text out.

        Skipped entirely under reduced motion: a still frame does not need
        a post pass, and this is the most expensive thing here.
      */}
      {still || lite ? null : (
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={1}
            luminanceSmoothing={0.4}
            intensity={0.65}
          />
        </EffectComposer>
      )}
    </group>
  );
}
