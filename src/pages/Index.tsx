import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";

// Lazy load below-the-fold sections for faster initial load
const AboutPreview = lazy(() => import("@/components/home/AboutPreview"));
const PortfolioPreview = lazy(() => import("@/components/home/PortfolioPreview"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Lightweight skeleton for lazy sections
const SectionSkeleton = ({ height = "h-96" }: { height?: string }) => (
  <div className={`${height} bg-muted shimmer-placeholder`} />
);

const Index = () => {
  return (
    <Layout>
      {/* Above-the-fold: loads immediately */}
      <HeroSection />
      <ServicesPreview />
      
      {/* Below-the-fold: lazy loaded */}
      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <AboutPreview />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-[600px]" />}>
        <PortfolioPreview />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <CTASection />
      </Suspense>
    </Layout>
  );
};

export default Index;
