"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Callout } from "@/components/Callout/Callout";
import {
  ListItem,
  type ChevronOrientation,
} from "@/components/ListItem/ListItem";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";
import { RichText } from "@/components/RichText/RichText";
import type { ContentSectionData, ListItemBlock, ListItemData } from "@/data/home";
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

type GroupedListItemCopy =
  | { type: "paragraphs"; paragraphs: string[] }
  | { type: "callout"; text: string };

function groupListItemBlocks(blocks: ListItemBlock[]): GroupedListItemCopy[] {
  const groups: GroupedListItemCopy[] = [];

  for (const block of blocks) {
    if (block.type === "callout") {
      groups.push({ type: "callout", text: block.text });
      continue;
    }

    const last = groups.at(-1);
    if (last?.type === "paragraphs") {
      last.paragraphs.push(block.text);
    } else {
      groups.push({ type: "paragraphs", paragraphs: [block.text] });
    }
  }

  return groups;
}

function ListItemDates({ dates }: { dates: string }) {
  return <p className="list-item-dates">{dates}</p>;
}

function ListItemCopy({ item }: { item: ListItemData }) {
  if (item.blocks?.length) {
    return (
      <div className="list-item-copy">
        {groupListItemBlocks(item.blocks).map((group) =>
          group.type === "callout" ? (
            <Callout key={`callout-${group.text}`}>{group.text}</Callout>
          ) : (
            <RichText
              key={`copy-${group.paragraphs[0]}`}
              content={{ type: "paragraphs", paragraphs: group.paragraphs }}
            />
          ),
        )}
        {item.dates ? <ListItemDates dates={item.dates} /> : null}
      </div>
    );
  }

  if (item.paragraphs?.length) {
    return (
      <>
        <RichText
          content={{ type: "paragraphs", paragraphs: item.paragraphs }}
        />
        {item.dates ? <ListItemDates dates={item.dates} /> : null}
      </>
    );
  }

  if (item.description || item.dates) {
    return (
      <div className="list-item-entry">
        {item.description ? (
          <p className="list-item-description">{item.description}</p>
        ) : null}
        {item.dates ? <ListItemDates dates={item.dates} /> : null}
      </div>
    );
  }

  return null;
}

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
  const isInitialMount = useRef(true);
  const supportsCardView = section.supportsCardView === true;
  const showCardView = viewMode === "card" && supportsCardView;
  const workViewTransition = getWorkViewTransition(reduceMotion);
  const workViewItemVariants = getWorkViewItemVariants(reduceMotion);
  const workViewCardContainerVariants =
    getWorkViewCardContainerVariants(reduceMotion);
  /**
   * On tab mount, start the list wrapper fully visible so blur/opacity are
   * not applied to chevrons. ListItem titles/icons still run their own enter.
   * On list↔card, enter from the hidden work-view state as before.
   */
  const workViewVisible = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, filter: "blur(0px)" };
  const listEnterInitial = isInitialMount.current
    ? workViewVisible
    : "initial";

  useEffect(() => {
    isInitialMount.current = false;
  }, []);

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
      animateIconOnHover={viewMode === "list"}
    >
      {item.blocks?.length ||
      item.paragraphs?.length ||
      item.description ||
      item.dates ? (
        <ListItemCopy item={item} />
      ) : null}
    </ListItem>
  ));

  return (
    <>
      {showDivider ? <hr className="content-section-divider" /> : null}
      <section className="content-section" aria-labelledby={section.id}>
        <div className="content-section-label-wrap">
          {supportsCardView ? (
            <AnimatePresence mode="popLayout">
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
              initial="initial"
              animate="animate"
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
          <AnimatePresence mode="wait">
            {showCardView ? (
              <motion.div
                key="card"
                className="content-section-cards"
                variants={workViewCardContainerVariants}
                initial={isInitialMount.current ? false : "initial"}
                animate="animate"
                exit="exit"
              >
                {cardProjects.map((project) => (
                  <motion.div
                    key={project.slug}
                    className="content-section-card"
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
                initial={listEnterInitial}
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
