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
};

export type ExpandableItemContent = {
  id: string;
  title: string;
  icon?: IconName;
  content?: RichTextBlock;
  imageSrc?: string;
  imageAlt?: string;
  media?: ProjectMedia[];
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
  cardDescription?: string;
  bannerSrc: string;
  bannerAlt: string;
  bannerType?: "image" | "video";
  bannerBackgroundSrc?: string;
  nav?: ProjectNavItem[];
  overview?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
  };
  problem?: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    imageSrc?: string;
    imageAlt?: string;
  };
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
};
