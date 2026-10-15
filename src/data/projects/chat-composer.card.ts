import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/interaction-design-samples/${path}`;

export const chatComposerCard: ProjectCardData = {
  slug: "chat-composer",
  href: "/work/chat-composer",
  title: "Chat Composer",
  chips: ["Interaction design"],
  timeline: "October 2026",
  description: "Concept work for Knool's case assistant that helps litigators write strong prompts, without needing to type the perfect one.",
  bannerSrc: asset("knool-prompt-suggestions.mp4"),
  bannerAlt: "Chat Composer preview",
  bannerType: "video",
  bannerAspectRatio: "3324 / 2160",
};
