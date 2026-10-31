"use client";

import { useEffect, useRef, useState } from "react";
import { BannerVideoPlaceholder } from "./BannerVideoPlaceholder";

/** Most banner videos are exported at this size */
const DEFAULT_ASPECT_RATIO = "3292 / 2160";

type LazyBannerVideoProps = {
  src: string;
  alt: string;
  /** Load and play as soon as the element mounts (e.g. page hero). */
  eager?: boolean;
  /** Reserves the video's box before it loads, e.g. "3840 / 1242" */
  aspectRatio?: string;
};

export function LazyBannerVideo({
  src,
  alt,
  eager = false,
  aspectRatio = DEFAULT_ASPECT_RATIO,
}: LazyBannerVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);
  const [inView, setInView] = useState(eager);
  const [isReady, setIsReady] = useState(false);
  const [intrinsicRatio, setIntrinsicRatio] = useState<string | null>(null);

  // Keep watching after the first load: phones can only decode a few videos at
  // once, so banners scrolled off-screen pause instead of playing on unseen.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
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

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    // A cached video can be ready before React attaches its listeners
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setIsReady(true);
    }

    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldLoad, inView]);

  return (
    <div
      ref={containerRef}
      className={`project-banner-video-wrap${isReady ? " is-ready" : ""}${inView ? "" : " is-offscreen"}`}
      style={{ aspectRatio: intrinsicRatio ?? aspectRatio }}
    >
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        onLoadedMetadata={(event) => {
          const { videoWidth, videoHeight } = event.currentTarget;
          if (videoWidth && videoHeight) {
            setIntrinsicRatio(`${videoWidth} / ${videoHeight}`);
          }
        }}
        onLoadedData={() => setIsReady(true)}
      />
      <BannerVideoPlaceholder isActive={!isReady && inView} />
    </div>
  );
}
