import type { ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/conversation-insights/${path}`;

export const conversationInsights: ProjectPageData = {
  slug: "conversation-insights",
  title: "Conversation Insights",
  subtitle:
    "An analytics platform built to overcome manual workflow problem to enable faster operational decision making.",
  projectType: "Product Design - Internal Tool",
  timeline: "Q4 2024 - Q2 2025",
  cardDescription:
    "A self-serve analytics platform that enabled Air Canada's contact centre teams (customer) to analyze customer conversations directly.",
  bannerSrc: asset("conversation-insights-preview.mp4"),
  bannerAlt: "Conversation Insights dashboard preview",
  bannerType: "video",
  bannerBackgroundSrc: asset("background.svg"),
  nav: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "problem", label: "Problem", href: "#problem" },
    { id: "discovery", label: "Discovery & Insights", href: "#discovery" },
    { id: "constraints", label: "Constraints", href: "#constraints" },
    { id: "early-designs", label: "Early Designs", href: "#early-designs" },
    { id: "learnings", label: "Learnings", href: "#learnings" },
    { id: "solutions", label: "Solutions" },
    { id: "outcome", label: "Outcome" },
    { id: "reflection", label: "Reflection" },
  ],
  // overview: {
  //   eyebrow: "Overview",
  //   heading: "For those skimming quickly, here’s what you need to know...",
  //   items: [
  //     {
  //       id: "context",
  //       title: "Context",
  //       icon: "globe",
  //       content: {
  //         type: "paragraphs",
  //         paragraphs: [
  //           "Conversation Insights is an enterprise analytics platform developed by RozieAI for Air Canada's contact centre teams. The platform uses AI to analyze hundreds of thousands of customer conversations, surfacing trends and operational signals that help teams understand customer issues at scale. Although initially built to meet Air Canada's operational needs, the product was designed as a scalable solution for future enterprise customers.",
  //         ],
  //       },
  //     },
  //     {
  //       id: "problem",
  //       title: "Problem",
  //       icon: "target",
  //       content: {
  //         type: "paragraphs",
  //         paragraphs: [
  //           "Before Conversation Insights, these insights were delivered through manually prepared weekly reports created by RozieAI's product team. This made it difficult for Air Canada's contact centre teams to independently investigate emerging issues, understand their operational impact, and take timely action.",
  //         ],
  //       },
  //     },
  //     {
  //       id: "my-role",
  //       title: "My Role",
  //       icon: "user-star",
  //       content: {
  //         type: "paragraphs-with-list",
  //         intro: ["I led the design for dashboard experience which included:"],
  //         items: [
  //           "Conducted user conversations with Air Canada's contact centre teams to understand workflows, pain points, and opportunities.",
  //           "Created high-fidelity mockups and prototypes in Figma to communicate and validate design solutions.",
  //           "Collaborated with engineering teams to ensure designs were technically feasible and aligned with product constraints.",
  //         ],
  //       },
  //     },
  //     {
  //       id: "solution",
  //       title: "Solution",
  //       icon: "lightbulb",
  //       content: {
  //         type: "paragraphs",
  //         paragraphs: [
  //           "I designed a dashboard that combined AI-generated conversation insights with operational metrics, enabling teams to discover trends, investigate root causes, and move from insight to action within a single experience.",
  //         ],
  //       },
  //     },
  //     {
  //       id: "outcome",
  //       title: "Outcome",
  //       icon: "trophy",
  //       content: {
  //         type: "paragraphs",
  //         paragraphs: [
  //           "Conversation Insights replaced a manual reporting workflow with a self-serve analytics platform, empowering Air Canada's contact centre teams to access insights on demand while laying the foundation for a product that could scale to future enterprise customers.",
  //         ],
  //       },
  //     },
  //   ],
  // },
  overview: {
    eyebrow: "Overview",
    heading: "Analytics Platform for Air Canada's Contact Centre Managers",
    paragraphs: [
      "Conversation Insights is an enterprise analytics platform developed by RozieAI for Air Canada's contact centre managers (users). The platform uses AI to analyze hundreds of thousands of customer conversations, surfacing trends and operational signals that help teams understand customer issues at scale. Although initially built to meet Air Canada's operational needs, the product was designed as a scalable solution for future enterprise customers.",
    ],
  },
  problem: {
    eyebrow: "Problem",
    heading:
      "Customer issue investigation was fragmented across reports, systems, and people, which slowed operational decisions.",
    paragraphs: [
      "Before Conversation Insights platform existed, AI-generated insights were delivered through weekly reports prepared by RozieAI product owners. These reports helped users identify emerging issues, but understanding where and why those issues were occurring required investigation across multiple sources.",
      "Users often moved between reports, AWS Connect portal, and follow-up discussions with RozieAI stakeholders to connect insights with operational data. This fragmented workflow slowed their operational decision-making.",
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
            "The users were mainly Air Canada's contact centre managers who were mainly interested in the following",
          ],
          items: [
            "Identify emerging issues (insights) to determine where attention was needed.",
            "Use those insights to trace them back to specific calls to understand contact centre operations data.",
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
            "Operations data from the AWS Connect call system, including routing profiles, queues, and agent-level attributes, provided context on who & how those conversations were handled.",
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
            "In order to understand how users approached analyzing customer issues, I conducted 6 interviews with team members. I found that insights were rarely consumed in isolation. Instead, they served as starting points for a broader analysis into their operational metadata.",
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
    "So, how might we enable Air Canada contact centre managers to independently investigate customer issues from identification to operational action?",
  constraints: {
    eyebrow: "Constraints",
    heading:
      "Business wanted to ship fast and engineering wasn't ready to build new components or patterns.",
    paragraphs: [
      "RozieAI needed to demonstrate value to Air Canada ahead of a contract renewal, while engineering had only days to build a working release. There wasn't enough time to design the product from scratch, so we reused patterns and components from another RozieAI product.",
      "I couldn't control the decision to reuse those patterns, but I could control how we validated them. We shipped quickly and set up weekly sessions with Air Canada teams to observe how they actually used the product, using those sessions to identify where the reused patterns fell short.",
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
        content: {
          type: "paragraphs",
          paragraphs: [
            'Charts anchored the middle because identifying patterns (spikes in topic frequency, shifts in sentiment) was how teams moved from "something might be wrong" to "here\'s what needs attention." I prioritized the visualizations that mapped to the highest-ranked metrics from stakeholder conversations, since those were the signals teams already knew to look for.',
          ],
        },
        imageSrc: asset("initial-solution/Iteration 1 - Top View.png"),
        imageAlt:
          "Early design showing visualization charts for conversation insights",
      },
      {
        id: "data-table-operational-metadata",
        title: "Data Table Operational Metadata",
        icon: "database",
        content: {
          type: "paragraphs",
          paragraphs: [
            "The data table followed because tracing operational impact always came last. Once teams identified an issue, they needed to connect it to specific queues, routing profiles, or agents. Placing the table below the charts preserved that natural hand-off from insight to investigation.",
          ],
        },
        imageSrc: asset("initial-solution/Iteration 1 - Bottom View.png"),
        imageAlt:
          "Early design showing the operational metadata data table below charts",
      },
      {
        id: "column-and-date-filters",
        title: "Column and Date Filters",
        icon: "bug",
        content: {
          type: "paragraphs",
          paragraphs: [
            "Filters came first because scoping a time window was always the entry point to any investigation. Without it, teams couldn't frame what they were looking at. I also made date and column filters apply to both the charts and the data table simultaneously, so teams could scope their analysis once and have both information layers update together. Splitting filter state across the two would have forced teams to re-scope twice, partially recreating the fragmentation the product was designed to eliminate.",
          ],
        },
        imageSrc: asset("initial-solution/Iteration 1 - Filters.png"),
        imageAlt:
          "Early design showing shared column and date filters for charts and table",
      },
    ],
    closingParagraphs: [
      "The deeper constraint I was designing against: AI-derived signals and operational metadata had previously lived in separate places, forcing teams to piece together a picture across reports and systems. Combining both layers in a single scrollable view was the core structural decision, not a layout preference, but a direct response to where the workflow broke down.",
    ],
  },
  learnings: {
    eyebrow: "Learnings from User Test Sessions",
    heading: "Evolving designs based on user feedback and constraints",
    paragraphs: [
      "After releasing the first version of the product, we conducted weekly feedback calls with our users to identify points of friction and additional requirements. Here's a list of all the problems from multiple user test sessions.",
    ],
    items: [
      {
        id: "users-preferred-direct-answers",
        title: "Users preferred direct answers",
        icon: "users",
        content: {
          type: "paragraphs",
          paragraphs: [
            'Over a few weeks of feedback calls, I noticed teams consistently bypassed the interactive charts and went straight to conversation records. When I looked closer at what they actually wanted, it wasn\'t complex: for a topic like "Bookings," they just wanted to see the label and its call count, like 1,345 calls. That was the insight. They didn\'t need to hover across a trend line or compare it against other topics to get there.',
            'The chart I designed assumed users wanted to explore how an issue moved over time: is this topic trending up, how does it compare to others this week. But for a lot of what teams needed first, the question wasn\'t "how is this trending," it was "what are the biggest issues right now, and how many calls does each represent." I\'d designed for exploration when what was needed, at least as a starting point, was a direct, scannable summary.',
          ],
        },
        imageSrc: asset("learnings/old-chart.png"),
        imageAlt:
          "Early chart visualization that users bypassed in favor of direct conversation records",
      },
      {
        id: "filtering-didnt-scale",
        title: "Filtering didn't scale with complex investigations.",
        icon: "database",
        content: {
          type: "paragraphs",
          paragraphs: [
            'The filter pattern we reused to hit the initial launch, built originally for a product with simpler filtering needs, started breaking down as investigations grew more complex. During the bi-weekly calls, I watched users apply several filters, then struggle to relocate a specific one they\'d already set among the chips stacked across the toolbar. Each chip showed only a count ("Primary Topics: 12 selected"), so once five or six were applied, users had to open chips one by one to find the one they actually wanted to check or adjust.',
            "The deeper issue wasn't just the pattern itself; it was what the pattern was doing to the page. Filters had grown to occupy as much visual space as the data they were meant to scope. That inverted the priority of the dashboard: filters are an affordance to control what data is visible, not the content users came to see. Once filtering started competing with the charts and table for attention, the product was asking users to work through the tool before they could get to the information.",
          ],
        },
        imageSrc: asset("learnings/old-filters.png"),
        imageAlt:
          "Early filter toolbar with stacked chips that became hard to manage during complex investigations",
      },
      {
        id: "gap-in-discovery",
        title: "A gap in discovery, not a cut made under pressure.",
        icon: "settings",
        content: {
          type: "paragraphs",
          paragraphs: [
            "Another gap that surfaced during feedback calls was that teams relied on operational metrics, like call volume and resolution rate, to decide whether an issue needed attention in the first place. This wasn't something I'd cut for time; it was something my discovery interviews hadn't surfaced. My original interviews focused on how teams moved through an investigation once they'd identified an issue worth digging into. What I hadn't fully asked was: how do you decide something is worth investigating at all? That earlier decision point turned out to depend heavily on these operational numbers, and it was a blind spot in my initial research scope rather than a deliberate tradeoff.",
          ],
        },
      },
    ],
  },
};
