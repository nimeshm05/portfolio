import type { IconName } from "@/components/Icon/Icon";

export type HomeTab = "work" | "about";

export type ListItemBlock =
  | { type: "paragraph"; text: string }
  | { type: "callout"; text: string };

export type ListItemData = {
  id: string;
  title: string;
  meta?: string;
  icon?: IconName;
  href?: string;
  description?: string;
  dates?: string;
  paragraphs?: string[];
  blocks?: ListItemBlock[];
};

export type ContentSectionData = {
  id: string;
  label: string;
  items: ListItemData[];
  supportsCardView?: boolean;
};

export const profile = {
  name: "Nimesh Mohanakrishnan",
  avatarSrc: "/assets/profile.svg",
  avatarAlt: "Portrait of Nimesh Mohanakrishnan",
  bioByTab: {
    work: "Product designer in Seattle, pursuing my master’s in HCDE at the University of Washington. I specialize in interaction design and prototyping, with experience designing end-to-end product experiences. Previously, I designed AI experiences for legal professionals at Knool and internal tools for contact center teams at RozieAI.",
    about:
      "Product designer in Seattle, pursuing my master’s in HCDE at the University of Washington. I specialize in interaction design and prototyping, with experience designing end-to-end product experiences. Previously, I designed AI experiences for legal professionals at Knool and internal tools for contact center teams at RozieAI.",
  },
} as const;

export const connect = {
  phoneDisplay: "+1 (253) 408-1856",
  phoneHref: "tel:+12534081856",
  email: "nimeshm.work@gmail.com",
  emailHref: "mailto:nimeshm.work@gmail.com",
  linkedInHref: "https://www.linkedin.com/in/nimeshm-work/",
  githubHref: "https://github.com/nimeshm05",
  xHref: "https://x.com/hoveroverhere",
  mediumHref: "https://nimeshmohanakrishnan.medium.com/"
} as const;

export const resume = {
  href: "#",
} as const;

