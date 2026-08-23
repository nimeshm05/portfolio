"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectBanner } from "@/components/ProjectBanner/ProjectBanner";
import Link from "next/link";
import type { ProjectCardData } from "@/data/projects";
import "./ProjectCard.css";

type ProjectCardProps = {
  project: ProjectCardData;
};

function ProjectCardType({ label }: { label: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isMarquee, setIsMarquee] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    const update = () => {
      setIsMarquee(text.scrollWidth > container.clientWidth + 1);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(text);

    return () => observer.disconnect();
  }, [label]);

  return (
    <span
      ref={containerRef}
      className={["project-card-type", isMarquee ? "is-marquee" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span ref={textRef} className="project-card-type-text">
        {label}
      </span>
    </span>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isExternal = project.href.startsWith("http");

  const content = (
    <>
      <div className="project-card-header">
        <span className="project-card-title">{project.title}</span>
        <ProjectCardType label={project.projectType} />
      </div>
      <ProjectBanner
        src={project.bannerSrc}
        alt={project.bannerAlt}
        type={project.bannerType}
        variant="card"
      />
      <div className="project-card-footer">
        <p className="project-card-timeline">{project.timeline}</p>
        <p className="project-card-description">{project.description}</p>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a
        className="project-card"
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link className="project-card" href={project.href}>
      {content}
    </Link>
  );
}
