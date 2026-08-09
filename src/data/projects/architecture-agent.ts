import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/architecture-agent/${path}`;

export const architectureAgent: ProjectPageData = {
  slug: "architecture-agent",
  title: "Architecture Agent",
  subtitle:
    "Leading usability testing for a pre-launch AI product, uncovering 29 key issues that shaped product prioritization and improved workflow clarity.",
  projectType: "Usability Testing",
  timeline: "Jan 2026 - Mar 2026",
  bannerSrc: asset("actual-ai-preview.mp4"),
  bannerAlt: "Architecture Agent product preview",
  bannerType: "video",
};
