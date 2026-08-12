import { Callout } from "@/components/Callout/Callout";
import { ContentTable } from "@/components/ContentTable/ContentTable";
import { InvestigationSteps } from "@/components/conversation-insights/InvestigationSteps/InvestigationSteps";
import { ListItem } from "@/components/ListItem/ListItem";
import { ProjectBanner } from "@/components/ProjectBanner/ProjectBanner";
import { ProjectHeader } from "@/components/ProjectHeader/ProjectHeader";
import { ProjectSection } from "@/components/ProjectSection/ProjectSection";
import { ProjectSidebar } from "@/components/ProjectSidebar/ProjectSidebar";
import { RichText } from "@/components/RichText/RichText";
import { ViewportEdgeBlur } from "@/components/ViewportEdgeBlur/ViewportEdgeBlur";
import type {
  ExpandableItemContent,
  ProjectMedia,
  ProjectPageData,
} from "@/data/projects/types";
import "./ProjectPage.css";

type ProjectPageProps = {
  project: ProjectPageData;
};

function getItemMedia(item: ExpandableItemContent): ProjectMedia[] {
  if (item.media?.length) {
    return item.media;
  }

  if (item.imageSrc) {
    return [{ src: item.imageSrc, alt: item.imageAlt ?? "" }];
  }

  return [];
}

function ExpandableItemMedia({
  item,
  backgroundSrc,
}: {
  item: ExpandableItemContent;
  backgroundSrc?: string;
}) {
  const media = getItemMedia(item);

  if (!media.length) {
    return null;
  }

  return (
    <>
      {media.map((entry) => (
        <ProjectBanner
          key={entry.src}
          src={entry.src}
          alt={entry.alt}
          type={entry.type}
          backgroundSrc={backgroundSrc}
        />
      ))}
    </>
  );
}

function ExpandableItemBody({
  item,
  backgroundSrc,
}: {
  item: ExpandableItemContent;
  backgroundSrc?: string;
}) {
  return (
    <>
      {item.content ? <RichText content={item.content} /> : null}
      {item.steps?.length ? (
        <InvestigationSteps steps={item.steps} />
      ) : (
        <ExpandableItemMedia item={item} backgroundSrc={backgroundSrc} />
      )}
    </>
  );
}

function hasExpandableItemBody(item: ExpandableItemContent) {
  return Boolean(
    item.content || item.steps?.length || getItemMedia(item).length,
  );
}

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <div className="project-page">
      <ViewportEdgeBlur />
      <ProjectSidebar items={project.nav ?? []} />
      <main className="project-body">
        <div className="project-intro">
          <ProjectHeader
            title={project.title}
            subtitle={project.subtitle}
            showMobileBack
          />
          <ProjectBanner
            src={project.bannerSrc}
            alt={project.bannerAlt}
            type={project.bannerType}
            backgroundSrc={project.bannerBackgroundSrc}
            showBackground={project.bannerType !== "video"}
          />
        </div>

        {project.overview ? (
          <ProjectSection
            id="overview"
            eyebrow={project.overview.eyebrow}
            heading={project.overview.heading}
          >
            <div className="project-section-body">
              {project.overview.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.product ? (
          <ProjectSection
            id="architecture-agent"
            eyebrow={project.product.eyebrow}
            heading={project.product.heading}
          >
            <div className="project-section-body">
              {project.product.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {project.product.imageSrc ? (
              <div className="project-section-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.product.imageSrc}
                  alt={project.product.imageAlt ?? ""}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
          </ProjectSection>
        ) : null}

        {project.problem ? (
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
            {project.problem.items?.length ? (
              <div className="project-section-list">
                {project.problem.items.map((item) => (
                  <ListItem key={item.id} title={item.title} icon={item.icon}>
                    {hasExpandableItemBody(item) ? (
                      <ExpandableItemBody
                        item={item}
                        backgroundSrc={project.bannerBackgroundSrc}
                      />
                    ) : null}
                  </ListItem>
                ))}
              </div>
            ) : null}
            {project.problem.imageSrc ? (
              <div className="project-section-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.problem.imageSrc}
                  alt={project.problem.imageAlt ?? ""}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
          </ProjectSection>
        ) : null}

        {project.studyDesign ? (
          <ProjectSection
            id="study-design"
            eyebrow={project.studyDesign.eyebrow}
            heading={project.studyDesign.heading}
          >
            <div className="project-section-body">
              {project.studyDesign.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {project.studyDesign.table ? (
              <ContentTable table={project.studyDesign.table} />
            ) : null}
            {project.studyDesign.imageSrc ? (
              <div className="project-section-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.studyDesign.imageSrc}
                  alt={project.studyDesign.imageAlt ?? ""}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
          </ProjectSection>
        ) : null}

        {project.findings?.map((finding) => (
          <ProjectSection
            key={finding.id}
            id={finding.id}
            eyebrow={finding.eyebrow}
            heading={finding.heading}
          >
            <div className="project-section-body">
              {finding.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="project-section-list">
              {finding.items.map((item) => (
                <ListItem key={item.id} title={item.title} icon={item.icon}>
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody
                      item={item}
                      backgroundSrc={project.bannerBackgroundSrc}
                    />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ))}

        {project.calloutOne ? <Callout>{project.calloutOne}</Callout> : null}

        {project.discovery ? (
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
                <ListItem
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody
                      item={item}
                      backgroundSrc={project.bannerBackgroundSrc}
                    />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.calloutTwo ? <Callout>{project.calloutTwo}</Callout> : null}

        {project.constraints ? (
          <ProjectSection
            id="constraints"
            eyebrow={project.constraints.eyebrow}
            heading={project.constraints.heading}
          >
            <div className="project-section-body">
              {project.constraints.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.earlyDesigns ? (
          <ProjectSection
            id="early-designs"
            eyebrow={project.earlyDesigns.eyebrow}
            heading={project.earlyDesigns.heading}
          >
            <div className="project-section-body">
              {project.earlyDesigns.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="project-section-list">
              {project.earlyDesigns.items.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody
                      item={item}
                      backgroundSrc={project.bannerBackgroundSrc}
                    />
                  ) : null}
                </ListItem>
              ))}
            </div>
            <div className="project-section-body">
              {project.earlyDesigns.closingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.learnings ? (
          <ProjectSection
            id="learnings"
            eyebrow={project.learnings.eyebrow}
            heading={project.learnings.heading}
          >
            <div className="project-section-body">
              {project.learnings.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="project-section-list">
              {project.learnings.items.map((item) => (
                <ListItem key={item.id} title={item.title} icon={item.icon}>
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody
                      item={item}
                      backgroundSrc={project.bannerBackgroundSrc}
                    />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.solutions ? (
          <ProjectSection
            id="solutions"
            eyebrow={project.solutions.eyebrow}
            heading={project.solutions.heading}
          >
            <div className="project-section-body">
              {project.solutions.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="project-section-list">
              {project.solutions.items.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody
                      item={item}
                      backgroundSrc={project.bannerBackgroundSrc}
                    />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.outcome ? (
          <ProjectSection
            id="outcome"
            eyebrow={project.outcome.eyebrow}
            heading={project.outcome.heading}
          >
            <div className="project-section-body">
              {project.outcome.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="project-section-list">
              {project.outcome.items.map((item) => (
                <ListItem key={item.id} title={item.title} icon={item.icon}>
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody
                      item={item}
                      backgroundSrc={project.bannerBackgroundSrc}
                    />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ) : null}
      </main>
    </div>
  );
}
