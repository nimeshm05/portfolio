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
  showBackground?: boolean;
  hugContent?: boolean;
};

export type SourceCard = {
  title: string;
  logoSrc: string;
  logoAlt: string;
  items: string[];
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
  | { type: "workflow-steps"; steps: WorkflowStep[] };

export type CalloutQuote = {
  text: string;
  attribution?: string;
  source?: string;
  designPrinciple?: string;
  variant?: "quote" | "body";
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
  projectType: string;
  timeline: string;
  description: string;
  bannerSrc: string;
  bannerAlt: string;
  bannerType?: "image" | "video";
  bannerBackgroundSrc?: string;
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
  bannerBackgroundSrc?: string;
  liveHref?: string;
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
  calloutTwo?: string;
  constraints?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
  };
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
