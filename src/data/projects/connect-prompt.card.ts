import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/connect-prompt/${path}`;

export const connectPromptCard: ProjectCardData = {
  slug: "connect-prompt",
  href: "/work/connect-prompt",
  title: "Connect Prompt",
  projectType: "Interaction Design",
  timeline: "August 2026",
  description:
    "Disecting my thought process for a playful component developed using motion + cursor coding agent, for my portfolio.",
  bannerSrc: asset("connect-prompt-preview.mp4"),
  bannerAlt: "Connect Prompt component preview",
  bannerType: "video",
};
