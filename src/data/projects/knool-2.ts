import type { ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/knool-chat-experience/${path}`;

export const knool2: ProjectPageData = {
  slug: "knool-2",
  title: "Rethinking Knool's New Chat Experience",
  subtitle:
    "Turning a 20-option empty state into stage-aware prompts that show attorneys what the assistant can do for their case, right when they start a chat.",
  projectType: "Product Design",
  timeline: "June 2026 – August 2026",
  bannerSrc: asset("knool-initial-chat-experience-preview.mp4"),
  bannerAlt: "Knool case assistant first screen preview",
  bannerType: "video",
  meta: {
    items: [
      { label: "Project Type", value: "Product Design" },
      { label: "Domain", value: "Legal Tech" },
      { label: "Timeline", value: "June 2026 – August 2026" },
      { label: "Role", value: "Product Intern" },
    ],
  },
};
