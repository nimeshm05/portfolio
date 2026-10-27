export type GalleryFrame = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  orientation: "landscape" | "portrait" | "square";
};

export const galleryInvite = "Wait, wanna art walk my gallery? It's free :)";

// Placeholder pieces until the real gallery is curated.
export const galleryFrames: GalleryFrame[] = [
  {
    id: "suzzallo",
    src: "/assets/images/udub/IMG_2539.jpeg",
    alt: "Students studying under the vaulted ceiling of Suzzallo Library's reading room",
    title: "Reading Room",
    caption: "Seattle, 2024",
    orientation: "landscape",
  },
  {
    id: "rainier",
    src: "/assets/images/udub/IMG_3564.jpeg",
    alt: "Mount Rainier at sunset over the Drumheller Fountain, framed by evergreens",
    title: "Rainier, Briefly",
    caption: "Seattle, 2024",
    orientation: "square",
  },
  {
    id: "studio",
    src: "/assets/images/udub/IMG_3340.jpeg",
    alt: "A long open studio space with pendant lights and event boards",
    title: "Studio, After Hours",
    caption: "Seattle, 2025",
    orientation: "portrait",
  },
  {
    id: "fellows",
    src: "/assets/images/innovation-fellows/IMG_20220322_134407_Original.JPG",
    alt: "Innovation Fellows program, March 2022",
    title: "Fellows",
    caption: "Bengaluru, 2022",
    orientation: "landscape",
  },
  {
    id: "professor",
    src: "/assets/images/udub/IMG_2978.jpeg",
    alt: "Standing with a professor in a classroom, holding a card",
    title: "The Card",
    caption: "Seattle, 2025",
    orientation: "portrait",
  },
  {
    id: "classmates",
    src: "/assets/images/udub/IMG_2976.jpeg",
    alt: "A selfie with classmates in a green-walled studio classroom",
    title: "Green Room",
    caption: "Seattle, 2024",
    orientation: "landscape",
  },
];
