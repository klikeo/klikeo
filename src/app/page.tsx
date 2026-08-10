import AuthGuard from "../components/AuthGuard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../components/landing/Hero";
import DashboardPreview from "../components/landing/DashboardPreview";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Benefits from "../components/landing/Benefits";

export default function LandingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <Hero />

        <Features />

        <Benefits />

        <HowItWorks />

        <Footer />
      </div>
    </AuthGuard>
  );
}
