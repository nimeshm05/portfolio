import { designingBeyondTheInterface } from "./designing-beyond-the-interface";
import type { ProjectCardData } from "@/data/projects/types";

const writings: Record<string, ProjectCardData> = {
  [designingBeyondTheInterface.slug]: designingBeyondTheInterface,
};

export function getWritingCard(slug: string): ProjectCardData | undefined {
  return writings[slug];
}
