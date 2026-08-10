import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/gz-lang/${path}`;

export const gzLangCard: ProjectCardData = {
  slug: "gz-lang",
  href: "/work/gz-lang",
  title: "gz-lang",
  projectType: "AI Project",
  timeline: "2025",
  description:
    "A GenZ programming language that transpiles to JavaScript. no cap. Write JavaScript using Gen Z slang.",
  bannerSrc: asset("gz-lang-preview.mp4"),
  bannerAlt: "gz-lang project preview",
  bannerType: "video",
};
