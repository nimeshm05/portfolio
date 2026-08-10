import type { ProjectCardData } from "./types";

const asset = (path: string) =>
  `/assets/projects/conversation-insights/${path}`;

export const conversationInsightsCard: ProjectCardData = {
  slug: "conversation-insights",
  href: "/work/conversation-insights",
  title: "Conversation Insights",
  projectType: "Product Design - Internal Tool",
  timeline: "Q4 2024 - Q2 2025",
  description:
    "A self-serve analytics platform that enabled Air Canada's contact centre teams (customer) to analyze customer conversations directly.",
  bannerSrc: asset("conversation-insights-preview.mp4"),
  bannerAlt: "Conversation Insights dashboard preview",
  bannerType: "video",
};
