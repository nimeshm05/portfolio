export type HomeTab = "work" | "about";

export type ListItemData = {
  id: string;
  title: string;
  meta?: string;
  icon?: string;
  href?: string;
};

export type ContentSectionData = {
  id: string;
  label: string;
  items: ListItemData[];
  compactGap?: boolean;
};

export const profile = {
  name: "Nimesh Mohanakrishnan",
  avatarSrc: "/assets/profile.jpeg",
  avatarAlt: "Portrait of Nimesh Mohanakrishnan",
  bioByTab: {
    work: "I'm a product designer living in Seattle, currently a masters student in the HCDE program at the University of Washington.",
    about:
      "I'm a product designer living in Seattle, currently a masters student in the HCDE program at the University of Washington.",
  },
} as const;

export const workSections: ContentSectionData[] = [
  {
    id: "industry-projects",
    label: "Industry Projects",
    items: [
      {
        id: "discovery-responses",
        title: "Discovery Responses",
        icon: "/assets/icons/discovery-responses.svg",
        href: "#",
      },
      {
        id: "conversation-insights",
        title: "Conversation Insights",
        icon: "/assets/icons/conversation-insights.svg",
        href: "#",
      },
      {
        id: "architecture-agent",
        title: "Architecture Agent",
        icon: "/assets/icons/architecture-agent.svg",
        href: "#",
      },
    ],
  },
  {
    id: "personal-projects",
    label: "Personal Projects",
    items: [
      {
        id: "digital-footprints",
        title: "Digital Footprints",
        icon: "/assets/icons/digital-footprints.svg",
        href: "#",
      },
      {
        id: "kar-no-key",
        title: "kar-no-key",
        icon: "/assets/icons/kar-no-key.svg",
        href: "#",
      },
      {
        id: "gz-lang",
        title: "gz-lang",
        icon: "/assets/icons/gz-lang.svg",
        href: "#",
      },
    ],
  },
  {
    id: "writing",
    label: "Writing",
    compactGap: true,
    items: [
      {
        id: "writing-kar-no-key",
        title: "kar-no-key",
        icon: "/assets/icons/kar-no-key.svg",
        href: "#",
      },
      {
        id: "writing-gz-lang",
        title: "gz-lang",
        icon: "/assets/icons/gz-lang.svg",
        href: "#",
      },
    ],
  },
];

export const aboutSections: ContentSectionData[] = [
  {
    id: "past-experience",
    label: "Past Experience",
    items: [
      {
        id: "knool",
        title: "Product Intern,",
        meta: "Knool",
        href: "#",
      },
      {
        id: "rozieai",
        title: "Product Designer,",
        meta: "RozieAI",
        href: "#",
      },
      {
        id: "brane",
        title: "Software Engineer,",
        meta: "Brane Enterprises",
        href: "#",
      },
    ],
  },
  {
    id: "education",
    label: "Education",
    items: [
      {
        id: "ms-hcde",
        title: "M.S. Human Centered Design & Engineering",
        href: "#",
      },
      {
        id: "beng-cse",
        title: "B.Eng. Computer Science & Engineering",
        href: "#",
      },
    ],
  },
  {
    id: "my-journey",
    label: "My Journey",
    compactGap: true,
    items: [
      {
        id: "as-a-child",
        title: "As a child...",
        href: "#",
      },
      {
        id: "where-it-started",
        title: "Where it all started...",
        href: "#",
      },
      {
        id: "stride-forward",
        title: "The stride forward...",
        href: "#",
      },
    ],
  },
];

export const homeTabs = [
  { id: "work" as const, label: "Work" },
  { id: "about" as const, label: "About" },
];
