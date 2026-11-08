"use client";

import { useState } from "react";

/* Asks the server for a Stripe Checkout and sends the browser there. */
export default function BuyButton({ productId, label }: { productId: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (data.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setError(data.error ?? "Checkout couldn't start.");
    } catch {
      setError("Checkout couldn't start. Check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={buy}
        disabled={busy}
        className="inline-flex items-center justify-center rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
      >
        {busy ? "Opening checkout…" : label}
      </button>
      {error ? <p role="alert" className="text-xs text-muted">{error}</p> : null}
    </div>
  );
}
