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
          <dd className="project-meta-value">
            {item.tools?.length ? (
              <ul className="project-meta-tools">
                {item.tools.map((tool) => (
                  <li key={tool.name} className="project-meta-tool">
                    <span className="project-meta-tool-logo" aria-hidden="true">
                      {tool.logoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tool.logoSrc} alt="" />
                      ) : (
                        <span className="project-meta-tool-emoji">
                          {tool.emoji}
                        </span>
                      )}
                    </span>
                    {tool.name}
                  </li>
                ))}
              </ul>
            ) : (
              item.value
            )}
          </dd>
        </PageEnterItem>
      ))}
    </dl>
  );
}
