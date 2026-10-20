import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/interaction-design-samples/${path}`;

export const smartPromptSuggestions: ProjectPageData = {
  slug: "smart-prompt-suggestions",
  title: "Smart Prompt Suggestions",
  subtitle: "Concept work for Knool's case assistant that helps litigators write strong prompts, without needing to type the perfect one.",
  projectType: "Interaction Design",
  timeline: "October 2026",
  bannerSrc: asset("knool-prompt-suggestions.mp4"),
  bannerAlt: "Smart Prompt Suggestions preview",
  bannerType: "video",
  bannerAspectRatio: "3324 / 2160",
  meta: {
    items: [
      { label: "Project Type", value: "Personal" },
      { label: "Intent", value: "Placeholder" },
      { label: "Timeline", value: "October 2026" },
      { label: "Tools", value: "Placeholder" },
    ],
  },
};
