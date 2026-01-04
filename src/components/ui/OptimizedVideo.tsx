import { useState, useRef, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface OptimizedVideoProps {
  src: string;
  srcWebm?: string;
  poster?: string;
  posterColor?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  showPlayIcon?: boolean;
}

const OptimizedVideo = memo(({ 
  src, 
  srcWebm,
  poster,
  posterColor = "hsl(var(--muted))",
  alt = "Video",
  className, 
  containerClassName,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  showPlayIcon = false,
}: OptimizedVideoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.load();
    }
  }, [isInView]);

  const handleCanPlay = () => {
    setIsLoaded(true);
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={cn("relative overflow-hidden", containerClassName)}
      style={{ backgroundColor: posterColor }}
    >
      {/* Poster image while loading */}
      {poster && !isLoaded && (
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video element */}
      {isInView && (
        <video
          ref={videoRef}
          poster={poster}
          preload="metadata"
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          onCanPlay={handleCanPlay}
          className={cn(
            "transition-opacity duration-200",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Play icon overlay */}
      {showPlayIcon && isLoaded && (
        <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full pointer-events-none">
          <Play className="h-4 w-4" />
        </div>
      )}
    </div>
  );
});

OptimizedVideo.displayName = "OptimizedVideo";

export default OptimizedVideo;
