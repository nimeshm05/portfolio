import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/connect-prompt/${path}`;

export const connectPromptCard: ProjectCardData = {
  slug: "connect-prompt",
  href: "/work/connect-prompt",
  title: "Connect Prompt",
  chips: ["Interaction design"],
  timeline: "August 2026",
  description:
    "Mapping my real-world conversation starters to a software interaction pattern",
  bannerSrc: asset("connect-prompt-preview-2k.mp4"),
  bannerLargeSrc: asset("connect-prompt-preview.mp4"),
  bannerAlt: "Connect Prompt component preview",
  bannerType: "video",
  bannerAspectRatio: "3840 / 1602",
};
