import type { IconName } from "@/components/Icon/Icon";

export type BioParagraph = readonly string[];

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
  /** Short name, used in the sidebar */
  label: string;
  /** Section heading on the page; falls back to label */
  heading?: string;
  items: ListItemData[];
  supportsCardView?: boolean;
};

export const profile = {
  name: "@nimesh.mohanakrishnan",
  avatarSrc: "/assets/profile-jelly.webp",
  avatarAlt: "Portrait of Nimesh Mohanakrishnan",
  bio: [
    [
      "Product designer in Seattle,",
      "with 2+ years designing B2B software in early stage startups.",
      "I use thoughtful reduction to bring clarity to the complexity,",
      "And I design in code to turn ideas into reality."
    ],
    [
      "Currently pursuing MS in Human Centered Design & Engineering,",
      "at the University of Washington.",
    ]
  ],
} as const;

export const connect = {
  phoneDisplay: "Phone Number",
  phoneHref: "tel:+12534081856",
  email: "nimeshm.work@gmail.com",
  emailHref: "mailto:nimeshm.work@gmail.com",
  linkedInHref: "https://www.linkedin.com/in/nimeshm-work/",
  githubHref: "https://github.com/nimeshm05",
  xHref: "https://x.com/nimeshm_me",
  mediumHref: "https://nimeshmohanakrishnan.medium.com/"
} as const;

export const socialHoverIcons = {
  linkedin: "/assets/social-media-icons/linkedin.svg",
  github: "/assets/social-media-icons/github.svg",
  x: "/assets/social-media-icons/x.svg",
  medium: "/assets/social-media-icons/medium.svg",
  email: "/assets/social-media-icons/apple-mail.svg",
  phone: "/assets/social-media-icons/phone.svg",
} as const;

export const resume = {
  href: "https://drive.google.com/file/d/1PDmCOGi8dJJMie-l7Vh5ztorGKP4oord/view?usp=sharing",
} as const;

export const footerLinks = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: connect.linkedInHref,
    iconSrc: socialHoverIcons.linkedin,
  },
  {
    id: "github",
    label: "Github",
    href: connect.githubHref,
    iconSrc: socialHoverIcons.github,
  },
  {
    id: "x",
    label: "X",
    href: connect.xHref,
    iconSrc: socialHoverIcons.x,
  },
  {
    id: "medium",
    label: "Medium",
    href: connect.mediumHref,
    iconSrc: socialHoverIcons.medium,
  },
  {
    id: "email",
    label: "Email",
    href: connect.emailHref,
    iconSrc: socialHoverIcons.email,
  },
  { id: "resume", label: "Resume", href: resume.href },
] as const;

