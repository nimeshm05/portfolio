"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedIcon } from "@/components/AnimatedIcon/AnimatedIcon";
import { getPageEnterItemVariants } from "@/motion/pageEnter";
import "./Header.css";

type HeaderProps = {
  name: string;
  bio: readonly string[];
  avatarSrc: string;
  avatarAlt: string;
  children?: ReactNode;
  bottom?: ReactNode;
  galleryOpen?: boolean;
  onAvatarClick?: () => void;
};

export function Header({
  name,
  bio,
  avatarSrc,
  avatarAlt,
  children,
  bottom,
  galleryOpen = false,
  onAvatarClick,
}: HeaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [avatarHovered, setAvatarHovered] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-profile">
        <motion.div
          className="site-header-profile-content"
          variants={getPageEnterItemVariants(reduceMotion)}
          initial="initial"
          animate="animate"
        >
          <button
            type="button"
            className={`site-header-avatar${avatarHovered ? " is-hovered" : ""}`}
            aria-label={`Open photo gallery. ${avatarAlt}`}
            aria-haspopup="dialog"
            aria-expanded={galleryOpen}
            aria-controls={galleryOpen ? "photo-gallery-dialog" : undefined}
            onClick={onAvatarClick}
            onPointerEnter={() => setAvatarHovered(true)}
            onPointerLeave={() => setAvatarHovered(false)}
            onFocus={() => setAvatarHovered(true)}
            onBlur={() => setAvatarHovered(false)}
          >
            <Image
              className="site-header-avatar-image"
              src={avatarSrc}
              alt=""
              width={60}
              height={60}
              priority
            />
            <span className="site-header-avatar-cue" aria-hidden="true">
              <AnimatedIcon name="expand" isActive={avatarHovered} size={20} />
            </span>
          </button>
          <div className="site-header-details">
            <div className="site-header-info">
              <h1 className="site-header-name">{name}</h1>
              <div className="site-header-bio">
                {bio.map((paragraph) => (
                  <p key={paragraph} className="site-header-bio-paragraph">
                    {paragraph}
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
