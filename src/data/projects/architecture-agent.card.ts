import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/architecture-agent/${path}`;

export const architectureAgentCard: ProjectCardData = {
  slug: "architecture-agent",
  href: "/work/architecture-agent",
  title: "Architecture Agent",
  projectType: "Usability Testing",
  timeline: "Jan 2026 - Mar 2026",
  description:
    "Leading usability testing for a pre-launch AI product, uncovering 29 key issues that shaped product prioritization and improved workflow clarity.",
  bannerSrc: asset("actual-ai-preview.mp4"),
  bannerAlt: "Architecture Agent product preview",
  bannerType: "video",
};
