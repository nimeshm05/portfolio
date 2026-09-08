"use client";

import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { BioParagraph } from "@/data/home";
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

  return (
    <header className="site-header">
      <div className="site-header-profile">
        <motion.div
          className="site-header-profile-content"
          variants={getPageEnterItemVariants(reduceMotion)}
          initial="initial"
          animate="animate"
        >
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
          <div className="site-header-details">
            <div className="site-header-info">
              <h1 className="site-header-name">{name}</h1>
              <div className="site-header-bio">
                {bio.map((paragraph) => (
                  <p key={paragraph[0]} className="site-header-bio-paragraph">
                    {paragraph.map((line, index) => (
                      <Fragment key={line}>
                        {index > 0 ? <br /> : null}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </div>
            {children}
          </div>
          {bottom}
        </motion.div>
      </div>
    </header>
  );
}
