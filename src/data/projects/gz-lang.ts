import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/gz-lang/${path}`;

export const gzLang: ProjectPageData = {
  slug: "gz-lang",
  title: "gz-lang",
  subtitle: "A GenZ programming language that transpiles to JavaScript. no cap. Write JavaScript using Gen Z slang.",
  projectType: "Programming Language",
  timeline: "2025",
  bannerSrc: asset("gz-lang-preview.mp4"),
  bannerAlt: "gz-lang project preview",
  bannerType: "video",
};
