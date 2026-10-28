export type PhotoBookSpread = {
  /** Path or URL, shown on the left page; for a video, its first frame */
  image: string;
  /** Optional silent clip that loops on the left page once the spread lands */
  video?: string;
  alt: string;
  /** 1–2 lines, set on the right page */
  caption: string;
};

/** Line breaks (\n) carry over to the cover */
export const photoBookTitle = "Designed by Nature\nShot by Me";

export const photoBookSpreads: PhotoBookSpread[] = [
  {
    image: "/assets/images/photo-book/udub-rainier.jpg",
    alt: "Mount Rainier glowing at sunset beyond Drumheller Fountain, framed by dark evergreens",
    caption:
      "Rainier ghosts Seattle for weeks, then shows up like nothing happened. Rude, but gorgeous.",
  },
  {
    image: "/assets/images/photo-book/suzz.jpg",
    alt: "Students studying at long wooden tables under the vaulted ceiling of Suzzallo Library's reading room",
    caption:
      "My study spot. Ten percent studying, ninety percent feeling like a wizard.",
  },
  {
    image: "/assets/images/photo-book/sunset-gasworks.jpg",
    alt: "Seattle's skyline and the Space Needle at dusk, reflected in Lake Union",
    caption:
      "A classic Seattle evening. The sky did all the work, I just held the phone.",
  },
  {
    image: "/assets/images/photo-book/sunset-discovery-park.jpg",
    alt: "A streaked orange and grey sunset over a dark field and a lone house at Discovery Park",
    caption: "I chased this sunset across Seattle. It won, but I got the photo.",
  },
  {
    image: "/assets/images/photo-book/lil-birdie.jpg",
    alt: "A fluffy black baby bird napping on a rock in the grass",
    caption:
      "Met this little one on a walk. Too busy napping to care about my photography career.",
  },
  {
    image: "/assets/images/photo-book/dubai-frame.jpg",
    alt: "The gold Dubai Frame seen from below against a blue sky",
    caption: "Dubai built a giant golden picture frame. So naturally, I framed it.",
  },
  {
    image: "/assets/images/photo-book/abstract-contrast.jpg",
    alt: "A towering wall of blue, green and yellow vertical stripes in a grey concrete courtyard in Dubai",
    caption:
      "Found on a random street in Dubai. Nobody asked this wall to go this hard.",
  },
  {
    image: "/assets/images/photo-book/golf-swing.jpg",
    video: "/assets/images/photo-book/golf-swing.mp4",
    alt: "Video of me swinging a golf club at a driving range under a cloudy Seattle sky",
    caption:
      "Driving range therapy. The ball went somewhere. I'm choosing to believe it was far.",
  },
  {
    image: "/assets/images/photo-book/ma-homies.jpg",
    alt: "Three polaroids of grad school friends squeezed into selfies, on a Japanese Garden card with a beaded bracelet",
    caption:
      "Grad school taught me research methods. These people taught me everything else.",
  },
];
