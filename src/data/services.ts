// Service images
import pladurImg from "@/assets/services/pladur.jpg";
import estuqueImg from "@/assets/services/estuque.jpg";
import pinturaImg from "@/assets/services/pintura.jpg";
import ladrilhoImg from "@/assets/services/ladrilho.jpg";
import tectoFalsoImg from "@/assets/services/tecto-falso.jpg";
import papelParedeImg from "@/assets/services/papel-parede.jpg";
import cozinhaAmericanaImg from "@/assets/services/cozinha-americana.jpg";
import painelTvImg from "@/assets/services/painel-tv.jpg";
import guardaRoupaImg from "@/assets/services/guarda-roupa.jpg";
import garrafeiraImg from "@/assets/services/garrafeira.jpg";
import papelVinilicoImg from "@/assets/services/papel-vinilico.jpg";
import placas3dImg from "@/assets/services/placas-3d.jpg";
import divisoriasImg from "@/assets/services/divisorias.jpg";
import estantesImg from "@/assets/services/estantes.jpg";
import sapateirasImg from "@/assets/services/sapateiras.jpg";
import pedrasNaturaisImg from "@/assets/services/pedras-naturais.jpg";
import espelhoParedeImg from "@/assets/services/espelho-parede.jpg";
import sanitasLavatoriosImg from "@/assets/services/sanitas-lavatorios.jpg";

export interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  image: string;
}

export const services: Service[] = [
  {
    id: "pladur",
    name: "Pladur",
    description: "Instalação profissional de placas de gesso cartonado (pladur) para divisórias, forros e revestimentos. Acabamentos perfeitos e duráveis para qualquer ambiente.",
    shortDescription: "Divisórias e revestimentos em gesso cartonado",
    icon: "LayoutGrid",
    image: pladurImg,
  },
  {
    id: "estuque",
    name: "Estuque",
    description: "Trabalhos de estuque tradicional e moderno. Molduras decorativas, sancas e acabamentos de teto com elegância e qualidade artesanal.",
    shortDescription: "Molduras decorativas e acabamentos artísticos",
    icon: "Paintbrush",
    image: estuqueImg,
  },
  {
    id: "pintura",
    name: "Pintura",
    description: "Serviços de pintura interior e exterior com tintas de alta qualidade. Preparação de superfícies, acabamentos lisos e texturados.",
    shortDescription: "Pintura interior e exterior profissional",
    icon: "Palette",
    image: pinturaImg,
  },
  {
    id: "ladrilho",
    name: "Ladrilho",
    description: "Assentamento de azulejos e pisos cerâmicos. Padrões modernos e tradicionais para cozinhas, casas de banho e áreas comuns.",
    shortDescription: "Assentamento de azulejos e pisos cerâmicos",
    icon: "Grid3X3",
    image: ladrilhoImg,
  },
  {
    id: "tecto-falso",
    name: "Tecto Falso",
    description: "Instalação de tectos falsos em gesso ou PVC. Iluminação embutida, isolamento acústico e designs personalizados.",
    shortDescription: "Tectos modernos com iluminação embutida",
    icon: "Square",
    image: tectoFalsoImg,
  },
  {
    id: "papel-parede",
    name: "Papel de Parede",
    description: "Aplicação profissional de papel de parede. Grande variedade de texturas, padrões e estilos para transformar qualquer ambiente.",
    shortDescription: "Texturas e padrões que transformam ambientes",
    icon: "Wallpaper",
    image: papelParedeImg,
  },
  {
    id: "cozinha-americana",
    name: "Cozinha Americana",
    description: "Projecto e execução de cozinhas americanas integradas. Balcões, ilhas e divisórias funcionais para um espaço moderno.",
    shortDescription: "Cozinhas integradas e funcionais",
    icon: "UtensilsCrossed",
    image: cozinhaAmericanaImg,
  },
  {
    id: "painel-tv",
    name: "Painel de TV",
    description: "Design e instalação de painéis de TV personalizados. Soluções modernas com prateleiras, iluminação LED e acabamentos premium.",
    shortDescription: "Painéis modernos com iluminação integrada",
    icon: "Monitor",
    image: painelTvImg,
  },
  {
    id: "guarda-roupa",
    name: "Guarda-roupa",
    description: "Guarda-roupas embutidos feitos por medida. Maximização do espaço com design funcional e acabamentos de qualidade.",
    shortDescription: "Guarda-roupas embutidos e personalizados",
    icon: "DoorClosed",
    image: guardaRoupaImg,
  },
  {
    id: "garrafeira",
    name: "Garrafeira",
    description: "Projecto e construção de garrafeiras personalizadas. Soluções elegantes para armazenar e exibir a sua colecção de vinhos.",
    shortDescription: "Espaços elegantes para a sua colecção",
    icon: "Wine",
    image: garrafeiraImg,
  },
  {
    id: "papel-vinilico",
    name: "Papel Vinílico",
    description: "Aplicação de papel vinílico resistente à humidade. Ideal para cozinhas, casas de banho e áreas de grande circulação.",
    shortDescription: "Resistente à humidade e fácil manutenção",
    icon: "Layers",
    image: papelVinilicoImg,
  },
  {
    id: "placas-3d",
    name: "Placas 3D",
    description: "Instalação de placas 3D decorativas. Texturas modernas que criam efeitos visuais únicos em paredes de destaque.",
    shortDescription: "Texturas modernas para paredes de destaque",
    icon: "Box",
    image: placas3dImg,
  },
  {
    id: "divisorias",
    name: "Divisórias",
    description: "Divisórias interiores em diversos materiais. Soluções práticas para reorganizar espaços sem obras estruturais.",
    shortDescription: "Reorganize espaços de forma prática",
    icon: "SeparatorHorizontal",
    image: divisoriasImg,
  },
  {
    id: "estantes",
    name: "Estantes",
    description: "Estantes personalizadas para sala, escritório ou quarto. Design funcional adaptado às suas necessidades de arrumação.",
    shortDescription: "Soluções de arrumação personalizadas",
    icon: "BookOpen",
    image: estantesImg,
  },
  {
    id: "sapateiras",
    name: "Sapateiras",
    description: "Sapateiras embutidas e organizadores de calçado. Maximize o espaço do seu hall ou quarto com soluções inteligentes.",
    shortDescription: "Organização inteligente de calçado",
    icon: "Footprints",
    image: sapateirasImg,
  },
  {
    id: "pedras-naturais",
    name: "Pedras Naturais",
    description: "Revestimento com pedras naturais decorativas. Texturas autênticas que trazem elegância e sofisticação ao seu espaço.",
    shortDescription: "Elegância natural para interiores",
    icon: "Mountain",
    image: pedrasNaturaisImg,
  },
  {
    id: "espelho-parede",
    name: "Espelho de Parede",
    description: "Instalação de espelhos decorativos e funcionais. Ampliam visualmente os espaços e adicionam luminosidade.",
    shortDescription: "Amplie espaços com estilo",
    icon: "RectangleHorizontal",
    image: espelhoParedeImg,
  },
  {
    id: "sanitas-lavatorios",
    name: "Sanitas & Lavatórios",
    description: "Instalação e substituição de sanitas e lavatórios. Equipamentos modernos com instalação profissional garantida.",
    shortDescription: "Instalação profissional de equipamentos",
    icon: "Droplets",
    image: sanitasLavatoriosImg,
  },
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};
