export type PhotoBookSpread = {
  /** Path or URL, shown on the left page */
  image: string;
  alt: string;
  /** 1–2 lines, set on the right page */
  caption: string;
};

export const photoBookTitle = "Designed by Nature, Shot by Me";

// Placeholder spreads until the real photo book is curated.
export const photoBookSpreads: PhotoBookSpread[] = [
  {
    image: "/assets/images/udub/IMG_3564.jpeg",
    alt: "Mount Rainier at sunset over the Drumheller Fountain, framed by evergreens",
    caption: "Rainier shows up maybe once a week. Everyone stops walking when it does.",
  },
  {
    image: "/assets/images/udub/IMG_2539.jpeg",
    alt: "Students studying under the vaulted ceiling of Suzzallo Library's reading room",
    caption: "Suzzallo's reading room, where it is very hard to feel productive enough.",
  },
  {
    image: "/assets/images/udub/IMG_3340.jpeg",
    alt: "A long open studio space with pendant lights and event boards",
    caption: "The studio after everyone left. Quiet enough to hear the lights.",
  },
  {
    image: "/assets/images/innovation-fellows/IMG_20220322_134407_Original.JPG",
    alt: "Innovation Fellows program, March 2022",
    caption: "Innovation Fellows, Bengaluru. The week I started asking why.",
  },
  {
    image: "/assets/images/udub/IMG_2978.jpeg",
    alt: "Standing with a professor in a classroom, holding a card",
    caption: "A card from a professor. I still keep it on my desk.",
  },
  {
    image: "/assets/images/udub/IMG_2976.jpeg",
    alt: "A selfie with classmates in a green-walled studio classroom",
    caption: "The green room, and the people who made the year.",
  },
];
