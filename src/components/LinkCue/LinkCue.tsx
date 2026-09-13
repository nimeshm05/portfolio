"use client";

import { useState, type ReactNode } from "react";
import { AnimatedIcon } from "@/components/AnimatedIcon/AnimatedIcon";
import "./LinkCue.css";

type LinkCueIcon = "arrow-down" | "arrow-right" | "arrow-up-right";

type LinkCueProps = {
  label: string;
  icon: LinkCueIcon;
  href?: string;
  onSelect?: () => void;
  tone?: "default" | "accent";
};

export function LinkCue({
  label,
  icon,
  href,
  onSelect,
  tone = "default",
}: LinkCueProps) {
  const [isHovered, setIsHovered] = useState(false);
  const className = [
    "link-cue",
    tone === "accent" ? "link-cue--accent" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const hoverHandlers = {
    onPointerEnter: () => setIsHovered(true),
    onPointerLeave: () => setIsHovered(false),
    onFocus: () => setIsHovered(true),
    onBlur: () => setIsHovered(false),
  };

  const content: ReactNode = (
    <>
      <span className="link-cue-icon" aria-hidden="true">
        <AnimatedIcon name={icon} isActive={isHovered} />
      </span>
      <span className="link-cue-label">{label}</span>
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http");

    return (
      <a
        className={className}
        href={href}
        data-cuelume-press={isExternal ? "arrival" : undefined}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...hoverHandlers}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onSelect}
      {...hoverHandlers}
    >
      {content}
    </button>
  );
}
