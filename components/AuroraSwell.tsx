"use client";

import { useEffect, useRef } from "react";

/*
  AuroraSwell — the hero background. A domain-warped fbm "aurora" bent into
  undulating horizontal wave bands; brightens + warps toward the cursor.
  Monochrome, built from the live accent token so it recolors with the picker.
  WebGL with a 2D-gradient fallback. Honors reduced-motion / offscreen / hidden.
*/

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uM;
uniform float uIntensity; uniform vec3 uDeep, uMid, uHi;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=uv; vec2 d=uv-uMouse; float r=length(d);
  p+=normalize(d+1e-5)*uM*0.05*exp(-r*5.0);
  float t=uTime*0.06;
  vec2 q=vec2(fbm(p*2.0+t),fbm(p*2.0+vec2(5.2,1.3)-t));
  float f=fbm(p*3.0+q*1.6+t);
  float bands=sin(uv.y*6.0+f*3.2+sin(uv.x*2.0+t)*0.7);
  float a=smoothstep(0.02,1.0,f)*(0.55+0.45*bands); a*=a;
  a+=uM*0.55*exp(-r*4.0);
  a=clamp(a*uIntensity*1.18,0.0,1.0);
  vec3 col=mix(uDeep,uMid,a);
  col=mix(col,uHi,clamp(a-0.48,0.0,1.0));
  gl_FragColor=vec4(col,1.0);
}`;

function hexToRgb(hex: string, fb: [number, number, number]): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return fb;
  const n = parseInt(m[1], 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}
const lighten = (c: [number, number, number], k = 0.5): [number, number, number] =>
  [c[0] + (1 - c[0]) * k, c[1] + (1 - c[1]) * k, c[2] + (1 - c[2]) * k];

export default function AuroraSwell({
  accentVar = "--color-signal",
  intensity = 1,
  speed = 1,
  className = "",
}: {
  accentVar?: string;
  intensity?: number;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const gl = cv.getContext("webgl", { alpha: false, antialias: true });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(devicePixelRatio || 1, 2);

    if (!gl) {
      const c = cv.getContext("2d")!;
      const fit = () => {
        const r = cv.getBoundingClientRect();
        cv.width = r.width * DPR;
        cv.height = r.height * DPR;
        const g = c.createLinearGradient(0, 0, cv.width, cv.height);
        g.addColorStop(0, "#07182a");
        g.addColorStop(1, "#1d5aa8");
        c.fillStyle = g;
        c.fillRect(0, 0, cv.width, cv.height);
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(cv);
      return () => ro.disconnect();
    }

    const pr = gl.createProgram()!;
    const sh = (t: number, s: string) => { const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x); gl.attachShader(pr, x); };
    sh(gl.VERTEX_SHADER, VERT); sh(gl.FRAGMENT_SHADER, FRAG); gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const uRes = U("uRes"), uTime = U("uTime"), uMouse = U("uMouse"), uM = U("uM"), uInt = U("uIntensity"), uDeep = U("uDeep"), uMid = U("uMid"), uHi = U("uHi");

    let mid: [number, number, number] = [0.14, 0.38, 0.85], hi = lighten(mid, 0.72);
    const deep: [number, number, number] = [0.03, 0.08, 0.16];
    const readAccent = () => { mid = hexToRgb(getComputedStyle(cv).getPropertyValue(accentVar), [0.14, 0.38, 0.85]); hi = lighten(mid, 0.72); };
    readAccent();
    window.addEventListener("accentchange", readAccent);
    const at = setInterval(readAccent, 1500);

    const fit = () => { const r = cv.getBoundingClientRect(); cv.width = Math.max(2, r.width * DPR); cv.height = Math.max(2, r.height * DPR); gl.viewport(0, 0, cv.width, cv.height); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(cv);

    const m = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, amt: 0, on: 0 };
    const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); m.tx = (e.clientX - r.left) / r.width; m.ty = 1 - (e.clientY - r.top) / r.height; m.on = 1; };
    const onLeave = () => { m.on = 0; };
    const host = cv.parentElement!;
    const isTouch = matchMedia("(hover: none)").matches;
    if (!isTouch) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    let vis = true; const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0 }); io.observe(cv);

    let raf = 0; const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!vis || document.hidden) return;
      m.x += (m.tx - m.x) * 0.08; m.y += (m.ty - m.y) * 0.08; m.amt += (m.on - m.amt) * 0.05;
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, reduce ? 6.0 : ((now - t0) / 1000) * speed);
      gl.uniform2f(uMouse, m.x, m.y); gl.uniform1f(uM, m.amt); gl.uniform1f(uInt, intensity);
      gl.uniform3fv(uDeep, deep); gl.uniform3fv(uMid, mid); gl.uniform3fv(uHi, hi);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduce) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); clearInterval(at); window.removeEventListener("accentchange", readAccent); ro.disconnect(); io.disconnect(); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, [accentVar, intensity, speed]);

  return <canvas ref={ref} aria-hidden="true" className={className}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, display: "block" }} />;
}
