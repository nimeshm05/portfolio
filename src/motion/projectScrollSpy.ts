"use client";

import { useEffect, useState } from "react";

export const PROJECT_SCROLL_SPY_CENTER_RATIO = 0.8;

export function getSectionElements(ids: string[]): HTMLElement[] {
  return ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el != null)
    .sort(
      (a, b) =>
        a.getBoundingClientRect().top +
        window.scrollY -
        (b.getBoundingClientRect().top + window.scrollY),
    );
}

export function getActiveSectionId(
  elements: HTMLElement[],
  centerRatio = PROJECT_SCROLL_SPY_CENTER_RATIO,
): string {
  if (elements.length === 0) {
    return "";
  }

  const viewportCenter = window.scrollY + window.innerHeight * centerRatio;

  const sections = elements.map((element) => {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    return {
      id: element.id,
      top,
      bottom: top + rect.height,
      center: top + rect.height / 2,
    };
  });

  const first = sections[0];
  const last = sections[sections.length - 1];

  if (viewportCenter < first.top) {
    return first.id;
  }

  if (viewportCenter >= last.bottom) {
    return last.id;
  }

  for (const section of sections) {
    if (section.top <= viewportCenter && viewportCenter < section.bottom) {
      return section.id;
    }
  }

  // Viewport center is in a gap between sections — highlight the nearest section.
  let activeId = first.id;
  let nearestDistance = Infinity;

  for (const section of sections) {
    const distance = Math.abs(section.center - viewportCenter);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      activeId = section.id;
    }
  }

  return activeId;
}

type UseProjectScrollSpyOptions = {
  sectionIds: string[];
  enabled?: boolean;
};

export function useProjectScrollSpy({
  sectionIds,
  enabled = true,
}: UseProjectScrollSpyOptions): string {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) {
      return;
    }

    let frameId = 0;

    const syncActiveSection = () => {
      const elements = getSectionElements(sectionIds);

      if (elements.length === 0) {
        return;
      }

      const nextActiveId = getActiveSectionId(elements);

      setActiveId((current) =>
        current === nextActiveId ? current : nextActiveId,
      );
    };

    const scheduleSync = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncActiveSection();
      });
    };

    syncActiveSection();

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [sectionIds, enabled]);

  return activeId;
}
