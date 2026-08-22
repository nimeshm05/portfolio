import type { ProjectCardData } from "./types";

const asset = (path: string) =>
  `/assets/projects/conversation-insights/${path}`;

export const conversationInsightsCard: ProjectCardData = {
  slug: "conversation-insights",
  href: "/work/conversation-insights",
  title: "Conversation Insights",
  projectType: "Product Design - Internal Tool",
  timeline: "Q3 2024 - Q2 2025",
  description:
    "Eliminating manual insight reporting in contact centers with self-serve analytics platform to enable faster operational decision making.",
  bannerSrc: asset("conversation-insights-preview.mp4"),
  bannerAlt: "Conversation Insights dashboard preview",
  bannerType: "video",
};
