import type { ProjectPageData } from "./types";

const asset = (path: string) => `/assets/projects/kar-no-key/${path}`;

export const karNoKey: ProjectPageData = {
  slug: "kar-no-key",
  title: "kar-no-key",
  subtitle: "A full-stack multiplayer type racer game built with Supabase and Next.JS using cursor agents.",
  projectType: "AI Project",
  timeline: "2025",
  bannerSrc: asset("kar-no-key-preview.mp4"),
  bannerAlt: "kar-no-key project preview",
  bannerType: "video",
  meta: {
    items: [
      { label: "Project Type", value: "Personal Project" },
      { label: "Intent", value: "To build an end-to-end multiplayer typing game with AI agents" },
      { label: "Timeline", value: "2026, 3 weeks" },
      { label: "Tools", value: "Cusor agents, Supabase, NextJS, Youtube API" },
    ],
  },
};
