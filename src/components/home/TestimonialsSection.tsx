import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const testimonials = [
  {
    id: 1,
    name: "Esperança Luzolo",
    role: "Empresária, Mbanza Kongo",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    text: "A NZINGA'RTE fez a renovação completa da minha loja. O trabalho de pladur e pintura ficou impecável. Profissionalismo do mais alto nível!",
    rating: 5,
  },
  {
    id: 2,
    name: "João Mavungo",
    role: "Engenheiro Civil, Soyo",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    text: "Como profissional da construção, exijo qualidade. O Samuel e a sua equipa superaram as minhas expectativas no projecto do meu escritório.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Kialungila",
    role: "Médica, M'banza Kongo",
    image: "https://images.unsplash.com/photo-1589156280159-27a852cc6e1d?w=150&h=150&fit=crop&crop=face",
    text: "Transformaram a minha casa num espaço moderno e acolhedor. O tecto falso com iluminação LED ficou espetacular. Recomendo a todos!",
    rating: 5,
  },
  {
    id: 4,
    name: "Pedro Nkanga",
    role: "Comerciante, Nzeto",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face",
    text: "Excelente trabalho na cozinha americana e nos guarda-roupas. Material de qualidade e equipa muito profissional. Preço justo!",
    rating: 5,
  },
  {
    id: 5,
    name: "Teresa Mbumba",
    role: "Professora, Mbanza Kongo",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    text: "O papel de parede e as placas 3D deram vida nova à minha sala. Trabalho limpo, rápido e com muito bom gosto. Obrigada NZINGA'RTE!",
    rating: 5,
  },
];

const stats = [
  { value: 150, label: "Projectos Concluídos", suffix: "+" },
  { value: 98, label: "Clientes Satisfeitos", suffix: "%" },
  { value: 8, label: "Anos de Experiência", suffix: "+" },
  { value: 50, label: "Serviços Disponíveis", suffix: "+" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const duration = 2000;
            const steps = 60;
            const stepValue = value / steps;
            let current = 0;
            
            const timer = setInterval(() => {
              current += stepValue;
              if (current >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`counter-${value}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span id={`counter-${value}`} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-secondary/30">
      {/* Stats */}
      <div className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <AnimatedSection key={index} animation="scale-in" delay={index * 100}>
              <div className="text-center p-6 rounded-2xl bg-background shadow-elegant">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-in-up" className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testemunhos</span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mt-2">
            O Que Dizem os Nossos Clientes
          </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-background rounded-3xl shadow-elegant p-8 lg:p-12">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
            
            <div className="flex flex-col items-center text-center">
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-20 h-20 rounded-full object-cover mb-6 ring-4 ring-primary/20"
              />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-lg lg:text-xl text-foreground leading-relaxed mb-6 max-w-2xl">
                "{currentTestimonial.text}"
              </p>

              <div>
                <h4 className="font-semibold text-foreground">{currentTestimonial.name}</h4>
                <p className="text-muted-foreground text-sm">{currentTestimonial.role}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-6 bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Ir para testemunho ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
