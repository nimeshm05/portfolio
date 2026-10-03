import { ProjectBanner } from "@/components/ProjectBanner/ProjectBanner";
import Link from "next/link";
import type { ProjectCardData } from "@/data/projects";
import "./ProjectCard.css";

type ProjectCardProps = {
  project: ProjectCardData;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");

  const content = (
    <>
      <ProjectBanner
        src={project.bannerSrc}
        alt={project.bannerAlt}
        type={project.bannerType}
        aspectRatio={project.bannerAspectRatio}
        variant="card"
      />
      <div className="project-card-footer">
        <div className="project-card-copy">
          <span className="project-card-title">{project.title}</span>
          <p className="project-card-description">{project.description}</p>
        </div>
        {project.chips.length ? (
          <ul className="project-card-chips">
            {project.chips.map((chip) => (
              <li key={chip} className="project-card-chip">
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a
        className="project-card"
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className="project-card" href={project.href}>
      {content}
    </Link>
  );
}
