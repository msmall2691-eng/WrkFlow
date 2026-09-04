"use client";

import { useEffect, useRef, useState } from "react";
import { useMaine } from "@/lib/useMaine";

/*
  WeatherLayer — the Portland sky, actually on the page.

  The site has fetched cloud cover, fog and wind for months and spent all of
  it adjusting a glow. Here the readings do something you can see: fog drifts
  when Portland is fogged in, rain falls when it's raining, snow when it's
  snowing, and everything moves faster when the wind is up.

  Rules it has to keep, because ambient decoration that breaks a page is not
  charming: it never sits above text (the hero's content is z-10, this is
  behind it), never intercepts a click, renders nothing at all under
  prefers-reduced-motion, and renders nothing if the weather fetch failed —
  which is also what happens on a clear day, since clear weather is the
  absence of an effect rather than an effect of its own.

  Preview without waiting for weather: ?weather=fog | rain | snow | none,
  the same escape hatch TideLevel uses for wave height.
*/

type Mode = "fog" | "rain" | "snow" | "none";

const RAIN = /(rain|drizzle|shower)/i;
const SNOW = /(snow|flurr|sleet|wintry)/i;

function modeFrom(text: string | undefined, fog: boolean): Mode {
  if (text && SNOW.test(text)) return "snow";
  if (text && RAIN.test(text)) return "rain";
  if (fog) return "fog";
  return "none";
}

type Drop = { x: number; y: number; len: number; speed: number; sway: number; r: number };

export default function WeatherLayer() {
  const d = useMaine();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [override, setOverride] = useState<Mode | null>(null);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("weather");
      if (p === "fog" || p === "rain" || p === "snow" || p === "none") setOverride(p);
    } catch {
      /* ignore */
    }
  }, []);

  const mode: Mode = override ?? modeFrom(d?.conditions?.text, d?.fog ?? false);
  const windMph = d?.wind?.mph ?? 0;

  useEffect(() => {
    if (mode === "none") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let drops: Drop[] = [];

    /* Wind scales how hard it comes down and how far it leans. */
    const gust = Math.min(1, windMph / 25);

    const seed = () => {
      const count =
        mode === "rain" ? Math.round(w / 3.6) : mode === "snow" ? Math.round(w / 10) : 8;
      drops = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (initial: boolean): Drop => {
      if (mode === "fog") {
        return {
          x: Math.random() * (w + 600) - 300,
          y: h * (0.15 + Math.random() * 0.7),
          len: 0,
          speed: 0.08 + Math.random() * 0.16 + gust * 0.35,
          sway: 0,
          r: 140 + Math.random() * 220,
        };
      }
      if (mode === "snow") {
        return {
          x: Math.random() * w,
          y: initial ? Math.random() * h : -10,
          len: 0,
          speed: 0.35 + Math.random() * 0.5 + gust * 0.8,
          sway: Math.random() * Math.PI * 2,
          r: 1 + Math.random() * 2,
        };
      }
      return {
        x: Math.random() * (w + 200) - 100,
        y: initial ? Math.random() * h : -30,
        len: 15 + Math.random() * 20,
        speed: 5 + Math.random() * 5 + gust * 8,
        sway: 0,
        r: 0,
      };
    };

    /*
      Two tints, because precipitation and fog want opposite treatments.
      Rain and snow are marks and need contrast: ink on cream, light on navy.
      Fog is not a mark, it is a loss of contrast — so it stays pale in both
      themes and merely leans cooler and heavier on cream, which is otherwise
      bright enough to swallow it entirely.
    */
    let tint = "226,236,244";
    let fogTint = "226,236,244";
    let fogAlpha = 0.075;
    const readTint = () => {
      const light = document.documentElement.dataset.theme === "light";
      tint = light ? "52,64,79" : "226,236,244";
      fogTint = light ? "168,184,201" : "226,236,244";
      fogAlpha = light ? 0.2 : 0.085;
    };
    readTint();
    window.addEventListener("theme:change", readTint);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Lean with the wind, and never straight down — rain that falls
       perfectly vertically reads as a screensaver. */
    const lean = 0.25 + gust * 1.5;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);

      if (mode === "fog") {
        for (const p of drops) {
          p.x += p.speed;
          if (p.x - p.r > w + 300) p.x = -p.r - 300;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(${fogTint},${fogAlpha})`);
          g.addColorStop(1, `rgba(${fogTint},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      if (mode === "snow") {
        ctx.fillStyle = `rgba(${tint},0.5)`;
        for (const p of drops) {
          p.y += p.speed;
          p.sway += 0.01;
          p.x += Math.sin(p.sway) * 0.4 + gust * 0.6;
          if (p.y > h + 6 || p.x > w + 12) Object.assign(p, spawn(false));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      /* Ambient, not a downpour: this sits behind a headline, and the
         first tuning pass was compensating for a layer that turned out to be
         painted over entirely. */
      ctx.strokeStyle = `rgba(${tint},0.32)`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (const p of drops) {
        p.y += p.speed;
        p.x += p.speed * lean * 0.25;
        if (p.y > h + p.len) Object.assign(p, spawn(false));
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.len * lean * 0.25, p.y - p.len);
      }
      ctx.stroke();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("theme:change", readTint);
    };
  }, [mode, windMph]);

  if (mode === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
