import Navbar from "@/components/layout/Navbar";
import CTABanner from "@/components/marketing/CTABanner";
import FAQ from "@/components/marketing/FAQ";
import Features from "@/components/marketing/Features";
import HeroCarousel from "@/components/marketing/HeroCarousel";
import HowItWorks from "@/components/marketing/HowItWorks";
// import PopularCourses from "@/components/marketing/PopularCourses";
import PricingPreview from "@/components/marketing/PricingPreview";
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
      {/* <PopularCourses /> */}
      <HowItWorks />
      <Teachers />
      <Testimonials />
      <PricingPreview />
      <FAQ />
      <CTABanner />
    </main>
  );
}