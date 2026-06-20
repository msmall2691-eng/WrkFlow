import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Shift from "@/components/Shift";
import WhoFor from "@/components/WhoFor";
import Deployments from "@/components/Deployments";
import WaveDivider from "@/components/WaveDivider";
import Playground from "@/components/Playground";
import WorkflowSim from "@/components/WorkflowSim";
import Dashboard from "@/components/Dashboard";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
import FounderNote from "@/components/FounderNote";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Shift />
        <WhoFor />
        <Deployments />
        <WaveDivider className="mx-auto max-w-6xl px-6" />
        <Playground />
        <WorkflowSim />
        <WaveDivider className="mx-auto max-w-6xl px-6" />
        <Dashboard />
        <Services />
        <Approach />
        <FounderNote />
        <Contact />
      </main>
      <Footer />
      <AccentSwitcher />
      <CommandPalette />
    </>
  );
}
