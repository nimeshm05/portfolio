import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/kar-no-key/${path}`;

export const karNoKey: ProjectPageData = {
  slug: "kar-no-key",
  title: "kar-no-key",
  subtitle: "Personal music project.",
  bannerSrc: asset("kar-no-key-preview.mp4"),
  bannerAlt: "kar-no-key project preview",
  bannerType: "video",
};
