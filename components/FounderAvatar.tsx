"use client";

import { useState } from "react";

/*
  FounderAvatar — shows /meg.jpg the moment it exists, falling back to the "M"
  monogram until then. Drop a square photo at public/meg.jpg and it appears; no
  code change needed.
*/
export default function FounderAvatar() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#16384a] font-display text-2xl text-white"
      >
        M
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/meg.jpg"
      alt="Meg, founder of M Studio"
      onError={() => setFailed(true)}
      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[#16384a]/15"
    />
  );
}
