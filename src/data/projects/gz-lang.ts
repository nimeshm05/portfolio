import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/gz-lang/${path}`;

export const gzLang: ProjectPageData = {
  slug: "gz-lang",
  title: "GZ-lang",
  subtitle: "A GenZ programming language that transpiles to JavaScript. no cap. Write JavaScript using Gen Z slang.",
  projectType: "AI Project",
  timeline: "2025",
  bannerSrc: asset("gz-lang-preview.mp4"),
  bannerAlt: "gz-lang project preview",
  bannerType: "video",
  liveHref: "https://gz-lang.vercel.app/",
  meta: {
    items: [
      { label: "Project Type", value: "Exploratory Project - Transpiler" },
      { label: "Intent", value: "Learning & Building with AI Agents" },
      { label: "Timeline", value: "2026, 2 weeks" },
      { label: "Role", value: "Design + Development" },
    ],
  },
};
