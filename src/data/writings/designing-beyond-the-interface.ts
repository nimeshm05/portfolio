import type { ProjectCardData } from "@/data/projects/types";

const asset = (path: string) => `/assets/projects/writings/${path}`;

export const designingBeyondTheInterface: ProjectCardData = {
  slug: "designing-beyond-the-interface",
  href: "https://nimeshmohanakrishnan.medium.com/designing-beyond-the-interface-what-contact-centers-taught-me-about-systems-thinking-ac164a68cc36",
  title: "Designing Beyond the Interface",
  projectType: "Writing",
  timeline: "Medium",
  description:
    "What contact centers taught me about systems thinking.",
  bannerSrc: asset("medium-article-systems-thinking-preview.mp4"),
  bannerAlt: "Designing Beyond the Interface article preview",
  bannerType: "video",
};
