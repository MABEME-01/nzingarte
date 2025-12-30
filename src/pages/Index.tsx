import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import AboutPreview from "@/components/home/AboutPreview";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesPreview />
      <AboutPreview />
      <PortfolioPreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
