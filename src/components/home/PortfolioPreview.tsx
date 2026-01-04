import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptimizedVideo from "@/components/ui/OptimizedVideo";
import trabalho1 from "@/assets/videos/trabalho-1.mp4";
import trabalho2 from "@/assets/videos/trabalho-2.mp4";
import vasosVideo from "@/assets/videos/vasos-personalizados.mp4";
import tectoFalsoVideo from "@/assets/videos/tecto-falso.mp4";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import vasosPoster from "@/assets/vasos-personalizados.jpg";
import tectoFalsoPoster from "@/assets/services/tecto-falso.jpg";

const portfolioItems = [
  {
    id: 1,
    video: trabalho1,
    poster: portfolio1,
    title: "Trabalho 1",
    category: "Decoração Interior",
    posterColor: "#8B7355",
  },
  {
    id: 2,
    video: trabalho2,
    poster: portfolio2,
    title: "Trabalho 2",
    category: "Decoração Interior",
    posterColor: "#A0937D",
  },
  {
    id: 3,
    video: vasosVideo,
    poster: vasosPoster,
    title: "Vasos Personalizados",
    category: "Artesanato",
    posterColor: "#C4A77D",
  },
  {
    id: 4,
    video: tectoFalsoVideo,
    poster: tectoFalsoPoster,
    title: "Tecto Falso",
    category: "Tecto Falso",
    posterColor: "#D4C4A8",
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
              <OptimizedVideo
                src={item.video}
                poster={item.poster}
                posterColor={item.posterColor}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Title always visible */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/70 to-transparent">
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
