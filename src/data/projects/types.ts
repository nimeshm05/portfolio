import type { IconName } from "@/components/Icon/Icon";

export type ProjectNavItem = {
  id: string;
  label: string;
  href?: string;
};

export type RichTextBlock =
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "paragraphs-with-list"; intro: string[]; items: string[]; outro?: string[] };

export type ProjectMedia = {
  src: string;
  alt: string;
  type?: "image" | "video";
  /** Video width / height, e.g. "1920 / 1080"; reserves its box while loading */
  aspectRatio?: string;
  showBackground?: boolean;
  frame?: "section";
  /** When false, section media keeps the outer container and omits the inner frame. */
  framed?: boolean;
  /** When true, section media stays within the text column instead of widening on large screens. */
  contained?: boolean;
};

export type SourceCard = {
  title: string;
  logoSrc: string;
  logoAlt: string;
  items: string[];
};

export type DataAttributeTone = "insight" | "operational";

export type DataAttributeCard = {
  title: string;
  description: string;
  tone: DataAttributeTone;
};

export type WorkflowStep = {
  icon: IconName;
  title: string;
  description: string;
};

export type ArchitectureWorkflowStep = {
  id: string;
  label: string;
  icon: IconName;
  heading: string;
  tools?: string[];
};

export type ArchitectureWorkflowData = {
  steps: ArchitectureWorkflowStep[];
};

export type ExpandableVisual =
  | { type: "source-cards"; cards: SourceCard[] }
  | { type: "data-attribute-cards"; cards: DataAttributeCard[] }
  | { type: "workflow-steps"; steps: WorkflowStep[] };

export type CalloutQuote = {
  text: string;
  attribution?: string;
  source?: string;
};

export type ExpandableItemContent = {
  id: string;
  title: string;
  icon?: IconName;
  content?: RichTextBlock;
  quotes?: CalloutQuote[];
  imageSrc?: string;
  imageAlt?: string;
  media?: ProjectMedia[];
  visual?: ExpandableVisual;
};

export type ProjectContentTable = {
  headers: string[];
  rows: string[][];
};

export type ProjectSectionWithMedia = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  imageSrc?: string;
  imageAlt?: string;
  imageType?: "image" | "video";
  /** When true, the section media stays within the text column instead of widening on large screens. */
  imageContained?: boolean;
  workflow?: ArchitectureWorkflowData;
};

export type ProjectMetaItem = {
  label: string;
  value: string;
};

export type ProjectCardData = {
  slug: string;
  href: string;
  title: string;
  chips: readonly string[];
  timeline: string;
  description: string;
  bannerSrc: string;
  bannerAlt: string;
  bannerType?: "image" | "video";
  /** Video width / height, e.g. "1920 / 1080"; reserves its box while loading */
  bannerAspectRatio?: string;
};

export type ProjectPageData = {
  slug: string;
  title: string;
  subtitle: string;
  projectType: string;
  timeline: string;
  bannerSrc: string;
  bannerAlt: string;
  bannerType?: "image" | "video";
  /** Video width / height, e.g. "1920 / 1080"; reserves its box while loading */
  bannerAspectRatio?: string;
  liveHref?: string;
  listItemsAlwaysExpanded?: boolean;
  nav?: ProjectNavItem[];
  meta?: {
    items: ProjectMetaItem[];
  };
  overview?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
  };
  product?: ProjectSectionWithMedia;
  problem?: ProjectSectionWithMedia & {
    items?: ExpandableItemContent[];
    list?: string[];
  };
  studyDesign?: ProjectSectionWithMedia & {
    table?: ProjectContentTable;
  };
  findings?: Array<{
    id: string;
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    media?: ProjectMedia[];
    items: ExpandableItemContent[];
  }>;
  calloutOne?: string;
  discovery?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    items: ExpandableItemContent[];
  };
  insights?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    items?: ExpandableItemContent[];
  };
  calloutTwo?: string;
  earlyDesigns?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    items: ExpandableItemContent[];
    closingParagraphs: string[];
  };
  learnings?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    items: ExpandableItemContent[];
  };
  solutions?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    items: ExpandableItemContent[];
  };
  outcome?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    items: ExpandableItemContent[];
  };
  reflection?: {
    eyebrow: string;
    heading?: string;
    paragraphs: string[];
    items: ExpandableItemContent[];
  };
};
