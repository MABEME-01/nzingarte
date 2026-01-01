import Layout from "@/components/layout/Layout";
import ServiceCard from "@/components/ui/ServiceCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { services } from "@/data/services";
import { CheckCircle, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const diferenciais = [
  "Profissionais experientes e qualificados",
  "Materiais de alta qualidade e durabilidade",
  "Orçamentos gratuitos e sem compromisso",
  "Cumprimento rigoroso de prazos",
  "Garantia de satisfação em todos os trabalhos",
  "Atendimento personalizado do início ao fim",
];

const Servicos = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-in-up">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Os Nossos Serviços</span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
                Serviços de Decoração Profissional
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                Oferecemos uma gama completa de serviços de decoração interna para transformar a sua casa, escritório ou espaço comercial em ambientes modernos e funcionais.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/contactos">
                    Pedir Orçamento Grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://wa.me/244936163587" target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-in-up" delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {diferenciais.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Count */}
      <section className="py-8 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center text-primary-foreground">
            <div>
              <p className="font-display text-3xl font-bold">{services.length}+</p>
              <p className="text-sm opacity-80">Tipos de Serviços</p>
            </div>
            <div className="w-px bg-primary-foreground/30" />
            <div>
              <p className="font-display text-3xl font-bold">150+</p>
              <p className="text-sm opacity-80">Projectos Concluídos</p>
            </div>
            <div className="w-px bg-primary-foreground/30" />
            <div>
              <p className="font-display text-3xl font-bold">98%</p>
              <p className="text-sm opacity-80">Clientes Satisfeitos</p>
            </div>
            <div className="w-px bg-primary-foreground/30" />
            <div>
              <p className="font-display text-3xl font-bold">8+</p>
              <p className="text-sm opacity-80">Anos de Experiência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Explore</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
              Todos os Nossos Serviços
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Clique em cada serviço para saber mais detalhes e pedir um orçamento personalizado.
            </p>
          </AnimatedSection>
          
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

      {/* CTA Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection animation="fade-in-up">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Não Encontrou o Que Procura?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Realizamos também outros tipos de trabalhos de decoração e acabamentos. Entre em contacto connosco para discutir o seu projecto específico.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/contactos">
                    Fale Connosco
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://wa.me/244936163587?text=Olá! Tenho um projecto específico que gostaria de discutir." target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5" />
                    WhatsApp Directo
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Servicos;
