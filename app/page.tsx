import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Deployments from "@/components/Deployments";
import Stack from "@/components/Stack";
import Services from "@/components/Services";
import Playground from "@/components/Playground";
import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import OperatorBand from "@/components/OperatorBand";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import CommandPalette from "@/components/CommandPalette";
import WorkflowSpine from "@/components/WorkflowSpine";

export default function Home() {
  return (
    <>
      <Nav />
      <WorkflowSpine />
      <main>
        {/* Hero → operator band (boxes + actions; full story on /about) →
            services → free tools → work → approach → pricing → stack → contact.
            Free tools sit at position 2 DELIBERATELY (survey J-01, decided):
            Meg put the kit up top because it's the site's strongest hook and
            she uses it herself — engagement beats narrative purity here. */}
        <Hero />
        <OperatorBand />
        <Services />
        <Playground />
        <Deployments />
        <Approach />
        <FAQ />
        <Pricing />
        {/* Stack moved below pricing (brief A4). Above it, a four-column grid
            reading "REST + typed clients" was the most intimidating thing on
            the page, and a non-technical visitor hit it immediately before the
            price. Down here it reassures the people who look for it instead of
            frightening the people who don't. */}
        <Stack />
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
