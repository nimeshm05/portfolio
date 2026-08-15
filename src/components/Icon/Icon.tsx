import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  Brain,
  Bug,
  ChartPie,
  ChevronLeft,
  ChevronsDown,
  ChevronRight,
  ClipboardList,
  Clock,
  CodeXml,
  Coffee,
  Columns4,
  Database,
  FileText,
  Footprints,
  Gauge,
  GitBranch,
  Globe,
  Handshake,
  LayoutGrid,
  Lightbulb,
  List,
  MessageCircleMore,
  Music2,
  NotebookPen,
  PanelsTopLeft,
  Scale,
  ScanSearch,
  Search,
  SendToBack,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Summary,
  Table,
  Target,
  Trophy,
  Type,
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
  | "chevrons-down"
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
  | "sliders-horizontal"
  | "scan-search"
  | "scale"
  | "clipboard-list"
  | "sparkles"
  | "clock"
  | "search"
  | "file-text"
  | "git-branch"
  | "brain"
  | "gauge"
  | "handshake"
  | "activity"
  | "type";

const icons: Record<IconName, LucideIcon> = {
  "message-circle-more": MessageCircleMore,
  bot: Bot,
  "music-2": Music2,
  "chart-pie": ChartPie,
  "code-xml": CodeXml,
  footprints: Footprints,
  "chevron-left": ChevronLeft,
  "chevrons-down": ChevronsDown,
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
  "scan-search": ScanSearch,
  scale: Scale,
  "clipboard-list": ClipboardList,
  sparkles: Sparkles,
  clock: Clock,
  search: Search,
  "file-text": FileText,
  "git-branch": GitBranch,
  brain: Brain,
  gauge: Gauge,
  handshake: Handshake,
  activity: Activity,
  type: Type,
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
