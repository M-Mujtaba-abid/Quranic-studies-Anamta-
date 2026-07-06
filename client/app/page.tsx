import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CTABanner from "@/components/marketing/CTABanner";
import FAQ from "@/components/marketing/FAQ";
import Features from "@/components/marketing/Features";
import GroupClassFeatures from "@/components/marketing/GroupClassFeatures";
import HeroCarousel from "@/components/marketing/HeroCarousel";
import HowItWorks from "@/components/marketing/HowItWorks";
import SponsorStudentSection from "@/components/marketing/SponsorStudentSection";
// import PopularCourses from "@/components/marketing/PopularCourses";
import PricingPreview from "@/components/marketing/PricingPreview";
import SponsorCTA from "@/components/marketing/SponsorCTA";
import Teachers from "@/components/marketing/Teachers";
import Testimonials from "@/components/marketing/Testimonials";
import TrustBar from "@/components/marketing/TrustBar";


export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroCarousel />
      <TrustBar />
      <Features />
      <GroupClassFeatures />
      {/* <PopularCourses /> */}
      <HowItWorks />
      <SponsorStudentSection />
      {/* <Teachers /> */}
      <Testimonials />
      {/* <PricingPreview /> */}
      {/* <FAQ /> */}
      <CTABanner />
      <SponsorCTA />
      <Footer />
    </main>
  );
}