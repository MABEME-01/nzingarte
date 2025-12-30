import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import portfolio2 from "@/assets/portfolio-2.jpg";

const AboutPreview = () => {
  const highlights = [
    "Acabamentos de alta qualidade",
    "Profissionais experientes e certificados",
    "Projectos personalizados",
    "Compromisso com prazos",
    "Orçamentos transparentes",
    "Satisfação garantida",
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={portfolio2}
                alt="Equipa NZINGA'ARTE em trabalho"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Experience badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg">
              <p className="font-display text-4xl font-bold">100%</p>
              <p className="text-sm opacity-90">Compromisso</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Sobre Nós
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Fazer bem, faz bem
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A NZINGA'ARTE é especializada em prestação de serviços de
              decoração interna em Mbanza Kongo, Angola. Trabalhamos com
              profissionalismo, qualidade e compromisso para valorizar cada
              detalhe da sua casa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cada projecto é único e tratado com a máxima atenção. A nossa
              missão é transformar espaços comuns em ambientes extraordinários
              que reflectem a personalidade e estilo de cada cliente.
            </p>

            {/* Highlights grid */}
            <div className="grid sm:grid-cols-2 gap-3 pt-4">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button className="group mt-4" asChild>
              <Link to="/sobre">
                Saber Mais
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
