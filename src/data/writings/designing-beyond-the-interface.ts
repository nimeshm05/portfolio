import type { ProjectCardData } from "@/data/projects/types";

const asset = (path: string) => `/assets/projects/writings/${path}`;

export const designingBeyondTheInterface: ProjectCardData = {
  slug: "designing-beyond-the-interface",
  href: "https://nimeshmohanakrishnan.medium.com/designing-beyond-the-interface-what-contact-centers-taught-me-about-systems-thinking-ac164a68cc36",
  title: "Designing Beyond the Interface",
  projectType: "HCDE 501 Class Paper",
  timeline: "Medium",
  description:
    "What contact centers taught me about systems thinking.",
  bannerSrc: asset("medium-article-systems-thinking-preview.mp4"),
  bannerAlt: "Designing Beyond the Interface article preview",
  bannerType: "video",
};

export const noteToMyself: ProjectCardData = {
  slug: "note-to-myself",
  href: "https://nimeshmohanakrishnan.medium.com/a-note-to-myself-339b3e6b02c9",
  title: "A Note to Myself",
  projectType: "Self-reflection",
  timeline: "Medium",
  description:
    "A note to myself about my journey so far.",
  bannerSrc: asset("note-self.mp4"),
  bannerAlt: "A Note to Myself article preview",
  bannerType: "video",
};