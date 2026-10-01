import { ArchitectureWorkflow } from "@/components/ArchitectureWorkflow/ArchitectureWorkflow";
import { Callout } from "@/components/Callout/Callout";
import { ContentTable } from "@/components/ContentTable/ContentTable";
import { DataAttributeCards } from "@/components/DataAttributeCards/DataAttributeCards";
import { ListItem } from "@/components/ListItem/ListItem";
import {
  PageEnter,
  PageEnterItem,
  PageEnterItems,
} from "@/components/PageEnter/PageEnter";
import { ProjectBanner } from "@/components/ProjectBanner/ProjectBanner";
import { ProjectHeader } from "@/components/ProjectHeader/ProjectHeader";
import { ProjectMeta } from "@/components/ProjectMeta/ProjectMeta";
import { ProjectSection } from "@/components/ProjectSection/ProjectSection";
import { ProjectSidebar } from "@/components/ProjectSidebar/ProjectSidebar";
import { RichText } from "@/components/RichText/RichText";
import { SourceCards } from "@/components/SourceCards/SourceCards";
import { ViewportEdgeBlur } from "@/components/ViewportEdgeBlur/ViewportEdgeBlur";
import { WorkflowSteps } from "@/components/WorkflowSteps/WorkflowSteps";
import type {
  ExpandableItemContent,
  ExpandableVisual,
  ProjectMedia,
  ProjectPageData,
} from "@/data/projects/types";
import "./ProjectPage.css";

type ProjectPageProps = {
  project: ProjectPageData;
};

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "ogg", "m4v"]);

function getMediaExtension(src: string): string {
  const path = src.split("?")[0] ?? src;
  const segment = path.split("/").pop() ?? "";
  const dot = segment.lastIndexOf(".");
  return dot >= 0 ? segment.slice(dot + 1).toLowerCase() : "";
}

function resolveSectionMediaType(
  src: string,
  imageType?: "image" | "video",
): "image" | "video" {
  if (imageType) {
    return imageType;
  }

  return VIDEO_EXTENSIONS.has(getMediaExtension(src)) ? "video" : "image";
}

function sectionMediaClassName(contained?: boolean) {
  return contained
    ? "project-section-media project-section-media--contained"
    : "project-section-media";
}

function SectionMedia({
  src,
  alt,
  imageType,
  framed = true,
  contained = false,
}: {
  src: string;
  alt: string;
  imageType?: "image" | "video";
  framed?: boolean;
  contained?: boolean;
}) {
  const type = resolveSectionMediaType(src, imageType);
  const media =
    type === "video" ? (
      <video src={src} aria-label={alt} autoPlay loop muted playsInline />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    );

  return (
    <div className={sectionMediaClassName(contained)}>
      {framed ? <div className="project-section-media-frame">{media}</div> : media}
    </div>
  );
}

function getItemMedia(item: ExpandableItemContent): ProjectMedia[] {
  if (item.media?.length) {
    return item.media;
  }

  if (item.imageSrc) {
    return [{ src: item.imageSrc, alt: item.imageAlt ?? "" }];
  }

  return [];
}

function ExpandableItemMedia({ item }: { item: ExpandableItemContent }) {
  const media = getItemMedia(item);

  if (!media.length) {
    return null;
  }

  return (
    <>
      {media.map((entry) =>
        entry.frame === "section" ? (
          <SectionMedia
            key={entry.src}
            src={entry.src}
            alt={entry.alt}
            imageType={entry.type}
            framed={entry.framed}
            contained={entry.contained}
          />
        ) : (
          <ProjectBanner
            key={entry.src}
            src={entry.src}
            alt={entry.alt}
            type={entry.type}
            showBackground={entry.showBackground}
          />
        ),
      )}
    </>
  );
}

function ExpandableItemVisual({ visual }: { visual: ExpandableVisual }) {
  switch (visual.type) {
    case "source-cards":
      return <SourceCards cards={visual.cards} />;
    case "data-attribute-cards":
      return <DataAttributeCards cards={visual.cards} />;
    case "workflow-steps":
      return <WorkflowSteps steps={visual.steps} />;
  }
}

function ExpandableItemBody({ item }: { item: ExpandableItemContent }) {
  const hasCopy = Boolean(item.content || item.quotes?.length);

  return (
    <>
      {hasCopy ? (
        <div className="expandable-item-copy">
          {item.content ? <RichText content={item.content} /> : null}
          {item.quotes?.map((quote) => (
            <Callout
              key={quote.text}
              attribution={quote.attribution}
              source={quote.source}
            >
              {quote.text}
            </Callout>
          ))}
        </div>
      ) : null}
      {item.visual ? <ExpandableItemVisual visual={item.visual} /> : null}
      <ExpandableItemMedia item={item} />
    </>
  );
}

