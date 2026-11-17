"use client";

import { useEffect, useRef } from "react";

/*
  LakeFog: a Maine lake at dawn, drawn live on the GPU. No video, no photos.

  One fragment shader paints the whole scene every frame: a sky that warms
  toward the horizon, a low sun, three ridgelines of hills fading into the
  haze, a near shore of pines, a lake that mirrors all of it with moving
  ripples and a streak of sunlight, and two layers of fog drifting at
  different speeds.

  Two inputs make it interactive:
    - `lift` (0..1), set by the page from scroll: the fog thins, the sun
      climbs and the light warms from first light to clear morning.
    - the pointer: the ridges and shore shift by depth (parallax) and the
      sun leans toward the cursor.

  Rules kept, as on the M Studio homepage canvas:
    - prefers-reduced-motion holds a still frame, redrawn only when the
      scroll position changes.
    - It stops when off screen or the tab is hidden, tracked separately.
    - It renders below device resolution (it is soft by nature) to stay
      light on phones. Without WebGL the CSS gradient behind it shows.
*/

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uLift;
uniform vec2 uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}

// Height of a ridgeline at x, for layer k (0 far .. 2 near).
float ridge(float x, float k){
  float base = 0.035 + k * 0.03;
  float amp = 0.05 + k * 0.035;
  return base + amp * fbm(vec2(x * (1.4 + k * 0.9) + k * 7.3, k * 3.1));
}
// The near shore: a band of pines, saw-toothed tops.
float pines(float x){
  float t = fract(x * 46.0);
  float tooth = 1.0 - abs(t - 0.5) * 2.0;
  float h = 0.035 + 0.05 * noise(vec2(floor(x * 46.0) * 0.37, 2.0));
  return 0.012 + h * (0.55 + 0.45 * tooth) + 0.02 * fbm(vec2(x * 3.0, 9.0));
}

vec3 skyCol(float y, vec2 uv, vec2 sun, float lift, float disc){
  vec3 top = mix(vec3(0.20, 0.27, 0.38), vec3(0.36, 0.52, 0.70), lift);
  vec3 hor = mix(vec3(0.86, 0.78, 0.70), vec3(0.92, 0.90, 0.84), lift);
  vec3 c = mix(hor, top, smoothstep(0.0, 0.55, y));
  float d = length((uv - sun) * vec2(1.0, 1.25));
  c += vec3(1.0, 0.86, 0.66) * (0.55 * exp(-d * 9.0) + 0.25 * exp(-d * 2.5)) * (0.75 + 0.25 * lift);
  c += vec3(1.0, 0.95, 0.85) * smoothstep(0.035, 0.028, d) * disc;
  return c;
}

// The land above the water line, seen through haze. Returns color and coverage.
vec4 land(float x, float y, vec2 m, float lift, vec3 haze){
  vec4 outc = vec4(0.0);
  for (int i = 0; i < 3; i++){
    float k = float(i);
    float px = x + m.x * (0.006 + k * 0.012);
    float h = ridge(px, k);
    float a = smoothstep(h + 0.002, h - 0.002, y);
    vec3 col = mix(vec3(0.16, 0.22, 0.25), vec3(0.08, 0.13, 0.13), k / 2.0);
    float far = 1.0 - k / 2.6;
    col = mix(col, haze, far * mix(0.82, 0.55, lift));
    outc.rgb = mix(outc.rgb, col, a);
    outc.a = max(outc.a, a);
  }
  float ph = pines(x + m.x * 0.05);
  float a = smoothstep(ph + 0.002, ph - 0.002, y);
  vec3 pc = mix(vec3(0.04, 0.07, 0.07), haze, mix(0.38, 0.12, lift));
  outc.rgb = mix(outc.rgb, pc, a);
  outc.a = max(outc.a, a);
  return outc;
}

