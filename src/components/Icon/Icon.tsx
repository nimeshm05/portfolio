import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Bug,
  ChartPie,
  ChevronLeft,
  ChevronRight,
  CodeXml,
  Coffee,
  Columns4,
  Database,
  Footprints,
  Globe,
  LayoutGrid,
  Lightbulb,
  List,
  MessageCircleMore,
  Music2,
  NotebookPen,
  PanelsTopLeft,
  SendToBack,
  Settings,
  SlidersHorizontal,
  Summary,
  Table,
  Target,
  Trophy,
  UserStar,
  Users,
  Workflow,
} from "lucide-react";
import "./Icon.css";

export type IconName =
  | "message-circle-more"
  | "bot"
  | "music-2"
  | "chart-pie"
  | "code-xml"
  | "footprints"
  | "chevron-left"
  | "users"
  | "bug"
  | "database"
  | "chevron-right"
  | "globe"
  | "target"
  | "user-star"
  | "lightbulb"
  | "trophy"
  | "send-to-back"
  | "coffee"
  | "workflow"
  | "settings"
  | "notebook-pen"
  | "list"
  | "layout-grid"
  | "summary"
  | "panels-top-left"
  | "table"
  | "columns-4"
  | "sliders-horizontal";

const icons: Record<IconName, LucideIcon> = {
  "message-circle-more": MessageCircleMore,
  bot: Bot,
  "music-2": Music2,
  "chart-pie": ChartPie,
  "code-xml": CodeXml,
  footprints: Footprints,
  "chevron-left": ChevronLeft,
  users: Users,
  bug: Bug,
  database: Database,
  "chevron-right": ChevronRight,
  globe: Globe,
  target: Target,
  "user-star": UserStar,
  lightbulb: Lightbulb,
  trophy: Trophy,
  "send-to-back": SendToBack,
  coffee: Coffee,
  workflow: Workflow,
  settings: Settings,
  "notebook-pen": NotebookPen,
  list: List,
  "layout-grid": LayoutGrid,
  summary: Summary,
  "panels-top-left": PanelsTopLeft,
  table: Table,
  "columns-4": Columns4,
  "sliders-horizontal": SlidersHorizontal,
};

type IconProps = {
  name: IconName;
  className?: string;
  size?: number;
};

export function Icon({ name, className, size = 20 }: IconProps) {
  const LucideIcon = icons[name];

  return (
    <LucideIcon
      className={className ? `icon ${className}` : "icon"}
      size={size}
      aria-hidden="true"
    />
  );
}
