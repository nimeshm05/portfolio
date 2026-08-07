import type { IconName } from "@/components/Icon/Icon";

export type HomeTab = "work" | "about";

export type ListItemData = {
  id: string;
  title: string;
  meta?: string;
  icon?: IconName;
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
  avatarSrc: "/assets/profile-3.jpeg",
  avatarAlt: "Portrait of Nimesh Mohanakrishnan",
  bioByTab: {
    work: "Product designer based in Seattle, currently earning my master's in HCDE at the University of Washington.",
    about:
      "Product designer based in Seattle, currently earning my master's in HCDE at the University of Washington.",
  },
  socialLinks: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/nimeshm05",
      iconSrc: "/assets/icons/github.svg",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nimesh-mohanakrishnan",
      iconSrc: "/assets/icons/linkedin.svg",
    },
  ],
} as const;

export const workSections: ContentSectionData[] = [
  {
    id: "industry-projects",
    label: "Industry Projects",
    items: [
      {
        id: "discovery-responses",
        title: "Discovery Responses",
        icon: "message-circle-more",
        href: "/work/discovery-responses",
      },
      {
        id: "conversation-insights",
        title: "Conversation Insights",
        icon: "chart-pie",
        href: "/work/conversation-insights",
      },
      {
        id: "architecture-agent",
        title: "Architecture Agent",
        icon: "bot",
        href: "/work/architecture-agent",
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
        icon: "footprints",
        href: "/work/digital-footprints",
      },
      {
        id: "kar-no-key",
        title: "kar-no-key",
        icon: "music-2",
        href: "/work/kar-no-key",
      },
      {
        id: "gz-lang",
        title: "gz-lang",
        icon: "code-xml",
        href: "/work/gz-lang",
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
        icon: "music-2",
        href: "#",
      },
      {
        id: "writing-gz-lang",
        title: "gz-lang",
        icon: "code-xml",
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
