/*
  Wordmark for M Studio. "M Studio" set in the monospace face. A compact glyph
  (two offset strokes suggesting linked systems / a branching flow) sits ahead
  of it. ("Linx" lives on quietly in the mlinx.studio domain.) Pass `tag` to
  append a smaller "/ Maine" lockup.
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
      {/* Two interlocking links — the "linx" undertone in the M Studio mark */}
      <svg
        width="27"
        height="16"
        viewBox="0 0 32 18"
        fill="none"
        aria-hidden="true"
        className="shrink-0 translate-y-[2px]"
      >
        <rect
          x="1.4"
          y="3.4"
          width="15"
          height="11.2"
          rx="5.6"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        <rect
          x="15.6"
          y="3.4"
          width="15"
          height="11.2"
          rx="5.6"
          stroke="var(--color-signal)"
          strokeWidth="2"
        />
      </svg>
      <span className={`font-mono text-[16px] font-semibold tracking-[0.04em] ${wordColor}`}>
        M&nbsp;Studio
      </span>
      {tag && (
        <span className={`font-mono text-[11px] uppercase tracking-[0.22em] ${tagColor}`}>
          / Maine
        </span>
      )}
    </span>
  );
}
