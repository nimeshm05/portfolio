"use client";

import { motion } from "motion/react";
import {
  ListItem,
  type ChevronOrientation,
} from "@/components/ListItem/ListItem";
import type { ContentSectionData } from "@/data/home";
import type { WorkViewMode } from "@/components/ViewSwitcher/ViewSwitcher";
import {
  tabContentBlurVariants,
  tabContentTransition,
  useTabContentMotion,
} from "@/motion/tabContent";
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
  const showCardPlaceholder =
    viewMode === "card" && section.supportsCardView === true;

  return (
    <>
      {showDivider ? <hr className="content-section-divider" /> : null}
      <section className="content-section" aria-labelledby={section.id}>
        <div className="content-section-label-wrap">
          {blurOnTabChange ? (
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
        <div className="content-section-list">
          {showCardPlaceholder ? (
            <p className="content-section-placeholder">Coming soon</p>
          ) : (
            section.items.map((item) => (
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
            ))
          )}
        </div>
      </section>
    </>
  );
}
