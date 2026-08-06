"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import { MorphingChevron } from "@/components/MorphingChevron/MorphingChevron";
import "./ListItem.css";

type ListItemProps = {
  title: string;
  meta?: string;
  icon?: IconName;
  href?: string;
  compactGap?: boolean;
  children?: ReactNode;
  defaultOpen?: boolean;
};

export function ListItem({
  title,
  meta,
  icon,
  href = "#",
  compactGap = false,
  children,
  defaultOpen = false,
}: ListItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();
  const isExpandable = children != null;
  const hasContent = Boolean(children);
  const className = `list-item${compactGap ? " list-item--compact" : ""}${
    isExpandable ? " list-item--expandable" : ""
  }${isExpandable && isOpen ? " is-open" : ""}`;

  const content = (
    <>
      {icon ? (
        <span className="list-item-icon" aria-hidden="true">
          <Icon name={icon} />
        </span>
      ) : null}
      <span className="list-item-title">
        {title}
        {meta ? <span className="list-item-meta"> {meta}</span> : null}
      </span>
      <span className="list-item-chevron" aria-hidden="true">
        {isExpandable ? (
          <MorphingChevron isOpen={isOpen} />
        ) : (
          <Icon name="chevron-right" />
        )}
      </span>
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
