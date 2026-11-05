import { architectureAgent } from "./architecture-agent";
import { smartPromptSuggestions } from "./smart-prompt-suggestions";
import { connectPrompt } from "./connect-prompt";
// Conversation Insights variations (only one is rendered at a time):
// - ./conversation-insights     original case study
// - ./conversation-insights-v3  original with Solutions told as three jobs (live)
import { conversationInsightsV3 as conversationInsights } from "./conversation-insights-v3";
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
  [smartPromptSuggestions.slug]: smartPromptSuggestions,
};

export function getProject(slug: string): ProjectPageData | undefined {
  return projects[slug];
}

export function getProjectSlugs(): string[] {
  return Object.keys(projects);
}

export type { ProjectCardData } from "./types";
