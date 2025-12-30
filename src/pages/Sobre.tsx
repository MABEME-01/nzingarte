import Layout from "@/components/layout/Layout";
import { CheckCircle, Target, Eye, Heart } from "lucide-react";
import portfolio2 from "@/assets/portfolio-2.jpg";

const Sobre = () => {
  return (
    <Layout>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Sobre Nós</span>
              <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-6">NZINGA'RTE</h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A NZINGA'RTE é uma empresa especializada em prestação de serviços de decoração interna, localizada em Mbanza Kongo, Angola.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Com uma equipa de profissionais experientes, transformamos espaços simples em ambientes modernos, elegantes e funcionais. O nosso lema "Fazer bem, faz bem" reflete o compromisso com a qualidade e satisfação do cliente.
              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-elegant">
              <img src={portfolio2} alt="Equipa NZINGA'RTE" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-3">Missão</h3>
              <p className="text-muted-foreground text-sm">Transformar espaços em ambientes que refletem a personalidade e estilo de cada cliente.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-3">Visão</h3>
              <p className="text-muted-foreground text-sm">Ser a referência em decoração interna na região, reconhecida pela qualidade e inovação.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-3">Valores</h3>
              <p className="text-muted-foreground text-sm">Qualidade, compromisso, transparência, profissionalismo e respeito pelo cliente.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sobre;
