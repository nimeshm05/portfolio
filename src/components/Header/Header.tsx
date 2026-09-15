"use client";

import {
  Children,
  Fragment,
  type ReactNode,
} from "react";
import Image from "next/image";
import type { BioParagraph } from "@/data/home";
import { PageEnterItem } from "@/components/PageEnter/PageEnter";
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
  return (
    <header className="site-header">
      <div className="site-header-profile">
        <div className="site-header-profile-content">
          <PageEnterItem className="site-header-avatar-enter">
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
          </PageEnterItem>
          <div className="site-header-details">
            <div className="site-header-info">
              <PageEnterItem as="h1" className="site-header-name">
                {name}
                <span className="site-header-name-rule" aria-hidden="true" />
              </PageEnterItem>
              <div className="site-header-bio">
                {bio.map((paragraph) => (
                  <p key={paragraph[0]} className="site-header-bio-paragraph">
                    {paragraph.map((line, index) => (
                      <Fragment key={line}>
                        {index > 0 ? <br /> : null}
                        <PageEnterItem as="span" className="site-header-bio-line">
                          {line}
                        </PageEnterItem>
                      </Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </div>
            {children ? (
              <div className="home-prompts">
                {Children.map(children, (child, index) => (
                  <PageEnterItem key={index} className="home-prompt-enter">
                    {child}
                  </PageEnterItem>
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
