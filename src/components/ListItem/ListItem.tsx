"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Icon, type IconName } from "@/components/Icon/Icon";
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

function getChevronRotate(
  closedOrientation: ChevronOrientation,
  isExpandable: boolean,
  isOpen: boolean,
) {
  if (isExpandable && isOpen) {
    return -90;
  }

  return closedOrientation === "down" ? 90 : 0;
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
  const chevronRotate = getChevronRotate(
    closedOrientation,
    isExpandable,
    isOpen,
  );
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

  const content = (
    <>
      {iconNode}
      {titleNode}
      <motion.span
        className="list-item-chevron"
        aria-hidden="true"
        initial={
          blurOnTabChange
            ? { rotate: chevronRotate === 90 ? 0 : 90 }
            : false
        }
        animate={{ rotate: chevronRotate }}
        transition={CHEVRON_TRANSITION}
      >
        <Icon name="chevron-right" />
      </motion.span>
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
