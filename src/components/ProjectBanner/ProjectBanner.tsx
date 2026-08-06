import "./ProjectBanner.css";

type ProjectBannerProps = {
  src: string;
  alt: string;
  type?: "image" | "video";
};

export function ProjectBanner({
  src,
  alt,
  type = "image",
}: ProjectBannerProps) {
  return (
    <div className="project-banner">
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
