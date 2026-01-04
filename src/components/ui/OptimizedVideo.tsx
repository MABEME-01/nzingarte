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
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: "200px",
        threshold: 0.15,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (isInView && videoRef.current && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      videoRef.current.load();
    }
  }, [isInView]);

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Always pause when not visible or when autoplay is disabled
    if (!isInView || !autoPlay) {
      video.pause();
      return;
    }

    // Try to keep playback going when visible
    if (isLoaded) {
      video.play().catch(() => {});
    }
  }, [autoPlay, isInView, isLoaded]);

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
          preload={autoPlay ? "auto" : "metadata"}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          onCanPlay={handleCanPlay}
          onCanPlayThrough={handleCanPlay}
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
