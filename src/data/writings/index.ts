import {
  connectPrompt,
  designingBeyondTheInterface,
  noteToMyself,
} from "./designing-beyond-the-interface";
import type { ProjectCardData } from "@/data/projects/types";

const writings: Record<string, ProjectCardData> = {
  [designingBeyondTheInterface.slug]: designingBeyondTheInterface,
  [noteToMyself.slug]: noteToMyself,
  [connectPrompt.slug]: connectPrompt,
};

export function getWritingCard(slug: string): ProjectCardData | undefined {
  return writings[slug];
}
