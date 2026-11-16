"use client";

import { useState } from "react";

/*
  WelcomeBookReserve — the inline "get yours" form on /welcome-book. Posts to
  the same /api/contact backend as the main contact form (with a honeypot),
  tagged so the lead is obviously a Digital Welcome Book request. No payment
  now — this captures interest and routes to a real conversation.
*/
export default function WelcomeBookReserve({ price }: { price: number }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [listing, setListing] = useState("");
  const [note, setNote] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          botField: hp,
          message:
            `Digital Welcome Book request (founding price $${price}).` +
            (listing ? `\n\nListing: ${listing}` : "") +
            (note ? `\n\nNote: ${note}` : ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Try again.");
        setState("error");
      } else {
        setState("done");
      }
    } catch {
      setError("Couldn't send — check your connection and try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-line bg-surface/60 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal/15 text-2xl text-signal">
          ✓
        </div>
        <p className="mt-4 font-display text-lg text-ink">You&apos;re on the list.</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Expect a reply soon to get the details and start your welcome book.
          No payment yet. That comes after you&apos;ve seen it.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-surface/60 p-6 md:p-8">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
        />
      </div>
      <input
        type="text"
        value={listing}
        onChange={(e) => setListing(e.target.value)}
        placeholder="Listing link (Airbnb/VRBO) — optional"
        className="mt-3 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Anything specific about your place? (optional)"
        className="mt-3 w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
      />

      {error && <p className="mt-3 text-sm text-[#f0a39b]">{error}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {state === "sending" ? "Sending…" : `Get my welcome book, $${price}`}
      </button>
      <p className="mt-3 text-center text-xs text-faint">
        No payment now. Expect a reply to get the details and start your book.
      </p>
    </form>
  );
}
