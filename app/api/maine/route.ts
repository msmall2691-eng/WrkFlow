import { getSunTimes, PORTLAND_ME } from "@/lib/sun";

/*
  /api/maine — a live readout for Portland, Maine: air + water temperature,
  wind, sky conditions, tide state, next sun event / golden hour, moon phase,
  and offshore wave height from NDBC buoy 44007. NWS + NOAA CO-OPS + NDBC,
  computed sun/moon. Edge-cached ~10 min. Every upstream call fails soft.
*/

const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" });
const ymd = (d: Date) =>
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const cardinal = (deg: number) => DIRS[Math.round(deg / 45) % 8];

function clarity(text: string): number {
  const t = text.toLowerCase();
  if (/(rain|shower|drizzle|storm|snow|sleet)/.test(t)) return 0.2;
  if (/(fog|mist|haze)/.test(t)) return 0.3;
  if (/mostly cloudy/.test(t)) return 0.4;
  if (/(overcast|cloudy)/.test(t)) return 0.3;
  if (/partly/.test(t)) return 0.6;
  if (/(mostly clear|mostly sunny|few clouds)/.test(t)) return 0.85;
  if (/(clear|sunny|fair)/.test(t)) return 1;
  return 0.6;
}
const isFog = (text: string) => /(fog|mist|haze)/i.test(text);

/*
  Buoy WVHT (significant wave height, meters) → 0..1 amplitude for shaping
  wave animations. Piecewise so the "current default" band sits in the middle:
  <0.5m glassy, 0.5-1.5m near default, >2.5m rolling (clamped).
*/
function waveAmp(m: number): number {
  if (m <= 0) return 0.1;
  if (m < 0.5) return 0.1 + (m / 0.5) * 0.25; // 0.10..0.35
  if (m < 1.5) return 0.35 + ((m - 0.5) / 1.0) * 0.2; // 0.35..0.55  (existing default sits here)
  if (m < 2.5) return 0.55 + ((m - 1.5) / 1.0) * 0.35; // 0.55..0.90
  return Math.min(1, 0.9 + ((m - 2.5) / 1.5) * 0.1); // 0.90..1.00
}

function moonPhase(date: Date) {
  const synodic = 29.530588853;
  const knownNew = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  let phase = ((date.valueOf() / 86400000 - knownNew) % synodic) / synodic;
  if (phase < 0) phase += 1;
  const i = Math.round(phase * 8) % 8;
  return {
    phase: ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"][i],
    emoji: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"][i],
  };
}

