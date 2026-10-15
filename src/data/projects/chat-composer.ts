import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/interaction-design-samples/${path}`;

export const chatComposer: ProjectPageData = {
  slug: "chat-composer",
  title: "Chat Composer",
  subtitle: "Concept work for Knool's case assistant that helps litigators write strong prompts, without needing to type the perfect one.",
  projectType: "Interaction Design",
  timeline: "October 2026",
  bannerSrc: asset("knool-prompt-suggestions.mp4"),
  bannerAlt: "Chat Composer preview",
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
