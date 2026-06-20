/*
  Wordmark for Connective Studio. Set in the monospace face, all-caps with
  deliberate letter-spacing, so it reads as a systems/engineering brand. A
  compact glyph (two offset strokes suggesting connected systems / a branching
  flow) sits ahead of it. Pass `tag` to append a smaller "/ Studio" lockup.
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
  const wordColor = tone === "light" ? "text-white" : "text-ink";
  const tagColor = tone === "light" ? "text-white/55" : "text-faint";
  return (
    <span className={`inline-flex items-baseline gap-2.5 ${wordColor} ${className}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0 translate-y-[3px]"
      >
        <path
          d="M3 4.5h6.5a3 3 0 0 1 3 3v0a3 3 0 0 0 3 3H19"
          stroke="var(--color-signal)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M3 11.5h6.5a3 3 0 0 1 3 3v0a3 3 0 0 0 3 3H19"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-mono text-[15px] font-semibold uppercase tracking-[0.22em] ${wordColor}`}>
        CONNECTIVE
      </span>
      {tag && (
        <span className={`font-mono text-[11px] uppercase tracking-[0.22em] ${tagColor}`}>
          / Studio
        </span>
      )}
    </span>
  );
}
