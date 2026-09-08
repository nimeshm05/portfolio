import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/architecture-agent/${path}`;

export const architectureAgentCard: ProjectCardData = {
  slug: "architecture-agent",
  href: "/work/architecture-agent",
  title: "Architecture Agent",
  chips: ["Usability testing", "UX research"],
  timeline: "Jan 2026 - Mar 2026",
  description:
    "Making AI recommendations easier to understand and act on - a usability test for the Architecture Agent.",
  bannerSrc: asset("actual-ai-preview.mp4"),
  bannerAlt: "Architecture Agent product preview",
  bannerType: "video",
};
