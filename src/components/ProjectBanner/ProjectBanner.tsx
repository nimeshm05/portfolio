import { ExpandableMedia } from "@/components/ExpandableMedia/ExpandableMedia";
import { LazyBannerVideo } from "./LazyBannerVideo";
import "./ProjectBanner.css";

type ProjectBannerProps = {
  src: string;
  /** Higher-resolution video for large Retina screens */
  largeSrc?: string;
  alt: string;
  type?: "image" | "video";
  /** Video width / height; see LazyBannerVideo */
  aspectRatio?: string;
  showBackground?: boolean;
  variant?: "page" | "card";
};

export function ProjectBanner({
  src,
  largeSrc,
  alt,
  type = "image",
  aspectRatio,
  showBackground = true,
  variant = "page",
}: ProjectBannerProps) {
  const isCard = variant === "card";
  const shouldShowBackground = !isCard && type !== "video" && showBackground;
  const isHeroMedia = variant === "page";
  const imageLoading = isHeroMedia ? "eager" : "lazy";

  const media =
    type === "video" ? (
      <LazyBannerVideo
        src={src}
        largeSrc={largeSrc}
        alt={alt}
        eager={isHeroMedia}
        aspectRatio={aspectRatio}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading={imageLoading} decoding="async" />
    );

  return (
    <div
      className={`project-banner${
        isCard ? " project-banner--card" : ""
      }${
        shouldShowBackground ? "" : " project-banner--no-background"
      }`}
    >
      <div className="project-banner-media">
        {isCard ? media : <ExpandableMedia label={alt}>{media}</ExpandableMedia>}
      </div>
    </div>
  );
}
