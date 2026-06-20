"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/useLocalStorage";

/*
  SaveResult — a small actions row for the Playground tools. Lets a visitor
  copy a plain-text summary of their result, or download it as a .txt file.
  Inputs are persisted separately via useLocalStorage, so reopening the tool
  restores what they had; this is for taking the result with them.
*/
export default function SaveResult({
  summary,
  filename,
}: {
  /** Plain-text result the visitor takes away. */
  summary: string;
  /** Download filename (without extension). */
  filename: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(summary);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  function handleDownload() {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-base px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-signal/60 hover:text-signal"
      >
        {copied ? "Copied ✓" : "Copy result"}
      </button>
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-base px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-signal/60 hover:text-ink"
      >
        Download .txt
      </button>
      <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
        Saved automatically
      </span>
    </div>
  );
}
