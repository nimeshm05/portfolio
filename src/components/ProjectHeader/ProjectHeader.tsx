"use client";

import { useLayoutEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { PageEnterItem } from "@/components/PageEnter/PageEnter";
import { LinkCue } from "@/components/LinkCue/LinkCue";
import "./ProjectHeader.css";

type ProjectHeaderProps = {
  title: string;
  subtitle: string;
  liveHref?: string;
};

/** How small and faint the pinned header gets once the content covers it */
const SHRUNK_SCALE = 0.88;
const SHRUNK_OPACITY = 0.35;

export function ProjectHeader({
  title,
  subtitle,
  liveHref,
}: ProjectHeaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const headerRef = useRef<HTMLElement>(null);
  // Scroll distance over which the content rises over the header: its own
  // height, so it's fully shrunk by the time it's covered
  const coverDistance = useRef(1);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const measure = () => {
      coverDistance.current = Math.max(header.offsetHeight, 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) =>
    Math.min(Math.max(y / coverDistance.current, 0), 1),
  );
  const scale = useTransform(progress, [0, 1], [1, SHRUNK_SCALE]);
  const opacity = useTransform(progress, [0, 1], [1, SHRUNK_OPACITY]);

  return (
    <header ref={headerRef} className="project-header">
      <motion.div
        className="project-header-content"
        style={reduceMotion ? { opacity } : { scale, opacity }}
      >
        <div className="project-header-info">
          <PageEnterItem as="h1" className="project-header-title">
            {title}
          </PageEnterItem>
          <PageEnterItem as="p" className="project-header-subtitle">
            {subtitle}
          </PageEnterItem>
          {liveHref ? (
            <PageEnterItem>
              <LinkCue
                label="View Live"
                href={liveHref}
                tone="accent"
              />
            </PageEnterItem>
          ) : null}
        </div>
        <PageEnterItem as="span" className="callout-rule" aria-hidden />
      </motion.div>
    </header>
  );
}
