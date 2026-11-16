import type { ProjectCardData } from "./types";

const asset = (path: string) =>
  `/assets/projects/knool-chat-experience/${path}`;

export const knool2Card: ProjectCardData = {
  slug: "knool-2",
  href: "/work/knool-2",
  title: "Rethinking Knool 2.0 Case Assistant",
  chips: ["Product Design", "Legal Tech"],
  timeline: "June 2026 – September 2026",
  description:
    "Turning a 20-option empty state into stage-aware prompts that show attorneys what the assistant can do for their case, right when they start a chat.",
  bannerSrc: asset("concept-final-solution-2k.mp4"),
  bannerLargeSrc: asset("concept-final-solution.mp4"),
  bannerAlt: "Knool case assistant first screen preview",
  bannerType: "video",
};
