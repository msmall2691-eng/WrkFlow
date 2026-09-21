/*
  Wordmark for M Studio. The mark is a small faceted badge — a gradient
  "M" glyph (teal → gold) with a duotone drop-shadow copy behind it for
  depth, a glass-sheen highlight, and a beacon dot at the corner — rather
  than a bare flat letter. It carries its own dark ground, so it reads the
  same over the hero or the solid nav bar; only the "Studio" wordmark
  switches tone. Pass `tag` to append the smaller "· Maine" geo lockup.
*/
export default function Logo({
  className = "",
  tag = false,
  tone = "dark",
}: {
  className?: string;
  tag?: boolean;
  /** "dark" = ink wordmark on light bg; "light" = white wordmark on dark bg. */
  tone?: "dark" | "light";
}) {
  /*
    Tone "light" = "for a transparent-over-hero context". In dark mode that's
    white on harbor navy; in daylight it's ink on cream. Both come from the
    same CSS vars the Nav uses so the wordmark and nav links match.
  */
  const wordColor = tone === "light" ? "text-[color:var(--nav-hero-ink2)]" : "text-ink";
  const tagColor = tone === "light" ? "text-[color:var(--nav-hero-ink)]" : "text-faint";
  return (
    <span className={`inline-flex items-center gap-2.5 ${wordColor} ${className}`}>
      {/* Mark — faceted M badge, tone-invariant */}
      <span aria-hidden="true" className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center">
        <span
          className="absolute inset-0 overflow-hidden rounded-[9px] shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
          style={{
            background: "linear-gradient(135deg, #0f2130 0%, #16293a 55%, #123a35 100%)",
            border: "1px solid rgba(238,242,244,0.14)",
          }}
        >
          {/* glass sheen */}
          <span
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 30% 18%, rgba(255,255,255,0.22), transparent 55%)" }}
          />
        </span>
        {/* duotone shadow copy, offset for depth */}
        <span
          className="absolute font-display text-[15px] font-extrabold leading-none text-gold/55"
          style={{ transform: "translate(1.5px, 1.5px)" }}
        >
          M
        </span>
        {/* front glyph, gradient-filled */}
        <span
          className="relative bg-clip-text font-display text-[15px] font-extrabold leading-none text-transparent"
          style={{ backgroundImage: "linear-gradient(135deg, #7fe9dc 0%, #2dd4bf 45%, #d9a441 100%)" }}
        >
          M
        </span>
        {/* beacon accent */}
        <span className="absolute -right-[2.5px] -top-[2.5px] h-[6px] w-[6px] rounded-full bg-gold shadow-[0_0_7px_2px_rgba(217,164,65,0.75)]" />
      </span>
      <span className={`font-mono text-[16px] font-semibold tracking-[0.04em] ${wordColor}`}>Studio</span>
      {tag && (
        <span className={`hidden font-mono text-[11px] uppercase tracking-[0.22em] sm:inline ${tagColor}`}>
          &middot; Maine
        </span>
      )}
    </span>
  );
}
