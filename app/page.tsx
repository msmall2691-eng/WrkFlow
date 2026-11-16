import BlueprintHero from "@/components/blueprint/BlueprintHero";
import WorkStage from "@/components/blueprint/WorkStage";
import Capabilities from "@/components/blueprint/Capabilities";
import Process from "@/components/blueprint/Process";
import PriceIt from "@/components/blueprint/PriceIt";
import ProductShelf from "@/components/blueprint/ProductShelf";
import { instrumentSerif } from "@/components/blueprint/fonts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

/*
  Homepage, "Signal" (Meg, Nov 16 2026).

  After a day of directions she did not love, Meg picked two AnimatedWebs
  demos, Ostrander Signal and Ironline Builders, and then said: "more like
  Ostrander", with Ironline's ideas saved for the other pages. She also
  turned down the navy-and-orange first pass, so the colours are
  Ostrander's: near-black, warm white, one electric cyan. Nothing is copied
  from either demo; this page follows Ostrander's rhythm with its own parts:

    BlueprintHero  a web page drawn line by line behind a giant wordmark,
                   the real h1, and a live Maine readout (time, temp, sun)
    WorkStage      four real projects rolling through one pinned window
    Capabilities   the four `services`, a warm-white band that slides
                   sideways as you scroll
    Process        `approachSteps` and a film strip of real captures
    ProductShelf   the six ready-made things, each with a working demo
    PriceIt        the real price sheet, total carried into the form
    Contact, Footer

  `.bp` re-points the shared `.cp` tokens, so Contact and Footer follow
  without being restyled, in either theme setting (the page is dark by
  design). Floors.tsx and the Antonio face are the Ironline half, kept for
  the inner pages. Earlier homepage notes are in git history.
*/
export default function Home() {
  return (
    <div className={`cp bp ${instrumentSerif.variable}`}>
      <BlueprintHero />
      <WorkStage />
      <Capabilities />
      <Process />
      <ProductShelf />
      <PriceIt />
      <Contact />
      <Footer />
      <CommandPalette />
    </div>
  );
}
