"use client";

import { useMemo } from "react";
import { SidebarNav } from "@/components/SidebarNav/SidebarNav";
import type { ProjectNavItem } from "@/data/projects/types";
import { useProjectScrollSpy } from "@/motion/projectScrollSpy";
import "./ProjectSidebar.css";

type ProjectSidebarProps = {
  items: ProjectNavItem[];
  scrollSpyEnabled?: boolean;
};

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

  const navItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
      })),
    [items],
  );

  return (
    <aside className="project-sidebar" aria-label="Project navigation">
      <SidebarNav
        items={navItems}
        activeId={activeId}
        showBack
        animate
      />
    </aside>
  );
}
