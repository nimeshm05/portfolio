import { getProjectCard } from "@/data/projects";
import type { ProjectCardData } from "@/data/projects/types";
import { getWritingCard } from "@/data/writings";

export function getWorkCard(id: string): ProjectCardData | undefined {
  return getProjectCard(id) ?? getWritingCard(id);
}
