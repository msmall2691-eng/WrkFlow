import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Deployments from "@/components/Deployments";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import CommandPalette from "@/components/CommandPalette";
import WorkflowSpine from "@/components/WorkflowSpine";

/*
  Homepage — five sections: what we build, proof it exists, the questions
  that come next, and how to start.

  It was ten, and ~8,800px on a laptop. Hero, founder band, services, eight
  free tools, work, approach, FAQ, pricing, stack, contact — every one of them
  defensible on its own and collectively far too much to land on. The cuts,
  and where each thing went:

    Free tools  → /tools      (eight forms is a product, not a section)
    Approach    → /about      (process belongs with the person)
    Stack       → /about      (reassurance for the people who look for it)
    OperatorBand→ cut         (its numbers now sit as one line in Work, and
                               the story it teased already lives on /about)

  Pricing came off the page after that (Meg's call). Every number now arrives
  in a written scope instead of on a card, so the section that used to carry
  them is no longer mounted — components/Pricing.tsx is still in the repo, and
  dropping <Pricing /> back in here is all it takes to restore it. The FAQ,
  which lived inside that section, is now a section of its own and absorbed
  the two things worth keeping: the "what does it cost" answer and the
  risk-reversal tiles.
*/
export default function Home() {
  return (
    <>
      <Nav />
      <WorkflowSpine />
      <main>
        <Hero />
        <Services />
        <Deployments />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