function hasExpandableItemBody(item: ExpandableItemContent) {
  return Boolean(
    item.content ||
      item.quotes?.length ||
      item.visual ||
      getItemMedia(item).length,
  );
}

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <div className="project-page">
      <ViewportEdgeBlur />
      <ProjectSidebar items={project.nav ?? []} />
      <PageEnter as="main" className="project-body">
        <div className="project-intro">
          <ProjectHeader
            title={project.title}
            subtitle={project.subtitle}
            liveHref={project.liveHref}
          />
          <PageEnterItem>
            <ProjectBanner
              src={project.bannerSrc}
              alt={project.bannerAlt}
              type={project.bannerType}
              showBackground={project.bannerType !== "video"}
            />
          </PageEnterItem>
          {project.meta?.items?.length ? (
            <ProjectMeta items={project.meta.items} />
          ) : null}
        </div>
        <PageEnterItems>

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
            {project.product.workflow ? (
              <div className={sectionMediaClassName(project.product.imageContained)}>
                <ArchitectureWorkflow steps={project.product.workflow.steps} />
              </div>
            ) : project.product.imageSrc ? (
              <SectionMedia
                src={project.product.imageSrc}
                alt={project.product.imageAlt ?? ""}
                imageType={project.product.imageType}
                contained={project.product.imageContained}
              />
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
              {project.problem.list?.length ? (
                <RichText
                  content={{
                    type: "paragraphs-with-list",
                    intro: [],
                    items: project.problem.list,
                  }}
                />
              ) : null}
            </div>
            {project.problem.items?.length ? (
              <div className="project-section-list">
                {project.problem.items.map((item) => (
                  <ListItem
                    key={item.id}
                    title={item.title}
                    defaultOpen={true}
                    alwaysExpanded={project.listItemsAlwaysExpanded}
                  >
                    {hasExpandableItemBody(item) ? (
                      <ExpandableItemBody item={item} />
                    ) : null}
                  </ListItem>
                ))}
              </div>
            ) : null}
            {project.problem.imageSrc ? (
              <SectionMedia
                src={project.problem.imageSrc}
                alt={project.problem.imageAlt ?? ""}
                imageType={project.problem.imageType}
                contained={project.problem.imageContained}
              />
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
              <SectionMedia
                src={project.studyDesign.imageSrc}
                alt={project.studyDesign.imageAlt ?? ""}
                imageType={project.studyDesign.imageType}
                contained={project.studyDesign.imageContained}
              />
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
            {finding.media?.map((entry) => (
              <ProjectBanner
                key={entry.src}
                src={entry.src}
                alt={entry.alt}
                type={entry.type}
                showBackground={entry.showBackground ?? false}
              />
            ))}
            <div className="project-section-list">
              {finding.items.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  defaultOpen={true}
                  alwaysExpanded={project.listItemsAlwaysExpanded}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody item={item} />
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
                  defaultOpen
                  alwaysExpanded={project.listItemsAlwaysExpanded}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody item={item} />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.insights ? (
          <ProjectSection
            id="insights"
            eyebrow={project.insights.eyebrow}
            heading={project.insights.heading}
          >
            <div className="project-section-body">
              {project.insights.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {project.insights.items?.length ? (
              <div className="project-section-list">
                {project.insights.items.map((item) => (
                  <ListItem
                    key={item.id}
                    title={item.title}
                    defaultOpen
                    alwaysExpanded={project.listItemsAlwaysExpanded}
                  >
                    {hasExpandableItemBody(item) ? (
                      <ExpandableItemBody item={item} />
                    ) : null}
                  </ListItem>
                ))}
              </div>
            ) : null}
          </ProjectSection>
        ) : null}

        {project.calloutTwo ? <Callout>{project.calloutTwo}</Callout> : null}

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
                  defaultOpen
                  alwaysExpanded={project.listItemsAlwaysExpanded}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody item={item} />
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
                <ListItem
                  key={item.id}
                  title={item.title}
                  alwaysExpanded={project.listItemsAlwaysExpanded}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody item={item} />
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
                  defaultOpen
                  alwaysExpanded={project.listItemsAlwaysExpanded}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody item={item} />
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
                <ListItem
                  key={item.id}
                  title={item.title}
                  defaultOpen
                  alwaysExpanded={project.listItemsAlwaysExpanded}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody item={item} />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {project.reflection ? (
          <ProjectSection
            id="reflection"
            eyebrow={project.reflection.eyebrow}
            heading={project.reflection.heading}
          >
            {project.reflection.paragraphs.length ? (
              <div className="project-section-body">
                {project.reflection.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            <div className="project-section-list">
              {project.reflection.items.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  defaultOpen
                  alwaysExpanded={project.listItemsAlwaysExpanded}
                >
                  {hasExpandableItemBody(item) ? (
                    <ExpandableItemBody item={item} />
                  ) : null}
                </ListItem>
              ))}
            </div>
          </ProjectSection>
        ) : null}
        </PageEnterItems>
      </PageEnter>
    </div>
  );
}
