import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/connect-prompt/${path}`;

export const connectPrompt: ProjectPageData = {
  slug: "connect-prompt",
  title: "Connect Prompt",
  subtitle:
    "Mapping my real-world conversation starters to a software interaction pattern",
  projectType: "Interaction Design",
  timeline: "August 2026, 1 week",
  bannerSrc: asset("connect-prompt-preview-2k.mp4"),
  bannerLargeSrc: asset("connect-prompt-preview.mp4"),
  bannerAlt: "Connect Prompt component preview",
  bannerType: "video",
  bannerAspectRatio: "3840 / 1602",
  meta: {
    items: [
      { label: "Project Type", value: "Personal" },
      { label: "Intent", value: "To sense-make how my conversations take place in real-world and translating that into software pattern" },
      { label: "Timeline", value: "August 2026, 1 week" },
      {
        label: "Tools",
        value: "Motion, Cursor Agents",
        tools: [
          { name: "Motion", logoSrc: "/assets/tools/motion.svg" },
          { name: "Cursor Agents", logoSrc: "/assets/tools/cursor.png" },
        ],
      },
    ],
  },
};
