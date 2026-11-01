"use client";

/* Opens the site-wide ⌘K palette (CommandPalette listens for `cmdk:open`). */
export default function PaletteButton({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
      className={className}
    >
      {children}
    </button>
  );
}
