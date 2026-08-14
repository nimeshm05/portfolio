"use client";

import { useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { SidebarNav } from "@/components/SidebarNav/SidebarNav";
import type { ContentSectionData } from "@/data/home";
import { useProjectScrollSpy } from "@/motion/projectScrollSpy";
import "./HomeSidebar.css";

type HomeSidebarProps = {
  visible: boolean;
  sections: ContentSectionData[];
};

export function HomeSidebar({ visible, sections }: HomeSidebarProps) {
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );

  const activeId = useProjectScrollSpy({
    sectionIds,
    enabled: visible,
  });

  const items = useMemo(
    () =>
      sections.map((section) => ({
        id: section.id,
        label: section.label,
        href: `#${section.id}`,
      })),
    [sections],
  );

  return (
    <AnimatePresence>
      {visible ? (
        <SidebarNav
          key="home-sidebar"
          className="home-sidebar"
          rootElement="aside"
          items={items}
          activeId={activeId}
          animate
          aria-label="Work sections"
        />
      ) : null}
    </AnimatePresence>
  );
}
