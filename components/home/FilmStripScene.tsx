"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CircleGeometry,
  Group,
  LinearFilter,
  PlaneGeometry,
  RingGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderTarget,
  type Texture,
} from "three";
import type { CanvasTile } from "@/lib/canvasTiles";

/*
  The film strip, and the viewfinder that magnifies the frame under your
  cursor.

  Built from the Aperture & Line prompt, which is free on Meg's
  AnimatedWebs account and licensed for commercial use. Two substitutions,
  both so it stays hers rather than becoming a generic template:

  **The palette.** The prompt asks for `#00ffff` and `#ff00ff` on
  `#0d0d0d`. Cyan and magenta on near-black is the "reads as a developer
  tool" look CLAUDE.md flags for contractor and admin-firm buyers. The
  ground stays; the accents are her own violet, teal and pink, which are
  already in that family and already tokens.

  **The faces.** It asks for Playfair Display and IBM Plex. Fraunces and
  JetBrains Mono are already loaded in exactly those two roles, and
  `app/layout.tsx` records what happened the last time this page carried
  five families.

  **And the frames are her real captures**, read from `catalog`, which is
  the one thing a template cannot supply. The prompt's film strip wants 24
  project thumbnails; there are 28 real ones.
*/

/* The strip, in world units. Tuned by screenshot at 1440 and 390 rather
   than derived: the prompt's radius 10 / arc 60° assumes one bent plane,
   and these are separate frames on a circle. */
const RADIUS = 16;
const COUNT = 24;
const FRAME_W = 3.9;
const FRAME_H = 2.44;
/** Radians between frames. */
const STEP = (Math.PI * 2) / COUNT;

/* Her violet, not the prompt's cyan. See the note at the top. */
const ACCENT = "#b9a2ff";

/** The prompt's 2x, its 80px circle, and its 0.1 cursor lerp. */
const MAGNIFY = 2;
const DISC_PX = 80;
const CURSOR_LERP = 0.1;

type Frame = { key: number; tile: CanvasTile; base: number };

