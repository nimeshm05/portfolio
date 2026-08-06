import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Bug,
  ChartPie,
  ChevronLeft,
  ChevronRight,
  CodeXml,
  Database,
  Footprints,
  Globe,
  Lightbulb,
  MessageCircleMore,
  Music2,
  Target,
  Trophy,
  UserStar,
  Users,
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
  | "trophy";

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
