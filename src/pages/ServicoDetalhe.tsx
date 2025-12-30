import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Phone, CheckCircle, Star } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getServiceById, services } from "@/data/services";

const beneficios = [
  "Profissionais experientes e qualificados",
  "Materiais de alta qualidade",
  "Acabamentos perfeitos e duráveis",
  "Orçamento gratuito e sem compromisso",
  "Garantia de satisfação",
  "Atendimento personalizado",
];

const ServicoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const service = getServiceById(id || "");

  if (!service) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Serviço não encontrado
            </h1>
            <Button asChild>
              <Link to="/servicos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Serviços
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box;

  // Find related services (excluding current)
  const relatedServices = services
    .filter((s) => s.id !== service.id)
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <AnimatedSection animation="fade-in" className="mb-8">
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Voltar aos Serviços</span>
            </Link>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <AnimatedSection animation="fade-in-up">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary">
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm font-medium">Serviço Especializado</span>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-in-up" delay={100}>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
                  {service.name}
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="fade-in-up" delay={200}>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-in-up" delay={300}>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="group" asChild>
                    <Link to="/contactos">
                      Pedir Orçamento
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a
                      href="https://wa.me/244936163587"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            {/* Main Image */}
            <AnimatedSection animation="slide-in-right" delay={200}>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/20 rounded-2xl -z-10" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-in-left">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Porquê Escolher-nos
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2 mb-6">
                Benefícios do Nosso Serviço
              </h2>
              <div className="space-y-4">
                {beneficios.map((beneficio, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{beneficio}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-in-right" delay={200}>
              <div className="bg-card rounded-2xl p-8 border border-border shadow-elegant">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                    <Star className="h-8 w-8 text-primary-foreground fill-current" />
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-foreground">
                      Fazer bem,
                    </p>
                    <p className="text-primary font-display text-xl">faz bem.</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Na NZINGA'RTE, acreditamos que cada projecto merece dedicação
                  total. A nossa equipa está pronta para transformar a sua visão
                  em realidade.
                </p>
                <Button className="w-full group" size="lg" asChild>
                  <Link to="/contactos">
                    Solicitar Orçamento Gratuito
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Explore Mais
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground mt-2">
              Serviços Relacionados
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((relatedService, index) => {
              const RelatedIcon =
                (LucideIcons as any)[relatedService.icon] || LucideIcons.Box;
              return (
                <AnimatedSection key={relatedService.id} animation="fade-in-up" delay={index * 100}>
                  <Link
                    to={`/servicos/${relatedService.id}`}
                    className="group block p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <RelatedIcon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {relatedService.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {relatedService.shortDescription}
                    </p>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicoDetalhe;
