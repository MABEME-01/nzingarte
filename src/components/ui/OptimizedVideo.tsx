import { useState, useRef, useEffect, memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface OptimizedVideoProps {
  src: string;
  srcWebm?: string;
  poster?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  showPlayIcon?: boolean;
  priority?: boolean;
}

const OptimizedVideo = memo(({ 
  src, 
  srcWebm,
  poster,
  alt = "Video",
  className, 
  containerClassName,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  showPlayIcon = false,
  priority = false,
}: OptimizedVideoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Intersection Observer - detect visibility
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Play/pause based on visibility - instant playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView && autoPlay) {
      // Play immediately when visible
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, autoPlay]);

  // Handle loaded
  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn("relative overflow-hidden bg-muted", containerClassName)}
    >
      {/* CSS shimmer placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 shimmer-placeholder" />
      )}

      {/* Video element - always rendered for instant playback */}
      <video
        ref={videoRef}
        poster={poster}
        preload="auto"
        autoPlay={autoPlay && isInView}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onLoadedData={handleLoadedData}
        className={cn(
          "transition-opacity duration-200",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
      >
        {srcWebm && <source src={srcWebm} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>

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