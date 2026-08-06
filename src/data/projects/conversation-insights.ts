import type { ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/conversation-insights/${path}`;

export const conversationInsights: ProjectPageData = {
  slug: "conversation-insights",
  title: "Conversation Insights",
  subtitle:
    "An analytics platform built to overcome manual workflow problem to enable faster operational decision making.",
  bannerSrc: asset("conversation-insights-banner.mp4"),
  bannerAlt: "Conversation Insights dashboard preview",
  bannerType: "video",
  nav: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "problem", label: "Problem", href: "#problem" },
    { id: "discovery", label: "Discovery & Insights", href: "#discovery" },
    { id: "constraints", label: "Constraints" },
    { id: "early-designs", label: "Early Designs" },
    { id: "learnings", label: "Learnings" },
    { id: "solutions", label: "Solutions" },
    { id: "outcome", label: "Outcome" },
    { id: "reflection", label: "Reflection" },
  ],
  overview: {
    heading: "Overview",
    paragraphs: [
      "Conversation Insights is a self-serve analytics platform built for Air Canada's contact centre (CC) teams. Every day, hundreds of thousands of customers call Air Canada's contact centre to resolve their issues. RozieAI's AI models process these calls to identify emerging trends and operational signals. Before the platform existed, these insights were delivered to the Air Canada CC team members through weekly reports which were manually crafted by RozieAI product owners, making it difficult for the members to independently investigate issues, understand their operational impact, and take timely action.",
      "As the product designer on the Conversation Insights team, I led the end-to-end design of a dashboard experience that brought AI-generated insights, operational data into a single self-serve workflow, enabling teams to move from identifying issues to taking operational action without relying on manual reports.",
    ],
  },
  problem: {
    eyebrow: "Problem",
    heading:
      "Customer issue investigation was fragmented across reports, systems, and people, which slowed operational decisions.",
    paragraphs: [
      "Before Conversation Insights platform existed, AI-generated insights were delivered through weekly reports prepared by RozieAI product owners. These reports helped Air Canada contact centre teams identify emerging issues, but understanding where and why those issues were occurring required investigation across multiple sources.",
      "Air Canada contact centre teams often moved between reports, AWS Connect portal, and follow-up discussions with RozieAI stakeholders to connect insights with operational data. This fragmented workflow slowed their operational decision-making.",
    ],
    imageSrc: asset("problem.svg"),
    imageAlt:
      "Diagram showing fragmented investigation across Outlook, Teams, Excel, Word, and AWS Connect",
  },
  calloutOne:
    "The opportunity was to transform customer issue investigation into a self-serve workflow, enabling contact centre teams to independently understand and act on customer issues.",
  discovery: {
    eyebrow: "Discovery & Insights",
    heading:
      "Understanding the system - users, data, & how teams analyzed customer issues.",
    paragraphs: [
      "Before diving into design, I initiated conversations with RozieAI product owners, data scientists, and Air Canada stakeholders to understand how insights were generated, delivered, and operationalized.",
      "I started here because designing a self-serve workflow without first understanding the existing investigation behavior risked solving the wrong problem - building a faster way to deliver the same static reports, rather than addressing the actual workflow underneath them.",
    ],
    items: [
      {
        id: "who-are-the-users",
        title: "Who are the users?",
        icon: "users",
        content: {
          type: "paragraphs-with-list",
          intro: [
            "The contact centre operations team we were serving mainly consisted of the following two personas:",
          ],
          items: [
            "Contact centre managers who were mainly interested in knowing the emerging issues and determining where attention was needed.",
            "Operation analysts who focused on understanding issues and tracing them back to specific calls in order to deliver operation insights.",
          ],
        },
      },
      {
        id: "what-type-of-data",
        title: "What type of data was being shared?",
        icon: "database",
        content: {
          type: "paragraphs-with-list",
          intro: [
            "By surfacing with the data scientist, I learned the taxonomy of data that was shared with the teams:",
          ],
          items: [
            "AI-derived signals such as primary topics, root causes, and sentiment helped summarize what customers were experiencing.",
            "Operational metadata from the AWS Connect call system, including routing profiles, queues, and agent-level attributes, provided context on who & how those conversations were handled.",
          ],
        },
        imageSrc: asset("data.svg"),
        imageAlt:
          "Diagram comparing AI-derived signals with AWS Connect operational metadata",
      },
      {
        id: "how-teams-analyze",
        title: "How did teams analyze issues?",
        icon: "bug",
        content: {
          type: "paragraphs",
          paragraphs: [
            "In order to understand how Air Canada contact centre teams approached analyzing customer issues, I conducted 6 interviews with team members. I found that insights were rarely consumed in isolation. Instead, they served as starting points for a broader analysis into their operational metadata.",
            "The teams consistently followed this investigation workflow:",
          ],
        },
        imageSrc: asset("workflow.svg"),
        imageAlt:
          "Flowchart of the contact centre investigation workflow from insight to operational action",
      },
      {
        id: "insights",
        title: "Insights",
        icon: "bug",
      },
    ],
  },
  calloutTwo:
    "So, how might we enable Air Canada contact centre teams to independently investigate customer issues from identification to operational action?",
};
