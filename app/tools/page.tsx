import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Playground from "@/components/Playground";

/*
  /tools — the free M Linx tools, on their own page.

  They used to sit at position 2 on the homepage, which was a deliberate call
  at the time: they are the site's strongest hook and Meg uses them herself.
  What that decision did not anticipate is how much they weigh. Eight tools,
  each with its own form, on the page a first-time visitor lands on, directly
  under the pitch — the homepage read as a toolbox rather than a studio.

  Here they get room and the homepage gets quiet. Everything that pointed at
  /#tools points here instead, and the nav carries a Tools link, so the hook
  is one click away rather than three screens down.
*/

export const metadata: Metadata = pageMeta({
  title: "Free tools · quotes, invoices, QR codes and more",
  description:
    "Free tools for service businesses: instant quotes, invoices, email signatures, digital cards, QR codes, tracked links and a website health check. No signup.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>

        <div className="relative z-10">
          <PanelHeader current="/tools" bookHref="/?offer=call#contact" />
        </div>

        {/* No pt-16: that cleared the fixed <Nav>, and PanelHeader is in flow. */}
        <main className="relative z-10">
          <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              {/*
                `display` (Space Grotesk), not `display-serif`, and left alone:
                this heading already used the panel's face, so unlike /services
                there is nothing to decide here.
              */}
              <h1 className="display m-0 max-w-3xl text-[2rem] text-balance text-[color:var(--cp-ink)] sm:text-4xl md:text-5xl">
                Free tools. No signup.
              </h1>
              <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                {/* "we build" was the one "we" left on this page. Meg is a solo
                    founder and the house rule is first person. */}
                The same tools that go into client systems. Use them here, free,
                for as long as you like.
              </p>
            </div>
          </section>
          {/*
            The tool grid sits on the flat ground, not over the aurora.

            Playground's category labels are 12px .text-faint, and
            --color-faint is tuned to clear 4.5:1 on #08070c specifically.
            Over the aurora it still passes, but only just: sampling the
            rendered pixels behind those labels gives #121f2b and 5.82:1,
            down from 7.00:1 on the flat ground. An opaque ground gives the
            densest text on the site the contrast the token was chosen for.

            It also settles a Lighthouse failure that is not what it looks
            like. axe reported 4.44:1 against #113837, which is cp-a2's
            rgba(45,212,191,.24) composited straight onto #08070c: it reads
            the lobe's own background-color and bounding box and applies
            neither the 90px blur nor any ancestor opacity or mask. So it
            was modelling a ground about three times stronger than the one
            that renders, and no amount of dimming or masking the layer
            could move the number. Giving the section a real background is
            the one change that is true in both models.
          */}
          <div className="relative bg-[var(--color-base)]">
            <Playground />
          </div>
        </main>
      </div>
      <Footer />
      {/* The floating "DAYLIGHT" pill lived here. It overlapped content on
          every page and on a phone sat on top of the cards. The theme
          toggle is now a command in the ⌘K palette (lib/theme.ts), so
          nobody who picked Harbor is stranded in it. */}
      <CommandPalette />
    </div>
  );
}
