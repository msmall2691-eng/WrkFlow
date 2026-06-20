"use client";

import { useEffect, useRef } from "react";

/*
  DepthContours — a living nautical depth-chart background.

  Thin concentric contour lines (bathymetric soundings) drift slowly across the
  dark field; on mouse-move they warp around the cursor and brighten toward the
  active accent. Calm, premium, hand-built. Ambient — never behind body copy or
  the interactive demos.

  Ties to the "Make it yours" accent picker by reading `accentVar`
  (default --color-signal) and recoloring live. WebGL with a static-SVG fallback.
*/

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

const FRAG = `
precision highp float;
uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uMouseAmt;
uniform float uIntensity;
uniform vec3  uAccent;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float a=.5, s=0.;
  for(int i=0;i<5;i++){ s+=a*vnoise(p); p*=2.02; a*=.5; }
  return s;
}
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes.xy;
  vec2 p  = uv * vec2(uRes.x/uRes.y, 1.0) * 3.2;
  vec2 m  = uMouse / uRes.xy; m.y = 1.0 - m.y;
  vec2 d  = uv - m;
  float r = length(d);
  p += normalize(d + 1e-5) * uMouseAmt * 0.18 * exp(-r*6.0);
  float field = fbm(p + vec2(uTime*0.02, uTime*0.015));
  float lines = abs(fract(field*7.0) - 0.5);
  float ink   = smoothstep(0.045, 0.0, lines);
  vec3 base  = vec3(0.043, 0.090, 0.133);   // harbor navy #0b1722
  vec3 slate = vec3(0.47, 0.59, 0.67);
  vec3 line  = mix(slate, uAccent, smoothstep(0.28, 0.0, r) * uMouseAmt);
  float alpha = ink * (0.16 + 0.12*uIntensity);
  gl_FragColor = vec4(mix(base, line, alpha), 1.0);
}`;

export default function DepthContours({
  intensity = 1,
  interactive = true,
  accentVar = "--color-signal",
  className = "",
}: {
  intensity?: number;
  interactive?: boolean;
  accentVar?: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) {
      // Static SVG fallback so it never looks broken without WebGL.
      cv.style.backgroundImage =
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='120'%3E%3Cg fill='none' stroke='%23788fa6' stroke-width='1' opacity='0.12'%3E%3Cpath d='M0,60 Q40,30 80,60 T160,60'/%3E%3Cpath d='M0,90 Q40,60 80,90 T160,90'/%3E%3Cpath d='M0,30 Q40,0 80,30 T160,30'/%3E%3C/g%3E%3C/svg%3E\")";
      return;
    }

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = matchMedia("(hover: none)").matches;
    const DPR = Math.min(devicePixelRatio || 1, 2);

    const prog = gl.createProgram()!;
    const sh = (t: number, src: string) => {
      const s = gl.createShader(t)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      gl.attachShader(prog, s);
    };
    sh(gl.VERTEX_SHADER, VERT);
    sh(gl.FRAGMENT_SHADER, FRAG);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse"),
      uMouseAmt = U("uMouseAmt"), uIntensity = U("uIntensity"), uAccent = U("uAccent");

    let accent = [0.086, 0.64, 0.58]; // sea-glass default
    const readAccent = () => {
      const hex = getComputedStyle(cv).getPropertyValue(accentVar).trim();
      const m = /^#?([0-9a-f]{6})$/i.exec(hex);
      if (m) {
        const n = parseInt(m[1], 16);
        accent = [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
      }
    };
    readAccent();
    window.addEventListener("accentchange", readAccent);
    const accentTimer = setInterval(readAccent, 1500);

    const resize = () => {
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(2, Math.floor(r.width * DPR));
      cv.height = Math.max(2, Math.floor(r.height * DPR));
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const mouse = { x: -9999, y: -9999, amt: 0, tx: -9999, ty: -9999 };
    const parent = cv.parentElement;
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * DPR;
      mouse.ty = (e.clientY - r.top) * DPR;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };
    if (interactive && !isTouch && parent) {
      parent.addEventListener("pointermove", onMove);
      parent.addEventListener("pointerleave", onLeave);
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(cv);

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      mouse.x += (mouse.tx - mouse.x) * 0.1;
      mouse.y += (mouse.ty - mouse.y) * 0.1;
      const target = mouse.tx > -100 ? 1 : 0;
      mouse.amt += (target - mouse.amt) * 0.06;
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, reduce ? 0.6 : (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseAmt, mouse.amt);
      gl.uniform1f(uIntensity, intensity);
      gl.uniform3fv(uAccent, accent);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduce) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(accentTimer);
      window.removeEventListener("accentchange", readAccent);
      ro.disconnect();
      io.disconnect();
      if (parent) {
        parent.removeEventListener("pointermove", onMove);
        parent.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [intensity, interactive, accentVar]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, display: "block" }}
    />
  );
}
