import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Shift from "@/components/Shift";
import Playground from "@/components/Playground";
import Dashboard from "@/components/Dashboard";
import Deployments from "@/components/Deployments";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
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
        {/* Tighter journey: intro → prove it (try it + dashboard) → work → how */}
        <Hero />
        <Shift />
        <Playground />
        <Dashboard />
        <Deployments />
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
