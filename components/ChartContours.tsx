/*
  ChartContours — a faint nautical-chart depth-contour motif (concentric
  "soundings"). The one coastal texture, used behind the hero (animated) and,
  very faintly, one other section. Purely decorative (aria-hidden); the caller
  controls master opacity + placement via className so it never fights text.
*/

type Cluster = { cx: number; cy: number; rings: number; gap: number; rot: number };

const CLUSTERS: Cluster[] = [
  { cx: 230, cy: 200, rings: 6, gap: 30, rot: -18 },
  { cx: 620, cy: 430, rings: 7, gap: 34, rot: 24 },
  { cx: 500, cy: 110, rings: 4, gap: 24, rot: 8 },
];

export default function ChartContours({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={className}
    >
      {CLUSTERS.map((c, ci) => (
        <g
          key={ci}
          className={animate ? "contour-drift" : undefined}
          style={animate ? { animationDelay: `${ci * -8}s` } : undefined}
        >
          {Array.from({ length: c.rings }).map((_, i) => (
            <ellipse
              key={i}
              cx={c.cx}
              cy={c.cy}
              rx={(i + 1) * c.gap * 1.18}
              ry={(i + 1) * c.gap * 0.8}
              transform={`rotate(${c.rot} ${c.cx} ${c.cy})`}
              stroke="var(--color-signal)"
              strokeWidth={1}
              strokeOpacity={Math.max(0.08, 0.6 - i * 0.08)}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