void main(){
  vec2 frag = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 uv = vec2(frag.x * aspect, frag.y);
  float lift = clamp(uLift, 0.0, 1.0);
  vec2 m = (uMouse - 0.5) * 2.0;

  float horizon = 0.42;
  vec2 sun = vec2(aspect * (0.62 + 0.04 * m.x), horizon + 0.05 + 0.16 * lift + 0.02 * m.y);
  vec3 haze = mix(vec3(0.80, 0.80, 0.80), vec3(0.88, 0.89, 0.87), lift);

  vec3 col;
  float y = frag.y - horizon;
  if (y >= 0.0){
    col = skyCol(y, uv, sun, lift, 1.0);
    vec4 l = land(uv.x, y, m, lift, haze); // x in height units, so a phone shows a slice, not a squeeze
    col = mix(col, l.rgb, l.a);
  } else {
    // Water: mirror the scene with moving ripples.
    float depth = -y;
    float t = uTime * 0.35;
    vec2 rp = vec2(uv.x * 7.0, depth * 46.0 / (depth * 6.0 + 0.25));
    float rip = fbm(rp + vec2(t, t * 0.6)) - 0.5;
    float rip2 = noise(vec2(uv.x * 30.0, depth * 140.0 - uTime * 1.2)) - 0.5;
    float wob = (rip * 0.022 + rip2 * 0.006) * smoothstep(0.0, 0.25, depth);
    float ry = depth + wob;
    vec2 ruv = vec2(uv.x + wob * 0.6, horizon + ry);
    vec3 refl = skyCol(ry, ruv, sun, lift, 0.0); // no hard disc in the water: the streak carries it
    vec4 l = land(uv.x + wob, ry, m, lift, haze);
    refl = mix(refl, l.rgb, l.a);
    vec3 deep = mix(vec3(0.06, 0.10, 0.13), vec3(0.10, 0.18, 0.24), lift);
    float fres = smoothstep(0.0, 0.5, depth);
    col = mix(refl * 0.86, deep, fres * 0.7);
    // Sun streak, broken by the ripples.
    float sx = abs(uv.x - sun.x);
    float streak = exp(-sx * sx * 260.0 / (depth + 0.05)) * smoothstep(0.55, 0.0, depth);
    float glints = smoothstep(0.62, 0.9, noise(vec2(uv.x * 60.0, depth * 220.0 - uTime * 2.0)));
    col += vec3(1.0, 0.88, 0.70) * streak * (0.35 + 0.9 * glints) * (0.6 + 0.4 * lift);
    // A thin bright line where the water meets the shore.
    col += haze * 0.12 * exp(-depth * 220.0);
  }

  // Fog: two drifting layers that hug the water and thin out as it lifts.
  float fy = frag.y - horizon;
  float band = exp(-pow((fy - 0.01) / (0.14 + 0.06 * lift), 2.0));
  float f1 = fbm(vec2(uv.x * 1.6 - uTime * 0.035, fy * 6.0 + uTime * 0.01));
  float f2 = fbm(vec2(uv.x * 3.4 + uTime * 0.05, fy * 11.0 - uTime * 0.02) + 4.0);
  float fog = band * smoothstep(0.32, 0.85, f1 * 0.65 + f2 * 0.45);
  float density = mix(0.95, 0.18, lift);
  vec3 fogCol = mix(vec3(0.84, 0.85, 0.86), vec3(0.95, 0.94, 0.90), lift);
  fogCol += vec3(1.0, 0.9, 0.75) * 0.12 * exp(-length((uv - sun) * vec2(0.6, 1.4)) * 2.0);
  col = mix(col, fogCol, clamp(fog * density, 0.0, 1.0));
  // An overall morning haze that burns off.
  col = mix(col, haze, (1.0 - lift) * 0.22 * exp(-abs(fy) * 6.0));

  // Vignette and a little grain so the gradients don't band.
  vec2 vq = frag - 0.5;
  col *= 1.0 - dot(vq, vq) * 0.55;
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function LakeFog({
  lift,
  className = "",
}: {
  /** 0 = dawn fog, 1 = clear morning. Read every frame through a ref. */
  lift: { current: number };
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // the CSS gradient behind the canvas stays as the picture

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.warn("LakeFog shader:", gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uLift = gl.getUniformLocation(prog, "uLift");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    let raf = 0;
    let inView = true;
    let tabShown = document.visibilityState === "visible";
    let running = false;
    const t0 = performance.now();

    function resize() {
      const r = canvas!.getBoundingClientRect();
      // Soft by nature: render below device resolution.
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (r.width > 900 ? 0.6 : 0.75);
      canvas!.width = Math.max(1, Math.round(r.width * scale));
      canvas!.height = Math.max(1, Math.round(r.height * scale));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    function draw(now: number) {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, reduce ? 12.0 : (now - t0) / 1000);
      gl!.uniform1f(uLift, lift.current);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    // Reduced motion keeps a loop too, but it only redraws when the scroll
    // position the page wrote has changed, so the still never lags behind
    // the parent's own frame-timed update (Codex, #146).
    let lastLift = -1;
    function loop(now: number) {
      if (!reduce || lift.current !== lastLift) {
        lastLift = lift.current;
        draw(now);
      }
      if (running) raf = requestAnimationFrame(loop);
    }
    function update() {
      const should = inView && tabShown;
      if (should && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    resize();
    draw(performance.now());
    update();

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      update();
    });
    io.observe(canvas);
    const onVis = () => {
      tabShown = document.visibilityState === "visible";
      update();
    };
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      gl!.deleteProgram(prog);
    };
  }, [lift]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
