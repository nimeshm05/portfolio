"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { ConnectPrompt } from "@/components/ConnectPrompt/ConnectPrompt";
import { ContentSection } from "@/components/ContentSection/ContentSection";
import { Header } from "@/components/Header/Header";
import { HomeFooter } from "@/components/HomeFooter/HomeFooter";
import { HomeSidebar } from "@/components/HomeSidebar/HomeSidebar";
import {
  PageEnter,
  PageEnterGroup,
  PageEnterItem,
} from "@/components/PageEnter/PageEnter";
import { LinkCue } from "@/components/LinkCue/LinkCue";
import { SocialIconRow } from "@/components/SocialIconRow/SocialIconRow";
import { ViewportEdgeBlur } from "@/components/ViewportEdgeBlur/ViewportEdgeBlur";
import { homeSections, profile, resume } from "@/data/home";
import { useHomeSectionSnap } from "@/motion/homeSectionSnap";
import { useHomeSidebarVisibility } from "@/motion/homeSidebarVisibility";
import "./HomePage.css";

export function HomePage() {
  const [pageEl, setPageEl] = useState<HTMLDivElement | null>(null);
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);
  const homeSidebarVisible = useHomeSidebarVisibility(contentEl);
  useHomeSectionSnap(pageEl);
  const reduceMotion = useReducedMotion() ?? false;

  const handleWorkCueSelect = () => {
    pageEl?.querySelector(".home-lower")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="home-page" ref={setPageEl}>
      <ViewportEdgeBlur />
      <HomeSidebar visible={homeSidebarVisible} sections={homeSections} />
      <PageEnter as="main" className="home-body">
        <Header
          name={profile.name}
          bio={profile.bio}
          avatarSrc={profile.avatarSrc}
          avatarAlt={profile.avatarAlt}
        >
          <ConnectPrompt />
          <SocialIconRow />
          <LinkCue
            label="Resume"
            icon="arrow-up-right"
            href={resume.href}
          />
          <LinkCue
            label="Work"
            icon="arrow-down"
            onSelect={handleWorkCueSelect}
            hideOnMobile
          />
        </Header>
        <PageEnterGroup className="home-lower">
          <PageEnterGroup className="home-main">
            <PageEnterItem>
              <div className="home-content" ref={setContentEl}>
                {homeSections.map((section, index) => (
                  <ContentSection
                    key={section.id}
                    section={section}
                    showDivider={index > 0}
                    chevronOrientation={
                      section.supportsCardView ? "right" : "down"
                    }
                    viewMode="card"
                  />
                ))}
              </div>
            </PageEnterItem>
          </PageEnterGroup>
          <PageEnterItem>
            <HomeFooter />
          </PageEnterItem>
        </PageEnterGroup>
      </PageEnter>
    </div>
  );
}
