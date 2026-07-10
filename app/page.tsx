import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ToolsTeaser from "@/components/ToolsTeaser";
import Deployments from "@/components/Deployments";
import Services from "@/components/Services";
import WorkflowMap from "@/components/WorkflowMap";
import Approach from "@/components/Approach";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import FounderNote from "@/components/FounderNote";
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
        {/* Hero → founder → services → workflow → tools teaser → work → approach → pricing → contact */}
        <Hero />
        <FounderNote />
        <Services />
        <WorkflowMap />
        <ToolsTeaser />
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
