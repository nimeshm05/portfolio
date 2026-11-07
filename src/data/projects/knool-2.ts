import type { ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/knool-chat-experience/${path}`;

export const knool2: ProjectPageData = {
  slug: "knool-2",
  title: "Rethinking Knool's New Chat Experience",
  subtitle:
    "Turning a 20-option empty state into stage-aware prompts that show attorneys what the assistant can do for their case, right when they start a chat.",
  projectType: "Product Design",
  timeline: "June 2026 – September 2026",
  bannerSrc: asset("knool-initial-chat-experience-preview-2k.mp4"),
  bannerLargeSrc: asset("knool-initial-chat-experience-preview.mp4"),
  bannerAlt: "Knool case assistant first screen preview",
  bannerType: "video",
  listItemsAlwaysExpanded: true,
  nav: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "role", label: "Role", href: "#role" },
    { id: "problem", label: "Problem", href: "#problem" },
    { id: "insights", label: "Insights", href: "#insights" },
    { id: "foundations", label: "Foundations", href: "#foundations" },
    { id: "concept-1", label: "Concept 1", href: "#concept-1" },
    { id: "concept-2", label: "Concept 2", href: "#concept-2" },
    { id: "concept-3", label: "Concept 3", href: "#concept-3" },
    { id: "final-solution", label: "Final Solution", href: "#final-solution" },
    { id: "outcomes", label: "Outcomes", href: "#outcomes" },
    { id: "learning", label: "Learning", href: "#learning" },
  ],
  meta: {
    items: [
      { label: "Project Type", value: "Product Design" },
      { label: "Domain", value: "Legal Tech" },
      { label: "Timeline", value: "June 2026 – September 2026" },
      { label: "Role", value: "Product Intern" },
    ],
  },
  sections: [
    {
      id: "overview",
      heading: "An early-stage legal-tech start-up making the move to an agentic v2.0",
      paragraphs: [
        "Knool is a legal-tech start-up that builds an AI platform for litigation storytelling. In the move to an agentic v2.0, the case assistant, where 95% of usage happens, became the centre of the product. I redesigned how attorneys start a chat, with two goals: restore simplicity and deliver value on the first message.",
      ],
      beforeAfter: {
        before: {
          src: asset("knool-chat-before.webp"),
          alt: "Knool v1.0 assistant screen with a mode toggle, toolbar buttons and ten quick-prompt chips under the composer",
          caption: "a chat screen doing everything at once.",
        },
        after: {
          src: asset("knool-chat-after.webp"),
          alt: "Redesigned Knool assistant screen asking “What are we working on?” with one composer and case-stage chips",
          caption: "one question, one composer, prompts that fit the case.",
        },
        idleCaption: "Slide the image to compare",
      },
    },
    {
      id: "role",
      heading: "A self-initiated redesign, from spotting the problem to a working prototype",
      paragraphs: [
        "No one assigned this project. I saw that the case assistant’s first screen wasn’t helping attorneys get started, so I took on the redesign myself and carried it from discovery through prototyping. I began by auditing the existing screen and found 20 clickable elements, a mode choice, and shortcuts that behaved inconsistently. To understand how attorneys actually used it, I analyzed chip-click data across 37 labels in Amplitude and interviewed Knool’s in-house attorneys about how they work through a case.",
        "With that grounding, I framed the problem and explored three concepts. The final direction paired stage-based quick actions with a key detail from another concept: prompts fill the composer instead of sending right away, so attorneys stay in control. Finally, I prototyped this direction with Claude Code and refined the styling directly in code to get the small details right.",
      ],
    },
    {
      id: "problem",
      heading: "v1.0 showed everything at once, so a good first answer took real effort",
      items: [
        {
          id: "user-problem",
          title: "User problem",
          content: {
            type: "paragraphs-with-list",
            intro: [
              "Attorneys come to the assistant at different stages of a case, but v1.0 showed them everything at once. It was built quickly with AI, without a deliberate design pass, and it showed:",
            ],
            items: [
              "**Too many ways in.** Modes, sources, a prompt library, templates and 12 suggestion chips, small talk that didn’t make sense, all in one composer area.",
              "**Same look, different behaviour.** Some chips filled the input, others fired instantly, so users couldn’t trust a click.",
              "**Good prompts were buried.** A useful answer meant browsing a library before typing a word.",
            ],
          },
        },
        {
          id: "business-problem",
          title: "Business problem",
          content: {
            type: "paragraphs",
            paragraphs: [
              "v2.0 puts chat at the centre of Knool, and 95% of usage already happens there. Simplicity is what churned and retained users value most, and v1.0 had lost it. Every extra step before a useful first answer puts new-user activation and retention at risk.",
            ],
          },
        },
      ],
      callout:
        "How might we help attorneys get a solid result from their first message, without hunting for the right prompt?",
      calloutPostmark: { label: "THE QUESTION", center: "HMW", bottom: "KNOOL · 2026", rotate: -10 },
    },
    {
      id: "insights",
      heading: "Attorneys think in stages, struggle with prompts and won’t put up with effort",
      paragraphs: [
        "From interviews with two in-house attorneys, I gathered the following insights:",
      ],
      list: [
        "**Attorneys think in case stages.**\nShow what fits the current stage, not everything at once.",
        "**Attorneys rarely write good prompts.**\nGive them a strong prompt to start from.",
        "**Effort is the real competitor.**\nUsers who left chose Claude because it asked less of them. Every step before the first answer is a reason to leave.",
      ],
    },
    {
      id: "foundations",
      heading: "Three routes to a strong first prompt, judged on stage fit, prompt quality and effort",
      paragraphs: [
        "Before exploring concepts, I fixed the interface itself, alongside the new visual language for v2.0. To begin with, the greeting is gone. Attorneys open Knool to work, not to say good morning, so the screen asks “What are we working on?” The composer is the main element. Chat history lives in the navigation panel, next to the New Chat button, and everything else is a secondary action under the plus button. Once I’d ranked the actions into primary, secondary and tertiary, this decision was easy.",
      ],
      media: [
        {
          src: asset("new-without-chips.webp"),
          alt: "Stripped-back Knool chat screen asking “What are we working on?”, with chat history in the side panel and the plus menu open on Templates, Documents, Prompt Library and Perspectives",
          showBackground: true,
        },
      ],
      closingParagraphs: [
        "I judged each concept against the three insights: does it fit the case stage, does it hand over a strong prompt, and does it add as little effort as possible before the first answer? Each was a working prototype, tested with our in-house attorneys and reviewed by the Head of Product, the CEO and engineering.",
      ],
    },
    {
      id: "concept-1",
      heading: "Document chips\nRight for drafting, wrong for everything else",
      mediaFirst: true,
      media: [
        {
          src: asset("concept-document-based.mp4"),
          alt: "Document chips concept: document types beneath the composer insert a structured drafting prompt in one click",
          type: "video",
          aspectRatio: "3324 / 2160",
        },
      ],
      list: [
        "**Why I tried it**\nMost of what attorneys asked v1.0’s chat for was document drafting. Starting from the document turns a blank composer into a ready-made prompt.",
        "**What I designed**\nDocument types beneath the composer, each inserting a structured drafting prompt in one click. Litigation has 100 to 300+ document types, so I kept only the ones our users actually drafted.",
        "**What testing showed**\nAttorneys pointed out that drafting is only part of the job. They also use the assistant to analyse cases, and that isn’t a document. Even the trimmed list raised a question we couldn’t answer: where do all the other documents go?",
        "**Why I dropped it**\nIt fit one task, not the way attorneys work. The options were the same at every stage of a case, so they were never in context. It also boxed in an agent that can do far more than draft.",
      ],
      callout: "What carried forward\nOne click from a blank screen to a strong prompt.",
      calloutPostmark: { label: "TAKEAWAY", center: "01", bottom: "DOCUMENT CHIPS", rotate: 7 },
    },
    {
      id: "concept-2",
      heading: "Smart prompt suggestions\nWell liked, but slow and unreliable",
      mediaFirst: true,
      media: [
        {
          src: asset("concept-prompt-suggestion.mp4"),
          alt: "Smart prompt suggestions concept: after a pause in typing, the draft is rewritten into a suggested, better-structured prompt",
          type: "video",
          aspectRatio: "3324 / 2160",
        },
      ],
      list: [
        "**Why I tried it**\nAttorneys rarely write strong prompts, and browsing a library takes effort. Instead, they type naturally and AI suggests a better-structured prompt.",
        "**What I designed**\nAfter a 0.5 to 1 second pause in typing, the draft goes to a model. It reads the text, works out the intent and returns a suggested prompt based on our guidelines.",
        "**What testing showed**\nEveryone liked the prototype. But every suggestion meant waiting for a model to read, interpret and rewrite before the attorney got anywhere near an answer.",
        "**Why I dropped it**\nIt added a wait before the first answer, which the third insight warns against. Its output was also probabilistic: sometimes a strong prompt, sometimes not. Our in-house attorneys write good prompts, so testing never surfaced a misread, but new users are exactly the people who would hit one. In legal work, a suggestion that is sometimes wrong costs trust. I explored running it throughout the chat and alongside case stage, but the same unreliability applied everywhere.",
      ],
      callout: "What carried forward\nMeet attorneys at the composer, not inside a library.",
      calloutPostmark: { label: "TAKEAWAY", center: "02", bottom: "SMART PROMPTS", rotate: -6 },
    },
    {
      id: "concept-3",
      heading: "Case stage accordions\nThe only concept attorneys found no drawback in",
      mediaFirst: true,
      media: [
        {
          src: asset("concept-case-stage.mp4"),
          alt: "Case-stage concept: picking a case stage shows prompts for that stage beneath the composer",
          type: "video",
          aspectRatio: "3324 / 2160",
        },
      ],
      list: [
        "**Why I tried it**\nAttorneys think in case stages, and what they need changes with each one. Showing only the prompts for the current stage cuts dozens of options to a handful that matter now.",
        "**What I designed**\nPrompts beneath the composer, filtered to the case’s stage. Our in-house attorneys defined the stages and wrote the prompts, since legal content is their call.",
        "**What testing showed**\nIt was the only concept nobody found a drawback in. Attorneys recognised their own workflow in it.",
        "**Why I chose it**\nIt was the only concept that met all three criteria. It fits the stage, hands over a strong prompt written by attorneys, and adds no wait or AI guesswork before the first answer, because the prompts are fixed, not generated.",
      ],
      callout: "The catch\nEngineering asked the question that reshaped the design: where does the case stage come from?",
      calloutPostmark: { label: "THE CATCH", center: "03", bottom: "CASE STAGE", rotate: 9 },
    },
    {
      id: "final-solution",
      heading: "Attorneys pick the stage in chat, so nothing has to be stored or backfilled",
      mediaFirst: true,
      media: [
        {
          src: asset("knool-initial-chat-experience-preview-2k.mp4"),
          alt: "Final Knool chat screen: “What are we working on?”, one composer and six case-stage chips; picking a stage opens its actions, and an action’s prompt goes into the composer",
          type: "video",
          aspectRatio: "2048 / 1330",
        },
      ],
      paragraphs: [
        "The assistant opens on “What are we working on?”, one composer, and six stage chips from Pre-litigation to Trial. Picking a stage opens a panel of that stage’s actions. Expanding an action shows its prompts, and Use prompt puts one to work.",
        "Picking a stage is optional. Attorneys who know what they want just type, and the chips help new users find a strong place to start. Making it required would add a step for every attorney, including the ones who don’t need it, which goes against the effort principle the design is built on.",
      ],
      callout:
        "This one was a rollercoaster: I was juggling several responsibilities while rebuilding the chat interface.",
      calloutPostmark: { label: "REFLECTION", center: "V2.0", bottom: "KNOOL · 2026", rotate: -8 },
    },
    {
      id: "outcomes",
      heading: "In beta, measured by first-session activation and prompt usage",
      paragraphs: [
        "Since this is still in beta, these are the metrics I would capture to measure the design’s success:",
      ],
      list: [
        "**New-user activation**\nThe share of new users who send a first message and act on the response in their first session. Here, “act on” means downloading a draft or giving a response a thumbs up.",
        "**Prompt usage**\nThe share of new chats that start from a case-stage prompt.",
      ],
      mediaLayout: "tilted",
      media: [
        {
          src: asset("ceo.webp"),
          alt: "Slack message from Knool’s CEO thanking Nimesh for getting the design foundation done, with names blurred",
          showBackground: false,
        },
        {
          src: asset("jen.webp"),
          alt: "Slack thread where Nimesh shares the case-stage prototype and an in-house attorney replies that it’s brilliant and intuitive, with names blurred",
          showBackground: false,
        },
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
