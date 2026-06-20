"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/useLocalStorage";

/*
  CopyLink — a contact line that's both a link and a one-tap copy. Small, quiet
  utility: tap the value to use it, tap "copy" to grab it. No layout noise.
*/
export default function CopyLink({
  href,
  value,
  label,
}: {
  href: string;
  value: string;
  /** Optional accessible label, defaults to the value. */
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (await copyToClipboard(value)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <span className="group inline-flex items-center gap-2">
      <a href={href} className="text-muted transition-colors hover:text-ink">
        {value}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label ?? value}`}
        className="font-mono text-[10px] uppercase tracking-widest text-faint opacity-0 transition-opacity hover:text-signal focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? "copied" : "copy"}
      </button>
    </span>
  );
}