export const workSections: ContentSectionData[] = [
  {
    id: "industry-projects",
    label: "Work",
    heading: "Things I got paid for",
    supportsCardView: true,
    items: [
      {
        id: "knool-2",
        title: "Knool 2.0: Rethinking the Case Assistant's First Screen",
        icon: "scale",
        href: "/work/knool-2",
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
    label: "Play",
    heading: "Just for fun, honestly",
    supportsCardView: true,
    items: [
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
      {
        id: "connect-prompt",
        title: "Connect Prompt",
        icon: "notebook-pen",
        href: "/work/connect-prompt",
      },
    ],
  },
  {
    id: "writing",
    label: "Notes",
    heading: "Thinking out loud",
    items: [
      {
        id: "designing-beyond-the-interface",
        title: "Designing Beyond the Interface",
        href: "https://nimeshmohanakrishnan.medium.com/designing-beyond-the-interface-what-contact-centers-taught-me-about-systems-thinking-ac164a68cc36",
      },
      {
        id: "note-to-myself",
        title: "A Note to Myself",
        href: "https://nimeshmohanakrishnan.medium.com/a-note-to-myself-339b3e6b02c9",
      },
    ],
  },
];

export const aboutSections: ContentSectionData[] = [
  {
    id: "past-experience",
    label: "Experience",
    heading: "Where I've clocked in",
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
    heading: "Where I got schooled",
    items: [
      {
        id: "ms-hcde",
        title: "M.S. Human Centered Design & Engineering, ",
        meta: "Univeristy of Washington",
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
    label: "Journey",
    heading: "The plot so far",
    items: [
      {
        id: "a-box-on-a-screen",
        title: "A box on a screen",
        paragraphs: [
          "I first got into programming in 10th grade. I wrote a little HTML and CSS and managed to draw a box on a webpage. Just a box. But I'd only just learned how the web worked, so it honestly felt like a magic trick. I could imagine something, write a few lines of code, and there it was. And I got to decide how it looked and how it behaved.",
          "That feeling is what took me to computer science. There, I learned what I'd now call the science of making things: databases, microcontrollers, how to build something end to end. For my database class, I built a full-stack blog in Django. Whenever I wasn't sure how something should work, I'd just look at how other blogs did it and build that. I knew how to make things. It never really occurred to me to ask whether they should work that way.",
        ],
      },
      {
        id: "the-first-question",
        title: "The first question",
        paragraphs: [
          "As it turns out, someone else asked that question for me. In 2021, I was interning as a developer at Brane Enterprises, working on a no-code platform. I was building a feature that let users add an intent, and my instinct was a modal: click a button, fill in a few details, done. Then the designers came back with a question. Was a modal even the right interaction here?",
          "I wasn't annoyed. I was curious. Why would they pick one approach over another? So I started asking questions of my own, and learned that the information was dense enough to need its own page. The point wasn't just to let people enter it. It was to help them understand it.",
          "Honestly, I don't remember the rest of the details. It was 2021, and apparently my brain decided those were optional. What stuck with me was the realization that **there was a whole layer of thinking between an idea and its implementation, and I hadn't learned to see it yet.**",
        ],
      },
      {
        id: "decoration-is-not-ux",
        title: "Decoration is not UX",
        paragraphs: [
          "So I went looking for that layer. I started with the Google UX Design Certificate course, which taught me the process: research, define, ideate, card sorting, all of it. Not long after, I joined RozieAI as a design intern, and that's where real work started teaching me the things a process can't.",
          "My first job there was redesigning screens for Experience Studio, a no-code tool businesses used to build their own conversation workflows. About a year in, I got my own project: Conversation Insights, an analytics platform for Air Canada's contact centre managers.",
          "That project is where I learned that decoration is not UX. I kept spotting chances to polish the interface, but my users were a small group of power users. They didn't need delight. They needed the right information. The biggest improvements actually came from taking things away: a trend chart people kept skipping, a filter bar that had grown as big as the data it was filtering. And the biggest gap came from a question I never thought to ask. I'd researched how managers investigated an issue, but not how they decided an issue was worth investigating in the first place.",
        ],
      },
      {
        id: "am-i-asking-the-right-questions",
        title: "Am I asking the right questions?",
        paragraphs: [
          "That missed question stayed with me. I'd learned design on the job, one screen at a time, and part of me wondered whether I'd learned it the right way. Was I asking the right questions? Would I even know if I wasn't? I wanted a real foundation, especially in research, which I'd never formally practiced. That's what brought me to HCDE at the University of Washington.",
        ],
      },
      {
        id: "the-question-shapes-the-answer",
        title: "The question shapes the answer",
        paragraphs: [
          "I started finding answers sooner than I expected. In my usability testing class, we ran a study for an industry partner. One of our tasks asked participants to find “architectural recommendations you care about.” The first two participants struggled. So we changed it to “find specific architectural recommendations,” and the next three completed it.",
          "One phrase changed the result. That's when it clicked for me: a question isn't just how you find an answer. It decides which answers you can find at all.",
          "Looking back, I don't think my path into design was ever a change of direction. It was me slowly learning to ask better questions about the things I was building. From **“How do I make this?”** to **“Why should this work this way?”** to **“What problem are we actually solving?”** and now, **“What exists around the problem? What should exist? What should be subtracted?”**",
          "And yes, I still work in code. I don't write much of it by hand these days, but I use it to close the gap between design and implementation, that same layer I couldn't see back at Brane. The box is still there. I just ask why it should exist before I draw it.",
        ],
      },
      {
        id: "the-magic-again",
        title: "The magic, again",
        paragraphs: [
          "Lately, building with AI has given me the same feeling I had with that box. I can picture something, describe it, and watch it come together, sometimes in a single day. It's honestly magical.",
          "But here's the thing. That magic used to feel like mine, and now it's everyone's. Anyone with the right tools can pick up a new skill, build something impressive, or put together a polished artifact in an afternoon. So I've been sitting with a slightly uncomfortable question: if making things isn't the hard part anymore, what do I actually bring?",
        ],
      },
      {
        id: "whats-still-mine",
        title: "What's still mine",
        paragraphs: [
          "A few months ago, I built a game entirely with AI tools. It's called kar-no-key: one person makes a room, shares a short code, and everyone races each other one lyric at a time. No accounts, nothing to sign up for. Front end, back end, all of it, in a matter of days.",
          "Then I realized something. Nobody was going to click “Leave game.” People just close the tab. But the game didn't know that, so it still thought they were in the room. The next time they opened it, it told them they were already in a game. And if the person who left was the host, their friends were stuck in a room with nobody running it.",
          "My first idea was a popup: “Leave the game?” Turns out that can't exist. When you close a tab, the browser just shuts the page down. The site doesn't get to ask you anything. So we went with a heartbeat instead. As long as your tab is open, it quietly lets the game know you're still there. Close the tab, and the heartbeat stops.",
          "Then I asked the question the AI hadn't: what about someone who's still there, just not clicking? Someone waiting for their friends, or thinking about the next lyric? They shouldn't get kicked out for being quiet. And they don't, because the heartbeat comes from the open tab, not from clicks. If the host leaves, the room doesn't disappear either. Someone else just takes over.",
          "That's what made it make sense for me. The building is getting easier. The questions are still mine. And when I look at the questions I keep asking, they tend to come back to two ideas that have started shaping how I design, and honestly, how I live.",
        ],
      },
      {
        id: "subtraction",
        title: "Subtraction",
        blocks: [
          { type: "paragraph", text: "The first one is simple:" },
          { type: "callout", text: "I like removing things." },
          {
            type: "paragraph",
            text: "When I design, I'm always looking for what doesn't need to be there. An extra interaction, another piece of information, one more decision the user has to make. If it doesn't add value, why make anyone deal with it?",
          },
          {
            type: "paragraph",
            text: "I'm doing exactly this right now on Knool, an AI workspace for attorneys. Over time, the case assistant's first screen had grown to 20 clickable elements and 37 shortcut labels, a lot of them duplicates. Fifteen of those shortcuts together got under 2% of clicks. So most of the redesign came down to deciding what to take away.",
          },
          {
            type: "paragraph",
            text: "I've started practicing this outside of work too. For me, subtraction isn't about having less for the sake of less. It's about making room for what actually matters.",
          },
        ],
      },
      {
        id: "progressive-disclosure",
        title: "Progressive disclosure",
        blocks: [
          {
            type: "paragraph",
            text: "The second idea goes hand in hand with the first:",
          },
          { type: "callout", text: "don't reveal everything at once." },
          {
            type: "paragraph",
            text: "Good products don't make you understand the whole system before you can do one thing. They give you what you need, when you need it. On Knool, that meant paying attention to how attorneys think. They see a case as a timeline: pleadings, discovery, depositions, trial. So instead of showing every shortcut at once, the assistant now offers what's useful for the stage the case is in, and the next layer shows up when it's needed.",
          },
          {
            type: "paragraph",
            text: "One small detail matters a lot here, too. Shortcuts now fill in the prompt instead of sending it straight away. The attorney gets to look it over first, so they're still in control before the agent does anything.",
          },
        ],
      },
      {
        id: "where-im-headed",
        title: "Where I'm headed",
        paragraphs: [
          "I'll be honest, these ideas are still taking shape. They feel less like rules and more like a compass.",
          "Right now, that compass is pointing me toward AI agents, agent tools, and developer tools, at the scale of products used by millions of people. So far, I've mostly designed for small groups of power users. But as agents take on more of our work, that question from kar-no-key gets a lot bigger: what happens to the person in the room? That's the question I want to work on, at scale, while staying close enough to the technology to build what I'm imagining.",
          "Do I have the destination figured out? Not yet. But I've made peace with that. Like a good interface, the next layer tends to show up when it's relevant. For now, I've got a direction, two ideas I believe in, and plenty of questions I still want to ask.",
        ],
      },
    ],
  },
];

/** Work, then everything about me, in one continuous scroll */
export const homeSections: ContentSectionData[] = [
  ...workSections,
  ...aboutSections,
];

export type WorkStampTone = "green" | "lime" | "teal";
export type WorkStampEmblem = "drafting" | "ripple" | "tiles";

export type WorkStampData = {
  id: string;
  company: string;
  role: string;
  dates: string;
  tone: WorkStampTone;
  emblem: WorkStampEmblem;
};

/** The stamp stack under the header bio; the first stamp sits on top */
export const workStamps: readonly WorkStampData[] = [
  {
    id: "knool",
    company: "Knool",
    role: "Product Designer",
    dates: "Mar 2026 - Jun 2026",
    tone: "green",
    emblem: "drafting",
  },
  {
    id: "rozieai",
    company: "RozieAI",
    role: "Product Designer",
    dates: "Mar 2023 - Aug 2025",
    tone: "lime",
    emblem: "ripple",
  },
  {
    id: "brane",
    company: "Brane",
    role: "SDE Intern",
    dates: "Jun 2021 - Nov 2021",
    tone: "teal",
    emblem: "tiles",
  },
];
