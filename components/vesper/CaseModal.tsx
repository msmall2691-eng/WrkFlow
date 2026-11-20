"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LinearFilter,
  Mesh,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";
import type { Planet } from "@/lib/planets";

/*
  Section 3 of the Vesper prompt: the case transition.

  **What it opens onto is a way in to the real case study, not a copy of
  it.** The spec says the modal cross-fades to "the case study content
  (images, video, text)". This site already has case studies, as pages,
  with their own tests and their own URL somebody can send to a client.
  Rendering that content a second time inside a modal would be the thing
  this repo keeps writing down about anything described in two places:
  two copies, one of which goes stale. So the modal carries the real
  capture, the real title, the real description, and a button through to
  the page. The transition is the spec's; the content stays where it
  lives.

  **The distortion is a real displacement, not a CSS filter.** A
  full-screen quad samples the capture through a curl-noise offset driven
  by one progress uniform over the spec's 800ms, peaking in the middle so
  the picture comes apart and reassembles rather than simply blurring.

  **Reduced motion and narrow screens get a cross-fade**, which the
  spec's own responsive and accessibility sections both ask for.
*/

const DURATION = 800;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uAmp;
  uniform float uTime;
  uniform vec2 uCover;
  varying vec2 vUv;

  /* Gradient noise, and a curl of it: rotating the gradient ninety
     degrees gives a divergence-free field, which is what makes the
     displacement swirl instead of simply pushing everything one way. */
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
                   dot(hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
               mix(dot(hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
                   dot(hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
  }
  vec2 curl(vec2 p) {
    float e = 0.012;
    float nx = noise(vec2(p.x, p.y + e)) - noise(vec2(p.x, p.y - e));
    float ny = noise(vec2(p.x + e, p.y)) - noise(vec2(p.x - e, p.y));
    return vec2(nx, -ny) / (2.0 * e);
  }

  void main() {
    /* Cover rather than stretch: a capture squashed to the window is a
       capture nobody believes. */
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    vec2 d = curl(uv * 3.2 + uTime * 0.12) * uAmp;
    vec2 s = clamp(uv + d, 0.0, 1.0);
    vec3 col = texture2D(uMap, s).rgb;
    /* Pull the whole thing down as it distorts, so the copy that fades
       in over it always has somewhere to sit. */
    gl_FragColor = vec4(col * (1.0 - uAmp * 2.4), 1.0);
  }
`;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

function Plate({ src, amp }: { src: string; amp: React.RefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  const { size, invalidate } = useThree();
  const [map, setMap] = useState<Texture | null>(null);

  useEffect(() => {
    let live = true;
    new TextureLoader().load(src, (t) => {
      if (!live) return;
      t.minFilter = LinearFilter;
      t.generateMipmaps = false;
      t.colorSpace = SRGBColorSpace;
      setMap(t);
      invalidate();
    });
    return () => {
      live = false;
    };
  }, [src, invalidate]);

  useEffect(() => () => map?.dispose(), [map]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uMap: { value: null },
          uAmp: { value: 0 },
          uTime: { value: 0 },
          uCover: { value: [1, 1] },
        },
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    if (map) material.uniforms.uMap.value = map;
  }, [map, material]);

  useFrame((state) => {
    material.uniforms.uAmp.value = amp.current ?? 0;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    /* `Texture.image` is typed as `{}` in three 0.187, so the two
       dimensions this needs are read through a narrow cast rather than
       by widening the texture type everywhere. */
    const img = map?.image as { width?: number; height?: number } | undefined;
    if (img?.width && img.height) {
      const ia = img.width / img.height;
      const va = size.width / size.height;
      /* Scale the shorter axis so the capture covers without squashing. */
      material.uniforms.uCover.value =
        va > ia ? [1, ia / va] : [va / ia, 1];
    }
  });

  if (!map) return null;
  return (
    <mesh ref={mesh} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export default function CaseModal({
  planet,
  onClose,
}: {
  planet: Planet | null;
  onClose: () => void;
}) {
  const amp = useRef(0);
  const [phase, setPhase] = useState<"in" | "open" | "out">("in");
  const [plain, setPlain] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 767px)");
    /* The spec asks for a plain cross-fade in both of these cases. */
    const sync = () => setPlain(reduced.matches || narrow.matches);
    sync();
    reduced.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  const finish = useCallback(() => {
    setPhase("out");
    const started = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - started) / DURATION);
      amp.current = plain ? 0 : Math.sin((1 - t) * Math.PI) * 0.09;
      if (t < 1) requestAnimationFrame(step);
      else onClose();
    };
    requestAnimationFrame(step);
  }, [onClose, plain]);

  /* Open: run the distortion once, then settle. */
  useEffect(() => {
    if (!planet) return;
    setPhase("in");
    const started = performance.now();
    let raf = 0;
    const step = () => {
      const t = Math.min(1, (performance.now() - started) / DURATION);
      amp.current = plain ? 0 : Math.sin(t * Math.PI) * 0.09;
      if (t < 1) raf = requestAnimationFrame(step);
      else setPhase("open");
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [planet, plain]);

  /*
    Focus trap, Escape, and restoring focus on the way out. A fullscreen
    overlay that leaves the keyboard behind the page under it is a
    fullscreen overlay nobody can use, and the spec names a focus trap
    outright.
  */
  useEffect(() => {
    if (!planet) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finish();
        return;
      }
      if (e.key !== "Tab") return;
      const root = panel.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    /* Move focus in once the panel exists. */
    const id = requestAnimationFrame(() => {
      panel.current
        ?.querySelector<HTMLElement>("button, a[href]")
        ?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
      returnTo.current?.focus?.();
    };
  }, [planet, finish]);

  if (!planet || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-[#0a0a0f]"
      role="dialog"
      aria-modal="true"
      aria-label={`${planet.title}, project preview`}
    >
      {/*
        **The plain image is the floor, and it is here because the modal
        opened on black for over a second.** R3F measures its container
        with a ResizeObserver, so the canvas is the default 300x150 until
        that first measurement lands: on a page already busy with the
        particle field and five planets that took about 1.5s, and what a
        visitor saw after pressing "View case" was a black screen. The
        capture renders underneath immediately and the canvas covers it
        once it is real, so there is no gap to see.
      */}
      {planet.shot ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={planet.shot}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* The capture, distorting. */}
      {planet.shot && !plain ? (
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: false }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Plate src={planet.shot} amp={amp} />
        </Canvas>
      ) : null}

      {/*
        The scrim ramps hard across the lower third, because that is
        where the copy is and the capture underneath is a bright white
        web page. The first version faded to 0.45 at mid-height and left
        the title sitting on a screenshot of a kitchen.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,15,0.97)_0%,rgba(10,10,15,0.93)_26%,rgba(10,10,15,0.55)_52%,rgba(10,10,15,0.5)_100%)]" />

      <div
        ref={panel}
        className={`relative mx-auto flex h-full w-full max-w-4xl flex-col justify-end px-6 pb-16 transition-opacity duration-300 ${
          phase === "open" ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={finish}
          className="absolute right-6 top-6 min-h-11 rounded-full border border-white/25 bg-[rgba(10,10,15,0.8)] px-5 text-[13px] text-white backdrop-blur-md transition-colors duration-150 hover:border-white/60"
        >
          Close
        </button>

        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-[#2dd4bf]">
          {planet.tag}
        </p>
        <h2 className="m-0 mt-3 font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-white">
          {planet.title}
        </h2>

        {/*
          One button, pointing at where the case study actually lives. The
          full story is a page with its own URL, which is what somebody
          sends to a client; this is the door to it, not a second copy.
        */}
        <div className="mt-7">
          {planet.external ? (
            <a
              href={planet.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl bg-white px-6 text-[15px] font-semibold text-[#0a0a0f] no-underline hover:opacity-90"
            >
              Visit the live site <span aria-hidden="true">&nbsp;→</span>
            </a>
          ) : (
            <Link
              href={planet.href}
              className="inline-flex min-h-11 items-center rounded-xl bg-white px-6 text-[15px] font-semibold text-[#0a0a0f] no-underline hover:opacity-90"
            >
              Read the case study <span aria-hidden="true">&nbsp;→</span>
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
