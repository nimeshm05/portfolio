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
  return <span>/ {label}</span>;
}

function getSectionElements(ids: string[]) {
  return ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el != null)
    .sort((a, b) => a.offsetTop - b.offsetTop);
}

function getActiveSectionId(elements: HTMLElement[]) {
  if (elements.length === 0) {
    return "";
  }

  const marker = window.scrollY + window.innerHeight * 0.2;
  let activeId = elements[0].id;

  for (const element of elements) {
    if (element.offsetTop <= marker) {
      activeId = element.id;
    }
  }

  return activeId;
}

export function ProjectSidebar({ items }: ProjectSidebarProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const ids = items.filter((item) => item.href).map((item) => item.id);

    if (ids.length === 0) {
      return;
    }

    const syncActiveSection = () => {
      const elements = getSectionElements(ids);

      if (elements.length === 0) {
        return;
      }

      setActiveId(getActiveSectionId(elements));
    };

    syncActiveSection();

    const elements = getSectionElements(ids);

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
          return;
        }

        syncActiveSection();
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    window.addEventListener("scroll", syncActiveSection, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncActiveSection);
    };
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