export const workSections: ContentSectionData[] = [
  {
    id: "industry-projects",
    label: "Industry Projects",
    supportsCardView: true,
    items: [
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
    supportsCardView: true,
    items: [
      // {
      //   id: "digital-footprints",
      //   title: "Digital Footprints",
      //   icon: "footprints",
      //   href: "/work/digital-footprints",
      // },
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
    supportsCardView: true,
    items: [
      {
        id: "designing-beyond-the-interface",
        title: "Designing Beyond the Interface",
        icon: "notebook-pen",
        href: "https://nimeshmohanakrishnan.medium.com/designing-beyond-the-interface-what-contact-centers-taught-me-about-systems-thinking-ac164a68cc36",
      },
      {
        id: "note-to-myself",
        title: "A Note to Myself",
        icon: "notebook-pen",
        href: "https://nimeshmohanakrishnan.medium.com/a-note-to-myself-339b3e6b02c9",
      },
      {
        id: "connect-prompt",
        title: "Connect Prompt Component",
        icon: "notebook-pen",
        href: "https://nimeshmohanakrishnan.medium.com/a-note-to-myself-339b3e6b02c9",
      }
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
        description:
          "Currently on the AI workspace team, leading feature improvements to increase usage metrics. Doing bit of design, strategic work, & product analytics - start-up life :)",
        dates: "June 2026 – August 2026",
      },
      {
        id: "rozieai",
        title: "Product Designer,",
        meta: "RozieAI",
        description:
          "Led end-to-end design for a couple of internal tools like conversation insights and experience studio, which was used by clients like Air Canada.",
        dates: "August 2023 – August 2025",
      },
      {
        id: "rozieai-intern",
        title: "Product Design Intern,",
        meta: "RozieAI",
        description:
          "Partnered with Design Lead to maintain and scale the organization’s design system, improving component re-usability, styleguide, and design-to-dev handoff efficiency.",
        dates: "March 2023 – July 2023",
      },
      {
        id: "brane",
        title: "Software Engineer Intern,",
        meta: "Brane Enterprises",
        description:
          "Learned Flutter, software testing, and state management by building and shipping three core features and fixing 20+ bugs.",
        dates: "June 2021 – November 2021",
      },
      {
        id: "stanford",
        title: "Innovation Fellow,",
        meta: "Stanford d.school",
        description:
          "Announced as innovation fellow by the UIF community at Stanford d.school, also where I was trained in design thinking.",
        dates: "2019",
      },
    ],
  },
  {
    id: "education",
    label: "Education",
    items: [
      {
        id: "ms-hcde",
        title: "M.S. Human Centered Design & Engineering, ",
        meta: "Udub",
        description: "Mastering my skills in systems thinking, prototyping, and interaction design at the University of Washington.",
        dates: "September 2025 – July 2027 (Expected)",
      },
      {
        id: "beng-cse",
        title: "B.Eng. Computer Science & Engineering, ",
        meta: "VTU",
        description: "Gained skills in developing software systems at the Visvesvaraya Technological University.",
        dates: "August 2018 – July 2022",
      },
    ],
  },
  {
    id: "my-journey",
    label: "My Journey",
    items: [
      {
        id: "where-it-started",
        title: "Where it all started...",
        paragraphs: [
          "Okay, this is a long statement. But I promise there's a point.",
          "I was introduced to programming in 10th grade, and very quickly became fascinated by the fact that I could make things exist on a screen. I remember writing some HTML and CSS and being genuinely amazed that I could draw a box on a webpage. A box. I had just learned how the web worked, so this felt like some kind of magic trick. I could imagine something, write a few lines of code, and suddenly it existed. Better yet, I could control how it looked and behaved.",
          "That fascination with creating and controlling things eventually led me to study computer science. At the time, my goal was pretty straightforward: get better at building things for the web.",
          "Then, during my internship at Brane Enterprises, I started noticing that there was a whole lot more to building digital products than writing the code.",
          "I was working as a developer on a no-code platform and collaborating with designers and product managers. I started paying attention to how designers made decisions. They weren't just handing me screens to build. They were questioning the screens themselves. I remember working on a feature where users could add an intent. My instinct was to build it as a modal: click a button, modal opens, fill in some details, done. The designers came back and questioned whether a modal was actually the right way to approach the interaction.",
          "I don't remember the exact reason anymore. It was 2021, and apparently my brain decided that detail was optional. What I do remember is the realization: **there was an entire layer of thinking between an idea and its implementation that I hadn't learned to see yet.**",
          "That pulled me toward UX, and eventually into product design at RozieAI. There, I learned another important lesson: decoration is not UX. Making an interface look good is part of the job, but it isn't the job. The interesting part was understanding workflows, constraints, user needs, and business goals, then figuring out how they could come together in a useful solution.",
          "Over time, I realized I wanted to get better at the thinking behind those decisions. I could reason about interfaces and workflows, but I wanted a more structured way to think about the people, activities, and systems surrounding them. I didn't want to think of a user simply as someone interacting with a screen. I wanted to understand what they were doing, who else was involved, what constraints shaped their behavior, and how a product fit into the larger system.",
          "That realization led me to HCDE.",
          "Looking back, my path into design wasn't really a change of direction. It was a gradual move toward asking better questions about the things I was building.",
          'From **“How do I make this?”** to **“Why should this work this way?”** to **“What problem are we actually solving?”** and, eventually, **“What exists around the problem? What should exist? What should be subtracted?”**',
          "Apparently, I just really like asking questions.",
        ],
      },
      {
        id: "stride-forward",
        title: "The stride forward...",
        blocks: [
          {
            type: "paragraph",
            text: "In the age of AI, I've been thinking a lot about what I can actually contribute.",
          },
          {
            type: "paragraph",
            text: "Truth be told, that's a difficult question. When anyone with the right AI tools can learn a new skill, build something impressive, or produce a pretty commendable artifact in an afternoon, it's harder to convince myself that *being able to make things* is enough.",
          },
          {
            type: "paragraph",
            text: "Perhaps that's just how life works.",
          },
          {
            type: "paragraph",
            text: "Okay, enough philosophy that leads nowhere.",
          },
          {
            type: "paragraph",
            text: "When I think about what I want my contribution to be, I keep coming back to a few principles that have started shaping both how I design and how I live.",
          },
          { type: "paragraph", text: "**Subtraction.**" },
          { type: "callout", text: "I like removing things." },
          {
            type: "paragraph",
            text: "In design, I naturally look for what doesn't need to be there: an extra interaction, another piece of information, another decision the user has to make. If something doesn't add value, why make someone deal with it?",
          },
          {
            type: "paragraph",
            text: "I've started thinking about life in much the same way. Some connections, commitments, and systems are just noise. Not everything needs to come with me into the next chapter. Subtraction isn't about having less for the sake of having less. It's about making room for what actually matters.",
          },
          { type: "paragraph", text: "**Intent.**" },
          {
            type: "callout",
            text: "I've become increasingly interested in the idea of intent: knowing why something exists before figuring out how it should work.",
          },
          {
            type: "paragraph",
            text: "Living in America over the past year has made me notice this in people, too. Intent is captivating. When someone knows what they're trying to accomplish, their decisions become clearer, their communication becomes sharper, and their energy has somewhere to go.",
          },
          {
            type: "paragraph",
            text: 'I want that kind of clarity in my design work. Before asking *“What should we build?”*, I want to understand *“What are we actually trying to accomplish?”*',
          },
          { type: "paragraph", text: "**Progressive disclosure.**" },
          {
            type: "paragraph",
            text: "I'm still figuring out a better name for this one. But the idea is simple:",
          },
          { type: "callout", text: "don't reveal everything at once." },
          {
            type: "paragraph",
            text: "Interfaces do this. Good products don't make users understand the entire system before they can accomplish one task. They give people what they need, when they need it, and let the complexity reveal itself over time.",
          },
          {
            type: "paragraph",
            text: "I think life works the same way. I don't need to figure everything out at once. I can learn something when it becomes relevant, go deeper when I need to, and let the next layer reveal itself.",
          },
          {
            type: "paragraph",
            text: "These principles are still evolving. They're less like rules and more like a compass for how I want to think.",
          },
          {
            type: "paragraph",
            text: "And professionally, that thinking is pulling me toward the intersection of **design, product, and technology**.",
          },
          {
            type: "paragraph",
            text: "I want to work on problems where the answer isn't sitting neatly inside a design file. I want to understand the product, question the problem, shape the interaction, and use technology to explore the idea quickly. AI has made it possible for me to prototype experiences directly in code, test ideas faster, and get closer to the thing I'm imagining.",
          },
          {
            type: "paragraph",
            text: "I don't know exactly what my contribution will look like yet.",
          },
          {
            type: "paragraph",
            text: "But I know I want to be close to the problem, close to the product, and close enough to the technology to build the thing I'm imagining.",
          },
          {
            type: "paragraph",
            text: "Maybe that's the stride forward:",
          },
          {
            type: "callout",
            text: "I don't have the destination figured out yet. But I have a direction, a few principles, and plenty of things I still want to explore.",
          },
        ],
      },
    ],
  },
];

export const homeTabs = [
  { id: "work" as const, label: "Work" },
  { id: "about" as const, label: "About" },
];
