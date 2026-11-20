/*
  The composed still: granite, a groove, a fiber, a seam.

  **It renders before the 3D exists, and instead of it when WebGL does
  not.** The spec asks for "a composed still frame immediately" and for
  the hero never to gate on the scene, so this is plain SVG and CSS with
  no client JavaScript at all: it is in the server-rendered HTML, so it
  is on screen in the first paint and the canvas fades in over it later.

  It is the same picture the scene opens on, drawn flat: a charcoal slab
  lit from the left so the grain reads, a shallow groove running across
  it, a violet fiber in the groove with one teal node on it, and the
  seam the cable crosses. Deliberately quiet, because the moment it is
  interesting on its own is the moment it competes with the headline.

  The mica is a seeded scatter rather than `Math.random`, so the server
  and the client draw the same flecks and React does not complain about
  a hydration mismatch. That is not a nicety: a random fill here would
  mismatch on every single load.
*/

function mica(seed: number, count: number) {
  let s = seed >>> 0;
  const next = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: next() * 100,
    y: next() * 100,
    r: 0.08 + next() * 0.22,
    o: 0.05 + next() * 0.3,
  }));
}

const FLECKS = mica(20261121, 110);

export default function CableStill({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        {/* Grazing light from the left, which is what makes stone read as
            stone rather than as a grey rectangle. */}
        <linearGradient id="cable-graze" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#23242a" />
          <stop offset="38%" stopColor="#15161b" />
          <stop offset="100%" stopColor="#0b0b0f" />
        </linearGradient>
        <linearGradient id="cable-groove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#2a2b33" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="cable-glow">
          <stop offset="0%" stopColor="#b9a2ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#b9a2ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cable-node">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100" height="100" fill="url(#cable-graze)" />

      {FLECKS.map((f, i) => (
        <circle key={i} cx={f.x} cy={f.y} r={f.r} fill="#d8d4e4" opacity={f.o} />
      ))}

      {/* The seam the cable crosses, a touch off centre so the composition
          is not split down the middle. */}
      <rect x="57" y="0" width="0.9" height="100" fill="#000" opacity="0.72" />
      <rect x="57.9" y="0" width="0.35" height="100" fill="#3a3b45" opacity="0.5" />

      {/* The groove, then the glow, then the fiber inside it. */}
      <path
        d="M -4 62 C 22 60, 40 57, 62 52 S 92 44, 106 41"
        stroke="url(#cable-groove)"
        strokeWidth="2.6"
        fill="none"
      />
      <path
        d="M -4 62 C 22 60, 40 57, 62 52 S 92 44, 106 41"
        stroke="url(#cable-glow)"
        strokeWidth="7"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M -4 62 C 22 60, 40 57, 62 52 S 92 44, 106 41"
        stroke="#8b5cf6"
        strokeWidth="0.55"
        fill="none"
        opacity="0.95"
      />

      {/* One teal node resting in the fiber, before the seam. */}
      <circle cx="38" cy="57.4" r="4" fill="url(#cable-node)" />
      <circle cx="38" cy="57.4" r="0.6" fill="#eafffb" />
    </svg>
  );
}
