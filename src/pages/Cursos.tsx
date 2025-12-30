import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

const Cursos = () => {
  return (
    <Layout>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Formação</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4">Cursos</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Aprenda com os profissionais da NZINGA'RTE.</p>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-8 shadow-elegant">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">Próximo Curso</div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Curso Intensivo de Pladur</h2>
            <p className="text-muted-foreground mb-6">Aprenda as técnicas profissionais de instalação de pladur, desde a estrutura até aos acabamentos.</p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                <span>30 de Setembro</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span>Duração: 1 Semana (Intensivo)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Mbanza Kongo, Angola</span>
              </div>
            </div>
            <Button size="lg" asChild>
              <a href="https://wa.me/244936163587?text=Olá! Gostaria de me inscrever no Curso Intensivo de Pladur." target="_blank" rel="noopener noreferrer">
                Inscrever-se
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cursos;
