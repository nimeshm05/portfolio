"use client";

import { useState } from "react";
import { AnimatedIcon } from "@/components/AnimatedIcon/AnimatedIcon";
import "./ViewWorkCue.css";

type ViewWorkCueProps = {
  onSelect: () => void;
};

export function ViewWorkCue({ onSelect }: ViewWorkCueProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className="view-work-cue"
      onClick={onSelect}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <span className="view-work-cue-icon" aria-hidden="true">
        <AnimatedIcon name="arrow-down" isActive={isHovered} />
      </span>
      <span className="view-work-cue-label">View work</span>
    </button>
  );
}
