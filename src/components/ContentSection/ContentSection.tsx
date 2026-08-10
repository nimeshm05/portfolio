"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ListItem,
  type ChevronOrientation,
} from "@/components/ListItem/ListItem";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import type { ContentSectionData } from "@/data/home";
import { getWorkCard } from "@/data/workCards";
import type { WorkViewMode } from "@/components/ViewSwitcher/ViewSwitcher";
import {
  tabContentBlurVariants,
  tabContentTransition,
  useTabContentMotion,
} from "@/motion/tabContent";
import {
  getWorkViewCardContainerVariants,
  getWorkViewItemVariants,
  getWorkViewTransition,
} from "@/motion/workView";
import "./ContentSection.css";

type ContentSectionProps = {
  section: ContentSectionData;
  showDivider?: boolean;
  chevronOrientation?: ChevronOrientation;
  viewMode?: WorkViewMode;
};

export function ContentSection({
  section,
  showDivider = false,
  chevronOrientation,
  viewMode = "list",
}: ContentSectionProps) {
  const blurOnTabChange = useTabContentMotion();
  const reduceMotion = useReducedMotion() ?? false;
  const supportsCardView = section.supportsCardView === true;
  const showCardView = viewMode === "card" && supportsCardView;
  const workViewTransition = getWorkViewTransition(reduceMotion);
  const workViewItemVariants = getWorkViewItemVariants(reduceMotion);
  const workViewCardContainerVariants =
    getWorkViewCardContainerVariants(reduceMotion);
  const cardProjects = showCardView
    ? section.items
        .map((item) => getWorkCard(item.id))
        .filter((project) => project != null)
    : [];

  const listContent = section.items.map((item) => (
    <ListItem
      key={item.id}
      title={item.title}
      meta={item.meta}
      icon={item.icon}
      href={item.href}
      chevronOrientation={chevronOrientation}
    >
      {item.description ? (
        <p className="list-item-description">{item.description}</p>
      ) : null}
    </ListItem>
  ));

  return (
    <>
      {showDivider ? <hr className="content-section-divider" /> : null}
      <section className="content-section" aria-labelledby={section.id}>
        <div className="content-section-label-wrap">
          {supportsCardView ? (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h2
                key={viewMode}
                className="content-section-label"
                id={section.id}
                variants={workViewItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={workViewTransition}
              >
                {section.label}
              </motion.h2>
            </AnimatePresence>
          ) : blurOnTabChange ? (
            <motion.h2
              className="content-section-label"
              id={section.id}
              variants={tabContentBlurVariants}
              transition={tabContentTransition}
            >
              {section.label}
            </motion.h2>
          ) : (
            <h2 className="content-section-label" id={section.id}>
              {section.label}
            </h2>
          )}
        </div>
        {supportsCardView ? (
          <AnimatePresence mode="popLayout" initial={false}>
            {showCardView ? (
              <motion.div
                key="card"
                className="content-section-cards"
                variants={workViewCardContainerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {cardProjects.map((project) => (
                  <motion.div
                    key={project.slug}
                    variants={workViewItemVariants}
                    transition={workViewTransition}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="content-section-list"
                variants={workViewItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={workViewTransition}
              >
                {listContent}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="content-section-list">{listContent}</div>
        )}
      </section>
    </>
  );
}
