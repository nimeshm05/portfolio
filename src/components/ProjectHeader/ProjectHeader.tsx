import { LinkCue } from "@/components/LinkCue/LinkCue";
import "./ProjectHeader.css";

type ProjectHeaderProps = {
  title: string;
  subtitle: string;
  liveHref?: string;
};

export function ProjectHeader({
  title,
  subtitle,
  liveHref,
}: ProjectHeaderProps) {
  return (
    <header className="project-header">
      <div className="project-header-content">
        <div className="project-header-info">
          <h1 className="project-header-title">{title}</h1>
          <p className="project-header-subtitle">{subtitle}</p>
          {liveHref ? (
            <LinkCue
              label="View Live"
              icon="arrow-right"
              href={liveHref}
              tone="accent"
            />
          ) : null}
        </div>
        <span className="callout-rule" aria-hidden="true"></span>
      </div>
    </header>
  );
}
