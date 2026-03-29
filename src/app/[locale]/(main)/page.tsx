import { useTranslations } from "next-intl";
import { HeroSection } from "@/components/home/hero-section";
import { ProductLineup } from "@/components/home/product-lineup";
import { HowItWorks } from "@/components/home/how-it-works";
import { SpecsBar } from "@/components/home/specs-bar";
import { FeaturesScroll } from "@/components/home/features-scroll";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { CTABanner } from "@/components/home/cta-banner";

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <HeroSection />
      <FeaturesScroll />
      <ProductLineup />
      <HowItWorks />
      <SpecsBar />
      <NewsletterSection />
      <CTABanner />
    </>
  );
}
