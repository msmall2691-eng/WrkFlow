import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HomeTools from "@/components/HomeTools";
import Deployments from "@/components/Deployments";
import Services from "@/components/Services";
import Promises from "@/components/Promises";
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
        {/* Hero → founder → services → free tools → work → approach → pricing → contact */}
        <Hero />
        <FounderNote />
        <Services />
        <Promises />
        <WorkflowMap />
        <HomeTools />
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
