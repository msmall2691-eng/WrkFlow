"use client";

import { useEffect, useRef } from "react";

/*
  Liquid Chrome — an interactive WebGL shader wallpaper.

  A domain-warped fbm field is pushed through high-frequency bands to fake a
  molten, reflective metal surface. It reacts to the pointer (the field bulges
  and brightens toward the cursor) and to clicks (expanding ripples distort the
  metal where you tap). Several palettes ("chrome", "aurora", "gold", "ion").

  Self-contained: raw WebGL, no dependencies. dpr-capped, pauses off-screen,
  honors prefers-reduced-motion (renders a single still frame), and degrades to
  a CSS gradient if WebGL is unavailable.
*/

export type ChromePalette = "chrome" | "aurora" | "gold" | "ion";

const PALETTE_ID: Record<ChromePalette, number> = {
  chrome: 0,
  aurora: 1,
  gold: 2,
  ion: 3,
};

const MAX_RIPPLES = 8;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;       // pixels, gl_FragCoord space (origin bottom-left)
uniform float u_palette;
uniform float u_intensity;
uniform float u_speed;
uniform vec3  u_ripples[${MAX_RIPPLES}]; // xy = pixels, z = age in seconds
uniform int   u_rippleCount;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

const mat2 M = mat2(1.6, 1.2, -1.2, 1.6);

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = M * p;
    a *= 0.5;
  }
  return v;
}

// Three-stop palette per id.
void palette(float id, out vec3 dark, out vec3 mid, out vec3 light) {
  if (id < 0.5) {            // chrome — cool steel / silver / white
    dark  = vec3(0.02, 0.03, 0.07);
    mid   = vec3(0.34, 0.40, 0.55);
    light = vec3(0.92, 0.96, 1.00);
  } else if (id < 1.5) {     // aurora — indigo / teal / mint
    dark  = vec3(0.03, 0.02, 0.10);
    mid   = vec3(0.10, 0.45, 0.55);
    light = vec3(0.60, 1.00, 0.85);
  } else if (id < 2.5) {     // gold — espresso / amber / pale gold
    dark  = vec3(0.06, 0.03, 0.01);
    mid   = vec3(0.55, 0.36, 0.08);
    light = vec3(1.00, 0.92, 0.66);
  } else {                   // ion — near-black / signal blue / white
    dark  = vec3(0.01, 0.02, 0.05);
    mid   = vec3(0.145, 0.388, 0.922);
    light = vec3(0.95, 0.97, 1.00);
  }
}

