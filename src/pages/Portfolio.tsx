import Layout from "@/components/layout/Layout";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";

const portfolioItems = [
  { id: 1, image: portfolio1, title: "Sala de Estar Moderna", category: "Decoração Interior" },
  { id: 2, image: portfolio2, title: "Tecto Falso com LED", category: "Tecto Falso" },
  { id: 3, image: portfolio3, title: "Cozinha Americana", category: "Cozinha" },
  { id: 4, image: portfolio4, title: "Painel de TV", category: "Painel TV" },
];

const Portfolio = () => {
  return (
    <Layout>
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Portfólio</span>
          <h1 className="font-display text-4xl font-bold text-foreground mt-2 mb-4">Trabalhos Realizados</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Veja alguns dos projectos que realizamos.</p>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-xs text-primary-foreground/80">{item.category}</p>
                  <h3 className="font-display font-semibold text-primary-foreground">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
