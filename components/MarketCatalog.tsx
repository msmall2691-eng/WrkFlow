"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import {
  marketItems,
  marketModelLabels,
  type MarketItem,
} from "@/lib/content";

/*
  MarketCatalog — the marketplace grid plus a lightweight "reserve / notify me"
  capture. Non-free products open a small modal that posts to /api/contact (same
  backend as the contact form), so interest is captured without a full checkout.
*/

const modelBadge: Record<MarketItem["model"], string> = {
  template: "text-signal border-signal/40 bg-signal/10",
  embed: "text-gold border-gold/40 bg-gold/10",
  open: "text-muted border-line bg-white/[0.04]",
};

export default function MarketCatalog() {
  const [active, setActive] = useState<MarketItem | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {marketItems.map((item, i) => (
          <Reveal key={item.id} delay={i * 50}>
            <ProductCard item={item} onReserve={() => setActive(item)} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-10 text-sm leading-relaxed text-faint">
          Pricing is indicative—every setup is tuned to your business, so the
          final number depends on scope. Reserve one and we&apos;ll send a fixed
          quote.
        </p>
      </Reveal>

      {active && <ReserveModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}

function ProductCard({
  item,
  onReserve,
}: {
  item: MarketItem;
  onReserve: () => void;
}) {
  const isOpen = item.model === "open";
  return (
    <article
      className={`elevate group flex h-full flex-col overflow-hidden rounded-2xl border bg-elevated transition-colors hover:border-signal/50 ${
        item.featured ? "border-signal/40" : "border-line"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {item.shot ? (
          <Image
            src={item.shot}
            alt={`${item.name} — preview`}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-elevated)_0%,var(--color-base)_75%)]">
            <span className="display-serif text-2xl text-muted">{item.category}</span>
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest backdrop-blur ${modelBadge[item.model]}`}
        >
          {marketModelLabels[item.model]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
          {item.category}
        </span>
        <h3 className="display-serif mt-2 text-xl text-ink">{item.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.tagline}</p>

        <ul className="mt-5 space-y-2 border-t border-line pt-5">
          {item.includes.map((inc) => (
            <li key={inc} className="flex items-start gap-2.5 text-sm text-muted">
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
              />
              <span>{inc}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
          <span className="font-display text-sm font-medium text-ink">{item.price}</span>
          {isOpen ? (
            <a
              href="/#kit"
              className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-4 py-2 text-xs font-semibold text-signal transition-colors hover:bg-signal/20"
            >
              Use it free
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={onReserve}
              className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-4 py-2 text-xs font-semibold text-signal transition-colors hover:bg-signal/20"
            >
              Reserve
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ReserveModal({ item, onClose }: { item: MarketItem; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
          company_website: hp,
          message:
            `Marketplace interest: ${item.name} (${item.price}, ${marketModelLabels[item.model]}).` +
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
      setError("Couldn't send—check your connection and try again.");
      setState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Reserve ${item.name}`}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative my-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-base shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
              {marketModelLabels[item.model]} · {item.price}
            </p>
            <h3 className="display-serif mt-1 text-xl text-ink">{item.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full px-2 text-xl text-faint transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        {state === "done" ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal/15 text-2xl text-signal">
              ✓
            </div>
            <p className="mt-4 font-display text-lg text-ink">You&apos;re on the list.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              We&apos;ll be in touch about <span className="text-ink">{item.name}</span> with
              a fixed quote and next steps.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-signal px-6 py-2.5 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6">
            <p className="mb-4 text-sm leading-relaxed text-muted">
              Reserve your spot—drop your details and we&apos;ll follow up with a
              fixed quote. No payment now.
            </p>
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
            <div className="space-y-3">
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
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Anything specific? (optional)"
                className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
              />
            </div>

            {error && <p className="mt-3 text-sm text-[#f0a39b]">{error}</p>}

            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {state === "sending" ? "Reserving…" : "Reserve this →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
