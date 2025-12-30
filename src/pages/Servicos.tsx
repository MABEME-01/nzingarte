import Layout from "@/components/layout/Layout";
import ServiceCard from "@/components/ui/ServiceCard";
import { services } from "@/data/services";

const Servicos = () => {
  return (
    <Layout>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Os Nossos Serviços</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4">Serviços de Decoração</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Oferecemos uma gama completa de serviços de decoração interna para transformar a sua casa ou espaço comercial.</p>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Servicos;
