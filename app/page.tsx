import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HomeTools from "@/components/HomeTools";
import Deployments from "@/components/Deployments";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
import FounderNote from "@/components/FounderNote";
import Contact from "@/components/Contact";
import BuildLog from "@/components/BuildLog";
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
        {/* Hero → founder → what M Studio does → free tools → work → approach → contact */}
        <Hero />
        <FounderNote />
        <Services />
        <HomeTools />
        <Deployments />
        <Approach />
        <Contact />
        <BuildLog />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
