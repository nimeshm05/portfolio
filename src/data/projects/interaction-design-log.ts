import type { ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/interaction-design-log/${path}`;

export const interactionDesignLog: ProjectPageData = {
  slug: "interaction-design-log",
  title: "Interaction Design Log",
  subtitle:
    "A learning log website for my HCDE 536 - Interaction Design & Prototyping class where I capture most of what I learned.",
  projectType: "Interaction Design",
  timeline: "November 2026",
  bannerSrc: asset("interaction-design-log-preview-2k.mp4"),
  bannerLargeSrc: asset("interaction-design-log-preview.mp4"),
  bannerAlt: "Interaction Design Log preview: a retro TV showing the learning log",
  bannerType: "video",
  bannerAspectRatio: "3324 / 2160",
  liveHref: "https://interaction-design-log.vercel.app/",
  meta: {
    items: [
      { label: "Project Type", value: "Personal" },
      { label: "Intent", value: "To capture what I learned in HCDE 536" },
      { label: "Timeline", value: "November 2026" },
      {
        label: "Tools",
        value: "Claude Code, My Neurons",
        tools: [
          { name: "Claude Code", logoSrc: "/assets/tools/claude.png" },
          { name: "My Neurons", emoji: "🧠" },
        ],
      },
    ],
  },
};
