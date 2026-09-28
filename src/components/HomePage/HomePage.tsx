"use client";

import { useState } from "react";
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
import {
  ViewSwitcher,
  type WorkViewMode,
} from "@/components/ViewSwitcher/ViewSwitcher";
import { LinkCue } from "@/components/LinkCue/LinkCue";
import { ViewportEdgeBlur } from "@/components/ViewportEdgeBlur/ViewportEdgeBlur";
import { aboutSections, profile, resume, workSections } from "@/data/home";
import { useHomeSidebarVisibility } from "@/motion/homeSidebarVisibility";
import "./HomePage.css";

const sections = [...workSections, ...aboutSections];

export function HomePage() {
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);
  const [workViewMode, setWorkViewMode] = useState<WorkViewMode>("card");
  const homeSidebarVisible = useHomeSidebarVisibility(contentEl);

  return (
    <div className="home-page">
      <ViewportEdgeBlur />
      <HomeSidebar visible={homeSidebarVisible} sections={sections} />
      <PageEnter as="main" className="home-body">
        <Header
          name={profile.name}
          bio={profile.bioByTab.work}
          avatarSrc={profile.avatarSrc}
          avatarAlt={profile.avatarAlt}
        >
          <ConnectPrompt />
          <LinkCue
            label="Resume"
            icon="arrow-up-right"
            href={resume.href}
          />
        </Header>
        <PageEnterGroup className="home-lower">
          <PageEnterGroup className="home-main">
            <PageEnterItem>
              <div className="home-nav">
                <ViewSwitcher
                  activeView={workViewMode}
                  onChange={setWorkViewMode}
                />
              </div>
            </PageEnterItem>
            <PageEnterItem>
              <div className="home-content" ref={setContentEl}>
                {sections.map((section, index) => (
                  <ContentSection
                    key={section.id}
                    section={section}
                    showDivider={index > 0}
                    viewMode={workViewMode}
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
