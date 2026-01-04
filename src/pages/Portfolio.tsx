import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Lightbox from "@/components/ui/Lightbox";
import OptimizedImage from "@/components/ui/OptimizedImage";
import OptimizedVideo from "@/components/ui/OptimizedVideo";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

// Import fallback service images
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
  { id: "pladur", name: "Pladur" },
  { id: "pintura", name: "Pintura" },
  { id: "tecto-falso", name: "Tecto Falso" },
  { id: "cozinha-americana", name: "Cozinha Americana" },
  { id: "guarda-roupa", name: "Guarda-roupa" },
  { id: "vasos", name: "Vasos Personalizados" },
  { id: "artesanato", name: "Artesanato" },
  { id: "outros", name: "Outros" },
];

// Fallback static items (used when no DB items exist)
const staticItems = [
  { id: "s1", image: pladur, title: "Acabamento em Pladur", category: "acabamentos", media_type: "image" },
  { id: "s2", image: estuque, title: "Estuque Decorativo", category: "acabamentos", media_type: "image" },
  { id: "s3", image: pintura, title: "Pintura Profissional", category: "acabamentos", media_type: "image" },
  { id: "s4", image: ladrilho, title: "Ladrilho Moderno", category: "acabamentos", media_type: "image" },
  { id: "s5", image: tectoFalso, title: "Tecto Falso com LED", category: "tectos", media_type: "image" },
  { id: "s6", image: papelParede, title: "Papel de Parede", category: "paredes", media_type: "image" },
  { id: "s7", image: papelVinilico, title: "Papel Vinílico", category: "paredes", media_type: "image" },
  { id: "s8", image: placas3d, title: "Placas 3D Decorativas", category: "paredes", media_type: "image" },
  { id: "s9", image: pedrasNaturais, title: "Pedras Naturais", category: "paredes", media_type: "image" },
  { id: "s10", image: espelhoParede, title: "Espelho de Parede", category: "paredes", media_type: "image" },
  { id: "s11", image: cozinhaAmericana, title: "Cozinha Americana", category: "cozinhas", media_type: "image" },
  { id: "s12", image: painelTv, title: "Painel de TV", category: "mobiliario", media_type: "image" },
  { id: "s13", image: guardaRoupa, title: "Guarda-Roupa Planejado", category: "mobiliario", media_type: "image" },
  { id: "s14", image: garrafeira, title: "Garrafeira", category: "mobiliario", media_type: "image" },
  { id: "s15", image: divisorias, title: "Divisórias", category: "mobiliario", media_type: "image" },
  { id: "s16", image: estantes, title: "Estantes Planejadas", category: "mobiliario", media_type: "image" },
  { id: "s17", image: sapateiras, title: "Sapateiras", category: "mobiliario", media_type: "image" },
  { id: "s18", image: sanitasLavatorios, title: "Sanitas e Lavatórios", category: "casasbanho", media_type: "image" },
];

interface PortfolioItem {
  id: string;
  image: string;
  title: string;
  category: string;
  media_type: string;
}

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Fetch from database
  const { data: dbItems = [] } = useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data.map(item => ({
        id: item.id,
        image: item.image_url,
        title: item.title,
        category: item.category,
        media_type: item.media_type || "image",
      }));
    },
  });

  // Use DB items if available, otherwise use static items
  const portfolioItems: PortfolioItem[] = dbItems.length > 0 ? dbItems : staticItems;

  // Get unique categories that have items
  const activeCategories = ["todos", ...new Set(portfolioItems.map(item => item.category))];
  const displayCategories = categories.filter(cat => activeCategories.includes(cat.id));

  const filteredItems = activeCategory === "todos" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const openLightbox = (index: number) => {
    // Only open lightbox for images, not videos
    const item = filteredItems[index];
    if (item.media_type === "video") return;
    
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Filter only images for lightbox
  const imageItems = filteredItems.filter(item => item.media_type === "image");
  const lightboxImages = imageItems.map(item => ({
    src: item.image,
    title: item.title,
  }));

  return (
    <Layout>
      {/* Filters */}
      <section className="py-6 bg-background border-b border-border sticky top-14 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-1.5">
            {displayCategories.map((category) => (
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
                  className={cn(
                    "group relative aspect-square rounded-2xl overflow-hidden",
                    item.media_type === "image" && "cursor-pointer"
                  )}
                  onMouseEnter={() => item.media_type === "video" && setActiveVideoId(item.id)}
                  onMouseLeave={() => item.media_type === "video" && setActiveVideoId((prev) => (prev === item.id ? null : prev))}
                  onClick={() => {
                    if (item.media_type === "video") {
                      setActiveVideoId((prev) => (prev === item.id ? null : item.id));
                      return;
                    }
                    openLightbox(index);
                  }}
                >
                  {item.media_type === "video" ? (
                    activeVideoId === item.id ? (
                      <OptimizedVideo
                        src={item.image}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        autoPlay
                        loop
                        muted
                        playsInline
                        showPlayIcon
                      />
                    ) : (
                      <div className="w-full h-full bg-muted">
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="rounded-full bg-background/70 backdrop-blur-sm p-3">
                            <Play className="h-6 w-6 text-foreground" />
                          </span>
                        </div>
                      </div>
                    )
                  ) : (
                    <OptimizedImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      containerClassName="w-full h-full"
                    />
                  )}
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
