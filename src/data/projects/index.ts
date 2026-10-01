import { architectureAgent } from "./architecture-agent";
import { connectPrompt } from "./connect-prompt";
import { conversationInsights } from "./conversation-insights";
import { gzLang } from "./gz-lang";
import { knool2 } from "./knool-2";
import { karNoKey } from "./kar-no-key";
import type { ProjectPageData } from "./types";

const projects: Record<string, ProjectPageData> = {
  [conversationInsights.slug]: conversationInsights,
  [architectureAgent.slug]: architectureAgent,
  [knool2.slug]: knool2,
  [karNoKey.slug]: karNoKey,
  [gzLang.slug]: gzLang,
  [connectPrompt.slug]: connectPrompt,
};

export function getProject(slug: string): ProjectPageData | undefined {
  return projects[slug];
}

export function getProjectSlugs(): string[] {
  return Object.keys(projects);
}

export type { ProjectCardData } from "./types";
