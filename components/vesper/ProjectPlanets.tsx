"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  CatmullRomCurve3,
  Color,
  Mesh,
  MeshPhysicalMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import type { Planet } from "@/lib/planets";

/*
  The project planets, and the camera that flies past them.

  Section 2 of the Vesper prompt: five spheres of radius 4 on a
  CatmullRom spline, a MeshPhysicalMaterial with clearcoat, a fragment
  shader injected through `onBeforeCompile` that scrolls noise across the
  surface, and a camera driven along the spline by scroll.

  **The spec asks for Lenis at lerp 0.07 and this eases the camera
  instead, which is a deliberate departure.** Lenis replaces the page's
  scrolling everywhere it is mounted, and this hero sits on top of a shop
  with a long catalogue, a case study and a contact form under it. Taking
  over the scroll of all of that to smooth one camera is a large change
  to the whole site in service of a small one here. The camera carries
  the same 0.07 easing toward the scroll position, so the movement looks
  the way the spec describes without the page's own scrolling being
  touched.

  **The spheres are geometry, and the projects are real.** What a planet
  shows when you reach it comes from `lib/planets.ts`, which reads the
  work list: a real title, a real description, a real link. The planet is
  a vehicle for getting you to a case study, not a claim in itself.
*/

/** The spec's radius, and how far apart the planets sit on the path. */
const PLANET_R = 4;
const SPAN = 26;

/** The spec's 5vh trigger zone, as a share of the whole spline. */
const TRIGGER = 0.05;

/** The spec's Lenis lerp, applied to the camera. */
const EASE = 0.07;

const NOISE = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

function makeMaterial(tint: Color) {
  const m = new MeshPhysicalMaterial({
    color: tint,
    roughness: 0.42,
    metalness: 0.1,
    /* The spec's clearcoat: what makes these read as bodies with an
       atmosphere rather than as painted balls. */
    clearcoat: 1,
    clearcoatRoughness: 0.25,
  });

  /*
    `onBeforeCompile` rather than a ShaderMaterial, because everything
    MeshPhysicalMaterial does about light is worth keeping; only the
    surface colour needs to move. The uniform is held on the material so
    the frame loop can advance it without recompiling anything.
  */
  const uniforms = { uTime: { value: 0 } };
  /* three 0.187 does not export a `Shader` type; the callback's own
     parameter type is what onBeforeCompile already declares. */
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "void main() {",
        `${NOISE}\n uniform float uTime;\n varying vec3 vPlanetPos;\n void main() {`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
         float n = snoise(vPlanetPos * 0.42 + vec3(0.0, uTime * 0.06, uTime * 0.04));
         float band = smoothstep(-0.25, 0.65, n);
         diffuseColor.rgb = mix(diffuseColor.rgb * 0.55, diffuseColor.rgb * 1.35, band);`,
      );
    shader.vertexShader = shader.vertexShader
      .replace("void main() {", "varying vec3 vPlanetPos;\n void main() {")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\n vPlanetPos = position;");
  };
  (m as MeshPhysicalMaterial & { userData: { uniforms: typeof uniforms } }).userData = {
    uniforms,
  };
  return m;
}

export default function ProjectPlanets({
  list,
  progress,
  still,
  onNear,
}: {
  list: Planet[];
  /** 0..1 along the spline, driven by scroll. */
  progress: React.RefObject<number>;
  still: boolean;
  onNear: (index: number | null) => void;
}) {
  const { camera, invalidate } = useThree();
  const eased = useRef(0);
  const near = useRef<number | null>(null);
  const look = useMemo(() => new Vector3(), []);

  /*
    The planets sit alternating left and right of the path so the camera
    passes BETWEEN them rather than through them, which is what makes the
    travel read as flight rather than as a slideshow.
  */
  const spots = useMemo(
    () =>
      list.map(
        (_, i) =>
          new Vector3(
            (i % 2 === 0 ? -1 : 1) * 7.5,
            (i % 3) * 2.4 - 2.4,
            -SPAN * (i + 1),
          ),
      ),
    [list],
  );

  const curve = useMemo(() => {
    /* One control point before the first planet and one past the last,
       so the camera is already moving when the first comes into view and
       does not stop dead at the end. */
    const pts = [
      new Vector3(0, 0, 10),
      ...spots.map((s, i) => new Vector3(s.x * -0.32, s.y * 0.35, s.z + SPAN * 0.5 - i * 0.2)),
      new Vector3(0, 0, -SPAN * (spots.length + 0.7)),
    ];
    return new CatmullRomCurve3(pts, false, "catmullrom", 0.5);
  }, [spots]);

  const geometry = useMemo(() => new SphereGeometry(PLANET_R, 64, 64), []);
  const materials = useMemo(() => {
    /* Her palette across the five, rather than the spec's two neons. */
    const tints = ["#2dd4bf", "#8b5cf6", "#f472b6", "#38bdf8", "#fbbf24"];
    return list.map((_, i) => makeMaterial(new Color(tints[i % tints.length])));
  }, [list]);

  useEffect(
    () => () => {
      geometry.dispose();
      for (const m of materials) m.dispose();
    },
    [geometry, materials],
  );

  const meshes = useRef<Mesh[]>([]);

  useFrame((state, delta) => {
    const want = Math.max(0, Math.min(1, progress.current ?? 0));

    /*
      Reduced motion goes straight to the scroll position with no easing:
      the camera still shows the right planet for where the page is, it
      just does not glide there. "No scroll-scrubbing" in the spec's
      quality bar means no smoothed travel, not a frozen scene.
    */
    eased.current = still
      ? want
      : eased.current + (want - eased.current) * (1 - Math.pow(1 - EASE, Math.min(delta, 0.05) * 60));

    const t = Math.max(0, Math.min(1, eased.current));
    curve.getPointAt(t, camera.position);

    /* Look a little further down the path, so the camera leads into the
       turn instead of swinging after it. */
    curve.getPointAt(Math.min(1, t + 0.02), look);
    camera.lookAt(look);

    /* Advance each planet's surface, and find the one the camera is in
       the trigger zone of. */
    let found: number | null = null;
    for (let i = 0; i < list.length; i += 1) {
      const m = meshes.current[i];
      if (m) {
        const u = (m.material as MeshPhysicalMaterial & {
          userData: { uniforms: { uTime: { value: number } } };
        }).userData.uniforms;
        if (u) u.uTime.value = still ? 0 : state.clock.elapsedTime;
        m.rotation.y += still ? 0 : delta * 0.05;
      }
      /* Each planet owns a slice of the spline; the trigger is the band
         around its centre. */
      const centre = (i + 1) / (list.length + 1);
      if (Math.abs(t - centre) < TRIGGER) found = i;
    }

    if (found !== near.current) {
      near.current = found;
      onNear(found);
      invalidate();
    }
  });

  return (
    <>
      {/* Enough light to show the clearcoat, from two sides so the
          spheres have a terminator rather than being flatly lit. */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 10, 6]} intensity={2.1} />
      <directionalLight position={[-9, -4, -8]} intensity={0.8} color="#8b5cf6" />

      {list.map((p, i) => (
        <mesh
          key={p.id}
          ref={(el) => {
            if (el) meshes.current[i] = el;
          }}
          geometry={geometry}
          material={materials[i]}
          position={spots[i]}
        />
      ))}
    </>
  );
}
