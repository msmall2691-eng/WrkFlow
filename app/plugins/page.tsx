import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Contact from "@/components/Contact";
import { LiveQuotePlugin, CopySnippet, GetPlugin } from "@/components/plugins/QuotePlugin";
import { catalog } from "@/lib/catalog";

/*
  /plugins — Nov 16 2026. Meg: "can we make like plug ins?", then "both"
  (a copy-paste snippet and a WordPress plugin). One plug-in so far, and it
  is real: the widget below is public/embed/quote.js, the same file a client
  site loads, in demo mode. The WordPress plugin source is in
  plugins/wordpress/ and is sent to buyers, not served from here.
*/

export const metadata: Metadata = pageMeta({
  title: "Plug-ins · Instant Quote for WordPress, Wix, Squarespace and any site",
  description:
    "Add an instant quote calculator to the website you already have. Your services and prices, leads sent to you. Works on WordPress, Wix, Squarespace, Shopify, Webflow and plain HTML.",
  path: "/plugins",
});

const price = catalog.find((i) => i.id === "quote-widget")?.price ?? "";

const SNIPPET = `<div data-mstudio-quote>
  <script type="application/json">
    {
      "business": "Your Business",
      "site": "your-site-key",
      "color": "#1d4ed8",
      "services": [
        { "name": "Small repair", "base": 250 },
        { "name": "Full job", "base": 1800, "perUnit": 450,
          "unit": "square", "min": 10, "max": 60, "start": 20 }
      ],
      "extras": [ { "name": "Haul away", "price": 400 } ]
    }
  </script>
</div>
<script src="https://mlinx.studio/embed/quote.js" async></script>`;

const PLATFORMS = ["WordPress", "Wix", "Squarespace", "Shopify", "Webflow", "GoDaddy", "Plain HTML"];

export default function PluginsPage() {
  return (
    <div className="cp">
      <PanelHeader current="/plugins" />

      <main>
        <section className="border-b border-[var(--cp-line)] pb-10 pt-8 md:pb-12 md:pt-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="m-0 text-[13px] font-medium text-[color:var(--cp-faint)]">Plug-ins</p>
            <h1 className="display m-0 mt-2 max-w-3xl text-[1.85rem] text-balance text-[color:var(--cp-ink)] sm:text-4xl">
              Add to the website you already have.
            </h1>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-[color:var(--cp-muted)]">
              No rebuild. Paste one snippet, or install the WordPress plugin, and
              it works inside your current site.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16" aria-labelledby="iq-heading">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[color:var(--cp-ink)] px-2.5 py-0.5 text-[12px] font-semibold text-[color:var(--cp-on-ink)]">
                  Plug-in
                </span>
                <span className="text-[13px] text-[color:var(--cp-faint)]">Ready now</span>
              </div>
              <h2 id="iq-heading" className="m-0 mt-3 text-2xl font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-3xl">
                Instant Quote
              </h2>
              <p className="m-0 mt-2 text-[15.5px] leading-relaxed text-[color:var(--cp-muted)]">
                Visitors pick a service, set the size and see a price range from
                your prices. When they send it, you get their name, contact,
                the job and the estimate by email.
              </p>
              <p className="m-0 mt-4 text-[17px] font-semibold text-[color:var(--cp-ink)]">{price}</p>
              <p className="m-0 mt-1 text-[13.5px] text-[color:var(--cp-faint)]">
                Set up with your services, prices and colors. Change prices any time.
              </p>

              <ul className="m-0 mt-5 grid list-none gap-2 p-0 text-[14.5px] text-[color:var(--cp-soft)]">
                <li>Flat prices, per-unit prices (per square, foot, hour, room) and add-ons</li>
                <li>Leads emailed to you, or sent to your own form or CRM</li>
                <li>Styles are sealed off, so your theme cannot break it and it cannot break your theme</li>
                <li>Keyboard and screen-reader friendly</li>
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <GetPlugin label="Get Instant Quote" strong />
                <GetPlugin label="Ask a question" />
              </div>

              <p className="m-0 mt-8 text-[13px] font-semibold text-[color:var(--cp-faint)]">Works on</p>
              <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
                {PLATFORMS.map((p) => (
                  <li key={p} className="rounded-md border border-[var(--cp-hairline)] px-2.5 py-1 text-[13px] text-[color:var(--cp-soft)]">
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="m-0 mb-3 text-[13px] text-[color:var(--cp-faint)]">
                Try it. This is the real plug-in with sample roofing prices. Nothing is sent.
              </p>
              <LiveQuotePlugin />
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--cp-line)] py-12 md:py-16" aria-labelledby="install-heading">
          <div className="mx-auto max-w-6xl px-6">
            <h2 id="install-heading" className="m-0 text-2xl font-semibold tracking-tight text-[color:var(--cp-ink)]">
              Two ways to install
            </h2>
            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="m-0 text-lg font-semibold text-[color:var(--cp-ink)]">Any website: paste a snippet</h3>
                <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-[color:var(--cp-muted)]">
                  Add an HTML or Embed block where you want it (Wix, Squarespace,
                  Shopify and Webflow all have one) and paste this. Your site key
                  and prices come with setup.
                </p>
                <div className="mt-4">
                  <CopySnippet code={SNIPPET} label="HTML" />
                </div>
              </div>
              <div>
                <h3 className="m-0 text-lg font-semibold text-[color:var(--cp-ink)]">WordPress: install the plugin</h3>
                <ol className="m-0 mt-2 grid gap-2 pl-5 text-[14.5px] leading-relaxed text-[color:var(--cp-muted)]">
                  <li>In WordPress, go to Plugins, then Add New, then Upload Plugin, and choose the zip you were sent.</li>
                  <li>Activate it, then open Settings, then Instant Quote.</li>
                  <li>Enter your services, prices, color and where leads should go.</li>
                  <li>
                    Put <code className="rounded bg-[color:var(--cp-fill-strong)] px-1.5 py-0.5 font-mono text-[13px]">[instant_quote]</code> on
                    any page. In the block editor, use a Shortcode block.
                  </li>
                </ol>
                <p className="m-0 mt-4 text-[14px] text-[color:var(--cp-faint)]">
                  Prefer not to touch it? Setup is included: send a login or
                  access and it gets installed for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}
