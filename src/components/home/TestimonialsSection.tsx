import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Cliente Residencial",
    image: "https://i.pravatar.cc/150?img=1",
    text: "A equipa da NZINGA'RTE transformou completamente a minha sala. O trabalho com pladur e o tecto falso ficaram perfeitos. Recomendo vivamente!",
    rating: 5,
  },
  {
    id: 2,
    name: "João Pereira",
    role: "Empresário",
    image: "https://i.pravatar.cc/150?img=3",
    text: "Profissionalismo exemplar na renovação do meu escritório. Cumpriram prazos e o resultado superou as expectativas. Excelente custo-benefício.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Costa",
    role: "Arquitecta",
    image: "https://i.pravatar.cc/150?img=5",
    text: "Como arquitecta, sou muito exigente. A NZINGA'RTE conseguiu executar os meus projectos com precisão e atenção aos detalhes. Parceria de sucesso!",
    rating: 5,
  },
  {
    id: 4,
    name: "Carlos Silva",
    role: "Cliente Residencial",
    image: "https://i.pravatar.cc/150?img=8",
    text: "A cozinha americana que fizeram é espetacular! Trabalho limpo, rápido e com materiais de qualidade. Muito satisfeito com o resultado final.",
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
