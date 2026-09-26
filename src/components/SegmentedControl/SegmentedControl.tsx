"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
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

export function SegmentedControl({
  tabs,
  activeTab,
  onChange,
}: SegmentedControlProps) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab),
  );
  const pillShift =
    activeIndex === 0
      ? 0
      : `calc(${activeIndex} * (100% + var(--gap-2xs)))`;

  return (
    <div
      className="segmented-control"
      style={{ "--segment-count": tabs.length } as CSSProperties}
      role="tablist"
      aria-label="Portfolio sections"
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`segmented-control-tab${isActive ? " is-active" : ""}`}
            style={{ gridColumn: index + 1 }}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
      <motion.div
        className="segmented-control-pill"
        initial={false}
        animate={{ x: pillShift }}
        transition={PILL_TRANSITION}
        aria-hidden="true"
      />
    </div>
  );
}