void main() {
  // Aspect-correct, centered coordinates.
  vec2 p = (gl_FragCoord.xy * 2.0 - u_res) / u_res.y;
  vec2 m = (u_mouse * 2.0 - u_res) / u_res.y;

  float t = u_time * 0.16 * u_speed;
  float amp = u_intensity;

  vec2 q = p;

  // Pointer bulge — the metal swells toward the cursor.
  vec2 toM = p - m;
  float md = length(toM);
  q += normalize(toM + 1e-5) * (0.22 * amp) * exp(-md * 1.4);

  // Click ripples — expanding waves that distort the surface.
  float ringGlow = 0.0;
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    if (i >= u_rippleCount) break;
    vec3 r = u_ripples[i];
    vec2 rp = (r.xy * 2.0 - u_res) / u_res.y;
    float age = r.z;
    float d = length(p - rp);
    float fall = exp(-d * 2.2) * exp(-age * 1.6);
    float wave = sin(d * 16.0 - age * 9.0) * fall;
    q += normalize(p - rp + 1e-5) * wave * (0.16 * amp);
    ringGlow += max(0.0, wave) * 0.5;
  }

  // Domain-warped fbm → the liquid flow.
  float n = fbm(q * 1.5 + t);
  vec2 warp = vec2(
    fbm(q + n + vec2(t, 0.0)),
    fbm(q - n + vec2(0.0, t))
  );
  float v = fbm(q * 2.0 + warp * 2.2 + t * 0.5);

  // High-frequency bands → reflective chrome ridges.
  float bands = sin(v * 8.0 + warp.x * 5.0 + p.x * 1.5);
  float chrome = pow(0.5 + 0.5 * bands, 1.6);

  vec3 dark, mid, light;
  palette(u_palette, dark, mid, light);

  vec3 col = mix(dark, mid, smoothstep(0.0, 0.55, chrome));
  col = mix(col, light, smoothstep(0.55, 0.92, chrome));

  // Sharp specular streaks.
  col += pow(chrome, 7.0) * 0.7;

  // Pointer hot-spot + ripple ring glow.
  col += light * exp(-md * 2.4) * 0.22 * amp;
  col += light * ringGlow * 0.6;

  // Gentle vignette so overlaid text stays readable.
  float vig = smoothstep(1.45, 0.35, length(p));
  col *= mix(0.6, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function LiquidChrome({
  palette = "chrome",
  intensity = 1,
  speed = 1,
  className = "",
}: {
  palette?: ChromePalette;
  intensity?: number;
  /** Flow speed multiplier — lower is calmer/less fluid. */
  speed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Latest props read by the render loop without re-initializing WebGL.
  const paletteRef = useRef(palette);
  const intensityRef = useRef(intensity);
  const speedRef = useRef(speed);
  paletteRef.current = palette;
  intensityRef.current = intensity;
  speedRef.current = speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: false, alpha: false }) as
        | WebGLRenderingContext
        | null) ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      // Fallback: a static gradient so the page never looks broken.
      canvas.style.background =
        "radial-gradient(120% 120% at 50% 30%, #2a3a5e 0%, #0a0e1a 70%)";
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Fullscreen triangle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uPalette = gl.getUniformLocation(prog, "u_palette");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");
    const uSpeed = gl.getUniformLocation(prog, "u_speed");
    const uRipples = gl.getUniformLocation(prog, "u_ripples");
    const uRippleCount = gl.getUniformLocation(prog, "u_rippleCount");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    const start = performance.now();

    // Pointer state (gl_FragCoord space: origin bottom-left).
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let primed = false;

    type Ripple = { x: number; y: number; t0: number };
    let ripples: Ripple[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = w;
      height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!primed) {
        mouse.x = target.x = canvas.width * 0.5;
        mouse.y = target.y = canvas.height * 0.6;
        primed = true;
      }
    };

    const toCanvas = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * dpr;
      const y = (rect.height - (clientY - rect.top)) * dpr; // flip Y
      return { x, y };
    };

    const onMove = (e: PointerEvent) => {
      const c = toCanvas(e.clientX, e.clientY);
      target.x = c.x;
      target.y = c.y;
    };

    const onDown = (e: PointerEvent) => {
      const c = toCanvas(e.clientX, e.clientY);
      ripples.push({ x: c.x, y: c.y, t0: (performance.now() - start) / 1000 });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    const render = () => {
      const now = (performance.now() - start) / 1000;

      // Smooth the pointer for a fluid, weighted feel.
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;

      // Drop ripples once they have decayed.
      ripples = ripples.filter((r) => now - r.t0 < 4.0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 6.0 : now);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uPalette, PALETTE_ID[paletteRef.current]);
      gl.uniform1f(uIntensity, intensityRef.current);
      gl.uniform1f(uSpeed, speedRef.current);

      const data = new Float32Array(MAX_RIPPLES * 3);
      ripples.forEach((r, i) => {
        data[i * 3] = r.x;
        data[i * 3 + 1] = r.y;
        data[i * 3 + 2] = now - r.t0;
      });
      gl.uniform3fv(uRipples, data);
      gl.uniform1i(uRippleCount, ripples.length);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (running && !reduced) raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduced) raf = requestAnimationFrame(render);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    if (reduced) render();
    else raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      io.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  );
}
