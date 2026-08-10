import { architectureAgentCard } from "@/data/projects/architecture-agent.card";
import { conversationInsightsCard } from "@/data/projects/conversation-insights.card";
import { gzLangCard } from "@/data/projects/gz-lang.card";
import { karNoKeyCard } from "@/data/projects/kar-no-key.card";
import type { ProjectCardData } from "@/data/projects/types";

const projectCards: Record<string, ProjectCardData> = {
  [conversationInsightsCard.slug]: conversationInsightsCard,
  [architectureAgentCard.slug]: architectureAgentCard,
  [karNoKeyCard.slug]: karNoKeyCard,
  [gzLangCard.slug]: gzLangCard,
};

export function getProjectCard(slug: string): ProjectCardData | undefined {
  return projectCards[slug];
}
