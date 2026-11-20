"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  LinearFilter,
  SRGBColorSpace,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  type Texture,
} from "three";
import type { CanvasTile } from "@/lib/canvasTiles";

/*
  The work, as a wall you drag through.

  **The technique is Solenne Okafor's infinite drag canvas, which Meg
  picked out of the templates she sent, and the content is the one thing
  those templates cannot give her: her own work.** Every tile is a real
  capture of a real system, read from `catalog` via `lib/canvasTiles.ts`,
  with the name and the price the shop already carries. So the hero is not
  a mood board in front of the page, it is the page's first and best
  answer to the complaint the whole storefront rebuild came from: "hard to
  see what is for sale that's tangible."

  Three decisions worth keeping written down.

  **Fixed textures, wrapped positions.** The grid repeats by moving each
  plane back round to the other side when it leaves the frame, rather than
  swapping its texture to match a world coordinate. Swapping would need a
  texture bind per tile per frame, which is the expensive thing in a scene
  like this; wrapping costs nothing. The visible consequence is that the
  wall repeats, and that is how the reference reads too: an archive, tiled.

  **The light follows the cursor and the rest sits back in the dark.**
  This is the half taken from Lumen & Grain rather than from Solenne, and
  it is doing real work rather than being a second effect. These are
  captures of websites: bright, white, busy. Twenty-eight of them at full
  brightness on near-black is a contact sheet, not a cinematic field. Dim
  by default and lit by proximity, it becomes one.

  **Pixel units.** The camera is orthographic at zoom 1, so one world unit
  is one CSS pixel and every size here is the size it is on screen. The
  alternative is a perspective camera and a conversion that has to be
  rederived every time the layout changes, which is how a grid ends up
  looking right at 1440 and wrong everywhere else.
*/

/* A tile, in pixels. 16:10 to match the captures rather than crop them. */
const CELL_W = 400;
const CELL_H = 250;
const GAP = 20;

/** Dim enough that the lit tile reads as lit, bright enough to see the wall. */
const DIM = 0.42;
/** How far from the cursor a tile still catches light, in pixels. */
const LIGHT_RADIUS = 520;

type Placed = {
  key: string;
  tile: CanvasTile;
  baseX: number;
  baseY: number;
};

