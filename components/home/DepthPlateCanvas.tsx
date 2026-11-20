"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, Mesh, TextureLoader, type Texture } from "three";

/*
  One real screenshot, given depth, moving with the cursor.

  **This is the technique Meg picked, and it is the opposite of what was
  here before.** The references she chose all do the same thing: a cream
  ground, a large serif headline, and ONE real photograph carrying actual
  depth that answers the pointer. The depth is inside the image. There is
  no floating geometry, no particle field and no glow, because in every
  one of those sites the craft is the typography and the picture, and the
  motion is only there to make the picture feel like a place.

  **What is on the plane is a real capture of a real system she built**,
  from `public/shots/`, which is the first rule in CLAUDE.md: proof is
  never invented, and that includes the hero image.

  Brume drives its parallax from a grayscale depth map painted per photo.
  There is no depth map for a screenshot of a web app and inventing one
  would be guessing at a third dimension that is not in the picture, so
  this does the honest version: the plate is a real plane in real space,
  lit and shadowed, and the camera moves around it. The depth is the
  geometry rather than a painted claim about it.
*/

export default function PlateCanvas({ src, still }: { src: string; still: boolean }) {
  return (
    <Canvas
      /* Reduced motion draws the plate square on, once, and holds it:
         the same picture, without the movement. */
      frameloop={still ? "demand" : "always"}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 30, position: [0, 0, 5.2], near: 0.1, far: 40 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Plate src={src} still={still} />
    </Canvas>
  );
}

function Plate({ src, still }: { src: string; still: boolean }) {
  const mesh = useRef<Mesh>(null);
  const { viewport, invalidate } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const [map, setMap] = useState<Texture | null>(null);

  /*
    Loaded imperatively rather than with `useLoader`, which suspends: a
    hero that throws to a Suspense boundary on first paint is a hero that
    flashes empty on the slowest connections, which is the one case it
    matters.
  */
  useEffect(() => {
    let live = true;
    new TextureLoader().load(src, (t) => {
      if (!live) return;
      t.anisotropy = 8;
      setMap(t);
      invalidate();
    });
    return () => {
      live = false;
    };
  }, [src, invalidate]);

  useEffect(() => () => map?.dispose(), [map]);

  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  /*
    Sized from the viewport so the plate fills its box at any width, with
    the capture's own 16:10 kept rather than stretched. A screenshot
    distorted to fit is a screenshot nobody will believe.
  */
  const [w, h] = useMemo(() => {
    const width = viewport.width;
    return [width, width * 0.625] as const;
  }, [viewport.width]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m || still) return;
    const k = 1 - Math.pow(0.0015, Math.min(delta, 0.05));
    /*
      Small on purpose. The reference sites tilt by a couple of degrees at
      most: past that a page stops reading as a photograph with depth and
      starts reading as a widget being waved about.
    */
    m.rotation.y = MathUtils.lerp(m.rotation.y, pointer.current.x * 0.055, k);
    m.rotation.x = MathUtils.lerp(m.rotation.x, pointer.current.y * 0.03, k);
    m.position.x = MathUtils.lerp(m.position.x, pointer.current.x * -0.09, k);
  });

  if (!map) return null;

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[w, h, 1, 1]} />
      {/* Unlit: the capture already carries its own light, and a lambert
          term over it would wash the UI in the screenshot grey. */}
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

