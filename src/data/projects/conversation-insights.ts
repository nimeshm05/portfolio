import type { ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/conversation-insights/${path}`;

export const conversationInsights: ProjectPageData = {
  slug: "conversation-insights",
  title: "Conversation Insights",
  subtitle:
    "Eliminating manual insight reporting in contact centers with self-serve analytics platform to enable faster operational decision making.",
  projectType: "Product Design - Internal Tool",
  timeline: "Q4 2024 - Q2 2025",
  bannerSrc: asset("conversation-insights-preview.mp4"),
  bannerAlt: "Conversation Insights dashboard preview",
  bannerType: "video",
  bannerBackgroundSrc: "/assets/projects/background.png",
  nav: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "problem", label: "Problem", href: "#problem" },
    { id: "discovery", label: "Discovery & Insights", href: "#discovery" },
    { id: "constraints", label: "Constraints", href: "#constraints" },
    { id: "early-designs", label: "Early Designs", href: "#early-designs" },
    { id: "learnings", label: "Learnings", href: "#learnings" },
    { id: "solutions", label: "Solutions", href: "#solutions" },
    { id: "outcome", label: "Outcome", href: "#outcome" },
    { id: "reflection", label: "Reflection", href: "#reflection" },
  ],
  meta: {
    items: [
      { label: "Company", value: "RozieAI Labs" },
      { label: "Client", value: "Air Canada" },
      { label: "Timeline", value: "Q3 2024 - Q3 2025" },
      { label: "Role", value: "Product Designer" },
    ],
  },
  overview: {
    eyebrow: "Overview",
    heading: "Analytics Platform for Air Canada's Contact Centre Managers",
    paragraphs: [
      "Conversation Insights is an enterprise analytics platform developed by RozieAI for Air Canada's contact centre managers (users). The platform uses AI to analyze hundreds of thousands of customer conversations, surfacing trends and operational signals that help managers understand their customer issues at scale. Although initially built to meet Air Canada's operational needs, the product was designed as a scalable solution for future enterprise customers.",
    ],
  },
  problem: {
    eyebrow: "Problem",
    heading:
      "Air Canada contact centre managers had access to AI-generated insights, but not a way to investigate them independently",
    paragraphs: [
      "Before Conversation Insights, AI-generated insights were delivered through weekly reports prepared by RozieAI product owners. While these reports helped Air Canada teams identify emerging issues, they provided limited context for understanding where those issues were occurring or what was driving them.",
      "Investigating an issue meant moving between reports, AWS Connect, and follow-up discussions with RozieAI stakeholders to piece together the operational context. Users therefore depended on a fragmented, people-dependent workflow to move from identifying an issue to understanding it, slowing how quickly they could make operational decisions.",
    ],
    imageSrc: asset("problem.svg"),
    imageAlt:
      "Diagram showing fragmented investigation across Outlook, Teams, Excel, Word, and AWS Connect",
  },
  calloutOne:
    "The opportunity was to transform customer issue investigation into a self-serve workflow to enable contact centre managers to independently understand and act on customer issues so that they can make faster operational decisions.",
  discovery: {
    eyebrow: "Discovery & Insights",
    heading:
      "Understanding the system - users, data, & how teams analyzed customer issues.",
    paragraphs: [
      "I first aligned with RozieAI product owners, data scientists, and Air Canada stakeholders to understand how insights were generated, delivered, and investigated. This showed me that the existing reports surfaced issues but didn't support the investigation that followed, so I focused the product on the underlying workflow rather than recreating the reports.",
    ],
    items: [
      {
        id: "who-are-the-users",
        title: "Who are the users?",
        icon: "users",
        content: {
          type: "paragraphs",
          paragraphs: [
            "Users are Air Canada's contact centre managers who used insights to identify emerging customer issues, then traced those issues to specific calls and operational patterns to understand where they were occurring.",
          ],
        },
      },
      {
        id: "what-type-of-data",
        title: "What data did they use?",
        icon: "database",
        content: {
          type: "paragraphs",
          paragraphs: [
            "By surfacing with data scientists, I found that teams combined two complementary types of data:",
          ],
        },
        visual: {
          type: "source-cards",
          cards: [
            {
              title: "RozieAI Insights",
              logoSrc: asset("rozieai-logo.png"),
              logoAlt: "RozieAI logo",
              items: [
                "Primary Topics",
                "Customer Intents",
                "Root Causes",
                "Sentiment Analysis",
                "Journey Moments",
              ],
            },
            {
              title: "Operational Metadata",
              logoSrc: asset("aws-connect.svg"),
              logoAlt: "Amazon Connect logo",
              items: [
                "Interaction Duration",
                "Routing Profile",
                "Agent Username",
                "Queue Name",
                "60+ Attributes",
              ],
            },
          ],
        },
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
        visual: {
          type: "workflow-steps",
          steps: [
            {
              icon: "clock",
              title: "Scope",
              description: "Define a time window to frame the analysis.",
            },
            {
              icon: "search",
              title: "Identify Issues",
              description:
                "Detect unusual patterns and emerging customer concerns.",
            },
            {
              icon: "file-text",
              title: "Understand Causes",
              description:
                "Use summaries and transcripts to understand what customers are experiencing.",
            },
            {
              icon: "git-branch",
              title: "Trace Operational Impact",
              description:
                "Identify where the issue is occurring using call records and operational data.",
            },
          ],
        },
      },
      {
        id: "insights",
        title: "Insights",
        icon: "bug",
        quotes: [
          {
            text: "The investigation workflow revealed that insights were not endpoints, but starting points for understanding and resolving customer issues.",
            designPrinciple:
              "Support investigation flow, not just consumption.",
          },
          {
            text: "Teams used call insights to identify issues, then combined it with operational metadata to understand causes, trace impact, and take action.",
            designPrinciple:
              "Keep both information layers within the same workflow.",
          },
        ],
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
      "I couldn't change that constraint, but I could control how we validated the experience. We shipped quickly, then ran weekly sessions with Air Canada teams to observe the product in use and identify where the inherited patterns created friction.",
    ],
  },
  earlyDesigns: {
    eyebrow: "Early Designs",
    heading: "Initial Product Hypothesis",
    paragraphs: [
      "I used the investigation workflow I uncovered in discovery to structure the first version of the product. Teams moved through four stages: Scope, Identify, Understand, and Trace. I designed the experience around that sequence, rather than treating the dashboard as a collection of charts and data.",
    ],
    items: [
      {
        id: "visualisation-for-insights",
        title: "Visualisation for Insights",
        icon: "users",
        content: {
          type: "paragraphs",
          paragraphs: [
            'I anchored the experience around charts because teams needed to spot patterns before deciding what to investigate. I prioritized the metrics stakeholders already used to identify issues, such as changes in topic frequency and sentiment.',
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
            "I placed operational data below the insights so teams could move from identifying an issue to tracing it back to specific queues, routing profiles, and agents. This created a direct path from insight to investigation.",
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
            "I made date and column filters shared across the charts and table because scoping was the first step in every investigation. This let teams establish their context once and carry it across both information layers.",
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
  solutions: {
    eyebrow: "Solution",
    heading: "Introducing a Dashboard with Complementary Modes:",
    paragraphs: [
      "Over a couple of development sprints, I iteratively refined the product experience based on the observations made in the user test sessions.",
      "I redesigned Conversation Insights around the way teams actually investigated issues. The first version put everything on one scrolling page, but user sessions showed that the workflow had a natural split: Overview helped teams decide what needed attention, while Table View helped them investigate why. I turned that split into two complementary modes.",
    ],
    items: [
      {
        id: "overview",
        title: "Overview",
        icon: "summary",
        content: {
          type: "paragraphs",
          paragraphs: [
            "I designed Overview as the starting point for investigation. It surfaces operational metrics and scannable insight cards so teams can quickly identify where attention is needed before digging deeper.",
          ],
        },
        media: [
          {
            src: asset("final-solution/top-view.png"),
            alt: "Overview mode with operational metrics and insight cards",
          },
        ],
      },
      {
        id: "insight-cards",
        title: "Insight Cards",
        icon: "panels-top-left",
        content: {
          type: "paragraphs",
          paragraphs: [
            'I replaced the trend-line chart with insight cards because teams wanted to know which issues mattered right now, not just how they changed over time. Instead of forcing every issue into one template, I designed each card around the question it needed to answer.',
          ],
        },
        media: [
          {
            src: asset("final-solution/bottom-views.png"),
            alt: "Insight cards showing distinct comparisons for each issue type",
          },
        ],
      },
      {
        id: "table-view",
        title: "Table View",
        icon: "table",
        content: {
          type: "paragraphs",
          paragraphs: [
            "I designed Table View for the deeper investigation. It connects insights to individual calls and exposes the operational attributes teams needed to trace issues across queues, routing paths, and agents.",
          ],
        },
        media: [
          {
            src: asset("final-solution/table-view.png"),
            alt: "Table view showing conversation records with operational attributes",
          },
          {
            src: asset("final-solution/summary.png"),
            alt: "Table view illustrating horizontal scroll friction with many columns",
          },
        ],
      },
      {
        id: "manage-columns",
        title: "Manage Columns",
        icon: "columns-4",
        content: {
          type: "paragraphs",
          paragraphs: [
            "With 60+ attributes, a fixed table made users scroll through information they didn't need. I introduced Manage Columns so each team could bring the attributes relevant to its investigation into view.",
          ],
        },
        media: [
          {
            src: asset("final-solution/manage-columns.png"),
            alt: "Manage Columns panel for customizing visible table attributes",
          },
        ],
      },
      {
        id: "new-filter-pattern",
        title: "New Filter Pattern",
        icon: "sliders-horizontal",
        content: {
          type: "paragraphs",
          paragraphs: [
            "I replaced the reused chip pattern with a query-based filter because investigations rarely relied on a single condition. The new pattern let teams layer conditions across customer and operational data while keeping filters shared between Overview and Table View.",
          ],
        },
        media: [
          {
            src: asset("final-solution/filter.mp4"),
            alt: "Filter pattern interaction in the table view",
            type: "video",
          },
        ],
      },
    ],
  },
  outcome: {
    eyebrow: "Outcomes",
    heading: "Beyond design...",
    paragraphs: [
      "After shipping all the changes, we noticed significant usage within the product and the product stickiness grew as part of our users everyday workflow. Here's a few outcomes from this project.",
    ],
    items: [
      {
        id: "business-tie-in",
        title: "Business tie-in",
        icon: "users",
        content: {
          type: "paragraphs",
          paragraphs: [
            "Sustained internal use and external interest supported a renewed client contract and generated new feature requests (under NDA), reinforcing the platform's long-term value beyond the initial engagement.",
          ],
        },
      },
    ],
  },
  reflection: {
    eyebrow: "Reflection",
    heading: "How this project changed the way I design",
    paragraphs: [],
    items: [
      {
        id: "mindset-utility-over-polish",
        title: "Mindset: Utility over polish",
        icon: "brain",
        content: {
          type: "paragraphs",
          paragraphs: [
            'Designing for power users changed how I think about “better” design. Conversation Insights served only 20–25 users, but they were power users who cared less about delight and more about having the right information and affordances to do their jobs. Throughout the project, I often saw opportunities to make the interface dramatically more polished, but I learned that improving the interface isn\'t automatically improving the product. In this context, the best design was often the one that gave users exactly what they needed, without adding anything they didn\'t.',
          ],
        },
      },
      {
        id: "tradeoffs-designing-with-speed",
        title: "Tradeoffs: Designing with speed",
        icon: "gauge",
        content: {
          type: "paragraphs",
          paragraphs: [
            "I learned to design with business momentum, not against it. Conversation Insights had to move quickly, and development had already started before I could fully shape the experience. That was uncomfortable at first, but I learned that a rigid design process isn't always the right response to a fast-moving business. My role was to keep the product moving while creating enough space to observe, reason, and improve the experience as we went. Speed didn't mean abandoning design; it meant being more deliberate about where design effort mattered most.",
          ],
        },
      },
      {
        id: "collaboration-engineering-in-the-loop",
        title: "Collaboration: Engineering as part of design loop",
        icon: "handshake",
        content: {
          type: "paragraphs",
          paragraphs: [
            "I learned to bring engineering into the design loop early. The insight cards were a custom interaction, and I knew they would require engineering work beyond the existing component system. By keeping engineering involved early and sharing the direction before the design was finalized, I could surface technical constraints sooner and give the team time to plan for what needed to be built. The result was less handoff and more shared ownership of the experience.",
          ],
        },
      },
    ],
  },
};
