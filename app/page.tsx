import ControlPanel from "@/components/ControlPanel";
import WorkBelow from "@/components/panel/WorkBelow";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

/*
  Homepage — V2, the one-screen control panel (Meg, Nov 1 2026).

    ControlPanel  the whole first screen: headline, real shipped screens,
                  case studies, free tools, live Portland conditions, a call
                  CTA, and a live NWS + NOAA ticker
    Contact       the form, directly below, so no lead depends on a second page
    Footer

  Everything the long homepage used to carry has a page of its own:
  /work/[slug] for case studies, /tools for every free tool, /services for
  scope and pricing, /about for Meg. The panel links to each, and ⌘K reaches
  all of them.

  `.cp` scopes the V2 palette (black + aurora) to this page. It also remaps
  the site's shared tokens, so Contact and Footer pick up the same colors
  without being restyled one by one. Inner pages keep the current look until
  their own V2 pass.
*/
export default function Home() {
  return (
    <div className="cp">
      <ControlPanel />
      <WorkBelow />
      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}
