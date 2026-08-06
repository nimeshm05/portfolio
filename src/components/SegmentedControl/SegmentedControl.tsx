"use client";

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

export function SegmentedControl({
  tabs,
  activeTab,
  onChange,
}: SegmentedControlProps) {
  return (
    <div
      className="segmented-control"
      role="tablist"
      aria-label="Portfolio sections"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
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
