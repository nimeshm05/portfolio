"use client";

import { useEffect, useRef, useState } from "react";

type LazyBannerVideoProps = {
  src: string;
  alt: string;
  /** Load and play as soon as the element mounts (e.g. page hero). */
  eager?: boolean;
};

export function LazyBannerVideo({ src, alt, eager = false }: LazyBannerVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="project-banner-video-wrap">
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      />
    </div>
  );
}
