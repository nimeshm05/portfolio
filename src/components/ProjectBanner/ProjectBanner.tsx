import type { CSSProperties } from "react";
import "./ProjectBanner.css";

type ProjectBannerProps = {
  src: string;
  alt: string;
  type?: "image" | "video";
  backgroundSrc?: string;
  /** When true, banner height follows the media instead of the fixed banner height. */
  hugContent?: boolean;
};

export function ProjectBanner({
  src,
  alt,
  type = "image",
  backgroundSrc,
  hugContent = false,
}: ProjectBannerProps) {
  return (
    <div
      className={`project-banner${hugContent ? " project-banner--hug" : ""}`}
      style={
        backgroundSrc
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
