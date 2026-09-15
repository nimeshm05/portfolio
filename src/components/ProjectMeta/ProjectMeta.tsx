"use client";

import { PageEnterItem } from "@/components/PageEnter/PageEnter";
import type { ProjectMetaItem } from "@/data/projects/types";
import "./ProjectMeta.css";

type ProjectMetaProps = {
  items: ProjectMetaItem[];
};

export function ProjectMeta({ items }: ProjectMetaProps) {
  if (!items.length) {
    return null;
  }

  return (
    <dl className="project-meta">
      {items.map((item) => (
        <PageEnterItem key={item.label} className="project-meta-item">
          <dt className="project-meta-label">{item.label}</dt>
          <dd className="project-meta-value">{item.value}</dd>
        </PageEnterItem>
      ))}
    </dl>
  );
}
