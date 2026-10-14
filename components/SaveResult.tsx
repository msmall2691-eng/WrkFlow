"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/useLocalStorage";
import { toolsStamp } from "@/lib/content";
import { trackTool } from "@/lib/track";
import ToolEmailCapture from "./ToolEmailCapture";

/*
  SaveResult — the actions row for the Playground tools. Lets a visitor copy
  a plain-text summary of their result, download it as a .txt file, or email
  it to themselves. Every takeaway (copy, download, email) carries the
  mlinx.studio stamp so the free tool still credits the source once it's out
  in the wild. Inputs are persisted separately via useLocalStorage, so
  reopening the tool restores what they had.
*/
export default function SaveResult({
  summary,
  filename,
  tool,
  toolLabel,
}: {
  /** Plain-text result the visitor takes away (without the stamp). */
  summary: string;
  /** Download filename (without extension). */
  filename: string;
  /** Short tool id for analytics + the lead notice, e.g. "quote". */
  tool: string;
  /** Human label for the emailed subject, e.g. "Instant quote". */
  toolLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const stamped = `${summary}\n\n—\n${toolsStamp}`;

  async function handleCopy() {
    const ok = await copyToClipboard(stamped);
    if (ok) {
      setCopied(true);
      trackTool(tool, "copied");
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  function handleDownload() {
    const blob = new Blob([stamped], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    trackTool(tool, "downloaded");
  }

  return (
    <div className="mt-5 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
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
        <ToolEmailCapture tool={tool} toolLabel={toolLabel} summary={stamped} />
        <span className="text-xs text-faint">
          Saved automatically
        </span>
      </div>
    </div>
  );
}
