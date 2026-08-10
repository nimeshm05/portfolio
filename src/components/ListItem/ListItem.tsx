"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { MorphingChevron } from "@/components/MorphingChevron/MorphingChevron";
import { MorphingArrowUpRight } from "@/components/MorphingArrowUpRight/MorphingArrowUpRight";
import {
  tabContentBlurVariants,
  tabContentOpacityVariants,
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

function getTabEntranceRotate(
  isExpandable: boolean,
  targetRotate: number,
) {
  if (isExpandable) {
    return targetRotate === 0 ? -90 : 0;
  }

  return targetRotate === 90 ? 0 : 90;
}

export function ListItem({
  title,
  meta,
  icon,
  href = "#",
  children,
  defaultOpen = false,
  chevronOrientation,
}: ListItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);
  const panelId = useId();
  const blurOnTabChange = useTabContentMotion();
  const isExpandable = children != null;
  const hasContent = Boolean(children);
  const isExternalLink = Boolean(href?.startsWith("http"));
  const closedOrientation =
    chevronOrientation ?? (isExpandable ? "down" : "right");
  const className = `list-item${
    isExpandable ? " list-item--expandable" : ""
  }${isExpandable && isOpen ? " is-open" : ""}`;

  const chevronRotate = isExpandable
    ? getExpandableChevronRotate(closedOrientation, isOpen)
    : getLinkChevronRotate(closedOrientation);

  /**
   * Drive entrance spin via state + effect instead of Motion `initial`.
   * Parent AnimatePresence/`initial={false}` can suppress child mount
   * animations, which broke About→Work link chevrons.
   */
  const [chevronAngle, setChevronAngle] = useState(() =>
    blurOnTabChange
      ? getTabEntranceRotate(isExpandable, chevronRotate)
      : chevronRotate,
  );

  useEffect(() => {
    if (!blurOnTabChange) {
      setChevronAngle(chevronRotate);
      return;
    }

    const frameId = requestAnimationFrame(() => {
      setChevronAngle(chevronRotate);
    });

    return () => cancelAnimationFrame(frameId);
  }, [blurOnTabChange, chevronRotate]);

  const iconNode = icon ? (
    blurOnTabChange ? (
      <motion.span
        className="list-item-icon"
        aria-hidden="true"
        variants={tabContentOpacityVariants}
        initial="initial"
        animate="animate"
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
      initial="initial"
      animate="animate"
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

  const chevronNode = (
    <motion.span
      className="list-item-chevron"
      aria-hidden="true"
      initial={false}
      animate={{ rotate: isExternalLink ? 0 : chevronAngle }}
      transition={CHEVRON_TRANSITION}
    >
      {isExpandable ? (
        <MorphingChevron isOpen={isOpen} />
      ) : isExternalLink ? (
        <MorphingArrowUpRight showArrow={isHovered} />
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
    <a
      className={className}
      href={href}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      {...(isExternalLink
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {content}
    </a>
  );
}
