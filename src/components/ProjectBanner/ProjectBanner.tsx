import type { CSSProperties } from "react";
import "./ProjectBanner.css";

type ProjectBannerProps = {
  src: string;
  alt: string;
  type?: "image" | "video";
  backgroundSrc?: string;
};

export function ProjectBanner({
  src,
  alt,
  type = "image",
  backgroundSrc,
}: ProjectBannerProps) {
  return (
    <div
      className="project-banner"
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
