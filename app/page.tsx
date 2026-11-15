import ControlPanel from "@/components/ControlPanel";
import ServiceRouter from "@/components/panel/ServiceRouter";
import WorkBelow from "@/components/panel/WorkBelow";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

/*
  Homepage — V2, the one-screen control panel (Meg, Nov 1 2026).

    ControlPanel  the whole first screen: headline, real shipped screens,
                  the work list, free tools, the five-feed live readout, and
                  a call CTA
    ServiceRouter the four things Meg sells, as four doors — the one place
                  the page asks a visitor what they came for
    WorkBelow     the case studies, which are the evidence for whichever
                  door they picked
    Contact       the form, directly below, so no lead depends on a second page
    Footer

  Everything the long homepage used to carry has a page of its own:
  /work/[slug] for case studies, /tools for every free tool, /services for
  scope and pricing, /about for Meg. The panel links to each, and ⌘K reaches
  all of them.

  `.cp` scopes the V2 palette to this page and remaps the site's shared
  tokens, so Contact and Footer pick up the same colours without being
  restyled one by one. Since Nov 14 that palette is Daylight by default —
  cream, white cards, aurora as accent — with Harbor still reachable in ⌘K.
*/
export default function Home() {
  return (
    <div className="cp">
      <ControlPanel />
      <ServiceRouter />
      <WorkBelow />
      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}
