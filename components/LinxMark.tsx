/*
  LinxMark — a small two-link glyph for the M Linx product line. Two interlocking
  links: one inherits the text color, one in the sea-glass signal accent. Subtle,
  scalable, distinct from the M Studio wordmark.
*/
export default function LinxMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1.5"
        y="3.5"
        width="15"
        height="11"
        rx="5.5"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      <rect
        x="13.5"
        y="3.5"
        width="15"
        height="11"
        rx="5.5"
        stroke="var(--color-signal)"
        strokeWidth="2"
      />
    </svg>
  );
}
