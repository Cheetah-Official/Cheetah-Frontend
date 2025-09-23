import HeroSection from "../components/landingPage/Hero-sections"
import Features from "../components/landingPage/features-section"
import CoreFeaturesSection from "@/components/landingPage/Core-features"
import StakeholderBenefitsSection from "@/components/landingPage/Stakeholder-Benefits-Section"
import MobileAppSection from "@/components/landingPage/mobileApp-section"
import Footer from "../components/landingPage/footer"
export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CoreFeaturesSection />
      <StakeholderBenefitsSection />
      <Features />
      <MobileAppSection />
      <Footer />
    </main>
  )
}
