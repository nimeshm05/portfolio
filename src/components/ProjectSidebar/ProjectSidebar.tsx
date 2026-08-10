"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import type { ProjectNavItem } from "@/data/projects/types";
import { useProjectScrollSpy } from "@/motion/projectScrollSpy";
import "./ProjectSidebar.css";

type ProjectSidebarProps = {
  items: ProjectNavItem[];
  scrollSpyEnabled?: boolean;
};

function NavItemContent({ label }: { label: string }) {
  return <span>/ {label}</span>;
}

export function ProjectSidebar({
  items,
  scrollSpyEnabled = true,
}: ProjectSidebarProps) {
  const sectionIds = useMemo(
    () => items.filter((item) => item.href).map((item) => item.id),
    [items],
  );

  const activeId = useProjectScrollSpy({
    sectionIds,
    enabled: scrollSpyEnabled,
  });

  return (
    <aside className="project-sidebar" aria-label="Project navigation">
      <Link className="project-sidebar-back" href="/">
        <span className="project-sidebar-icon" aria-hidden="true">
          <Icon name="chevron-left" size={16} />
        </span>
        <span>Back</span>
      </Link>
      <nav className="project-sidebar-nav">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const className = [
            "project-sidebar-link",
            isActive ? "is-active" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return item.href ? (
            <a key={item.id} className={className} href={item.href}>
              <NavItemContent label={item.label} />
            </a>
          ) : (
            <span key={item.id} className={className}>
              <NavItemContent label={item.label} />
            </span>
          );
        })}
      </nav>
    </aside>
  );
}
