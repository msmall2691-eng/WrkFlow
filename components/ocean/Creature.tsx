/*
  One of Meg's renders, with the rectangle taken off.

  **This is the Like a King move, and it is the one thing her homepage
  was missing that theirs has on every section.** Rendered side by side
  at 1440x900 on Nov 24 2026: their "Multi-cloud by design." is a glowing
  globe sitting beside the heading with no card, no border and no edge,
  and their hero is a lit tree dissolving into the same black the page is
  made of. Nothing on this page did that. The art here was either the
  full-bleed dive behind everything or a picture inside a frame.

  So this is the in-between that was missing: one subject, lit, beside
  the words, with `.creature-bleed` dissolving the frame into the ground.
  See globals.css for why that mask is harder than `.ocean-bleed`, and
  for why Daylight gets no creature rather than a grey one.

  **It is decoration and it says so.** `aria-hidden`, empty `alt`, never
  a link and never the only place something is said: a screen reader and
  a Daylight visitor both get the section complete without it. That is
  also what lets it be hidden on small screens, where there is no room
  beside a heading and stacking it would push the actual content down a
  full screen.
*/
export default function Creature({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`creature pointer-events-none ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="creature-bleed block h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
