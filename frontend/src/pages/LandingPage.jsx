import LandingCta from "../components/landing/LandingCta";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingFooter from "../components/landing/LandingFooter";
import LandingHero from "../components/landing/LandingHero";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingPermissions from "../components/landing/LandingPermissions";
import LandingWorkflow from "../components/landing/LandingWorkflow";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07090d] font-sans text-white selection:bg-emerald-300 selection:text-zinc-950">
      <LandingNavbar />

      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingWorkflow />
        <LandingPermissions />
        <LandingCta />
      </main>

      <LandingFooter />
    </div>
  );
}
