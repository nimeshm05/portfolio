import type { ReactNode } from "react";
import "@/components/ContentSection/ContentSection.css";
import "./ProjectSection.css";

type ProjectSectionProps = {
  id: string;
  eyebrow?: string;
  heading?: string;
  className?: string;
  children: ReactNode;
};

export function ProjectSection({
  id,
  eyebrow,
  heading,
  className,
  children,
}: ProjectSectionProps) {
  // "Job 1\nWhen I…" renders each line as its own block so they can be spaced
  const headingLines = heading?.split("\n") ?? [];

  return (
    <section
      className={className ? `project-section ${className}` : "project-section"}
      id={id}
      aria-labelledby={heading || eyebrow ? `${id}-heading` : undefined}
    >
      {eyebrow || heading ? (
        <div className="project-section-heading">
          <div className="project-section-heading-content">
          {/* {eyebrow ? (
            <p
              className="content-section-label"
              id={heading ? undefined : `${id}-heading`}
            >
              {eyebrow}
            </p>
          ) : null} */}
          {heading ? (
            <h2 className="project-section-title" id={`${id}-heading`}>
              {headingLines.length > 1
                ? headingLines.map((line, index) => (
                    <span key={line} className="project-section-title-line">
                      {line}
                      {/* Keeps "Job 1 When…" apart for screen readers */}
                      {index < headingLines.length - 1 ? " " : null}
                    </span>
                  ))
                : heading}
            </h2>
          ) : null}
          </div>
          {/* {heading ? (
            <hr className="project-section-heading-divider" />
          ) : null} */}
        </div>
      ) : null}
      {children}
    </section>
  );
}
