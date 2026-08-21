"use client";

import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { AnimatedIcon } from "@/components/AnimatedIcon/AnimatedIcon";
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
  alwaysExpanded?: boolean;
  chevronOrientation?: ChevronOrientation;
  animateIconOnHover?: boolean;
};

const CHEVRON_TRANSITION = {
  duration: 0.5,
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
  alwaysExpanded = false,
  chevronOrientation,
  animateIconOnHover = false,
}: ListItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen || alwaysExpanded);
  const [isHovered, setIsHovered] = useState(false);
  const panelId = useId();
  const blurOnTabChange = useTabContentMotion();
  const hasContent = children != null;
  const isStaticExpanded = hasContent && alwaysExpanded;
  const isExpandable = hasContent && !alwaysExpanded;
  const isExternalLink = Boolean(href?.startsWith("http"));
  const isInternalLink =
    !isExpandable && !isStaticExpanded && !isExternalLink && href.startsWith("/");
  const closedOrientation =
    chevronOrientation ?? (isExpandable ? "down" : "right");
  const className = `list-item${
    isExpandable || isStaticExpanded ? " list-item--expandable" : ""
  }${isStaticExpanded ? " list-item--static" : ""}${
    (isExpandable && isOpen) || isStaticExpanded ? " is-open" : ""
  }`;

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

  const rowHoverHandlers = {
    onPointerEnter: () => setIsHovered(true),
    onPointerLeave: () => setIsHovered(false),
  };

  const iconContent =
    icon &&
    (animateIconOnHover ? (
      <AnimatedIcon name={icon} isActive={isHovered} />
    ) : (
      <Icon name={icon} />
    ));

  const iconNode = iconContent ? (
    blurOnTabChange ? (
      <motion.span
        className="list-item-icon"
        aria-hidden="true"
        variants={tabContentOpacityVariants}
        initial="initial"
        animate="animate"
        transition={tabContentTransition}
      >
        {iconContent}
      </motion.span>
    ) : (
      <span className="list-item-icon" aria-hidden="true">
        {iconContent}
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

  const chevronNode = isStaticExpanded ? null : (
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

  if (isStaticExpanded) {
    return (
      <div className="list-item-shell is-open">
        <div className={className}>{content}</div>
        <div className="list-item-panel" id={panelId}>
          {children}
        </div>
      </div>
    );
  }

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
          {...rowHoverHandlers}
        >
          {content}
        </button>
        {hasContent ? (
          <div
            className="list-item-panel-collapse"
            id={panelId}
            aria-hidden={!isOpen}
          >
            <div className="list-item-panel-collapse-inner">
              <div className="list-item-panel">{children}</div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (isInternalLink) {
    return (
      <Link className={className} href={href} {...rowHoverHandlers}>
        {content}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={href}
      {...rowHoverHandlers}
      {...(isExternalLink
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {content}
    </a>
  );
}
