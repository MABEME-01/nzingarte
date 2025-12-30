import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const portfolioItems = [
  {
    id: 1,
    image: portfolio1,
    title: "Sala de Estar Moderna",
    category: "Decoração Interior",
  },
  {
    id: 2,
    image: portfolio2,
    title: "Tecto Falso com LED",
    category: "Tecto Falso",
  },
  {
    id: 3,
    image: portfolio3,
    title: "Cozinha Americana",
    category: "Cozinha",
  },
  {
    id: 4,
    image: portfolio4,
    title: "Painel de TV",
    category: "Painel TV",
  },
];

const PortfolioPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Portfólio
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
            Trabalhos Realizados
          </h2>
          <p className="text-muted-foreground">
            Veja alguns dos projectos que realizamos e inspire-se para o seu
            próximo espaço.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {portfolioItems.map((item, index) => (
            <Link
              key={item.id}
              to="/portfolio"
              className="group relative aspect-square rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-primary-foreground/80 mb-1">
                  {item.category}
                </p>
                <h3 className="font-display font-semibold text-primary-foreground">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="group" asChild>
            <Link to="/portfolio">
              Ver Todo o Portfólio
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
