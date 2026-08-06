import "./ProjectBanner.css";

type ProjectBannerProps = {
  src: string;
  alt: string;
};

export function ProjectBanner({ src, alt }: ProjectBannerProps) {
  return (
    <div className="project-banner">
      <div className="project-banner-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}
