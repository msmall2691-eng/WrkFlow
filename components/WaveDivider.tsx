/*
  WaveDivider — a subtle coastal horizon between sections.

  Layered low-opacity sine lines in the brand accent. Reads as a calm New
  England shoreline at a glance, but stays quiet enough to be a divider, not a
  decoration. Decorative only.
*/

export default function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="h-10 w-full md:h-14"
        fill="none"
      >
        <path
          d="M0,30 C 160,14 320,14 480,30 S 800,46 960,30 S 1280,14 1440,30"
          stroke="var(--color-signal)"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
        <path
          d="M0,26 C 180,12 340,12 520,26 S 860,40 1040,26 S 1320,12 1440,26"
          stroke="var(--color-signal)"
          strokeOpacity="0.1"
          strokeWidth="1.5"
        />
        <path
          d="M0,34 C 200,20 380,20 560,34 S 900,48 1080,34 S 1340,20 1440,34"
          stroke="var(--color-signal)"
          strokeOpacity="0.06"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
