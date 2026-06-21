"use client";

import { useState } from "react";

/*
  FounderAvatar — shows Meg's photo (/meg.png), falling back to the "M" monogram
  if the file is ever missing.
*/
export default function FounderAvatar() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#16384a] font-display text-2xl text-white"
      >
        M
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/meg.png"
      alt="Meg, founder of M Studio"
      onError={() => setFailed(true)}
      className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-[#16384a]/15"
    />
  );
}
