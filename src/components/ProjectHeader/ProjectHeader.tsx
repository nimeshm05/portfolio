import "./ProjectHeader.css";

type ProjectHeaderProps = {
  title: string;
  subtitle: string;
};

export function ProjectHeader({ title, subtitle }: ProjectHeaderProps) {
  return (
    <header className="project-header">
      <div className="project-header-info">
        <h1 className="project-header-title">{title}</h1>
        <p className="project-header-subtitle">{subtitle}</p>
      </div>
    </header>
  );
}
