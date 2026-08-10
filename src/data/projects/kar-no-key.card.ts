import type { ProjectCardData } from "./types";

const asset = (path: string) => `/assets/projects/kar-no-key/${path}`;

export const karNoKeyCard: ProjectCardData = {
  slug: "kar-no-key",
  href: "/work/kar-no-key",
  title: "kar-no-key",
  projectType: "AI Project",
  timeline: "2025",
  description:
    "A full-stack multiplayer type racer game built with Supabase and Next.JS using cursor agents.",
  bannerSrc: asset("kar-no-key-preview.mp4"),
  bannerAlt: "kar-no-key project preview",
  bannerType: "video",
};
