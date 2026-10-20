import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/interaction-design-samples/${path}`;

export const smartPromptSuggestionsCard: ProjectCardData = {
  slug: "smart-prompt-suggestions",
  href: "/work/smart-prompt-suggestions",
  title: "Smart Prompt Suggestions",
  chips: ["Interaction design"],
  timeline: "October 2026",
  description: "Concept work for Knool's case assistant that helps litigators write strong prompts, without needing to type the perfect one.",
  bannerSrc: asset("knool-prompt-suggestions.mp4"),
  bannerAlt: "Smart Prompt Suggestions preview",
  bannerType: "video",
  bannerAspectRatio: "3324 / 2160",
};
