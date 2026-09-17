import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Deployments from "@/components/Deployments";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import CommandPalette from "@/components/CommandPalette";
import WorkflowSpine from "@/components/WorkflowSpine";

/*
  Homepage — five sections: what we build, proof it exists, what it costs,
  how to start.

  It was ten, and ~8,800px on a laptop. Hero, founder band, services, eight
  free tools, work, approach, FAQ, pricing, stack, contact — every one of them
  defensible on its own and collectively far too much to land on. The cuts,
  and where each thing went:

    Free tools  → /tools      (eight forms is a product, not a section)
    FAQ         → inside Pricing, where the objections it answers come up
    Approach    → /about      (process belongs with the person)
    Stack       → /about      (reassurance for the people who look for it)
    OperatorBand→ cut         (its numbers now sit as one line in Work, and
                               the story it teased already lives on /about)
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
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
