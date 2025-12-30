import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const categories = [
  { id: "todos", name: "Todos" },
  { id: "decoracao", name: "Decoração Interior" },
  { id: "tecto", name: "Tecto Falso" },
  { id: "cozinha", name: "Cozinha" },
  { id: "painel", name: "Painel TV" },
  { id: "pladur", name: "Pladur" },
];

const portfolioItems = [
  { id: 1, image: portfolio1, title: "Sala de Estar Moderna", category: "decoracao" },
  { id: 2, image: portfolio2, title: "Tecto Falso com LED", category: "tecto" },
  { id: 3, image: portfolio3, title: "Cozinha Americana", category: "cozinha" },
  { id: 4, image: portfolio4, title: "Painel de TV", category: "painel" },
  { id: 5, image: portfolio1, title: "Divisória em Pladur", category: "pladur" },
  { id: 6, image: portfolio2, title: "Tecto Decorativo", category: "tecto" },
  { id: 7, image: portfolio3, title: "Cozinha Integrada", category: "cozinha" },
  { id: 8, image: portfolio4, title: "Painel Moderno", category: "painel" },
  { id: 9, image: portfolio1, title: "Acabamento Premium", category: "decoracao" },
  { id: 10, image: portfolio2, title: "Iluminação Embutida", category: "tecto" },
  { id: 11, image: portfolio3, title: "Bancada Americana", category: "cozinha" },
  { id: 12, image: portfolio4, title: "Estante Planejada", category: "pladur" },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("todos");

  const filteredItems = activeCategory === "todos" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <Layout>
      <section className="py-20 bg-gradient-to-br from-secondary via-background to-secondary/50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection animation="fade-in-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Portfólio</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">Trabalhos Realizados</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Veja alguns dos projectos que realizamos e inspire-se para transformar o seu espaço.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <AnimatedSection
                key={item.id}
                animation="scale-in"
                delay={index * 50}
              >
                <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium mb-2">
                      {getCategoryName(item.category)}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-primary-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum projecto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
