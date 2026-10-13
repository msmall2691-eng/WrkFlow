import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
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
  title: "Free tools — quotes, invoices, QR codes & more",
  description:
    "Free tools for service businesses: instant quotes, invoices, email signatures, digital cards, QR codes, tracked links and a website health check. No signup.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="border-b border-line py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Free tools
            </p>
            <h1 className="display max-w-3xl text-balance text-[1.9rem] text-ink sm:text-4xl md:text-5xl">
              Free tools. No signup.
            </h1>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-muted">
              The same tools we build into client systems. Use them here, free,
              for as long as you like.
            </p>
          </div>
        </section>
        <Playground />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
