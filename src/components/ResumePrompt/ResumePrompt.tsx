import { MorphingArrowRight } from "@/components/MorphingArrowRight/MorphingArrowRight";
import { resume } from "@/data/home";
import "./ResumePrompt.css";

export function ResumePrompt() {
  const isExternal = resume.href.startsWith("http");

  return (
    <div className="resume-prompt">
      <div className="resume-prompt-content">
      <span className="resume-prompt-icon" aria-hidden="true">
        <MorphingArrowRight variant="right" />
      </span>
      <span className="resume-prompt-text">See more</span>
      </div>
      <a
        className="resume-prompt-action"
        href={resume.href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        View
      </a>
    </div>
  );
}
