"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { HomeTab } from "@/data/home";
import "./SegmentedControl.css";

type TabOption = {
  id: HomeTab;
  label: string;
};

type SegmentedControlProps = {
  tabs: TabOption[];
  activeTab: HomeTab;
  onChange: (tab: HomeTab) => void;
};

const PILL_TRANSITION = {
  duration: 0.25,
  ease: "easeInOut" as const,
};

const SNAP_TRANSITION = { duration: 0 };

export function SegmentedControl({
  tabs,
  activeTab,
  onChange,
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const hasMeasuredRef = useRef(false);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null,
  );
  const [transition, setTransition] = useState(SNAP_TRANSITION);

  useLayoutEffect(() => {
    const container = containerRef.current;

    const updatePill = (immediate: boolean) => {
      const activeTabElement = activeTabRef.current;

      if (!activeTabElement) {
        return;
      }

      setTransition(immediate ? SNAP_TRANSITION : PILL_TRANSITION);
      setPill({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
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
  }, [activeTab]);

  return (
    <div
      className="segmented-control"
      ref={containerRef}
      role="tablist"
      aria-label="Portfolio sections"
    >
      {pill ? (
        <motion.div
          className="segmented-control-pill"
          initial={false}
          animate={{ left: pill.left, width: pill.width }}
          transition={transition}
          aria-hidden="true"
        />
      ) : null}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            ref={isActive ? activeTabRef : null}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`segmented-control-tab${isActive ? " is-active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
