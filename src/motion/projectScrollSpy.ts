"use client";

import { useEffect, useState } from "react";

/** Distance from the viewport top at which a section becomes active. */
export const PROJECT_SCROLL_SPY_OFFSET_PX = 200;

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
  offsetPx = PROJECT_SCROLL_SPY_OFFSET_PX,
): string {
  if (elements.length === 0) {
    return "";
  }

  const scrollBottom = window.scrollY + window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight;

  // The last sections may be too short to ever reach the activation line;
  // once the page can't scroll further, the final section is the one in view.
  if (scrollBottom >= maxScroll - 2) {
    return elements[elements.length - 1].id;
  }

  let activeId = elements[0].id;

  for (const element of elements) {
    // A section scrolled to via its anchor rests at its scroll-margin, which
    // can sit below offsetPx; treat that resting position as active too.
    const scrollMargin = parseFloat(getComputedStyle(element).scrollMarginTop);
    const activationLine = Math.max(offsetPx, (scrollMargin || 0) + 1);

    if (element.getBoundingClientRect().top <= activationLine) {
      activeId = element.id;
    }
  }

  return activeId;
}

type UseProjectScrollSpyOptions = {
  sectionIds: string[];
  enabled?: boolean;
  offsetPx?: number;
};

export function useProjectScrollSpy({
  sectionIds,
  enabled = true,
  offsetPx = PROJECT_SCROLL_SPY_OFFSET_PX,
}: UseProjectScrollSpyOptions): string {
  const [activeId, setActiveId] = useState("");
  const sectionIdsKey = sectionIds.join(",");

  useEffect(() => {
    const ids = sectionIdsKey ? sectionIdsKey.split(",") : [];

    if (!enabled || ids.length === 0) {
      return;
    }

    let frameId = 0;

    const syncActiveSection = () => {
      const elements = getSectionElements(ids);

      if (elements.length === 0) {
        return;
      }

      const nextActiveId = getActiveSectionId(elements, offsetPx);

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
  }, [enabled, offsetPx, sectionIdsKey]);

  return activeId;
}
