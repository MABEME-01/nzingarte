import Layout from "@/components/layout/Layout";
import ServiceCard from "@/components/ui/ServiceCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { services } from "@/data/services";

const Servicos = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-in-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Os Nossos Serviços</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">Serviços de Decoração</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Oferecemos uma gama completa de serviços de decoração interna para transformar a sua casa ou espaço comercial.
            </p>
          </AnimatedSection>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimatedSection 
                key={service.id} 
                animation="fade-in-up" 
                delay={index * 50}
              >
                <ServiceCard service={service} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Servicos;
