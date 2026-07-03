/*
  moon.ts — synodic moon phase + illumination for a given date, no network.
  Uses the well-known epoch of the 2000-01-06 18:14 UTC new moon and the mean
  synodic period. Precise to ~1-2% of a phase across the current century.
*/

const SYNODIC = 29.530588853; // days
const KNOWN_NEW = Date.UTC(2000, 0, 6, 18, 14) / 86400000;

export type Moon = {
  phase: number; // 0..1, 0 = new, 0.5 = full
  illumination: number; // 0..1 of visible disc
  waxing: boolean;
  name: string;
};

export function getMoon(date: Date = new Date()): Moon {
  let phase = ((date.valueOf() / 86400000 - KNOWN_NEW) % SYNODIC) / SYNODIC;
  if (phase < 0) phase += 1;
  const angle = 2 * Math.PI * phase;
  const illumination = (1 - Math.cos(angle)) / 2;
  const waxing = phase < 0.5;
  const name = nameFor(phase);
  return { phase, illumination, waxing, name };
}

function nameFor(p: number): string {
  const tol = 0.03;
  if (p < tol || p > 1 - tol) return "New moon";
  if (Math.abs(p - 0.25) < tol) return "First quarter";
  if (Math.abs(p - 0.5) < tol) return "Full moon";
  if (Math.abs(p - 0.75) < tol) return "Last quarter";
  if (p < 0.25) return "Waxing crescent";
  if (p < 0.5) return "Waxing gibbous";
  if (p < 0.75) return "Waning gibbous";
  return "Waning crescent";
}

/*
  moonPath — SVG path for the illuminated portion of the disc.
  Composed of two arcs: the outer semicircle on the lit side, plus the
  terminator ellipse whose horizontal radius shrinks from r (new/full) to
  0 (quarters). Bulges inward for a crescent, outward for a gibbous.
*/
export function moonPath(cx: number, cy: number, r: number, moon: Moon): string {
  const { illumination, waxing } = moon;
  const crescent = illumination <= 0.5;
  const rx = r * (crescent ? 1 - 2 * illumination : 2 * illumination - 1);
  const outerSweep = waxing ? 1 : 0;
  // Waxing crescent + waning gibbous bulge inward (sweep 0);
  // waxing gibbous + waning crescent bulge outward (sweep 1).
  const innerSweep = waxing === crescent ? 0 : 1;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 ${outerSweep} ${cx} ${cy + r} A ${rx} ${r} 0 0 ${innerSweep} ${cx} ${cy - r} Z`;
}
