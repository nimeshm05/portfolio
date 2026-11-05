"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BannerVideoPlaceholder } from "./BannerVideoPlaceholder";
import {
  isVideoFocused,
  subscribeVideoFocus,
  trackVideoFocus,
} from "./videoFocus";

/** Most banner videos are exported at this size */
const DEFAULT_ASPECT_RATIO = "3292 / 2160";

/**
 * Screens that can actually show more than a ~2K-wide video: wide windows on
 * Retina displays, where banners and cards span 2,000+ device pixels.
 * Everywhere else the 2K file looks the same and is far cheaper to decode.
 */
const LARGE_VIDEO_MEDIA = "(min-width: 1600px) and (min-resolution: 2dppx)";

// The choice is made once per page load: switching files on resize would
// restart the video, and the smaller file already looks right at any size.
function subscribeLargeScreen() {
  return () => {};
}

function getLargeScreen() {
  return window.matchMedia(LARGE_VIDEO_MEDIA).matches;
}

function getLargeScreenOnServer() {
  return null;
}

type LazyBannerVideoProps = {
  src: string;
  /** Higher-resolution file for large Retina screens (see LARGE_VIDEO_MEDIA). */
  largeSrc?: string;
  alt: string;
  /** Load and play as soon as the element mounts (e.g. page hero). */
  eager?: boolean;
  /** Reserves the video's box before it loads, e.g. "3840 / 1242" */
  aspectRatio?: string;
};

export function LazyBannerVideo({
  src,
  largeSrc,
  alt,
  eager = false,
  aspectRatio = DEFAULT_ASPECT_RATIO,
}: LazyBannerVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);
  const [inView, setInView] = useState(eager);
  const [isFocused, setIsFocused] = useState(eager);
  const [isReady, setIsReady] = useState(false);
  const [intrinsicRatio, setIntrinsicRatio] = useState<string | null>(null);
  // With a large variant the file is picked once the screen size is known.
  // The server (and hydration) sees null, so nothing loads until then and a
  // large screen never downloads the smaller file first.
  const isLargeScreen = useSyncExternalStore(
    subscribeLargeScreen,
    getLargeScreen,
    getLargeScreenOnServer,
  );
  const resolvedSrc = !largeSrc
    ? src
    : isLargeScreen === null
      ? null
      : isLargeScreen
        ? largeSrc
        : src;

  // Load a little ahead of the viewport, and keep watching after the first
  // load so banners scrolled away are known to be off-screen.
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

  // Only the most-visible banner video on the page plays.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const update = () => setIsFocused(isVideoFocused(container));
    const unsubscribe = subscribeVideoFocus(update);
    const untrack = trackVideoFocus(container);
    update();

    return () => {
      unsubscribe();
      untrack();
    };
  }, []);

  const shouldPlay = inView && isFocused;

  useEffect(() => {
    if (!shouldLoad || !resolvedSrc) {
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

    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldLoad, resolvedSrc, shouldPlay]);

  return (
    <div
      ref={containerRef}
      className={`project-banner-video-wrap${isReady ? " is-ready" : ""}${inView ? "" : " is-offscreen"}`}
      style={{ aspectRatio: intrinsicRatio ?? aspectRatio }}
    >
      <video
        ref={videoRef}
        src={shouldLoad && resolvedSrc ? resolvedSrc : undefined}
        aria-label={alt}
        // Playback is driven by the effect above, so a video that isn't the
        // focused one doesn't start on its own when it loads.
        autoPlay={shouldPlay}
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
