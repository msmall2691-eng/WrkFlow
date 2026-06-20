/*
  Watermark — a giant, faint background wordmark that drifts slowly. Pure
  decoration (aria-hidden); reinforces the brand / "linked" theme without
  competing with content. Outlined stroke keeps it subtle.
*/
export default function Watermark({
  text = "LINKED",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <span
        className="wm absolute left-1/2 top-1/2 select-none whitespace-nowrap font-display text-[24vw] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(110,211,198,0.10)]"
      >
        {text}
      </span>
    </div>
  );
}
