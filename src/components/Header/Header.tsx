"use client";

import {
  Children,
  Fragment,
  type ReactNode,
} from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { BioParagraph } from "@/data/home";
import {
  getHomeIntroItemVariants,
  useHomeFirstLoadIntro,
} from "@/motion/homeIntro";
import { getPageEnterItemVariants } from "@/motion/pageEnter";
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
  const isFirstLoad = useHomeFirstLoadIntro();
  const introVariants = getHomeIntroItemVariants(reduceMotion);
  let introIndex = 0;
  const nextIntroIndex = () => introIndex++;

  const avatar = (
    <div className="site-header-avatar is-static">
      <Image
        className="site-header-avatar-image"
        src={avatarSrc}
        alt={avatarAlt}
        width={60}
        height={60}
        priority
      />
    </div>
  );

  const content = (
    <>
      {isFirstLoad ? (
        <motion.div
          className="site-header-avatar-enter"
          variants={introVariants}
          custom={nextIntroIndex()}
          initial="initial"
          animate="animate"
        >
          {avatar}
        </motion.div>
      ) : (
        avatar
      )}
      <div className="site-header-details">
        <div className="site-header-info">
          {isFirstLoad ? (
            <motion.h1
              className="site-header-name"
              variants={introVariants}
              custom={nextIntroIndex()}
              initial="initial"
              animate="animate"
            >
              {name}
            </motion.h1>
          ) : (
            <h1 className="site-header-name">{name}</h1>
          )}
          <div className="site-header-bio">
            {bio.map((paragraph) => (
              <p key={paragraph[0]} className="site-header-bio-paragraph">
                {paragraph.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 ? <br /> : null}
                    {isFirstLoad ? (
                      <motion.span
                        className="site-header-bio-line"
                        variants={introVariants}
                        custom={nextIntroIndex()}
                        initial="initial"
                        animate="animate"
                      >
                        {line}
                      </motion.span>
                    ) : (
                      line
                    )}
                  </Fragment>
                ))}
              </p>
            ))}
          </div>
        </div>
        {children ? (
          <div className="home-prompts">
            {isFirstLoad
              ? Children.map(children, (child, index) => (
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
                ))
              : children}
          </div>
        ) : null}
      </div>
      {bottom}
    </>
  );

  return (
    <header className="site-header">
      <div className="site-header-profile">
        {isFirstLoad ? (
          <div className="site-header-profile-content">{content}</div>
        ) : (
          <motion.div
            className="site-header-profile-content"
            variants={getPageEnterItemVariants(reduceMotion)}
            initial="initial"
            animate="animate"
          >
            {content}
          </motion.div>
        )}
      </div>
    </header>
  );
}
