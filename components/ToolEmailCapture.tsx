"use client";

import { useState } from "react";
import { trackTool, trackLead } from "@/lib/track";

/*
  ToolEmailCapture — "Email me this →" for the free Playground tools.
  Free-to-use stays free-to-use: the field is optional and inline, never a
  signup wall. Sends the result to the visitor and drops a lead notice (email
  + tool) in Meg's inbox via /api/tool-lead — see that route for the "why".
*/
export default function ToolEmailCapture({
  tool,
  toolLabel,
  summary,
  attachment,
  className = "",
}: {
  /** Short tool id used in analytics + the lead notice, e.g. "quote". */
  tool: string;
  /** Human label for the email subject, e.g. "Instant quote". */
  toolLabel: string;
  /** Plain-text result the visitor gets emailed. */
  summary: string;
  /** Optional binary attachment (e.g. a QR PNG). */
  attachment?: { filename: string; contentBase64: string; contentType?: string };
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/tool-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool, toolLabel, summary, attachment }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Couldn't send. Try again.");
      }
      setStatus("sent");
      trackTool(tool, "emailed");
      // Same lead_submitted event as the contact form, so free-tool leads
      // sit next to form leads in one funnel (lib/track.ts).
      trackLead("tool", tool);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't send. Try again.");
    }
  }

  if (status === "sent") {
    return (
      <p className={`text-xs leading-relaxed text-signal ${className}`}>
        Sent! Want this tuned to your business?{" "}
        <a href="/#contact" className="font-semibold underline underline-offset-2 hover:opacity-80">
          →
        </a>
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full border border-line bg-base px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-signal/60 hover:text-signal ${className}`}
      >
        Email me this
        <span aria-hidden="true">→</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSend} className={`flex flex-wrap items-center gap-2 ${className}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="min-w-0 flex-1 rounded-full border border-line bg-base px-4 py-2 text-xs text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
      {status === "error" && (
        <span role="alert" className="basis-full text-xs text-[#e5645a]">
          {error}
        </span>
      )}
    </form>
  );
}
