"use client";

import { useEffect, useRef, useState } from "react";

type InViewVideoProps = {
  src: string;
  alt: string;
};

/**
 * Muted looping video that only loads once it nears the viewport and only plays
 * while it is on screen. Pages with many clips would otherwise decode them all
 * at once, which phones can't keep up with.
 */
export function InViewVideo({ src, alt }: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          setShouldLoad(true);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) {
      return;
    }

    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldLoad, inView]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      aria-label={alt}
      loop
      muted
      playsInline
      preload="none"
    />
  );
}
