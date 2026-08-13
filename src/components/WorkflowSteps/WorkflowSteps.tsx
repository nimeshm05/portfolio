import { Icon } from "@/components/Icon/Icon";
import type { WorkflowStep } from "@/data/projects/types";
import "./WorkflowSteps.css";

type WorkflowStepsProps = {
  steps: WorkflowStep[];
};

export function WorkflowSteps({ steps }: WorkflowStepsProps) {
  return (
    <ol className="workflow-steps">
      {steps.map((step) => (
        <li key={step.title} className="workflow-step">
          <span className="workflow-step-icon" aria-hidden="true">
            <Icon name={step.icon} />
          </span>
          <div className="workflow-step-copy">
            <p className="workflow-step-title">{step.title}</p>
            <p className="workflow-step-description">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
