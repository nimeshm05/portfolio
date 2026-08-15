import type { ReactNode } from "react";
import "@/components/ContentSection/ContentSection.css";
import "./ProjectSection.css";

type ProjectSectionProps = {
  id: string;
  eyebrow?: string;
  heading?: string;
  children: ReactNode;
};

export function ProjectSection({
  id,
  eyebrow,
  heading,
  children,
}: ProjectSectionProps) {
  return (
    <section
      className="project-section"
      id={id}
      aria-labelledby={heading || eyebrow ? `${id}-heading` : undefined}
    >
      {eyebrow || heading ? (
        <div className="project-section-heading">
          {eyebrow ? (
            <p
              className="content-section-label"
              id={heading ? undefined : `${id}-heading`}
            >
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2 className="project-section-title" id={`${id}-heading`}>
              {heading}
            </h2>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
