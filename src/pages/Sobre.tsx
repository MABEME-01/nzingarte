import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { CheckCircle, Target, Eye, Heart, Award, Users, Clock, MapPin } from "lucide-react";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";

const valores = [
  "Qualidade em cada detalhe",
  "Compromisso com prazos",
  "Transparência nos orçamentos",
  "Profissionalismo exemplar",
  "Respeito pelo cliente",
  "Inovação constante",
];

const Sobre = () => {
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
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Sobre Nós</span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-6">NZINGA'RTE</h1>
              <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
                A <strong className="text-foreground">NZINGA'RTE</strong> é uma empresa angolana especializada em prestação de serviços de decoração interna, fundada e sediada em Mbanza Kongo, província do Zaire.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Com uma equipa de profissionais experientes e apaixonados pelo que fazem, transformamos espaços simples em ambientes modernos, elegantes e funcionais. O nosso lema <span className="text-primary font-semibold">"Fazer bem, faz bem"</span> reflete o nosso compromisso inabalável com a qualidade e satisfação de cada cliente.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Mbanza Kongo, Angola</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>+8 Anos de Experiência</span>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" delay={200}>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-elegant">
                <img src={portfolio2} alt="Trabalho NZINGA'RTE" className="w-full h-full object-cover" />
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/20 rounded-2xl -z-10" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slide-in-left" delay={100}>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant">
                  <img src={portfolio1} alt="Samuel Nzinga Júnior - Fundador" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg">
                  <p className="font-display text-2xl font-bold">Samuel Nzinga</p>
                  <p className="text-primary-foreground/80">Fundador & CEO</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-in-up" delay={200}>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">O Fundador</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-6">Samuel Nzinga Júnior</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Natural de Mbanza Kongo, Samuel Nzinga Júnior é um empreendedor visionário que transformou a sua paixão pela decoração e construção numa empresa de referência na região.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Com formação técnica em construção civil e anos de experiência prática, Samuel fundou a NZINGA'RTE com o objetivo de oferecer serviços de decoração de alta qualidade a preços acessíveis, contribuindo para a modernização dos espaços habitacionais e comerciais em Angola.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sob a sua liderança, a empresa já realizou mais de 150 projetos bem-sucedidos, conquistando a confiança de clientes em toda a província do Zaire e regiões vizinhas.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-secondary">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Fundador</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-secondary">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Líder</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-secondary">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Visionário</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up" className="text-center mb-12">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">A Nossa Essência</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">Missão, Visão e Valores</h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection animation="fade-in-up" delay={100}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border h-full hover:shadow-elegant transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">Missão</h3>
                <p className="text-muted-foreground">
                  Transformar espaços em ambientes que refletem a personalidade e estilo de cada cliente, oferecendo soluções de decoração inovadoras, acessíveis e de alta qualidade.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in-up" delay={200}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border h-full hover:shadow-elegant transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">Visão</h3>
                <p className="text-muted-foreground">
                  Ser a empresa de referência em decoração interna em Angola, reconhecida pela excelência, inovação e pelo impacto positivo na qualidade de vida dos nossos clientes.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in-up" delay={300}>
              <div className="text-center p-8 rounded-2xl bg-card border border-border h-full hover:shadow-elegant transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-4">Valores</h3>
                <p className="text-muted-foreground">
                  Qualidade, compromisso, transparência, profissionalismo, respeito pelo cliente e inovação constante em tudo o que fazemos.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values List */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-in-up">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">O Que Nos Define</span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-2 mb-6">Os Nossos Compromissos</h2>
              <p className="text-muted-foreground mb-8">
                Na NZINGA'RTE, cada projecto é tratado com o mesmo nível de dedicação e atenção aos detalhes. Estes são os pilares que sustentam o nosso trabalho:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {valores.map((valor, index) => (
                  <AnimatedSection key={index} animation="fade-in-up" delay={index * 50}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{valor}</span>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slide-in-right" delay={200}>
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-elegant">
                  <img src={portfolio2} alt="Projecto NZINGA'RTE" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-6 -right-6 bg-card p-6 rounded-2xl shadow-elegant border border-border">
                  <p className="font-display text-4xl font-bold text-primary">150+</p>
                  <p className="text-muted-foreground text-sm">Projectos Realizados</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sobre;
