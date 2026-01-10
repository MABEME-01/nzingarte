import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Play, Film } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number;
}

// Vídeos de demonstração (fallback)
import tectoFalsoVideo from "@/assets/videos/tecto-falso.mp4";
import trabalho1Video from "@/assets/videos/trabalho-1.mp4";
import trabalho2Video from "@/assets/videos/trabalho-2.mp4";
import vasosVideo from "@/assets/videos/vasos-personalizados.mp4";

const defaultVideos: GalleryVideo[] = [
  {
    id: "demo-1",
    title: "Instalação de Tecto Falso",
    description: "Veja o processo de instalação de tecto falso com acabamento profissional.",
    video_url: tectoFalsoVideo,
    thumbnail_url: null,
    display_order: 1,
  },
  {
    id: "demo-2",
    title: "Trabalho de Acabamento",
    description: "Demonstração de técnicas de acabamento em paredes e tectos.",
    video_url: trabalho1Video,
    thumbnail_url: null,
    display_order: 2,
  },
  {
    id: "demo-3",
    title: "Detalhes de Construção",
    description: "Atenção aos detalhes que fazem a diferença nos nossos trabalhos.",
    video_url: trabalho2Video,
    thumbnail_url: null,
    display_order: 3,
  },
  {
    id: "demo-4",
    title: "Vasos Personalizados",
    description: "Criação artesanal de vasos personalizados para decoração.",
    video_url: vasosVideo,
    thumbnail_url: null,
    display_order: 4,
  },
];

const Galeria = () => {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_videos")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setVideos(data);
      } else {
        setVideos(defaultVideos);
      }
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setVideos(defaultVideos);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Film className="h-5 w-5" />
                <span className="text-sm font-medium">Galeria de Vídeos</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Os Nossos <span className="text-primary">Trabalhos</span> em Vídeo
              </h1>
              <p className="text-lg text-muted-foreground">
                Acompanhe o processo e o resultado dos nossos projetos através de vídeos 
                que demonstram a qualidade e dedicação da equipa NZINGA'RTE.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <AnimatedSection key={video.id} animation="fade-in-up" delay={index * 100}>
                  <div
                    className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-muted">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={video.video_url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      )}
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play className="h-8 w-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    </div>
                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
            >
              Fechar ✕
            </button>
            <video
              src={selectedVideo.video_url}
              className="w-full rounded-lg"
              controls
              autoPlay
              playsInline
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedVideo.title}
              </h3>
              {selectedVideo.description && (
                <p className="text-white/70">{selectedVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Galeria;
