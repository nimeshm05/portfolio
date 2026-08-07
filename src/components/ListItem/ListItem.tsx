"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { MorphingChevron } from "@/components/MorphingChevron/MorphingChevron";
import {
  tabContentBlurVariants,
  tabContentTransition,
  useTabContentMotion,
} from "@/motion/tabContent";
import "./ListItem.css";

export type ChevronOrientation = "right" | "down";

type ListItemProps = {
  title: string;
  meta?: string;
  icon?: IconName;
  href?: string;
  compactGap?: boolean;
  children?: ReactNode;
  defaultOpen?: boolean;
  chevronOrientation?: ChevronOrientation;
};

const CHEVRON_TRANSITION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * Link chevrons use chevron-right as the base glyph.
 * Expandable chevrons use MorphingChevron (down/up) as the base glyph,
 * so "right" is expressed as -90° on that down-facing path.
 */
function getLinkChevronRotate(orientation: ChevronOrientation) {
  return orientation === "down" ? 90 : 0;
}

function getExpandableChevronRotate(
  orientation: ChevronOrientation,
  isOpen: boolean,
) {
  if (isOpen) {
    return 0;
  }

  return orientation === "right" ? -90 : 0;
}

export function ListItem({
  title,
  meta,
  icon,
  href = "#",
  compactGap = false,
  children,
  defaultOpen = false,
  chevronOrientation,
}: ListItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const blurOnTabChange = useTabContentMotion();
  const isExpandable = children != null;
  const hasContent = Boolean(children);
  const closedOrientation =
    chevronOrientation ?? (isExpandable ? "down" : "right");
  const className = `list-item${compactGap ? " list-item--compact" : ""}${
    isExpandable ? " list-item--expandable" : ""
  }${isExpandable && isOpen ? " is-open" : ""}`;

  const iconNode = icon ? (
    blurOnTabChange ? (
      <motion.span
        className="list-item-icon"
        aria-hidden="true"
        variants={tabContentBlurVariants}
        transition={tabContentTransition}
      >
        <Icon name={icon} />
      </motion.span>
    ) : (
      <span className="list-item-icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
    )
  ) : null;

  const titleNode = blurOnTabChange ? (
    <motion.span
      className="list-item-title"
      variants={tabContentBlurVariants}
      transition={tabContentTransition}
    >
      {title}
      {meta ? <span className="list-item-meta"> {meta}</span> : null}
    </motion.span>
  ) : (
    <span className="list-item-title">
      {title}
      {meta ? <span className="list-item-meta"> {meta}</span> : null}
    </span>
  );

  const chevronRotate = isExpandable
    ? getExpandableChevronRotate(closedOrientation, isOpen)
    : getLinkChevronRotate(closedOrientation);

  const chevronInitialRotate = blurOnTabChange
    ? isExpandable
      ? chevronRotate === 0
        ? -90
        : 0
      : chevronRotate === 90
        ? 0
        : 90
    : false;

  const chevronNode = (
    <motion.span
      className="list-item-chevron"
      aria-hidden="true"
      initial={
        chevronInitialRotate === false
          ? false
          : { rotate: chevronInitialRotate }
      }
      animate={{ rotate: chevronRotate }}
      transition={CHEVRON_TRANSITION}
    >
      {isExpandable ? (
        <MorphingChevron isOpen={isOpen} />
      ) : (
        <Icon name="chevron-right" />
      )}
    </motion.span>
  );

  const content = (
    <>
      {iconNode}
      {titleNode}
      {chevronNode}
    </>
  );

  if (isExpandable) {
    return (
      <div className={`list-item-shell${isOpen ? " is-open" : ""}`}>
        <button
          type="button"
          className={className}
          aria-expanded={hasContent ? isOpen : undefined}
          aria-controls={hasContent ? panelId : undefined}
          onClick={() => {
            if (hasContent) {
              setIsOpen((open) => !open);
            }
          }}
        >
          {content}
        </button>
        {hasContent && isOpen ? (
          <div className="list-item-panel" id={panelId}>
            {children}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <a className={className} href={href}>
      {content}
    </a>
  );
}
