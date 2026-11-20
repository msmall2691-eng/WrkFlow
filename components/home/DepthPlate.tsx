"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/*
  One real screenshot, given depth, moving with the cursor.

  **This is the technique Meg picked, and it is the opposite of what was
  here before.** The references she chose all do the same thing: a cream
  ground, a large serif headline, and ONE real photograph carrying depth
  that answers the pointer. The depth is inside the image. There is no
  floating geometry, no particle field and no glow, because in every one
  of those sites the craft is the typography and the picture, and the
  motion is only there to make the picture feel like a place.

  **What is on the plane is a real capture of a real system she built**,
  from `public/shots/`, which is the first rule in CLAUDE.md: proof is
  never invented, and that includes the hero image.

  **The plain `<img>` is the floor, not the fallback.** It renders first,
  it is what a browser without WebGL keeps, and it is what sits under the
  canvas while the texture loads, so the hero is never an empty box. That
  also makes it the element the page's largest-paint is measured on, which
  is why the canvas is allowed to arrive late.

  **And the canvas arrives in its own chunk, which is load-bearing
  rather than tidy.** Imported directly it put three.js into the
  homepage's first load and took it from 131 kB to 378 kB: the page every
  visitor fetches, nearly tripled, for an effect that is decoration over a
  picture that already works. Split, the picture ships immediately and
  three follows only once the page is interactive.
*/

const PlateCanvas = dynamic(() => import("./DepthPlateCanvas"), {
  ssr: false,
});

export default function DepthPlate({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [ready, setReady] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    /* WebGL is checked before the chunk is requested: a machine that
       cannot draw it should not pay to download three to find out. */
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

    /* One reader, subscribed. Turning the setting on with the page open is
       the moment it matters most. */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(reduced.matches);
    sync();
    reduced.addEventListener("change", sync);
    setReady(true);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-[color:var(--cp-well)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        decoding="async"
      />
      {ready ? <PlateCanvas src={src} still={still} /> : null}
    </div>
  );
}
