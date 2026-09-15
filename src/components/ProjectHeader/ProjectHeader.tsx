"use client";

import { PageEnterItem } from "@/components/PageEnter/PageEnter";
import { LinkCue } from "@/components/LinkCue/LinkCue";
import "./ProjectHeader.css";

type ProjectHeaderProps = {
  title: string;
  subtitle: string;
  liveHref?: string;
};

export function ProjectHeader({
  title,
  subtitle,
  liveHref,
}: ProjectHeaderProps) {
  return (
    <header className="project-header">
      <div className="project-header-content">
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
                icon="arrow-right"
                href={liveHref}
                tone="accent"
              />
            </PageEnterItem>
          ) : null}
        </div>
        <PageEnterItem as="span" className="callout-rule" aria-hidden />
      </div>
    </header>
  );
}
