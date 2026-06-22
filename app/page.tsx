import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HomeTools from "@/components/HomeTools";
import Deployments from "@/components/Deployments";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
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
        {/* Hero → founder → services → work → approach → pricing → free tools → contact */}
        <Hero />
        <FounderNote />
        <Services />
        <Deployments />
        <Approach />
        <Pricing />
        <HomeTools />
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
