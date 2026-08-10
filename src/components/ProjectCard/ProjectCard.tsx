import { ProjectBanner } from "@/components/ProjectBanner/ProjectBanner";
import type { ProjectCardData } from "@/data/projects";
import "./ProjectCard.css";

type ProjectCardProps = {
  project: ProjectCardData;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");

  return (
    <a
      className="project-card"
      href={project.href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <div className="project-card-header">
        <span className="project-card-title">{project.title}</span>
        <span className="project-card-type">{project.projectType}</span>
      </div>
      <ProjectBanner
        src={project.bannerSrc}
        alt={project.bannerAlt}
        type={project.bannerType}
        variant="card"
      />
      <div className="project-card-footer">
        <p className="project-card-timeline">{project.timeline}</p>
        <p className="project-card-description">{project.description}</p>
      </div>
    </a>
  );
}