export async function GET() {
  const now = new Date();
  const t = now.getTime();
  const sun = getSunTimes(now);
  const night = t < sun.sunrise.getTime() || t > sun.sunset.getTime();

  let nextSun: { label: string; time: string };
  if (t < sun.sunrise.getTime()) nextSun = { label: "sunrise", time: fmtTime(sun.sunrise) };
  else if (t < sun.sunset.getTime()) nextSun = { label: "sunset", time: fmtTime(sun.sunset) };
  else nextSun = { label: "sunrise", time: fmtTime(getSunTimes(new Date(t + 86400000)).sunrise) };

  // Golden hour — ~70 min around sunrise / sunset.
  const hr = 3600000;
  let light: { label: string; time?: string } | null = null;
  if (t >= sun.sunset.getTime() - 70 * 60000 && t <= sun.sunset.getTime())
    light = { label: "golden hour", time: fmtTime(sun.sunset) };
  else if (t >= sun.sunrise.getTime() && t <= sun.sunrise.getTime() + 70 * 60000)
    light = { label: "golden hour" };

  // Air temp + wind + conditions — NWS (Portland Jetport)
  let tempF: number | null = null;
  let wind: { mph: number; dir: string } | null = null;
  let conditions: { text: string; clarity: number } | null = null;
  try {
    const r = await fetch("https://api.weather.gov/stations/KPWM/observations/latest", {
      headers: { "User-Agent": "mlinx.studio (contact@mlinx.studio)", Accept: "application/geo+json" },
      next: { revalidate: 600 },
    });
    if (r.ok) {
      const p = (await r.json())?.properties ?? {};
      if (typeof p.temperature?.value === "number") tempF = Math.round((p.temperature.value * 9) / 5 + 32);
      if (typeof p.windSpeed?.value === "number") {
        const mph = Math.round(p.windSpeed.value * 2.236936);
        wind = { mph, dir: typeof p.windDirection?.value === "number" ? cardinal(p.windDirection.value) : "" };
      }
      if (typeof p.textDescription === "string" && p.textDescription)
        conditions = { text: p.textDescription, clarity: clarity(p.textDescription) };
    }
  } catch {
    /* fail soft */
  }
  const fog = conditions ? isFog(conditions.text) : false;

  // Buoy 44007 (Portland, ME approaches) — significant wave height, meters.
  // Fixed-width text; column 8 is WVHT, 'MM' means missing. Ignore if the
  // latest sample is older than ~3 h so we fall back to the site default.
  let waveM: number | null = null;
  let wave: { m: number; amp: number } | null = null;
  try {
    const r = await fetch("https://www.ndbc.noaa.gov/data/realtime2/44007.txt", {
      next: { revalidate: 900 },
    });
    if (r.ok) {
      const text = await r.text();
      const first = text.split("\n").find((l) => l && !l.startsWith("#"));
      if (first) {
        const c = first.trim().split(/\s+/);
        // [YYYY, MM, DD, hh, mm, WDIR, WSPD, GST, WVHT, ...]
        const wv = c[8];
        if (wv && wv !== "MM") {
          const h = parseFloat(wv);
          if (Number.isFinite(h) && h >= 0 && h < 30) {
            const sampled = Date.UTC(
              parseInt(c[0], 10),
              parseInt(c[1], 10) - 1,
              parseInt(c[2], 10),
              parseInt(c[3], 10),
              parseInt(c[4], 10),
            );
            if (Number.isFinite(sampled) && t - sampled < 3 * 60 * 60 * 1000) {
              waveM = Math.round(h * 10) / 10;
              wave = { m: waveM, amp: Math.round(waveAmp(h) * 100) / 100 };
            }
          }
        }
      }
    }
  } catch {
    /* fail soft */
  }

  // Water temp — NOAA CO-OPS (Portland 8418150)
  let waterTempF: number | null = null;
  try {
    const r = await fetch(
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_temperature&date=latest&station=8418150&time_zone=gmt&units=english&format=json",
      { next: { revalidate: 600 } },
    );
    if (r.ok) {
      const v = (await r.json())?.data?.[0]?.v;
      if (v != null && !Number.isNaN(Number(v))) waterTempF = Math.round(Number(v));
    }
  } catch {
    /* fail soft */
  }

  // Tide state + live level — NOAA CO-OPS hi/lo, GMT for absolute compare.
  // tideLevel ∈ 0..1 (low→high), cosine-interpolated between surrounding extremes.
  let tide: "rising" | "falling" | null = null;
  let nextTide: { type: string; time: string } | null = null;
  let tideLevel: number | null = null;
  try {
    const url =
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions" +
      "&application=mlinx.studio&datum=MLLW&station=8418150&time_zone=gmt&units=english&interval=hilo&format=json" +
      `&begin_date=${ymd(new Date(t - 86400000))}&end_date=${ymd(new Date(t + 2 * 86400000))}`;
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (r.ok) {
      const preds = ((await r.json())?.predictions ?? []).map((p: { t: string; type: string }) => ({
        time: new Date(p.t.replace(" ", "T") + "Z").getTime(),
        type: p.type,
      }));
      const ni = preds.findIndex((p: { time: number }) => p.time > t);
      const next = ni >= 0 ? preds[ni] : null;
      const prev = ni > 0 ? preds[ni - 1] : null;
      if (next) {
        tide = next.type === "H" ? "rising" : "falling";
        nextTide = { type: next.type === "H" ? "high" : "low", time: fmtTime(new Date(next.time)) };
      }
      if (next && prev) {
        const frac = (t - prev.time) / (next.time - prev.time); // 0..1 between extremes
        const rising = next.type === "H";
        tideLevel = rising ? (1 - Math.cos(Math.PI * frac)) / 2 : (1 + Math.cos(Math.PI * frac)) / 2;
      }
    }
  } catch {
    /* fail soft */
  }

  return Response.json(
    {
      place: PORTLAND_ME.label,
      tempF,
      waterTempF,
      wind,
      conditions,
      fog,
      tide,
      nextTide,
      tideLevel,
      wave,
      sun: nextSun,
      light,
      moon: moonPhase(now),
      night,
      sunrise: fmtTime(sun.sunrise),
      sunset: fmtTime(sun.sunset),
    },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=1800" } },
  );
}
