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

// Check if connection is slow
const getIsSlowConnection = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
  if (!connection) return false;
  return connection.saveData || connection.effectiveType === "2g" || connection.effectiveType === "slow-2g";
};

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
  const [isBufferReady, setIsBufferReady] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasLoadedRef = useRef(false);
  const isSlowConnection = useRef(getIsSlowConnection());

  // Intersection Observer with higher threshold for sequential loading
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
        rootMargin: "50px", // Smaller margin to reduce concurrent loads
        threshold: 0.3, // 30% visible before loading
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Load video when in view
  useEffect(() => {
    if (isInView && videoRef.current && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      videoRef.current.load();
    }
  }, [isInView]);

  // Handle metadata loaded
  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Wait for sufficient buffer before playing
  const handleCanPlayThrough = useCallback(() => {
    setIsBufferReady(true);
  }, []);

  // Control playback based on visibility and buffer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pause when not visible
    if (!isInView) {
      video.pause();
      return;
    }

    // Skip autoplay on slow connections
    if (isSlowConnection.current && !priority) {
      return;
    }

    // Wait for buffer to be ready before playing
    if (autoPlay && isBufferReady && isInView) {
      video.play().catch(() => {});
    }
  }, [autoPlay, isInView, isBufferReady, priority]);

  return (
    <div 
      ref={containerRef} 
      className={cn("relative overflow-hidden bg-muted", containerClassName)}
    >
      {/* CSS shimmer placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 shimmer-placeholder" />
      )}

      {/* Poster image while loading */}
      {poster && !isLoaded && (
        <img
          src={poster}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Video element - only render when in view */}
      {isInView && (
        <video
          ref={videoRef}
          poster={poster}
          preload={priority ? "auto" : "metadata"}
          autoPlay={false} // We control playback manually
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          onLoadedData={handleLoadedData}
          onCanPlayThrough={handleCanPlayThrough}
          className={cn(
            "transition-opacity duration-300",
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
