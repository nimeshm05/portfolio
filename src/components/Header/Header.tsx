"use client";

import {
  Children,
  Fragment,
  type ReactNode,
} from "react";
import type { BioParagraph } from "@/data/home";
import { GemAvatar } from "@/components/GemAvatar/GemAvatar";
import { PageEnterItem } from "@/components/PageEnter/PageEnter";
import "./Header.css";

type HeaderProps = {
  name: string;
  bio: readonly BioParagraph[];
  avatarLabel: string;
  children?: ReactNode;
  /** Rendered directly below the bio, e.g. the work stamps */
  afterBio?: ReactNode;
  bottom?: ReactNode;
};

export function Header({
  name,
  bio,
  avatarLabel,
  children,
  afterBio,
  bottom,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-profile">
        <div className="site-header-profile-content">
          {/* not part of the text stagger: the gem drops in on its own once the text has entered */}
          <div className="site-header-avatar-enter">
            <GemAvatar label={avatarLabel} />
          </div>
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
              {afterBio ? (
                <PageEnterItem className="site-header-after-bio">
                  {afterBio}
                </PageEnterItem>
              ) : null}
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
