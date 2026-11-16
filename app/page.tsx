import BlueprintHero from "@/components/blueprint/BlueprintHero";
import WorkStage from "@/components/blueprint/WorkStage";
import Floors from "@/components/blueprint/Floors";
import PriceIt from "@/components/blueprint/PriceIt";
import ProductShelf from "@/components/blueprint/ProductShelf";
import { antonio, instrumentSerif } from "@/components/blueprint/fonts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

/*
  Homepage, "Blueprint" (Meg, Nov 16 2026).

  After a day of directions she did not love, Meg picked two AnimatedWebs
  demos as the look: Ironline Builders (a contractor site where every
  section is a floor of a building going up, with a live job-site log) and
  Ostrander Signal (a web studio with a full-screen moving opening and its
  case studies rolling through a pinned browser window). Neither is copied;
  this page borrows their structure and builds its own pieces:

    BlueprintHero  a blueprint of a web page being drawn, the M Studio
                   wordmark, the real h1, and a live Maine site log
    WorkStage      four real projects rolling through one window (pinned)
    ProductShelf   the six ready-made things, each with a working demo
    Floors         how a project gets built, one floor at a time
    PriceIt        the real price sheet, with a running total that goes
                   into the contact form
    Contact, Footer

  `.bp` re-points the shared `.cp` tokens to blueprint navy, so Contact and
  Footer follow without being restyled, in either theme setting (the page
  is dark by design; see the `.bp` block in globals.css). Earlier homepage
  notes (V2 panel, the Nov 15 rebuild) are in git history.
*/
export default function Home() {
  return (
    <div className={`cp bp ${antonio.variable} ${instrumentSerif.variable}`}>
      <BlueprintHero />
      <WorkStage />
      <ProductShelf />
      <Floors />
      <PriceIt />
      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}
