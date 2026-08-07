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
  bannerBackgroundSrc: asset("background-1.png"),
  nav: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "problem", label: "Problem", href: "#problem" },
    { id: "discovery", label: "Discovery & Insights", href: "#discovery" },
    { id: "constraints", label: "Constraints", href: "#constraints" },
    { id: "early-designs", label: "Early Designs", href: "#early-designs" },
    { id: "learnings", label: "Learnings" },
    { id: "solutions", label: "Solutions" },
    { id: "outcome", label: "Outcome" },
    { id: "reflection", label: "Reflection" },
  ],
  overview: {
    eyebrow: "Overview",
    heading: "For those skimming quickly, here’s what you need to know...",
    items: [
      {
        id: "context",
        title: "Context",
        icon: "globe",
        content: {
          type: "paragraphs",
          paragraphs: [
            "Conversation Insights is an enterprise analytics platform developed by RozieAI for Air Canada's contact centre teams. The platform uses AI to analyze hundreds of thousands of customer conversations, surfacing trends and operational signals that help teams understand customer issues at scale. Although initially built to meet Air Canada's operational needs, the product was designed as a scalable solution for future enterprise customers.",
          ],
        },
      },
      {
        id: "problem",
        title: "Problem",
        icon: "target",
        content: {
          type: "paragraphs",
          paragraphs: [
            "Before Conversation Insights, these insights were delivered through manually prepared weekly reports created by RozieAI's product team. This made it difficult for Air Canada's contact centre teams to independently investigate emerging issues, understand their operational impact, and take timely action.",
          ],
        },
      },
      {
        id: "my-role",
        title: "My Role",
        icon: "user-star",
        content: {
          type: "paragraphs-with-list",
          intro: ["I led the design for dashboard experience which included:"],
          items: [
            "Conducted user conversations with Air Canada's contact centre teams to understand workflows, pain points, and opportunities.",
            "Created high-fidelity mockups and prototypes in Figma to communicate and validate design solutions.",
            "Collaborated with engineering teams to ensure designs were technically feasible and aligned with product constraints.",
          ],
        },
      },
      {
        id: "solution",
        title: "Solution",
        icon: "lightbulb",
        content: {
          type: "paragraphs",
          paragraphs: [
            "I designed a dashboard that combined AI-generated conversation insights with operational metrics, enabling teams to discover trends, investigate root causes, and move from insight to action within a single experience.",
          ],
        },
      },
      {
        id: "outcome",
        title: "Outcome",
        icon: "trophy",
        content: {
          type: "paragraphs",
          paragraphs: [
            "Conversation Insights replaced a manual reporting workflow with a self-serve analytics platform, empowering Air Canada's contact centre teams to access insights on demand while laying the foundation for a product that could scale to future enterprise customers.",
          ],
        },
      },
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
      "I first aligned with RozieAI product owners, data scientists, and Air Canada stakeholders to understand how insights were generated, delivered, and used. This helped me avoid simply recreating static reports and instead design a self-serve experience that supported the underlying investigation workflow.",
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
  constraints: {
    eyebrow: "Constraints",
    heading:
      "Business wanted to ship fast and engineering wasn't ready to build new components or patterns.",
    paragraphs: [
      "Two constraints shaped the initial phase. RozieAI needed to demonstrate value to Air Canada ahead of a contract renewal, and a working release (not a wireframe) was what would reinforce that trust. At the same time, engineering had only days, not weeks, to build. There wasn't room to design something new from ground-up for this product, so the product owner made the call: reuse the patterns and components already built for another RozieAI product, rather than design something new here.",
      "I didn't have room to design the ideal solution; the decision was made for the sake of shipping. What I could still control was how we'd know if that decision was wrong. Instead of just shipping and moving on, we set up weekly calls with Air Canada teams, where they'd share their screen and walk through how they were actually using the product to analyze issues. That gave us a plan: ship fast now, and use direct observation, not just what users said but what they actually did, to find out where the reused patterns broke.",
    ],
  },
  earlyDesigns: {
    eyebrow: "Early Designs",
    heading: "Initial Product Hypothesis",
    paragraphs: [
      "The investigation workflow I uncovered during discovery gave me a clear structure to design against. Teams consistently moved through four stages - Scope, Identify, Understand, Trace — and the product needed to support that sequence, not just surface data. This shaped three decisions in the initial layout.",
    ],
    items: [
      {
        id: "visualisation-for-insights",
        title: "Visualisation for Insights",
        icon: "users",
      },
      {
        id: "data-table-operational-metadata",
        title: "Data Table Operational Metadata",
        icon: "database",
      },
      {
        id: "column-and-date-filters",
        title: "Column and Date Filters",
        icon: "bug",
      },
    ],
  },
};
