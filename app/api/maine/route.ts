import { getSunTimes, PORTLAND_ME } from "@/lib/sun";
import { getMoon } from "@/lib/moon";

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
  // Turned up so calm-day readings still show visible motion — Meg wants
  // the ambient story to read on typical days, not only during storms.
  if (m <= 0) return 0.28;
  if (m < 0.5) return 0.28 + (m / 0.5) * 0.22; // 0.28..0.50
  if (m < 1.5) return 0.5 + ((m - 0.5) / 1.0) * 0.3; // 0.50..0.80
  return Math.min(1, 0.8 + ((m - 1.5) / 1.5) * 0.2); // 0.80..1.00
}

const MOON_EMOJI = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
function moonSummary(date: Date) {
  const m = getMoon(date);
  return { phase: m.name, emoji: MOON_EMOJI[Math.round(m.phase * 8) % 8] };
}

// -------- upstream fetch helpers — each returns its own shape, silent on any failure --------

type WeatherOut = {
  tempF: number | null;
  wind: { mph: number; dir: string } | null;
  conditions: { text: string; clarity: number } | null;
};
async function fetchWeather(): Promise<WeatherOut> {
  const out: WeatherOut = { tempF: null, wind: null, conditions: null };
  try {
    const r = await fetch("https://api.weather.gov/stations/KPWM/observations/latest", {
      headers: { "User-Agent": "mlinx.studio (contact@mlinx.studio)", Accept: "application/geo+json" },
      next: { revalidate: 600 },
    });
    if (!r.ok) return out;
    const p = (await r.json())?.properties ?? {};
    if (typeof p.temperature?.value === "number") out.tempF = Math.round((p.temperature.value * 9) / 5 + 32);
    if (typeof p.windSpeed?.value === "number") {
      const mph = Math.round(p.windSpeed.value * 2.236936);
      out.wind = { mph, dir: typeof p.windDirection?.value === "number" ? cardinal(p.windDirection.value) : "" };
    }
    if (typeof p.textDescription === "string" && p.textDescription)
      out.conditions = { text: p.textDescription, clarity: clarity(p.textDescription) };
  } catch {
    /* fail soft */
  }
  return out;
}

async function fetchWaterTemp(): Promise<number | null> {
  try {
    const r = await fetch(
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_temperature&date=latest&station=8418150&time_zone=gmt&units=english&format=json",
      { next: { revalidate: 600 } },
    );
    if (!r.ok) return null;
    const v = (await r.json())?.data?.[0]?.v;
    if (v != null && !Number.isNaN(Number(v))) return Math.round(Number(v));
  } catch {
    /* fail soft */
  }
  return null;
}

async function fetchWave(now: number): Promise<{ m: number; amp: number } | null> {
  try {
    const r = await fetch("https://www.ndbc.noaa.gov/data/realtime2/44007.txt", {
      next: { revalidate: 900 },
    });
    if (!r.ok) return null;
    const text = await r.text();
    const first = text.split("\n").find((l) => l && !l.startsWith("#"));
    if (!first) return null;
    const c = first.trim().split(/\s+/);
    // [YYYY, MM, DD, hh, mm, WDIR, WSPD, GST, WVHT, ...]
    const wv = c[8];
    if (!wv || wv === "MM") return null;
    const h = parseFloat(wv);
    if (!Number.isFinite(h) || h < 0 || h >= 30) return null;
    const sampled = Date.UTC(
      parseInt(c[0], 10),
      parseInt(c[1], 10) - 1,
      parseInt(c[2], 10),
      parseInt(c[3], 10),
      parseInt(c[4], 10),
    );
    if (!Number.isFinite(sampled) || now - sampled >= 3 * 60 * 60 * 1000) return null;
    return { m: Math.round(h * 10) / 10, amp: Math.round(waveAmp(h) * 100) / 100 };
  } catch {
    /* fail soft */
  }
  return null;
}

type TideOut = {
  tide: "rising" | "falling" | null;
  nextTide: { type: string; time: string } | null;
  tideLevel: number | null;
};
async function fetchTide(now: number): Promise<TideOut> {
  const out: TideOut = { tide: null, nextTide: null, tideLevel: null };
  try {
    const url =
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions" +
      "&application=mlinx.studio&datum=MLLW&station=8418150&time_zone=gmt&units=english&interval=hilo&format=json" +
      `&begin_date=${ymd(new Date(now - 86400000))}&end_date=${ymd(new Date(now + 2 * 86400000))}`;
    const r = await fetch(url, { next: { revalidate: 600 } });
    if (!r.ok) return out;
    const preds = ((await r.json())?.predictions ?? []).map((p: { t: string; type: string }) => ({
      time: new Date(p.t.replace(" ", "T") + "Z").getTime(),
      type: p.type,
    }));
    const ni = preds.findIndex((p: { time: number }) => p.time > now);
    const next = ni >= 0 ? preds[ni] : null;
    const prev = ni > 0 ? preds[ni - 1] : null;
    if (next) {
      out.tide = next.type === "H" ? "rising" : "falling";
      out.nextTide = { type: next.type === "H" ? "high" : "low", time: fmtTime(new Date(next.time)) };
    }
    if (next && prev) {
      const frac = (now - prev.time) / (next.time - prev.time); // 0..1 between extremes
      const rising = next.type === "H";
      out.tideLevel = rising ? (1 - Math.cos(Math.PI * frac)) / 2 : (1 + Math.cos(Math.PI * frac)) / 2;
    }
  } catch {
    /* fail soft */
  }
  return out;
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
  let light: { label: string; time?: string } | null = null;
  if (t >= sun.sunset.getTime() - 70 * 60000 && t <= sun.sunset.getTime())
    light = { label: "golden hour", time: fmtTime(sun.sunset) };
  else if (t >= sun.sunrise.getTime() && t <= sun.sunrise.getTime() + 70 * 60000)
    light = { label: "golden hour" };

  // Four upstream fetches, in parallel — response time is bounded by the
  // slowest one, not the sum. Each helper fails soft into its own null.
  const [weather, waterTempF, wave, tide] = await Promise.all([
    fetchWeather(),
    fetchWaterTemp(),
    fetchWave(t),
    fetchTide(t),
  ]);

  const fog = weather.conditions ? isFog(weather.conditions.text) : false;

  return Response.json(
    {
      place: PORTLAND_ME.label,
      tempF: weather.tempF,
      waterTempF,
      wind: weather.wind,
      conditions: weather.conditions,
      fog,
      tide: tide.tide,
      nextTide: tide.nextTide,
      tideLevel: tide.tideLevel,
      wave,
      sun: nextSun,
      light,
      moon: moonSummary(now),
      night,
      sunrise: fmtTime(sun.sunrise),
      sunset: fmtTime(sun.sunset),
    },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=1800" } },
  );
}
