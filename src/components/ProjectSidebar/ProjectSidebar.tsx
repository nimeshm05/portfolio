import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import type { ProjectNavItem } from "@/data/projects/types";
import "./ProjectSidebar.css";

type ProjectSidebarProps = {
  items: ProjectNavItem[];
};

export function ProjectSidebar({ items }: ProjectSidebarProps) {
  return (
    <aside className="project-sidebar" aria-label="Project navigation">
      <Link className="project-sidebar-back" href="/">
        <span className="project-sidebar-icon" aria-hidden="true">
          <Icon name="arrow-left" size={16} />
        </span>
        <span>Back</span>
      </Link>
      <nav className="project-sidebar-nav">
        {items.map((item) => (
          <a key={item.id} className="project-sidebar-link" href={`#${item.id}`}>
            <span className="project-sidebar-icon" aria-hidden="true">
              <Icon name="chevron-right" size={16} />
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
