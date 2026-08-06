import { Callout } from "@/components/Callout/Callout";
import { ListItem } from "@/components/ListItem/ListItem";
import { ProjectBanner } from "@/components/ProjectBanner/ProjectBanner";
import { ProjectHeader } from "@/components/ProjectHeader/ProjectHeader";
import { ProjectSection } from "@/components/ProjectSection/ProjectSection";
import { ProjectSidebar } from "@/components/ProjectSidebar/ProjectSidebar";
import { RichText } from "@/components/RichText/RichText";
import type { ProjectPageData } from "@/data/projects/types";
import "./ProjectPage.css";

type ProjectPageProps = {
  project: ProjectPageData;
};

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <div className="project-page">
      <ProjectSidebar items={project.nav} />
      <main className="project-body">
        <ProjectHeader title={project.title} subtitle={project.subtitle} />
        <ProjectBanner src={project.bannerSrc} alt={project.bannerAlt} />

        <ProjectSection
          id="overview"
          heading={project.overview.heading}
          gap="overview"
        >
          <div className="project-section-body">
            {project.overview.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </ProjectSection>

        <ProjectSection
          id="problem"
          eyebrow={project.problem.eyebrow}
          heading={project.problem.heading}
        >
          <div className="project-section-body">
            {project.problem.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="project-section-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.problem.imageSrc}
              alt={project.problem.imageAlt}
            />
          </div>
        </ProjectSection>

        <Callout>{project.calloutOne}</Callout>

        <ProjectSection
          id="discovery"
          eyebrow={project.discovery.eyebrow}
          heading={project.discovery.heading}
        >
          <div className="project-section-body">
            {project.discovery.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="project-section-list">
            {project.discovery.items.map((item) => (
              <ListItem key={item.id} title={item.title} icon={item.icon}>
                {item.content || item.imageSrc ? (
                  <>
                    {item.content ? <RichText content={item.content} /> : null}
                    {item.imageSrc ? (
                      <div className="list-item-media">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt ?? ""}
                        />
                      </div>
                    ) : null}
                  </>
                ) : null}
              </ListItem>
            ))}
          </div>
        </ProjectSection>

        <Callout>{project.calloutTwo}</Callout>
      </main>
    </div>
  );
}
