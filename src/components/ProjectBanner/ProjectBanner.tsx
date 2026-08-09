import type { CSSProperties } from "react";
import "./ProjectBanner.css";

type ProjectBannerProps = {
  src: string;
  alt: string;
  type?: "image" | "video";
  backgroundSrc?: string;
  showBackground?: boolean;
  variant?: "page" | "card";
  /** When true, banner height follows the media instead of the fixed banner height. */
  hugContent?: boolean;
};

export function ProjectBanner({
  src,
  alt,
  type = "image",
  backgroundSrc,
  showBackground = true,
  variant = "page",
  hugContent = false,
}: ProjectBannerProps) {
  const isCard = variant === "card";
  const shouldShowBackground = isCard ? false : showBackground;

  return (
    <div
      className={`project-banner${
        isCard ? " project-banner--card" : ""
      }${hugContent ? " project-banner--hug" : ""}${
        shouldShowBackground ? "" : " project-banner--no-background"
      }`}
      style={
        shouldShowBackground && backgroundSrc
          ? ({ "--project-banner-bg": `url(${backgroundSrc})` } as CSSProperties)
          : undefined
      }
    >
      <div className="project-banner-media">
        {type === "video" ? (
          <video
            src={src}
            aria-label={alt}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} />
        )}
      </div>
    </div>
  );
}
