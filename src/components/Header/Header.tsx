"use client";

import {
  Children,
  Fragment,
  type ReactNode,
} from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { BioParagraph } from "@/data/home";
import { getHomeIntroItemVariants } from "@/motion/homeIntro";
import "./Header.css";

type HeaderProps = {
  name: string;
  bio: readonly BioParagraph[];
  avatarSrc: string;
  avatarAlt: string;
  children?: ReactNode;
  bottom?: ReactNode;
};

export function Header({
  name,
  bio,
  avatarSrc,
  avatarAlt,
  children,
  bottom,
}: HeaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const introVariants = getHomeIntroItemVariants(reduceMotion);
  let introIndex = 0;
  const nextIntroIndex = () => introIndex++;

  return (
    <header className="site-header">
      <div className="site-header-profile">
        <div className="site-header-profile-content">
          <motion.div
            className="site-header-avatar-enter"
            variants={introVariants}
            custom={nextIntroIndex()}
            initial="initial"
            animate="animate"
          >
            <div className="site-header-avatar">
              <Image
                className="site-header-avatar-image"
                src={avatarSrc}
                alt={avatarAlt}
                width={60}
                height={60}
                priority
              />
            </div>
          </motion.div>
          <div className="site-header-details">
            <div className="site-header-info">
              <motion.h1
                className="site-header-name"
                variants={introVariants}
                custom={nextIntroIndex()}
                initial="initial"
                animate="animate"
              >
                {name}
                <span className="site-header-name-rule" aria-hidden="true" />
              </motion.h1>
              <div className="site-header-bio">
                {bio.map((paragraph) => (
                  <p key={paragraph[0]} className="site-header-bio-paragraph">
                    {paragraph.map((line, index) => (
                      <Fragment key={line}>
                        {index > 0 ? <br /> : null}
                        <motion.span
                          className="site-header-bio-line"
                          variants={introVariants}
                          custom={nextIntroIndex()}
                          initial="initial"
                          animate="animate"
                        >
                          {line}
                        </motion.span>
                      </Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </div>
            {children ? (
              <div className="home-prompts">
                {Children.map(children, (child, index) => (
                  <motion.div
                    key={index}
                    className="home-prompt-enter"
                    variants={introVariants}
                    custom={nextIntroIndex()}
                    initial="initial"
                    animate="animate"
                  >
                    {child}
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>
          {bottom}
        </div>
      </div>
    </header>
  );
}
