import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/connect-prompt/${path}`;

export const connectPrompt: ProjectPageData = {
  slug: "connect-prompt",
  title: "Connect Prompt",
  subtitle:
    "A playful component developed using motion + cursor agent for my portfolio",
  projectType: "Interaction Design",
  timeline: "August 2026, 1 week",
  bannerSrc: asset("connect-prompt-preview.mp4"),
  bannerAlt: "Connect Prompt component preview",
  bannerType: "video",
  bannerAspectRatio: "3840 / 1242",
  meta: {
    items: [
      { label: "Project Type", value: "Personal" },
      { label: "Intent", value: "To explore motion & interaction design with coding agents" },
      { label: "Timeline", value: "August 2026, 1 week" },
      { label: "Tools", value: "NextJS, CSS, Motion (Animation)" },
    ],
  },
};
