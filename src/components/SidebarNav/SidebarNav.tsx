"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/Icon/Icon";
import {
  getSidebarEnterContainerVariants,
  getSidebarEnterItemVariants,
} from "@/motion/sidebarEnter";
import "./SidebarNav.css";

export type SidebarNavItem = {
  id: string;
  label: string;
  href?: string;
  /** Category heading; consecutive items with the same group share one */
  group?: string;
};

type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

function groupItems(items: SidebarNavItem[]): SidebarNavGroup[] {
  const groups: SidebarNavGroup[] = [];

  for (const item of items) {
    const last = groups.at(-1);

    if (last && last.label === item.group) {
      last.items.push(item);
    } else {
      groups.push({ label: item.group, items: [item] });
    }
  }

  return groups;
}

type SidebarNavProps = {
  items: SidebarNavItem[];
  activeId?: string;
  showBack?: boolean;
  animate?: boolean;
  className?: string;
  rootElement?: "div" | "aside";
  "aria-label"?: string;
  onItemClick?: (
    event: MouseEvent<HTMLAnchorElement>,
    item: SidebarNavItem,
  ) => void;
};

function NavItemContent({ label }: { label: string }) {
  return <span>/ {label}</span>;
}

export function SidebarNav({
  items,
  activeId = "",
  showBack = false,
  animate = false,
  className = "",
  rootElement = "div",
  "aria-label": ariaLabel,
  onItemClick,
}: SidebarNavProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const containerVariants = getSidebarEnterContainerVariants(reduceMotion);
  const itemVariants = getSidebarEnterItemVariants(reduceMotion);
  const rootClassName = ["sidebar-nav", className].filter(Boolean).join(" ");

  const backLink = showBack ? (
    <Link className="sidebar-nav-back" href="/">
      <span className="sidebar-nav-icon" aria-hidden="true">
        <Icon name="chevron-left" size={16} />
      </span>
      <span>Back</span>
    </Link>
  ) : null;

  const renderLink = (item: SidebarNavItem) => {
    const isActive = item.id === activeId;
    const linkClassName = ["sidebar-nav-link", isActive ? "is-active" : ""]
      .filter(Boolean)
      .join(" ");

    return item.href ? (
      <a
        className={linkClassName}
        href={item.href}
        onClick={(event) => onItemClick?.(event, item)}
      >
        <NavItemContent label={item.label} />
      </a>
    ) : (
      <span className={linkClassName}>
        <NavItemContent label={item.label} />
      </span>
    );
  };

  const groups = groupItems(items);

  if (!animate) {
    const Root = rootElement;

    return (
      <Root className={rootClassName} aria-label={ariaLabel}>
        {backLink}
        <nav className="sidebar-nav-links">
          {groups.map((group, index) => (
            <div key={group.label ?? index} className="sidebar-nav-group">
              {group.label ? (
                <span className="sidebar-nav-group-label">{group.label}</span>
              ) : null}
              {group.items.map((item) => (
                <div key={item.id} className="sidebar-nav-item">
                  {renderLink(item)}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </Root>
    );
  }

  const MotionRoot = rootElement === "aside" ? motion.aside : motion.div;

  return (
    <MotionRoot
      className={rootClassName}
      aria-label={ariaLabel}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {backLink ? (
        <motion.div className="sidebar-nav-motion-item" variants={itemVariants}>
          {backLink}
        </motion.div>
      ) : null}
      <nav className="sidebar-nav-links">
        {groups.map((group, index) => (
          <div key={group.label ?? index} className="sidebar-nav-group">
            {group.label ? (
              <motion.span
                className="sidebar-nav-group-label sidebar-nav-motion-item"
                variants={itemVariants}
              >
                {group.label}
              </motion.span>
            ) : null}
            {group.items.map((item) => (
              <motion.div
                key={item.id}
                className="sidebar-nav-motion-item"
                variants={itemVariants}
              >
                {renderLink(item)}
              </motion.div>
            ))}
          </div>
        ))}
      </nav>
    </MotionRoot>
  );
}
