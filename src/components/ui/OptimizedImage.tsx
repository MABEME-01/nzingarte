import { useState, useRef, useEffect, memo, useCallback } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage = memo(({ 
  src, 
  alt, 
  className, 
  containerClassName,
  onClick,
  priority = false,
  sizes,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: "100px",
        threshold: 0.01 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div 
      ref={imgRef} 
      className={cn("relative overflow-hidden bg-muted", containerClassName)}
      onClick={onClick}
    >
      {/* CSS shimmer placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 shimmer-placeholder" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          onLoad={handleLoad}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
