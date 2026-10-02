"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { SidebarNav, type SidebarNavItem } from "@/components/SidebarNav/SidebarNav";
import type { ContentSectionData } from "@/data/home";
import { useProjectScrollSpy } from "@/motion/projectScrollSpy";
import "./HomeSidebar.css";

type HomeSidebarProps = {
  visible: boolean;
  sections: ContentSectionData[];
};

function scrollToHomeSection(
  event: MouseEvent<HTMLAnchorElement>,
  item: SidebarNavItem,
  reduceMotion: boolean,
) {
  const href = item.href;

  if (!href?.startsWith("#")) {
    return;
  }

  const target = document.getElementById(href.slice(1));

  if (!target) {
    return;
  }

  event.preventDefault();
  // Release the hero/content scroll snap first, otherwise a click that lands
  // while snapping is still active gets pulled back to the snap point.
  document.documentElement.style.scrollSnapType = "none";
  target.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
  history.pushState(null, "", href);
}

export function HomeSidebar({ visible, sections }: HomeSidebarProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );

  const spyActiveId = useProjectScrollSpy({
    sectionIds,
    enabled: visible,
  });
  /** The section last clicked, held until the user scrolls on their own. */
  const [clickedId, setClickedId] = useState<string | null>(null);

  useEffect(() => {
    if (!clickedId) {
      return;
    }

    const release = () => setClickedId(null);
    const options = { passive: true, once: true } as const;

    window.addEventListener("wheel", release, options);
    window.addEventListener("touchstart", release, options);
    window.addEventListener("keydown", release, options);

    return () => {
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };
  }, [clickedId]);

  const activeId = clickedId ?? spyActiveId;

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
          onItemClick={(event, item) => {
            setClickedId(item.id);
            scrollToHomeSection(event, item, reduceMotion);
          }}
        />
      ) : null}
    </AnimatePresence>
  );
}
