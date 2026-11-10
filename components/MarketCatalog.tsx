"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import LinxMark from "./LinxMark";
import WorkflowDiagram from "./WorkflowDiagram";
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

export default function MarketCatalog({ exclude = [] }: { exclude?: string[] }) {
  const [active, setActive] = useState<MarketItem | null>(null);
  /*
    `exclude` lets a page render one item somewhere else and keep it out of
    the grid. /marketplace uses it for the welcome book, which now has its
    own band above this. The numbering follows the filtered list, so the
    grid still reads 01, 02, 03 with no gap where the excluded card was.
  */
  const items = marketItems.filter((m) => !exclude.includes(m.id));

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 50}>
            <ProductCard item={item} n={i + 1} onReserve={() => setActive(item)} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-10 text-sm leading-relaxed text-faint">
          Pricing is indicative. Every setup is tuned to your business, so the
          final number depends on scope. Reserve one and I&apos;ll send a fixed
          quote.
        </p>
      </Reveal>

      {active && <ReserveModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}

function ProductCard({
  item,
  n,
  onReserve,
}: {
  item: MarketItem;
  n: number;
  onReserve: () => void;
}) {
  const isOpen = item.model === "open";
  return (
    <article
      className={`elevate group flex h-full flex-col overflow-hidden rounded-2xl border bg-elevated transition-all duration-500 hover:-translate-y-1 hover:border-signal/50 ${
        item.featured ? "border-signal/40" : "border-line"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {item.liveUrl ? (
          <LiveThumb url={item.liveUrl} title={item.name} />
        ) : item.shot ? (
          <Image
            src={item.shot}
            alt={`Preview of ${item.name}`}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : item.illustration === "flow" ? (
          <FlowThumb />
        ) : (
          /*
            No capture exists for this one yet. It used to render the bare
            category word ("Dashboard") centred in a gradient, which read as
            a broken image rather than a deliberate blank. This says what the
            card is and marks it as drawn, so nobody mistakes it for a
            screenshot of something that was never built.
          */
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-elevated)_0%,var(--color-base)_75%)]">
            <LinxMark className="h-4 w-auto opacity-70" />
            <span className="display-serif text-xl text-muted">{item.category}</span>
            {/* Not font-mono: CLAUDE.md keeps JetBrains Mono for real code or
                data, and this is a label. Much of the site breaks that rule
                already, but a new label need not add to it. */}
            <span className="text-[10px] uppercase tracking-wider text-faint">
              Built to order
            </span>
          </div>
        )}
        {/*
          The index sat as white/70 directly on the thumbnail, which works
          over a dark screenshot and fails over a light one: Lighthouse
          measured 1.06:1 on the cards whose preview is pale. (Pre-existing,
          confirmed by measuring this page before this change; fixed here
          because this change gives more cards a light preview.) The chip is
          the same translucent treatment the "Live preview" badge already
          uses, so the number reads on any thumbnail.

          The scrim is a literal colour, not `bg-ink`. `--color-ink` flips
          with the theme: it is near-white in Harbor, which is the default,
          so `bg-ink/75` made a near-white chip under white text and was
          worse than what it replaced. The chip has to stay dark in both
          themes because the thumbnail under it does not follow the theme
          at all, so this is one of the few places a fixed value is right.
        */}
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#0b1722]/75 px-1.5 py-0.5 font-mono text-[11px] text-white backdrop-blur-sm">
          {String(n).padStart(2, "0")}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur ${modelBadge[item.model]}`}
        >
          {marketModelLabels[item.model]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs text-faint">
          {item.category}
        </span>
        <h3 className="display-serif mt-2 flex items-center gap-2 text-lg text-ink md:text-xl">
          <LinxMark className="h-3 w-auto shrink-0" />
          {item.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.tagline}</p>

        {/*
          flex-1 so the price and the Reserve button pin to the bottom of
          every card instead of floating directly under the last bullet.
          Nothing inside this column grew to fill it before, so a card with
          one extra bullet (or one that wraps) pushed its own footer down and
          the row of buttons came out ragged. For a grid whose job is to let
          somebody compare prices, the prices have to line up.
        */}
        <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-5">
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
              href="/tools"
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

/*
  FlowThumb — the preview for M Linx Flows, which is a set of automations and
  so has no screen to screenshot. WorkflowDiagram is the same diagram the
  homepage and the case studies draw, rendered `still` (no travelling pulse:
  CLAUDE.md allows two looping animations on the site and the proof reel and
  the live hero sky already spend both). It holds no state and no effects,
  so it adds markup and no behaviour; being imported here it rides along in
  this component's client bundle, which is why it stays this small.
*/
function FlowThumb() {
  return (
    <div className="flex h-full items-center bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-elevated)_0%,var(--color-base)_75%)] px-4">
      {/*
        w-full matters: this wrapper is a flex container (to centre the
        diagram vertically), so without it the diagram is a content-sized
        flex item. Its connector tracks are `flex-1` with a zero basis, so
        they add nothing to that intrinsic width, and the whole row shrank
        to the four stage columns with no room left for the lines.
      */}
      <div className="w-full">
        <WorkflowDiagram
          stages={[
            { icon: "\u{1F4C5}", label: "Booking" },
            { icon: "\u2709\uFE0F", label: "Confirm" },
            { icon: "\u{1F514}", label: "Remind" },
            { icon: "\u2B50", label: "Review" },
          ]}
          live="still"
          compact
        />
      </div>
    </div>
  );
}

/*
  LiveThumb — an always-current preview of a real site, embedded as a scaled,
  non-interactive iframe (the page renders at 2x the card width, then scales to
  0.5, so the full desktop layout shows "zoomed out"). Lazy: nothing loads until
  the card scrolls near the viewport. Pointer events are off so the card's own
  Reserve button stays clickable.
*/
function LiveThumb({ url, title }: { url: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 bg-base">
      {load ? (
        <iframe
          src={url}
          title={`Live preview of ${title}`}
          loading="lazy"
          className="absolute left-0 top-0"
          style={{
            border: 0,
            width: "200%",
            height: "200%",
            transform: "scale(0.5)",
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div className="flex h-full items-center justify-center font-mono text-xs text-faint">
          Loading live preview…
        </div>
      )}
      <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-base/70 px-2 py-0.5 text-xs font-medium text-signal backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
        Live preview
      </span>
    </div>
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
          botField: hp,
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
      setError("Couldn't send, check your connection and try again.");
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
            <p className="text-xs font-medium text-signal">
              {marketModelLabels[item.model]} · {item.price}
            </p>
            <h3 className="display-serif mt-1 text-lg text-ink md:text-xl">{item.name}</h3>
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
              I&apos;ll be in touch about <span className="text-ink">{item.name}</span> with
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
              Reserve your spot. Drop your details and I&apos;ll follow up with a
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
