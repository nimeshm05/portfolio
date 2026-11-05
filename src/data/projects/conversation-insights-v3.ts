import type { ExpandableItemContent, ProjectPageData } from "./types";

const asset = (path: string) =>
  `/assets/projects/conversation-insights/${path}`;

const text = (...paragraphs: string[]): ExpandableItemContent["content"] => ({
  type: "paragraphs",
  paragraphs,
});

const points = (...items: string[]): ExpandableItemContent["content"] => ({
  type: "paragraphs-with-list",
  intro: [],
  items,
});

/**
 * Variation of ./conversation-insights (copied Nov 2026): Early Designs and
 * Learnings are dropped, and Solutions is told as three jobs, each with
 * Version 1, User Feedback and Version 2.
 */
export const conversationInsightsV3: ProjectPageData = {
  slug: "conversation-insights",
  title: "Conversation Insights",
  subtitle:
    "Eliminating manual insight reporting in contact centers with self-serve analytics platform to enable faster operational decision making.",
  projectType: "Product Design - Internal Tool",
  timeline: "Q3 2024 - Q2 2025",
  bannerSrc: asset("conversation-insights-preview.mp4"),
  bannerAlt: "Conversation Insights dashboard preview",
  bannerType: "video",
  bannerAspectRatio: "3212 / 2160",
  listItemsAlwaysExpanded: true,
  nav: [
    { id: "overview", label: "Overview", href: "#overview" },
    { id: "problem", label: "Problem", href: "#problem" },
    { id: "discovery", label: "Discovery", href: "#discovery" },
    { id: "insights", label: "Insights", href: "#insights" },
    { id: "solutions", label: "Solutions", href: "#solutions" },
    { id: "outcome", label: "Outcome", href: "#outcome" },
    { id: "reflection", label: "Reflection", href: "#reflection" },
  ],
  meta: {
    items: [
      { label: "Company", value: "RozieAI Labs" },
      { label: "Client", value: "Air Canada" },
      { label: "Timeline", value: "Q3 2024 - Q2 2025" },
      { label: "Role", value: "Product Designer" },
    ],
  },
  overview: {
    eyebrow: "Overview",
    heading: "Analytics Platform for Air Canada's Contact Centre Managers",
    paragraphs: [
      "Conversation Insights is an analytics platform developed by RozieAI for Air Canada's contact centre managers (users). The platform uses AI to analyze hundreds of thousands of customer calls, surfacing trends and operational signals that help managers understand their customer issues at scale. Although initially built to meet Air Canada's operational needs, the product was designed as a scalable solution for future enterprise customers.",
    ],
  },
  problem: {
    eyebrow: "Problem",
    heading:
      "Air Canada contact centre managers had access to AI-generated insights, but not a way to investigate them independently",
    paragraphs: [
      "Before Conversation Insights, AI-generated call insights were delivered as weekly reports prepared by RozieAI product owners. While these reports helped Air Canada teams identify emerging issues, they provided limited context for understanding where those issues were occurring or what was driving them.",
      "Investigating an issue was a big hurdle because it required moving between reports, AWS Connect, and follow-up discussions with RozieAI stakeholders to piece together the operational context. Users therefore depended on a fragmented, people-dependent workflow to move from identifying an issue to understanding it, slowing how quickly they could make operational decisions.",
    ],
    imageSrc: asset("problem.mp4"),
    imageContained: true,
    imageAlt:
      "Diagram showing fragmented investigation across Outlook, Teams, Excel, Word, and AWS Connect",
  },
  calloutOne:
    "The opportunity was to transform customer issue investigation into a self-serve workflow to enable contact centre managers to independently understand and act on customer issues so that they can make faster operational decisions.",
  discovery: {
    eyebrow: "Discovery",
    heading:
      "Understanding the system - users, data, & how teams analyzed customer issues.",
    paragraphs: [
      "I first aligned with RozieAI product owners, data scientists, and Air Canada stakeholders to understand how teams used insights to investigate customer issues. I found that reports helped managers identify issues, but understanding what was happening and where required piecing together information from multiple sources. So I focused the product on supporting that investigation rather than recreating the reports.",
    ],
    items: [
      {
        id: "who-are-the-users",
        title: "Who are the users?",
        icon: "users",
        content: text(
          "Users are Air Canada's contact centre managers who used insights to identify emerging customer issues, then traced those issues to specific calls and operational patterns to understand where they were occurring.",
        ),
      },
      {
        id: "what-type-of-data",
        title: "What data do they use?",
        icon: "database",
        content: text(
          "By surfacing with data scientists, I found that teams combined two complementary types of data (RozieAI generated insights and AWS Connect attributes):",
        ),
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
              title: "AWS Attributes",
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
        content: text(
          "In order to understand how users approached analyzing customer issues, I conducted 6 interviews with team members. I found that insights were rarely consumed in isolation. Instead, they served as starting points for a broader analysis into their operational metadata.",
          "The teams consistently followed this investigation workflow:",
        ),
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
    ],
  },
  insights: {
    eyebrow: "Insights",
    heading: "Insights",
    paragraphs: [],
    list: [
      "The investigation workflow revealed that insights were not endpoints, but starting points for understanding and resolving customer issues.",
      "Teams used call insights to identify issues, then combined it with operational metadata to understand causes, trace impact, and take action.",
    ],
  },
  calloutTwo:
    "So, how might we enable Air Canada contact centre managers to independently investigate customer issues from identification to operational action?",
  solutions: {
    eyebrow: "Solution",
    heading: "Solution",
    paragraphs: [],
    items: [],
    jobs: [
      {
        id: "job-1",
        heading:
          "Job 1\nWhen I start my day, I want to see which customer issues are biggest right now, so I can decide where to focus first.",
        items: [
          {
            id: "job-1-version-1",
            title: "Version 1",
            content: text(
              "I built the first view around trend charts, assuming users needed to spot patterns before deciding what to look into. The charts tracked the signals stakeholders already relied on, like changes in topic frequency and sentiment over time.",
            ),
            media: [
              {
                src: asset("v1/charts.png"),
                alt: "First version of the dashboard built around trend charts",
              },
            ],
          },
          {
            id: "job-1-user-feedback",
            title: "User Feedback",
            content: points(
              "Users skipped the charts and went straight to the call records.",
              "Their first question wasn't “how is this trending?” but “what are the biggest issues right now?”",
              "What they wanted was simple: a topic and its call count, like “Bookings: 1,345 calls.”",
              "I had designed for exploration when they needed a summary they could scan.",
            ),
          },
          {
            id: "job-1-version-2",
            title: "Version 2",
            content: text(
              "I replaced the trend charts with insight cards, so the biggest issues are visible at a glance. Not every issue answers the same question, so instead of one template, I designed each card around the question it answers.",
            ),
            media: [
              {
                src: asset("new-videos/overview.mp4"),
                alt: "Overview with insight cards showing the biggest issues and their call counts",
                type: "video",
                aspectRatio: "3330 / 2160",
              },
            ],
          },
        ],
      },
      {
        id: "job-2",
        heading:
          "Job 2\nWhen I've found an issue or an insight I'm interested in, I want to see the calls and operational details behind it, so I can trace where it's happening across queues, routing and agents.",
        items: [
          {
            id: "job-2-version-1",
            title: "Version 1",
            content: text(
              "I placed a data table of operational data directly below the insights, so users could go straight from spotting an issue to tracing it to specific queues, routing profiles and agents.",
            ),
            media: [
              {
                src: asset("v1/table.png"),
                alt: "First version with an operational data table below the insights",
              },
            ],
          },
          {
            id: "job-2-user-feedback",
            title: "User Feedback",
            content: points(
              "The table showed a fixed set of attributes out of 60+.",
              "Each user relied on only a few of them, and they weren't the same few.",
              "Users scrolled past data they didn't need to reach the columns they did.",
            ),
          },
          {
            id: "job-2-version-2",
            title: "Version 2",
            content: text(
              "I introduced Manage Columns so users can choose which attributes appear in the table. The table now fits the investigation in front of them instead of showing everything to everyone.",
            ),
            media: [
              {
                src: asset("new-videos/table.mp4"),
                alt: "Table View with Manage Columns for choosing which attributes appear",
                type: "video",
                aspectRatio: "3324 / 2160",
              },
            ],
          },
        ],
      },
      {
        id: "job-3",
        heading:
          "Job 3\nWhen I'm investigating an issue, I want to combine several conditions and come back to them later, so I don't rebuild the same investigation every week.",
        items: [
          {
            id: "job-3-version-1",
            title: "Version 1",
            content: text(
              "Every investigation started with scoping, so I made the date and column filters shared across the charts and the table. Users could set their context once and keep it in both places. To hit the launch timeline, we reused a filter-chip pattern from an existing product rather than designing a new one.",
            ),
            media: [
              {
                src: asset("v1/filters.png"),
                alt: "First version with filter chips shared across the charts and table",
              },
            ],
          },
          {
            id: "job-3-user-feedback",
            title: "User Feedback",
            content: points(
              "Investigations rarely relied on one condition. Users stacked several at once.",
              "Each chip only showed a count (“Primary Topics: 12 selected”), so once 5 or 6 were applied, users had to open them one by one to find the right one.",
              "The filters grew to take up as much space as the data they were meant to scope.",
              "Users rebuilt the same filters every time they came back to an issue.",
            ),
          },
          {
            id: "job-3-version-2",
            title: "Version 2",
            content: text(
              "I replaced the chip pattern with a query-based filter. Users can layer conditions across customer and operational data and save them to come back to later. Filters stay shared between Overview and Table View, so the context carries over.",
            ),
            media: [
              {
                src: asset("new-videos/filters.mp4"),
                alt: "Query-based filters with saved filters",
                type: "video",
                aspectRatio: "3324 / 2160",
              },
            ],
          },
        ],
      },
    ],
  },
  outcome: {
    eyebrow: "Outcomes",
    heading: "Beyond design...",
    paragraphs: [
      "We didn’t have usage analytics instrumentation in place, so these outcomes come from weekly feedback calls and customer conversations.",
    ],
    list: [
      "Managers moved from weekly reports to finding issues themselves. Conversation Insights became part of their daily workflow, with 20 managers using it regularly.",
      "Product owners no longer had to produce reports by hand every week. Steady use by the client led to a renewed contract and new feature requests (under NDA). The platform also became a product RozieAI could offer to other enterprise customers.",
    ],
    items: [],
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
        content: text(
          "Conversation Insights served 20 power users who cared more about having the right information than about delight. I often saw ways to polish the interface, but a more polished interface isn't automatically a better product. Here, the better design gave users exactly what they needed and nothing more.",
        ),
      },
      {
        id: "tradeoffs-designing-with-speed",
        title: "Tradeoffs: Designing with speed",
        icon: "gauge",
        content: text(
          "Development started before the design was done. Instead of holding to a rigid process, I kept the product moving while making room to observe and improve as we went. Speed didn't mean less design, just being deliberate about where it mattered most.",
        ),
      },
      {
        id: "collaboration-engineering-in-the-loop",
        title: "Collaboration: Engineering as part of design loop",
        icon: "handshake",
        content: text(
          "The insight cards needed work beyond our existing components, so I shared the direction with engineering before it was final. That brought technical constraints up early, gave the team time to plan, and meant less handoff and more shared ownership.",
        ),
      },
    ],
  },
};
