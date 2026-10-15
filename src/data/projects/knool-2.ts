import type { ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/knool-chat-experience/${path}`;

export const knool2: ProjectPageData = {
  slug: "knool-2",
  title: "Rethinking Knool's New Chat Experience",
  subtitle:
    "Turning a 20-option empty state into stage-aware prompts that show attorneys what the assistant can do for their case, right when they start a chat.",
  projectType: "Product Design",
  timeline: "June 2026 – August 2026",
  bannerSrc: asset("knool-initial-chat-experience-preview.mp4"),
  bannerAlt: "Knool case assistant first screen preview",
  bannerType: "video",
  listItemsAlwaysExpanded: true,
  nav: [
    { id: "contributions", label: "My Contributions", href: "#contributions" },
    { id: "learning", label: "Learning", href: "#learning" },
  ],
  meta: {
    items: [
      { label: "Project Type", value: "Product Design" },
      { label: "Domain", value: "Legal Tech" },
      { label: "Timeline", value: "June 2026 – August 2026" },
      { label: "Role", value: "Product Intern" },
    ],
  },
  notice: "This project is under NDA.\nPlease reach out to learn more.",
  sections: [
    {
      id: "contributions",
      heading: "A self-initiated redesign, from spotting the problem to a working prototype",
      paragraphs: [
        "No one assigned this project. I saw that the case assistant’s first screen wasn’t helping attorneys get started, so I took on the redesign myself and carried it from discovery through prototyping. I began by auditing the existing screen and found 20 clickable elements, a mode choice, and shortcuts that behaved inconsistently. To understand how attorneys actually used it, I analyzed chip-click data across 37 labels in Amplitude and interviewed Knool’s in-house attorneys about how they work through a case.",
        "With that grounding, I framed the problem and the How Might We, set three criteria for judging ideas (relevant, first result, simple), and explored three concepts against them. The final direction paired stage-based quick actions with a key detail from another concept: prompts fill the composer instead of sending right away, so attorneys stay in control. Finally, I prototyped this direction with Claude Code and refined the styling directly in code to get the small details right.",
      ],
    },
    {
      id: "learning",
      heading: "What leading this project on my own taught me",
      items: [
        {
          id: "leading-without-a-brief",
          title: "Leading without a brief",
          content: {
            type: "paragraphs",
            paragraphs: [
              "No one handed me this problem, so no one defined what “done” looked like either. I had to decide the scope myself, justify why it mattered, and keep the work moving without a deadline pushing me. I learned that initiative isn’t just starting something. It’s building enough evidence that others want to see it through with you.",
            ],
          },
        },
        {
          id: "letting-evidence-settle-the-debate",
          title: "Letting evidence settle the debate",
          content: {
            type: "paragraphs",
            paragraphs: [
              "Coming in, I had my own opinions about what the screen needed. Pairing Amplitude data with attorney interviews taught me to hold those opinions loosely. The data told me what attorneys did, and the conversations told me why. Having both made my design decisions far easier to defend than my instincts alone would have been.",
            ],
          },
        },
        {
          id: "designing-in-code",
          title: "Designing in code",
          content: {
            type: "paragraphs",
            paragraphs: [
              "Prototyping with Claude Code let me move past static mockups and feel the interaction for real, like the difference between a prompt that fills the composer and one that sends on click. Refining the styling in code also taught me how much the small details depend on implementation, and how much faster I can iterate when I’m not handing off every change.",
            ],
          },
        },
        {
          id: "simplicity-takes-work",
          title: "Simplicity takes work",
          content: {
            type: "paragraphs",
            paragraphs: [
              "Cutting chips that drew under 2% of clicks sounded easy, but deciding what to leave out was the hardest part of the project. I came away believing that keeping a product simple is a deliberate choice you make again with every new capability, especially as an agent grows more powerful.",
            ],
          },
        },
      ],
      media: [
        {
          src: asset("knool-pd-huddle.jpg"),
          alt: "Product design huddle with the Knool team on a video call",
          showBackground: true,
        },
      ],
    },
  ],
};
