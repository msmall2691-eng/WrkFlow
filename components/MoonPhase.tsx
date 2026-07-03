import { getMoon, moonPath } from "@/lib/moon";

/*
  MoonPhase — a small inline SVG rendering tonight's actual moon: dark disc,
  moonlight-teal illuminated portion, correct orientation for a northern-
  hemisphere observer (waxing lit on the right, waning on the left). Rendered
  server-side; no fetches, no client JS. Tooltip carries the phase name.
*/
export default function MoonPhase({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const moon = getMoon(new Date());
  const r = size / 2 - 1; // 1px padding so the disc rim stays inside the SVG box
  const cx = size / 2;
  const cy = size / 2;
  const pct = Math.round(moon.illumination * 100);
  const label = `${moon.name} · ${pct}% illuminated`;

  return (
    <svg
      role="img"
      aria-label={label}
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <title>{label}</title>
      {/* Dark disc + faint rim so a new moon still reads as "there is a moon here" */}
      <circle cx={cx} cy={cy} r={r} fill="#0b1722" stroke="#dff3ef" strokeOpacity="0.18" strokeWidth="0.6" />
      {/* Illuminated portion */}
      <path d={moonPath(cx, cy, r, moon)} fill="#8bd6c8" />
    </svg>
  );
}
