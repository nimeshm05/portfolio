"use client";

import { motion } from "motion/react";
import { ListItem } from "@/components/ListItem/ListItem";
import type { ContentSectionData } from "@/data/home";
import {
  tabContentBlurVariants,
  tabContentTransition,
  useTabContentMotion,
} from "@/motion/tabContent";
import "./ContentSection.css";

type ContentSectionProps = {
  section: ContentSectionData;
  showDivider?: boolean;
};

export function ContentSection({
  section,
  showDivider = false,
}: ContentSectionProps) {
  const blurOnTabChange = useTabContentMotion();

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
          {section.items.map((item) => (
            <ListItem
              key={item.id}
              title={item.title}
              meta={item.meta}
              icon={item.icon}
              href={item.href}
              compactGap={section.compactGap}
            >
              {item.description ? (
                <p className="list-item-description">{item.description}</p>
              ) : null}
            </ListItem>
          ))}
        </div>
      </section>
    </>
  );
}