function Strip({
  tiles,
  still,
  onFrame,
}: {
  tiles: CanvasTile[];
  still: boolean;
  onFrame: (t: CanvasTile | null) => void;
}) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const meshes = useRef<Mesh[]>([]);
  const [maps, setMaps] = useState<Record<string, Texture>>({});
  const travel = useRef(0);
  const velocity = useRef(0);
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const smooth = useRef({ x: 0, y: 0 });

  const frames = useMemo<Frame[]>(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        key: i,
        tile: tiles[i % tiles.length],
        base: i * STEP,
      })),
    [tiles],
  );

  useEffect(() => {
    const loader = new TextureLoader();
    const seen = new Set<string>();
    let live = true;
    for (const f of frames) {
      if (seen.has(f.tile.image)) continue;
      seen.add(f.tile.image);
      loader.load(f.tile.image, (tex) => {
        if (!live) return;
        tex.minFilter = LinearFilter;
        tex.generateMipmaps = false;
        /* A capture is sRGB. Without this the strip comes back washed
           out, which is how the last scene shipped its first draft. */
        tex.colorSpace = SRGBColorSpace;
        setMaps((m) => ({ ...m, [f.tile.image]: tex }));
        invalidate();
      });
    }
    return () => {
      live = false;
    };
  }, [frames, invalidate]);

  /*
    The viewfinder's render target, and the camera that fills it.

    **This is the prompt's technique and the reason the circle is worth
    building at all.** A CSS zoom on a canvas magnifies the pixels that
    were already drawn, so the result is soft exactly where somebody is
    looking closely. Rendering the scene a second time, through a camera
    with half the field of view, aimed where the cursor is pointing, gives
    a genuinely sharper image of the frame underneath.

    The circle itself sits on layer 1 and that camera only renders layer
    0, so the viewfinder cannot photograph itself, which is an infinite
    regress that shows up as a black disc.
  */
  const rt = useMemo(() => {
    const target = new WebGLRenderTarget(1024, 1024);
    target.texture.minFilter = LinearFilter;
    target.texture.colorSpace = SRGBColorSpace;
    return target;
  }, []);

  const lens = useMemo(() => {
    const c = new PerspectiveCamera(1, 1, 0.1, 100);
    c.layers.set(0);
    return c;
  }, []);

  useEffect(() => () => rt.dispose(), [rt]);

  useEffect(() => {
    if (still) return;
    const el = document.getElementById("film-strip");
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.inside = true;
    };
    const leave = () => {
      pointer.current.inside = false;
    };
    const wheel = (e: WheelEvent) => {
      /* Horizontal intent drives the strip. Vertical stays the page's, so
         nobody is ever trapped inside a full-screen hero. */
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      velocity.current += e.deltaX * 0.00008;
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("wheel", wheel);
    };
  }, [still]);

  const hit = useRef<string | null>(null);
  const aim = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    /* The prompt's 0.5x auto-scroll, paused while a pointer is on it. */
    if (!still) {
      const drift = pointer.current.inside ? 0 : 0.055;
      travel.current += (drift + velocity.current) * dt * 60 * 0.016;
      velocity.current *= 0.92;
      smooth.current.x = MathUtils.lerp(
        smooth.current.x,
        pointer.current.x,
        CURSOR_LERP,
      );
      smooth.current.y = MathUtils.lerp(
        smooth.current.y,
        pointer.current.y,
        CURSOR_LERP,
      );
    }

    let nearest: { d: number; tile: CanvasTile } | null = null;

    for (let i = 0; i < frames.length; i += 1) {
      const m = meshes.current[i];
      if (!m) continue;
      /* Wrap into (-π, π] so a frame leaving one edge re-enters at the
         other without its texture changing. */
      let a = frames[i].base + travel.current;
      a = ((((a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

      m.position.set(Math.sin(a) * RADIUS, 0, -Math.cos(a) * RADIUS);
      m.rotation.y = a;
      /* Frames behind the viewer are not drawn at all, which keeps the
         draw count near what is actually on screen. */
      m.visible = Math.abs(a) < 1.0;

      if (m.visible) {
        const d = Math.abs(a);
        if (!nearest || d < nearest.d) nearest = { d, tile: frames[i].tile };
      }
    }

    const id = nearest && nearest.d < 0.22 ? nearest.tile.id : null;
    if (id !== hit.current) {
      hit.current = id;
      onFrame(nearest && nearest.d < 0.22 ? nearest.tile : null);
    }

    /* Point the lens where the cursor is, at half the field of view, and
       render the strip into the circle's texture. */
    if (!still && pointer.current.inside) {
      const main = camera as PerspectiveCamera;
      aim.set(smooth.current.x, smooth.current.y, 0.5).unproject(main);
      lens.position.copy(main.position);
      lens.lookAt(aim);
      /*
        **The field of view is derived from the size of the circle, not
        from the main camera's, which is the correction.** `main.fov /
        MAGNIFY` reads like 2x and is not: it gives the 80px circle a 16°
        view of a scene the 1440px screen shows at 49°, so the frame came
        out roughly six times SMALLER inside the viewfinder than outside
        it. Magnified, in the only sense that matters, means the circle
        covers `80 / 2` screen pixels' worth of the main view and fills
        itself with them.
      */
      const span = DISC_PX / MAGNIFY;
      lens.fov = MathUtils.radToDeg(
        2 *
          Math.atan(
            Math.tan(MathUtils.degToRad(main.fov) / 2) * (span / size.height),
          ),
      );
      lens.aspect = 1;
      lens.updateProjectionMatrix();

      gl.setRenderTarget(rt);
      gl.render(scene, lens);
      gl.setRenderTarget(null);
    }
  });

  /* The viewfinder disc, in front of the camera on its own layer. */
  const disc = useRef<Group>(null);
  const discGeo = useMemo(() => new CircleGeometry(0.5, 64), []);
  const ringGeo = useMemo(() => new RingGeometry(0.5, 0.525, 64), []);
  /* Two short bars rather than lines across the whole circle, so the
     frame underneath is never cut in half by its own instrument. */
  const crossH = useMemo(() => new PlaneGeometry(0.22, 0.012), []);
  const crossV = useMemo(() => new PlaneGeometry(0.012, 0.22), []);
  useEffect(
    () => () => {
      discGeo.dispose();
      ringGeo.dispose();
      crossH.dispose();
      crossV.dispose();
    },
    [discGeo, ringGeo, crossH, crossV],
  );

  useFrame(() => {
    const d = disc.current;
    if (!d) return;
    d.visible = !still && pointer.current.inside;
    if (!d.visible) return;
    const main = camera as PerspectiveCamera;

    /*
      **Placed in camera space rather than by unprojecting, which is the
      correction.** The first version unprojected the cursor to a world
      point and walked a fraction of the way along that ray; the fraction
      depends on how far the unprojected point happens to land, so the
      disc came out both mis-aimed and about a tenth of its intended size.
      Measured on screen it was a dot nowhere near the pointer.

      The camera here sits at the origin and does not move, so camera
      space is world space, and the frustum at a known distance has a
      known size. That makes the position exact and the 80px the prompt
      asks for actually 80px.
    */
    const z = 2;
    const h = 2 * z * Math.tan(MathUtils.degToRad(main.fov) / 2);
    const w = h * (size.width / size.height);
    d.position.set((smooth.current.x * w) / 2, (smooth.current.y * h) / 2, -z);
    d.rotation.set(0, 0, 0);
    /* CircleGeometry radius 0.5, so one world unit across before scaling. */
    d.scale.setScalar((DISC_PX * h) / size.height);
  });

  return (
    <>
      {frames.map((f, i) => {
        const map = maps[f.tile.image];
        return (
          <mesh
            key={f.key}
            ref={(el) => {
              if (el) meshes.current[i] = el;
            }}
          >
            <planeGeometry args={[FRAME_W, FRAME_H]} />
            {/* Keyed on the capture: a material compiled without a map
                ignores one assigned later, which rendered an entire
                earlier scene as blank rectangles. */}
            <meshBasicMaterial
              key={map ? f.tile.image : "pending"}
              map={map ?? null}
              color={map ? "#ffffff" : "#15151a"}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/*
        The disc, and the ring and crosshairs that make it a viewfinder.

        **Without the ring there is nothing to see.** The circle is mostly
        dark wherever the strip is, on a near-black page, so the first
        version read as a stray bright rectangle rather than as an
        instrument. The prompt asks for crosshairs and they are not
        decoration: they are what says this is a thing you are looking
        THROUGH.
      */}
      <group ref={disc} layers-mask={2} renderOrder={10}>
        <mesh geometry={discGeo}>
          <meshBasicMaterial map={rt.texture} toneMapped={false} />
        </mesh>
        <mesh geometry={ringGeo} position={[0, 0, 0.001]}>
          <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.9} />
        </mesh>
        <mesh geometry={crossH} position={[0, 0, 0.002]}>
          <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.65} />
        </mesh>
        <mesh geometry={crossV} position={[0, 0, 0.002]}>
          <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.65} />
        </mesh>
      </group>
    </>
  );
}

export default function FilmStripScene({
  tiles,
  still,
  onFrame,
}: {
  tiles: CanvasTile[];
  still: boolean;
  onFrame: (t: CanvasTile | null) => void;
}) {
  return (
    <Canvas
      frameloop={still ? "demand" : "always"}
      /* The prompt's own quality bar caps this, and so does every other
         scene in this project. */
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 32, position: [0, 0, 0], near: 0.1, far: 60 }}
      onCreated={({ camera }) => {
        /* The main camera draws the strip (layer 0) and the viewfinder
           (layer 1). The lens inside only ever draws layer 0. */
        camera.layers.enable(1);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Strip tiles={tiles} still={still} onFrame={onFrame} />
    </Canvas>
  );
}
