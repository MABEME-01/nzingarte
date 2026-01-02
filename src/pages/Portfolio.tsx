import { useState } from "react";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Lightbox from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

// Import all service images
import pladur from "@/assets/services/pladur.jpg";
import estuque from "@/assets/services/estuque.jpg";
import pintura from "@/assets/services/pintura.jpg";
import ladrilho from "@/assets/services/ladrilho.jpg";
import tectoFalso from "@/assets/services/tecto-falso.jpg";
import papelParede from "@/assets/services/papel-parede.jpg";
import cozinhaAmericana from "@/assets/services/cozinha-americana.jpg";
import painelTv from "@/assets/services/painel-tv.jpg";
import guardaRoupa from "@/assets/services/guarda-roupa.jpg";
import garrafeira from "@/assets/services/garrafeira.jpg";
import papelVinilico from "@/assets/services/papel-vinilico.jpg";
import placas3d from "@/assets/services/placas-3d.jpg";
import divisorias from "@/assets/services/divisorias.jpg";
import estantes from "@/assets/services/estantes.jpg";
import sapateiras from "@/assets/services/sapateiras.jpg";
import pedrasNaturais from "@/assets/services/pedras-naturais.jpg";
import espelhoParede from "@/assets/services/espelho-parede.jpg";
import sanitasLavatorios from "@/assets/services/sanitas-lavatorios.jpg";

const categories = [
  { id: "todos", name: "Todos" },
  { id: "acabamentos", name: "Acabamentos" },
  { id: "tectos", name: "Tectos" },
  { id: "cozinhas", name: "Cozinhas" },
  { id: "mobiliario", name: "Mobiliário" },
  { id: "paredes", name: "Paredes" },
  { id: "casasbanho", name: "Casas de Banho" },
];

const portfolioItems = [
  // Acabamentos
  { id: 1, image: pladur, title: "Acabamento em Pladur", category: "acabamentos" },
  { id: 2, image: estuque, title: "Estuque Decorativo", category: "acabamentos" },
  { id: 3, image: pintura, title: "Pintura Profissional", category: "acabamentos" },
  { id: 4, image: ladrilho, title: "Ladrilho Moderno", category: "acabamentos" },
  
  // Tectos
  { id: 5, image: tectoFalso, title: "Tecto Falso com LED", category: "tectos" },
  
  // Paredes
  { id: 6, image: papelParede, title: "Papel de Parede", category: "paredes" },
  { id: 7, image: papelVinilico, title: "Papel Vinílico", category: "paredes" },
  { id: 8, image: placas3d, title: "Placas 3D Decorativas", category: "paredes" },
  { id: 9, image: pedrasNaturais, title: "Pedras Naturais", category: "paredes" },
  { id: 10, image: espelhoParede, title: "Espelho de Parede", category: "paredes" },
  
  // Cozinhas
  { id: 11, image: cozinhaAmericana, title: "Cozinha Americana", category: "cozinhas" },
  
  // Mobiliário
  { id: 12, image: painelTv, title: "Painel de TV", category: "mobiliario" },
  { id: 13, image: guardaRoupa, title: "Guarda-Roupa Planejado", category: "mobiliario" },
  { id: 14, image: garrafeira, title: "Garrafeira", category: "mobiliario" },
  { id: 15, image: divisorias, title: "Divisórias", category: "mobiliario" },
  { id: 16, image: estantes, title: "Estantes Planejadas", category: "mobiliario" },
  { id: 17, image: sapateiras, title: "Sapateiras", category: "mobiliario" },
  
  // Casas de Banho
  { id: 18, image: sanitasLavatorios, title: "Sanitas e Lavatórios", category: "casasbanho" },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems = activeCategory === "todos" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = filteredItems.map(item => ({
    src: item.image,
    title: item.title,
  }));

  return (
    <Layout>
      {/* Filters */}
      <section className="py-6 bg-background border-b border-border sticky top-14 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1.5">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
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
                <div 
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
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

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
      />
    </Layout>
  );
};

export default Portfolio;