function Wall({
  tiles,
  still,
  onHover,
}: {
  tiles: CanvasTile[];
  still: boolean;
  onHover: (t: CanvasTile | null) => void;
}) {
  const { size, invalidate } = useThree();
  const offset = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0, inside: false });
  const [maps, setMaps] = useState<Record<string, Texture>>({});
  const group = useRef<Mesh[]>([]);

  /* Enough columns and rows to cover the viewport with one spare ring, so
     a tile is always already in place before it scrolls into view. */
  const { placed, spanX, spanY } = useMemo(() => {
    const stepX = CELL_W + GAP;
    const stepY = CELL_H + GAP;
    const cols = Math.ceil(size.width / stepX) + 2;
    const rows = Math.ceil(size.height / stepY) + 2;
    const out: Placed[] = [];
    for (let c = 0; c < cols; c += 1) {
      for (let r = 0; r < rows; r += 1) {
        /* Two coprime strides so neighbours are never the same capture and
           the repeat does not fall into obvious rows or columns. */
        const i = (c * 7 + r * 3) % tiles.length;
        out.push({
          key: `${c}-${r}`,
          tile: tiles[i],
          /* Odd rows are offset half a cell, which is what stops the wall
             reading as a spreadsheet. */
          baseX: c * stepX + (r % 2 ? stepX / 2 : 0),
          baseY: r * stepY,
        });
      }
    }
    return { placed: out, spanX: cols * stepX, spanY: rows * stepY };
  }, [size.width, size.height, tiles]);

  /* Textures, loaded once per distinct capture and shared by every plane
     showing it. Twenty-eight images, not one per plane. */
  useEffect(() => {
    const loader = new TextureLoader();
    const seen = new Set<string>();
    let live = true;
    for (const t of tiles) {
      if (seen.has(t.image)) continue;
      seen.add(t.image);
      loader.load(t.image, (tex) => {
        if (!live) return;
        tex.minFilter = LinearFilter;
        tex.generateMipmaps = false;
        /* Without this the captures come back washed out: three assumes
           linear, and a screenshot is sRGB like every other image. */
        tex.colorSpace = SRGBColorSpace;
        setMaps((m) => ({ ...m, [t.image]: tex }));
        invalidate();
      });
    }
    return () => {
      live = false;
    };
  }, [tiles, invalidate]);

  useEffect(() => {
    return () => {
      for (const t of Object.values(maps)) t.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    Drag, wheel and pointer, all writing to one target that the frame loop
    eases toward. Written on refs rather than state: a wall that re-renders
    React on every pointer move is a wall that drops frames.
  */
  useEffect(() => {
    if (still) return;
    const el = document.getElementById("work-canvas");
    if (!el) return;

    let dragging = false;
    let last = { x: 0, y: 0 };

    const down = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      cursor.current.x = e.clientX - r.left - r.width / 2;
      cursor.current.y = -(e.clientY - r.top - r.height / 2);
      cursor.current.inside = true;
      if (!dragging) return;
      target.current.x += e.clientX - last.x;
      target.current.y -= e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    const leave = () => {
      cursor.current.inside = false;
    };
    const wheel = (e: WheelEvent) => {
      /*
        Horizontal intent moves the wall; vertical is left to the page.
        Hijacking vertical scroll would trap somebody inside a full-screen
        hero with no way down, which is the oldest sin in this genre.
      */
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      target.current.x -= e.deltaX;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("wheel", wheel);
    };
  }, [still]);

  const lit = useMemo(() => new Color(), []);
  const hovered = useRef<string | null>(null);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.0015, Math.min(delta, 0.05));

    if (!still) {
      /*
        A slow drift when nobody is touching it, so the wall is alive
        before the first interaction. Stopped the moment a pointer is
        inside, because drifting under somebody's cursor fights them.
      */
      if (!cursor.current.inside) target.current.x -= delta * 14;
      offset.current.x = MathUtils.lerp(offset.current.x, target.current.x, k);
      offset.current.y = MathUtils.lerp(offset.current.y, target.current.y, k);
    }

    const half = { x: spanX / 2, y: spanY / 2 };
    let nearest: { d: number; tile: CanvasTile } | null = null;

    for (let i = 0; i < placed.length; i += 1) {
      const m = group.current[i];
      if (!m) continue;
      const p = placed[i];

      /* Wrap into a band centred on the camera, so a tile leaving one edge
         is already drawn at the other. */
      const x =
        (((p.baseX + offset.current.x + half.x) % spanX) + spanX) % spanX - half.x;
      const y =
        (((p.baseY + offset.current.y + half.y) % spanY) + spanY) % spanY - half.y;
      m.position.set(x, y, 0);

      /* Proximity to the cursor decides the light. */
      const d = cursor.current.inside
        ? Math.hypot(x - cursor.current.x, y - cursor.current.y)
        : Number.POSITIVE_INFINITY;
      const near = MathUtils.clamp(1 - d / LIGHT_RADIUS, 0, 1);
      const want = DIM + near * near * (1 - DIM);

      const mat = m.material as MeshBasicMaterial;
      lit.setScalar(still ? 1 : want);
      mat.color.lerp(lit, k);

      if (d < Math.min(CELL_W, CELL_H) / 2 && (!nearest || d < nearest.d)) {
        nearest = { d, tile: p.tile };
      }
    }

    const id = nearest?.tile.id ?? null;
    if (id !== hovered.current) {
      hovered.current = id;
      onHover(nearest?.tile ?? null);
    }
  });

  return (
    <>
      {placed.map((p, i) => {
        const map = maps[p.tile.image];
        return (
          <mesh
            key={p.key}
            ref={(el) => {
              if (el) group.current[i] = el;
            }}
          >
            <planeGeometry args={[CELL_W, CELL_H]} />
            {/*
              **Keyed on the capture, which is the fix rather than a
              flourish.** The textures load after first paint, and a
              three.js material compiled without a map ignores one
              assigned afterwards: the shader it built has no texture
              sampler in it. The whole wall rendered as flat grey
              rectangles, laid out perfectly, with no error anywhere.
              Changing the key makes R3F build a new material once the
              texture is in hand, which is the documented way out.
            */}
            <meshBasicMaterial
              key={map ? p.tile.image : "pending"}
              map={map ?? null}
              color={map ? "#6b6b6b" : "#141414"}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

export default function WorkCanvasScene({
  tiles,
  still,
  onHover,
}: {
  tiles: CanvasTile[];
  still: boolean;
  onHover: (t: CanvasTile | null) => void;
}) {
  return (
    <Canvas
      orthographic
      /* Zoom 1 on an orthographic camera makes one world unit one pixel,
         which is why every measurement in this file is a plain CSS size. */
      camera={{ zoom: 1, position: [0, 0, 10], near: 0.1, far: 100 }}
      frameloop={still ? "demand" : "always"}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Wall tiles={tiles} still={still} onHover={onHover} />
    </Canvas>
  );
}
