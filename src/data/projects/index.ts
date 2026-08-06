import { conversationInsights } from "./conversation-insights";
import type { ProjectPageData } from "./types";

const projects: Record<string, ProjectPageData> = {
  [conversationInsights.slug]: conversationInsights,
};

export function getProject(slug: string): ProjectPageData | undefined {
  return projects[slug];
}

export function getProjectSlugs(): string[] {
  return Object.keys(projects);
}

export type { ProjectPageData, ExpandableItemContent, RichTextBlock } from "./types";
