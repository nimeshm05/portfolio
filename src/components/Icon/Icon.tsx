import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Brain,
  Bug,
  ChartPie,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  CodeXml,
  Columns4,
  Contrast,
  Database,
  FileText,
  Gauge,
  GitBranch,
  Handshake,
  LayoutGrid,
  Lightbulb,
  List,
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
  Type,
  Users,
  Workflow,
  Expand,
} from "lucide-react";
import "./Icon.css";

export type IconName =
  | "bot"
  | "music-2"
  | "chart-pie"
  | "code-xml"
  | "chevron-left"
  | "users"
  | "bug"
  | "database"
  | "chevron-right"
  | "lightbulb"
  | "send-to-back"
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
  | "type"
  | "arrow-down"
  | "arrow-right"
  | "arrow-up-right"
  | "contrast"
  | "expand";

const icons: Record<IconName, LucideIcon> = {
  bot: Bot,
  "music-2": Music2,
  "chart-pie": ChartPie,
  "code-xml": CodeXml,
  "chevron-left": ChevronLeft,
  users: Users,
  bug: Bug,
  database: Database,
  "chevron-right": ChevronRight,
  lightbulb: Lightbulb,
  "send-to-back": SendToBack,
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
  "arrow-down": ArrowDown,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  contrast: Contrast,
  expand: Expand,
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
