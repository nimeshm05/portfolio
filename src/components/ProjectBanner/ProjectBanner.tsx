import { LazyBannerVideo } from "./LazyBannerVideo";
import "./ProjectBanner.css";

type ProjectBannerProps = {
  src: string;
  alt: string;
  type?: "image" | "video";
  showBackground?: boolean;
  variant?: "page" | "card";
};

export function ProjectBanner({
  src,
  alt,
  type = "image",
  showBackground = true,
  variant = "page",
}: ProjectBannerProps) {
  const isCard = variant === "card";
  const shouldShowBackground = !isCard && type !== "video" && showBackground;
  const isHeroMedia = variant === "page";
  const imageLoading = isHeroMedia ? "eager" : "lazy";

  return (
    <div
      className={`project-banner${
        isCard ? " project-banner--card" : ""
      }${
        shouldShowBackground ? "" : " project-banner--no-background"
      }`}
    >
      <div className="project-banner-media">
        {type === "video" ? (
          <LazyBannerVideo src={src} alt={alt} eager={isHeroMedia} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading={imageLoading} decoding="async" />
        )}
      </div>
    </div>
  );
}
