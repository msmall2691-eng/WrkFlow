import type { PrintArt } from "@/lib/demo-shop";

/*
  Draws a print.

  This is not a placeholder standing in for a photograph. In this store the
  artwork IS the product, so what renders here is the thing a buyer would be
  buying. That is the whole reason the demo is a print shop: see the note at
  the top of lib/demo-shop.ts.

  Pure SVG, no state, no effects, so it renders on the server and costs the
  page nothing at runtime. `id` scopes the gradient defs, because two prints
  on the same grid with the same gradient id would make the second one
  inherit the first one's sky.
*/
export default function PrintArtwork({
  art,
  id,
  className = "",
}: {
  art: PrintArt;
  id: string;
  className?: string;
}) {
  const skyId = `sky-${id}`;
  return (
    <svg
      viewBox="0 0 600 420"
      className={className}
      role="img"
      aria-label={`${art.scene} print`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.sky[0]} />
          <stop offset="100%" stopColor={art.sky[1]} />
        </linearGradient>
      </defs>

      <rect width="600" height="420" fill={`url(#${skyId})`} />

      {art.disc && (
        <circle cx={art.disc.x} cy={art.disc.y} r={art.disc.r} fill={art.disc.fill} />
      )}

      {art.scene === "lighthouse" && (
        <>
          <rect y="250" width="600" height="170" fill={art.sea} />
          <path d="M0 250 Q150 238 300 250 T600 250 V272 H0 Z" fill={art.sea} opacity="0.55" />
          <path d="M0 300 h600 v120 H0 Z" fill={art.land} />
          <path d="M392 300 l10 -92 h26 l10 92 Z" fill={art.land} />
          <rect x="398" y="188" width="24" height="22" rx="3" fill={art.land} />
          <rect x="403" y="194" width="14" height="11" rx="2" fill={art.disc?.fill ?? "#fff"} />
        </>
      )}

      {art.scene === "islands" && (
        <>
          <rect y="236" width="600" height="184" fill={art.sea} />
          {/* Separated, and each sitting ON the waterline rather than
              floating through it, so they read as three islands at
              different distances instead of one shape. */}
          <path d="M44 236 q22 -26 54 -24 q30 2 44 24 Z" fill={art.land} opacity="0.55" />
          <path d="M214 238 q34 -44 78 -40 q46 4 64 40 Z" fill={art.land} opacity="0.78" />
          <path d="M424 237 q26 -30 60 -27 q32 3 46 27 Z" fill={art.land} />
          <path d="M0 236 h600 v3 H0 Z" fill="#ffffff" opacity="0.2" />
          <path d="M0 330 h600 v90 H0 Z" fill={art.land} />
        </>
      )}

      {art.scene === "harbor" && (
        <>
          <rect y="244" width="600" height="176" fill={art.sea} />
          <path d="M0 244 h600 v16 H0 Z" fill="#ffffff" opacity="0.14" />
          {/* Mast, sail and a hull sitting in the water. Without the hull
              these read as pennants on poles rather than moored boats. */}
          {[120, 210, 300, 392, 470].map((x, i) => {
            const deck = 258 + (i % 2) * 6;
            const top = deck - 56 - (i % 3) * 10;
            return (
              <g key={x}>
                <rect x={x} y={top} width="2.5" height={deck - top} fill={art.land} />
                <path
                  d={`M${x + 2.5} ${top + 8} l22 ${deck - top - 14} h-22 Z`}
                  fill={art.land}
                  opacity="0.8"
                />
                <path
                  d={`M${x - 16} ${deck} h40 q-6 11 -20 11 q-14 0 -20 -11 Z`}
                  fill={art.land}
                />
              </g>
            );
          })}
          <path d="M0 316 h600 v104 H0 Z" fill={art.land} />
        </>
      )}

      {art.scene === "pines" && (
        <>
          <rect y="268" width="600" height="152" fill={art.sea} />
          {Array.from({ length: 13 }).map((_, i) => {
            const x = 18 + i * 46;
            const h = 104 + ((i * 37) % 58);
            return (
              <path
                key={x}
                d={`M${x} 290 l${22} -${h} l${22} ${h} Z`}
                fill={art.land}
                opacity={i % 3 === 0 ? 0.82 : 1}
              />
            );
          })}
          <path d="M0 300 h600 v120 H0 Z" fill={art.land} />
        </>
      )}

      {art.scene === "dunes" && (
        <>
          <path d="M0 262 Q160 226 320 258 T600 240 V420 H0 Z" fill={art.sea} />
          <path d="M0 316 Q180 282 340 312 T600 298 V420 H0 Z" fill={art.land} opacity="0.82" />
          {Array.from({ length: 26 }).map((_, i) => {
            const x = 14 + i * 23;
            const h = 26 + ((i * 29) % 34);
            return (
              <path
                key={x}
                d={`M${x} 330 q6 -${h} ${12} -${h - 8}`}
                stroke={art.land}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </>
      )}

      {art.scene === "cove" && (
        <>
          <rect y="252" width="600" height="168" fill={art.sea} />
          {/* The moon's track on the water. Tapered and broken into bands
              rather than one hard-edged rectangle, which read as a render
              glitch rather than a reflection. */}
          {art.disc &&
            [0, 1, 2, 3, 4, 5].map((n) => {
              const y = 258 + n * 17;
              const w = 7 + n * 3.5;
              return (
                <rect
                  key={n}
                  x={art.disc!.x - w / 2}
                  y={y}
                  width={w}
                  height="7"
                  rx="3.5"
                  fill={art.disc!.fill}
                  opacity={0.3 - n * 0.04}
                />
              );
            })}
          <path d="M0 252 Q120 228 260 246 T600 232 V300 H0 Z" fill={art.land} />
          <circle cx="188" cy="238" r="3.5" fill="#ffd27a" />
          <path d="M0 330 h600 v90 H0 Z" fill={art.land} />
        </>
      )}
    </svg>
  );
}
