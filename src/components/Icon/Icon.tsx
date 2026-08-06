import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BookOpenText,
  Bot,
  Briefcase,
  Bug,
  ChartPie,
  ChevronDown,
  ChevronRight,
  CodeXml,
  Database,
  Footprints,
  MessageCircleMore,
  Music2,
  Sprout,
  Users,
  X,
} from "lucide-react";
import "./Icon.css";

export type IconName =
  | "message-circle-more"
  | "bot"
  | "music-2"
  | "chart-pie"
  | "code-xml"
  | "x"
  | "book-open-text"
  | "briefcase"
  | "sprout"
  | "chevron-down"
  | "footprints"
  | "arrow-left"
  | "users"
  | "bug"
  | "database"
  | "chevron-right";

const icons: Record<IconName, LucideIcon> = {
  "message-circle-more": MessageCircleMore,
  bot: Bot,
  "music-2": Music2,
  "chart-pie": ChartPie,
  "code-xml": CodeXml,
  x: X,
  "book-open-text": BookOpenText,
  briefcase: Briefcase,
  sprout: Sprout,
  "chevron-down": ChevronDown,
  footprints: Footprints,
  "arrow-left": ArrowLeft,
  users: Users,
  bug: Bug,
  database: Database,
  "chevron-right": ChevronRight,
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
