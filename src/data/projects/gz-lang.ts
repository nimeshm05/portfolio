import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/gz-lang/${path}`;

export const gzLang: ProjectPageData = {
  slug: "gz-lang",
  title: "gz-lang",
  subtitle: "Personal programming language.",
  bannerSrc: asset("gz-lang-preview.mp4"),
  bannerAlt: "gz-lang project preview",
  bannerType: "video",
};
