"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import type { ProjectNavItem } from "@/data/projects/types";
import "./ProjectSidebar.css";

type ProjectSidebarProps = {
  items: ProjectNavItem[];
};

function NavItemContent({ label }: { label: string }) {
  return (
    <>
      <span className="project-sidebar-icon" aria-hidden="true">
        <Icon name="chevron-right" size={16} />
      </span>
      <span>/ {label}</span>
    </>
  );
}

export function ProjectSidebar({ items }: ProjectSidebarProps) {
  const sectionIds = items.filter((item) => item.href).map((item) => item.id);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const ids = items.filter((item) => item.href).map((item) => item.id);

    if (ids.length === 0) {
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="project-sidebar" aria-label="Project navigation">
      <Link className="project-sidebar-back" href="/">
        <span className="project-sidebar-icon" aria-hidden="true">
          <Icon name="chevron-left" size={16} />
        </span>
        <span>Back</span>
      </Link>
      <nav className="project-sidebar-nav">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const className = [
            "project-sidebar-link",
            isActive ? "is-active" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return item.href ? (
            <a key={item.id} className={className} href={item.href}>
              <NavItemContent label={item.label} />
            </a>
          ) : (
            <span key={item.id} className={className}>
              <NavItemContent label={item.label} />
            </span>
          );
        })}
      </nav>
    </aside>
  );
}
