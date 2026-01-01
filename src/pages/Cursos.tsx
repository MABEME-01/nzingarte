import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Award, CheckCircle, BookOpen } from "lucide-react";

const cursosProgramados = [
  {
    id: 1,
    title: "Curso Intensivo de Pladur",
    description: "Aprenda as técnicas profissionais de instalação de pladur, desde a estrutura metálica até aos acabamentos finais. Curso prático com certificado.",
    date: "15 de Fevereiro de 2026",
    duration: "1 Semana (40 horas)",
    location: "Mbanza Kongo, Angola",
    price: "45.000 Kz",
    vagas: 12,
    topicos: [
      "Montagem de estrutura metálica",
      "Corte e fixação de placas",
      "Tratamento de juntas",
      "Acabamentos e pintura",
      "Isolamento térmico e acústico",
    ],
    whatsapp: "https://wa.me/244936163587?text=Olá! Gostaria de me inscrever no Curso Intensivo de Pladur.",
  },
  {
    id: 2,
    title: "Curso de Pintura Decorativa",
    description: "Domine as técnicas de pintura decorativa, incluindo efeitos especiais, texturas e acabamentos profissionais para interiores.",
    date: "1 de Março de 2026",
    duration: "3 Dias (24 horas)",
    location: "Mbanza Kongo, Angola",
    price: "25.000 Kz",
    vagas: 15,
    topicos: [
      "Preparação de superfícies",
      "Técnicas de pintura lisa",
      "Efeitos decorativos",
      "Uso de cores e combinações",
      "Manutenção e conservação",
    ],
    whatsapp: "https://wa.me/244936163587?text=Olá! Gostaria de me inscrever no Curso de Pintura Decorativa.",
  },
  {
    id: 3,
    title: "Curso de Tecto Falso com Iluminação LED",
    description: "Aprenda a instalar tectos falsos modernos com sistemas de iluminação LED embutida. Curso completo do projecto à instalação.",
    date: "22 de Março de 2026",
    duration: "5 Dias (40 horas)",
    location: "Mbanza Kongo, Angola",
    price: "55.000 Kz",
    vagas: 10,
    topicos: [
      "Projecto e medição",
      "Estrutura para tecto falso",
      "Instalação de placas",
      "Sistemas de iluminação LED",
      "Acabamentos profissionais",
    ],
    whatsapp: "https://wa.me/244936163587?text=Olá! Gostaria de me inscrever no Curso de Tecto Falso com Iluminação LED.",
  },
];

const beneficios = [
  {
    icon: Award,
    title: "Certificado",
    description: "Certificado de conclusão reconhecido",
  },
  {
    icon: Users,
    title: "Turmas Pequenas",
    description: "Atenção individualizada",
  },
  {
    icon: BookOpen,
    title: "Material Incluído",
    description: "Apostila e ferramentas de prática",
  },
  {
    icon: CheckCircle,
    title: "Prática Real",
    description: "Aprenda fazendo projectos reais",
  },
];

const Cursos = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-in-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Formação Profissional</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">Cursos NZINGA'RTE</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Aprenda com os melhores profissionais de decoração e construção. Cursos práticos, intensivos e com certificação.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {beneficios.map((beneficio, index) => (
              <AnimatedSection key={index} animation="fade-in-up" delay={index * 100}>
                <div className="text-center p-6 rounded-2xl bg-secondary hover:shadow-elegant transition-shadow">
                  <beneficio.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{beneficio.title}</h3>
                  <p className="text-sm text-muted-foreground">{beneficio.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Courses List */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Próximos Cursos</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">Calendário de Formações</h2>
          </AnimatedSection>

          <div className="space-y-8">
            {cursosProgramados.map((curso, index) => (
              <AnimatedSection key={curso.id} animation="fade-in-up" delay={index * 100}>
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-elegant hover:shadow-lg transition-shadow">
                  <div className="grid lg:grid-cols-3">
                    {/* Course Info */}
                    <div className="lg:col-span-2 p-8">
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          Inscrições Abertas
                        </span>
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium">
                          {curso.vagas} vagas
                        </span>
                      </div>
                      
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">{curso.title}</h3>
                      <p className="text-muted-foreground mb-6">{curso.description}</p>
                      
                      <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{curso.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{curso.duration}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{curso.location}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-3">O que vai aprender:</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {curso.topicos.map((topico, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>{topico}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="bg-secondary/50 p-8 flex flex-col justify-center items-center text-center">
                      <p className="text-muted-foreground mb-2">Investimento</p>
                      <p className="font-display text-3xl font-bold text-primary mb-6">{curso.price}</p>
                      <Button size="lg" className="w-full" asChild>
                        <a href={curso.whatsapp} target="_blank" rel="noopener noreferrer">
                          Inscrever-se
                        </a>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-4">
                        Pagamento pode ser feito em 2x
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Training */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection animation="fade-in-up">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Formação Personalizada</span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2 mb-4">Precisa de Formação para a Sua Equipa?</h2>
              <p className="text-muted-foreground mb-8">
                Oferecemos cursos personalizados para empresas e grupos. Entre em contacto para discutir as suas necessidades específicas e criar um programa de formação à medida.
              </p>
              <Button size="lg" asChild>
                <a href="https://wa.me/244936163587?text=Olá! Gostaria de saber mais sobre formações personalizadas para a minha equipa." target="_blank" rel="noopener noreferrer">
                  Solicitar Proposta
                </a>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cursos;
