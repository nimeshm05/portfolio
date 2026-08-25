"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Icon } from "@/components/Icon/Icon";
import "./ViewSwitcher.css";

export type WorkViewMode = "list" | "card";

type ViewOption = {
  id: WorkViewMode;
  icon: "list" | "layout-grid";
  label: string;
};

const VIEW_OPTIONS: ViewOption[] = [
  { id: "list", icon: "list", label: "List view" },
  { id: "card", icon: "layout-grid", label: "Card view" },
];

type ViewSwitcherProps = {
  activeView: WorkViewMode;
  onChange: (view: WorkViewMode) => void;
};

const PILL_TRANSITION = {
  duration: 0.25,
  ease: "easeInOut" as const,
};

const SNAP_TRANSITION = { duration: 0 };

export function ViewSwitcher({ activeView, onChange }: ViewSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeOptionRef = useRef<HTMLButtonElement>(null);
  const hasMeasuredRef = useRef(false);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null,
  );
  const [transition, setTransition] = useState(SNAP_TRANSITION);

  useLayoutEffect(() => {
    const container = containerRef.current;

    const updatePill = (immediate: boolean) => {
      const activeOptionElement = activeOptionRef.current;

      if (!activeOptionElement) {
        return;
      }

      setTransition(immediate ? SNAP_TRANSITION : PILL_TRANSITION);
      setPill({
        left: activeOptionElement.offsetLeft,
        width: activeOptionElement.offsetWidth,
      });
    };

    updatePill(!hasMeasuredRef.current);
    hasMeasuredRef.current = true;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updatePill(true);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [activeView]);

  return (
    <div
      className="view-switcher"
      ref={containerRef}
      role="group"
      aria-label="Project view"
    >
      {pill ? (
        <motion.div
          className="view-switcher-pill"
          initial={false}
          animate={{ left: pill.left, width: pill.width }}
          transition={transition}
          aria-hidden="true"
        />
      ) : null}
      {VIEW_OPTIONS.map((option) => {
        const isActive = option.id === activeView;

        return (
          <button
            key={option.id}
            ref={isActive ? activeOptionRef : null}
            type="button"
            aria-pressed={isActive}
            aria-label={option.label}
            className={`view-switcher-option${isActive ? " is-active" : ""}`}
            data-cuelume-toggle=""
            onClick={() => onChange(option.id)}
          >
            <Icon name={option.icon} className="view-switcher-icon" size={15} />
          </button>
        );
      })}
    </div>
  );
}
