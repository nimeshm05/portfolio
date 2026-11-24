import type { ProjectCardData } from "./types";

const asset = (path: string) =>
  `/assets/projects/interaction-design-log/${path}`;

export const interactionDesignLogCard: ProjectCardData = {
  slug: "interaction-design-log",
  href: "/work/interaction-design-log",
  title: "Interaction Design Log",
  chips: ["Interaction design"],
  timeline: "November 2026",
  description:
    "A learning log website for my HCDE 536 - Interaction Design & Prototyping class where I capture most of what I learned.",
  bannerSrc: asset("interaction-design-log-preview-2k.mp4"),
  bannerLargeSrc: asset("interaction-design-log-preview.mp4"),
  bannerAlt: "Interaction Design Log preview: a retro TV showing the learning log",
  bannerType: "video",
  bannerAspectRatio: "3324 / 2160",
};
