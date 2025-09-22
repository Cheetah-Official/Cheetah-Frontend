import HeroSection from "../Components/landingPage/Hero-sections"
import Features from "../Components/landingPage/features-section"
import CoreFeaturesSection from "@/Components/landingPage/Core-features"
import StakeholderBenefitsSection from "@/Components/landingPage/Stakeholder-Benefits-Section"
import MobileAppSection from "@/Components/landingPage/mobileApp-section"
import Footer from "../Components/landingPage/footer"
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
