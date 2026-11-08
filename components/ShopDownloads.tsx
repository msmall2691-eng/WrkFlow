import Image from "next/image";
import Link from "next/link";
import BuyButton from "./BuyButton";
import { shopProducts } from "@/lib/shop";
import { isForSale } from "@/lib/shopServer";

/*
  Instant downloads on /marketplace. Server component: it decides per product
  whether a sale could actually complete (Stripe key + price configured) and
  only then renders a Buy button. Otherwise the card says "Coming soon".
*/
export default function ShopDownloads() {
  return (
    <section id="downloads" className="scroll-mt-24 border-b border-line py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs font-medium text-signal">Instant downloads</p>
        <h2 className="display mt-3 text-2xl text-ink sm:text-3xl">Templates you can use today.</h2>
        <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted">
          Templates for cleaning and rental businesses, from someone who runs one.
          Pay once, download right away, and edit them however you like.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shopProducts.map((p) => {
            const live = isForSale(p);
            return (
              <article key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
                <Image
                  src={p.shot}
                  alt={`Preview of the ${p.name}`}
                  width={960}
                  height={600}
                  className="aspect-[16/10] w-full border-b border-line bg-white object-cover object-top"
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-faint">{p.format}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-ink">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.tagline}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted">
                    {p.includes.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span aria-hidden="true" className="text-signal">✓</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                    <span className="font-display text-lg font-semibold text-ink">{p.priceLabel}</span>
                    {live ? (
                      <BuyButton productId={p.id} label="Buy & download" />
                    ) : (
                      <Link
                        href="/#contact"
                        className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink"
                      >
                        Coming soon · ask me
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-8 text-sm leading-relaxed text-faint">
          Secure checkout by Stripe. Personal and business use; please don&apos;t resell the files.
        </p>
      </div>
    </section>
  );
}
