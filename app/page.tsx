import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProofBand from "@/components/ProofBand";
import ProofStrip from "@/components/ProofStrip";
import Deployments from "@/components/Deployments";
import Capabilities from "@/components/Capabilities";
import TryIt from "@/components/TryIt";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

/*
  Homepage — a portfolio first, a studio second.

    Hero          headline + the live Maine conditions panel
    Proof reel    real shipped screens, cycling, in their own band
    Proof         the operating numbers, attributed
    Work          the case studies, the main argument of the page
    What I do     the five capabilities, compact, no prices
    Try it        a working tool, not a description of one
    Contact       the form, a calendar link, and the résumé

  Services detail and every price moved to /services. Both used to sit here,
  which meant the first thing anyone read about the work was what it cost.
  That is right for a visitor shopping for a website and wrong for anyone
  judging the work itself, and one page cannot lead with both. So this page
  leads with the work and /services answers the money question in full.
*/
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofBand />
        <ProofStrip />
        <Deployments />
        <Capabilities />
        <TryIt />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
