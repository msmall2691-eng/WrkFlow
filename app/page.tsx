import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Deployments from "@/components/Deployments";
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
            services → free tools → work → approach → pricing → contact.
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
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
