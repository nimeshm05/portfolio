import { Fragment } from "react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import "./InvestigationSteps.css";

export type InvestigationStep = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
};

type InvestigationStepsProps = {
  steps: InvestigationStep[];
};

export function InvestigationSteps({ steps }: InvestigationStepsProps) {
  if (!steps.length) {
    return null;
  }

  return (
    <ol className="investigation-steps">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          {index > 0 ? (
            <li className="investigation-steps-connector" aria-hidden="true">
              <span className="investigation-steps-connector-line" />
              <Icon
                name="chevrons-down"
                className="investigation-steps-connector-chevron"
              />
            </li>
          ) : null}
          <li className="investigation-steps-item">
            <div className="investigation-steps-header">
              <span className="investigation-steps-icon" aria-hidden="true">
                <Icon name={step.icon} />
              </span>
              <span className="investigation-steps-title">{step.title}</span>
            </div>
            <p className="investigation-steps-description">{step.description}</p>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
