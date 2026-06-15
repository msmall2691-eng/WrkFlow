/*
  Wordmark for Workflow Studio. A compact glyph (two offset strokes
  suggesting a flow / branching path) paired with the name. Treatment
  is intentionally restrained — to be refined during iteration.
*/
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
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
      <span className="font-display text-[15px] font-semibold tracking-tight">
        Workflow<span className="text-muted"> Studio</span>
      </span>
    </span>
  );
}
