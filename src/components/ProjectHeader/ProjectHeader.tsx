import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import "./ProjectHeader.css";

type ProjectHeaderProps = {
  title: string;
  subtitle: string;
  showMobileBack?: boolean;
};

export function ProjectHeader({
  title,
  subtitle,
  showMobileBack = false,
}: ProjectHeaderProps) {
  return (
    <header className="project-header">
      {showMobileBack ? (
        <Link className="project-back-mobile" href="/">
          <span className="project-back-mobile-icon" aria-hidden="true">
            <Icon name="chevron-left" size={16} />
          </span>
          <span>Back</span>
        </Link>
      ) : null}
      <div className="project-header-info">
        <h1 className="project-header-title">{title}</h1>
        <p className="project-header-subtitle">{subtitle}</p>
      </div>
    </header>
  );
}
