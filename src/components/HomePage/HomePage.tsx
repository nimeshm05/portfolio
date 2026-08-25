"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
import type { ChevronOrientation } from "@/components/ListItem/ListItem";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import {
  ViewSwitcher,
  type WorkViewMode,
} from "@/components/ViewSwitcher/ViewSwitcher";
import { LinkCue } from "@/components/LinkCue/LinkCue";
import { PhotoGalleryOverlay } from "@/components/PhotoGalleryOverlay/PhotoGalleryOverlay";
import { ViewportEdgeBlur } from "@/components/ViewportEdgeBlur/ViewportEdgeBlur";
import {
  aboutSections,
  homeTabs,
  profile,
  resume,
  workSections,
  type HomeTab,
} from "@/data/home";
import { useHomeSectionSnap } from "@/motion/homeSectionSnap";
import { useHomeSidebarVisibility } from "@/motion/homeSidebarVisibility";
import {
  TabContentMotionProvider,
  tabContentBlurVariants,
  tabContentTransition,
} from "@/motion/tabContent";
import "./HomePage.css";

const PHOTO_GALLERY_ENABLED = false;

export function HomePage() {
  const [pageEl, setPageEl] = useState<HTMLDivElement | null>(null);
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<HomeTab>("work");
  const [workViewMode, setWorkViewMode] = useState<WorkViewMode>("card");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const sections = activeTab === "work" ? workSections : aboutSections;
  const chevronOrientation: ChevronOrientation =
    activeTab === "about" ? "down" : "right";
  const homeSidebarEnabled = activeTab === "work" && workViewMode === "card";
  const homeSidebarVisible = useHomeSidebarVisibility(contentEl, {
    enabled: homeSidebarEnabled,
  });
  useHomeSectionSnap(pageEl);
  const reduceMotion = useReducedMotion() ?? false;

  const handleCueSelect = (tab: HomeTab) => {
    setActiveTab(tab);
    pageEl?.querySelector(".home-lower")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="home-page" ref={setPageEl}>
      <ViewportEdgeBlur />
      <HomeSidebar
        visible={homeSidebarEnabled && homeSidebarVisible}
        sections={workSections}
      />
      <PageEnter as="main" className="home-body">
        <Header
          name={profile.name}
          bio={profile.bioByTab[activeTab]}
          avatarSrc={profile.avatarSrc}
          avatarAlt={profile.avatarAlt}
          galleryOpen={PHOTO_GALLERY_ENABLED && galleryOpen}
          onAvatarClick={
            PHOTO_GALLERY_ENABLED ? () => setGalleryOpen(true) : undefined
          }
        >
          <div className="home-prompts">
            <ConnectPrompt activeTab={activeTab} />
            <LinkCue
              label="View resume"
              icon="arrow-up-right"
              href={resume.href}
            />
            <LinkCue
              label="View work"
              icon="arrow-down"
              onSelect={() => handleCueSelect("work")}
            />
          </div>
        </Header>
        <PageEnterGroup className="home-lower">
          <PageEnterGroup className="home-main">
            <PageEnterItem>
              <div className="home-nav">
                <div className="segmented-control-container">
                  <SegmentedControl
                    tabs={homeTabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                  />
                </div>
                <AnimatePresence>
                  {activeTab === "work" ? (
                    <motion.div
                      key="view-switcher"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={tabContentBlurVariants}
                      transition={tabContentTransition}
                    >
                      <ViewSwitcher
                        activeView={workViewMode}
                        onChange={setWorkViewMode}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </PageEnterItem>
            <PageEnterItem>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  ref={setContentEl}
                  className="home-content"
                  role="tabpanel"
                  initial={false}
                  animate="animate"
                  exit="exit"
                  transition={tabContentTransition}
                >
                  <TabContentMotionProvider value={true}>
                    {sections.map((section, index) => (
                      <ContentSection
                        key={section.id}
                        section={section}
                        showDivider={index > 0}
                        chevronOrientation={chevronOrientation}
                        viewMode={
                          activeTab === "work" ? workViewMode : undefined
                        }
                      />
                    ))}
                  </TabContentMotionProvider>
                </motion.div>
              </AnimatePresence>
            </PageEnterItem>
          </PageEnterGroup>
          <PageEnterItem>
            <HomeFooter />
          </PageEnterItem>
        </PageEnterGroup>
      </PageEnter>
      <AnimatePresence>
        {PHOTO_GALLERY_ENABLED && galleryOpen ? (
          <PhotoGalleryOverlay
            key="photo-gallery"
            onClose={() => setGalleryOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
