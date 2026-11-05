import type { ExpandableItemContent, ProjectPageData } from "./types";
import { conversationInsights as previous } from "./conversation-insights";

const asset = (path: string) =>
  `/assets/projects/conversation-insights/${path}`;

const text = (...paragraphs: string[]): ExpandableItemContent["content"] => ({
  type: "paragraphs",
  paragraphs,
});

/**
 * Reworded case study (Nov 2026). The previous version lives in
 * ./conversation-insights and is kept for reference, but no longer rendered.
 */
export const conversationInsightsV2: ProjectPageData = {
  slug: previous.slug,
  title: previous.title,
  subtitle: previous.subtitle,
  projectType: previous.projectType,
  timeline: previous.timeline,
  bannerSrc: previous.bannerSrc,
  bannerAlt: previous.bannerAlt,
  bannerType: previous.bannerType,
  bannerAspectRatio: previous.bannerAspectRatio,
  listItemsAlwaysExpanded: true,
  meta: previous.meta,
  nav: [
    { id: "context", label: "Context", href: "#context" },
    { id: "my-role", label: "My Role", href: "#my-role" },
    { id: "problem", label: "Problem", href: "#problem" },
    { id: "insights", label: "Insights", href: "#insights" },
    { id: "job-1", label: "Job 1: Insights", href: "#job-1" },
    { id: "job-2", label: "Job 2: Operational Data", href: "#job-2" },
    { id: "job-3", label: "Job 3: Filters", href: "#job-3" },
    { id: "outcome", label: "Outcome", href: "#outcome" },
    { id: "learnings", label: "Learnings", href: "#learnings" },
  ],
  sections: [
    {
      id: "context",
      heading:
        "An AI analytics platform for Air Canada's contact centre managers",
      paragraphs: [
        "Conversation Insights is an analytics platform developed by RozieAI for Air Canada's contact centre managers (users). The platform uses AI to analyze hundreds of thousands of customer calls, surfacing trends and operational signals that help managers understand their customer issues at scale. Although initially built to meet Air Canada's operational needs, the product was designed as a scalable solution for future enterprise customers.",
      ],
    },
    {
      id: "my-role",
      heading: "My Role",
      paragraphs: [
        "I was the first product designer on the Conversation Insights project, where I led the initial efforts of dashboard design. I conducted informal interviews with the users to understand their needs. I set the initial foundations of the dashboard by designing the insight cards and scalable filter panels for manager jobs.",
      ],
    },
    {
      id: "problem",
      heading: "Problem",
      items: [
        {
          id: "business-problem",
          title: "Business problem: Manual reporting didn't scale",
          content: text(
            "Product owners spent hours every week producing reports. That was manageable for one client, but it wouldn't hold up if RozieAI wanted to sell the platform to other customers.",
          ),
        },
        {
          id: "user-problem",
          title: "User problem: Managers waited on reports to act",
          content: text(
            "Managers depended on reports that took a long time to produce. They couldn't respond quickly to what was happening in the contact centre, and looking into any issue meant going back to RozieAI.",
          ),
        },
      ],
    },
    {
      id: "insights",
      heading: "Insights",
      list: [
        "**The first question is \u201cwhat's biggest now?\u201d** Managers wanted a topic and its call count, not a chart to explore.",
        "**Operational metrics decide what gets investigated.** Managers looked at call volume and resolution rate before deciding whether an AI insight needed attention.",
        "**Each team needs a different slice of the data.** Out of 60+ operational attributes, each team relied on a small set of its own.",
        "**The same investigations come back every week.** Managers kept rebuilding the same views to check on the same issues.",
      ],
    },
    {
      id: "job-1",
      heading: "Job 1: Viewing quick details about insights",
      quotes: [
        {
          text: "When I start my day, I want to see which customer issues are biggest right now, so I can decide where to focus first.",
        },
      ],
      items: [
        {
          id: "job-1-v1",
          title: "v1: Trend-line charts",
          content: text(
            "I built the charts so managers could explore how topics changed over time.",
          ),
          media: [
            {
              src: asset("v1/charts.png"),
              alt: "First version of the dashboard with trend-line charts for each topic",
            },
          ],
        },
        {
          id: "job-1-what-happened",
          title: "What happened",
          content: text(
            "Users skipped the charts and went straight to the call records. They wanted “Bookings: 1,345 calls,” not a trend line.",
          ),
        },
        {
          id: "job-1-v2",
          title: "v2: Insight cards",
          content: text(
            "Scannable cards show each issue with its call count and sit alongside operational metrics. Each card is built around the question it answers.",
          ),
          media: [
            {
              src: asset("new-videos/overview.mp4"),
              alt: "Overview with insight cards and operational metrics",
              type: "video",
              aspectRatio: "3330 / 2160",
            },
          ],
        },
      ],
    },
    {
      id: "job-2",
      heading: "Job 2: Viewing operational data",
      quotes: [
        {
          text: "When I've found an issue or I'm interested in an insight, I want to see the calls and operational details behind it, so I can trace where it's happening across queues, routing and agents.",
        },
      ],
      items: [
        {
          id: "job-2-v1",
          title: "v1: A fixed data table",
          content: text(
            "A fixed data table sat below the charts on one scrolling page, showing a set group of attributes.",
          ),
          media: [
            {
              src: asset("v1/table.png"),
              alt: "First version with a fixed data table below the charts",
            },
          ],
        },
        {
          id: "job-2-what-happened",
          title: "What happened",
          content: text(
            "With 60+ attributes, teams scrolled past data they didn't need to reach the few they did.",
          ),
        },
        {
          id: "job-2-v2",
          title: "v2: Table View + Manage Columns",
          content: text(
            "Investigation now has its own mode, and each team chooses which attributes to show.",
          ),
          media: [
            {
              src: asset("new-videos/table.mp4"),
              alt: "Table View with Manage Columns for choosing visible attributes",
              type: "video",
              aspectRatio: "3324 / 2160",
            },
          ],
        },
      ],
    },
    {
      id: "job-3",
      heading: "Job 3: Applying and saving filters",
      quotes: [
        {
          text: "When I'm investigating an issue, I want to combine several conditions and come back to them later, so I don't rebuild the same investigation every week.",
        },
      ],
      items: [
        {
          id: "job-3-v1",
          title: "v1: Reused filter chips",
          content: text(
            "Filter chips reused from another product to make launch. Filters couldn't be saved.",
          ),
          media: [
            {
              src: asset("v1/filters.png"),
              alt: "First version with filter chips in the toolbar",
            },
          ],
        },
        {
          id: "job-3-what-happened",
          title: "What happened",
          content: text(
            "Investigations needed several conditions at once, which we learned after v1. Once 5 or 6 chips were applied, users couldn't find the one they wanted, since each chip only showed “12 selected.” The filters ended up taking as much space as the data.",
          ),
        },
        {
          id: "job-3-v2",
          title: "v2: Query-based filters with saved filters",
          content: text(
            "Teams can stack conditions across AI and operational data, save them, and carry them between views.",
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
    {
      id: "outcome",
      heading: "Outcome",
      items: [
        {
          id: "daily-workflow",
          title: "20 managers made the platform part of their daily workflow",
        },
        { id: "contract-renewed", title: "The client renewed the contract" },
        {
          id: "feature-requests",
          title: "New feature requests came in (under NDA)",
        },
      ],
    },
    {
      id: "learnings",
      heading: "Learnings",
      items: [
        {
          id: "utility-over-polish",
          title: "Utility over polish",
          content: text(
            "For 20–25 power users, the better design gave them exactly what they needed and nothing more.",
          ),
        },
        {
          id: "design-with-momentum",
          title: "Design with momentum",
          content: text(
            "Development started before design was done. I kept things moving while making room to observe and fix.",
          ),
        },
        {
          id: "engineering-in-the-loop",
          title: "Engineering in the loop early",
          content: text(
            "Sharing the custom insight cards early brought constraints up before handoff.",
          ),
        },
      ],
    },
  ],
};
