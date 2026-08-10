import { getProjectCard as getProjectCardFromRegistry } from "@/data/projectCards";
import { architectureAgent } from "./architecture-agent";
import { conversationInsights } from "./conversation-insights";
import { gzLang } from "./gz-lang";
import { karNoKey } from "./kar-no-key";
import type { ProjectCardData, ProjectPageData } from "./types";

const projects: Record<string, ProjectPageData> = {
  [conversationInsights.slug]: conversationInsights,
  [architectureAgent.slug]: architectureAgent,
  [karNoKey.slug]: karNoKey,
  [gzLang.slug]: gzLang,
};

export function getProject(slug: string): ProjectPageData | undefined {
  return projects[slug];
}

export function getProjectSlugs(): string[] {
  return Object.keys(projects);
}

export function getProjectCard(slug: string): ProjectCardData | undefined {
  return getProjectCardFromRegistry(slug);
}
export type {
  ProjectCardData,
  ProjectPageData,
  ExpandableItemContent,
  RichTextBlock,
} from "./types";
