"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Icon } from "@/components/Icon/Icon";
import type { ArchitectureWorkflowStep } from "@/data/projects/types";
import {
  tabContentBlurVariants,
  tabContentOpacityVariants,
  tabContentTransition,
} from "@/motion/tabContent";
import "./ArchitectureWorkflow.css";

const AUTO_ROTATE_MS = 2000;

type ArchitectureWorkflowProps = {
  steps: ArchitectureWorkflowStep[];
};

export function ArchitectureWorkflow({ steps }: ArchitectureWorkflowProps) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const isInView = useInView(rootRef, { amount: 0.25 });
  const [isPaused, setIsPaused] = useState(false);
  const [activeStepId, setActiveStepId] = useState(steps[0]?.id ?? "");
  const activeStep =
    steps.find((step) => step.id === activeStepId) ?? steps[0];
  const variants = reduceMotion
    ? tabContentOpacityVariants
    : tabContentBlurVariants;

  useEffect(() => {
    if (!isInView || isPaused || steps.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveStepId((currentId) => {
        const currentIndex = steps.findIndex((step) => step.id === currentId);
        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % steps.length;

        return steps[nextIndex]?.id ?? currentId;
      });
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(intervalId);
  }, [isInView, isPaused, steps]);

  const pause = () => setIsPaused(true);

  const resumeIfBlurred = (relatedTarget: EventTarget | null) => {
    if (!rootRef.current?.contains(relatedTarget as Node)) {
      setIsPaused(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className="architecture-workflow"
      onMouseEnter={pause}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={pause}
      onBlurCapture={(event) => resumeIfBlurred(event.relatedTarget)}
    >
      <div
        className="architecture-workflow-nav"
        role="tablist"
        aria-label="Architecture Agent workflow"
      >
        {steps.map((step) => {
          const isActive = step.id === activeStepId;
          const tabId = `${baseId}-tab-${step.id}`;
          const panelId = `${baseId}-panel-${step.id}`;

          return (
            <button
              key={step.id}
              type="button"
              id={tabId}
              className={`architecture-workflow-step${isActive ? " is-active" : ""}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              onMouseEnter={() => setActiveStepId(step.id)}
              onFocus={() => setActiveStepId(step.id)}
            >
              <span className="architecture-workflow-step-icon" aria-hidden="true">
                <Icon name={step.icon} size={24} />
              </span>
              <span className="architecture-workflow-step-label">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="architecture-workflow-panel">
        <AnimatePresence mode="wait">
          {activeStep ? (
            <motion.div
              key={activeStep.id}
              id={`${baseId}-panel-${activeStep.id}`}
              className={`architecture-workflow-content${
                activeStep.tools?.length
                  ? " architecture-workflow-content--with-tools"
                  : ""
              }`}
              role="tabpanel"
              aria-live="polite"
              aria-labelledby={`${baseId}-tab-${activeStep.id}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={tabContentTransition}
            >
              <p className="architecture-workflow-heading">
                {activeStep.heading}
              </p>
              {activeStep.tools?.length ? (
                <ul className="architecture-workflow-tools">
                  {activeStep.tools.map((tool) => (
                    <li key={tool} className="architecture-workflow-tool">
                      {tool}
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
