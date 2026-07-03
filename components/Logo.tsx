/*
  Wordmark for M Studio. A glowing sea-glass "M" monogram (the brand letter,
  same as the favicon) leads the "Studio" wordmark in the monospace face.
  Pass `tag` to append the smaller "· Maine" geo lockup.
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
    <span className={`inline-flex items-baseline gap-2 ${wordColor} ${className}`}>
      {/* Glowing "M" monogram — the brand letter, accent-aware */}
      <span
        aria-hidden="true"
        className="font-display text-[20px] font-bold leading-none text-signal [text-shadow:0_0_15px_rgba(45,212,191,0.5),0_0_6px_rgba(45,212,191,0.35)]"
      >
        M
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
