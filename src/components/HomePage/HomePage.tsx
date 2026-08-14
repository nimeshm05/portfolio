"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ConnectPrompt } from "@/components/ConnectPrompt/ConnectPrompt";
import { ContentSection } from "@/components/ContentSection/ContentSection";
import { Header } from "@/components/Header/Header";
import { HomeFooter } from "@/components/HomeFooter/HomeFooter";
import { HomeSidebar } from "@/components/HomeSidebar/HomeSidebar";
import type { ChevronOrientation } from "@/components/ListItem/ListItem";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import {
  ViewSwitcher,
  type WorkViewMode,
} from "@/components/ViewSwitcher/ViewSwitcher";
import { ViewportEdgeBlur } from "@/components/ViewportEdgeBlur/ViewportEdgeBlur";
import {
  aboutSections,
  homeTabs,
  profile,
  workSections,
  type HomeTab,
} from "@/data/home";
import { useHomeSidebarVisibility } from "@/motion/homeSidebarVisibility";
import {
  TabContentMotionProvider,
  tabContentBlurVariants,
  tabContentTransition,
} from "@/motion/tabContent";
import "./HomePage.css";

export function HomePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<HomeTab>("work");
  const [workViewMode, setWorkViewMode] = useState<WorkViewMode>("card");
  const sections = activeTab === "work" ? workSections : aboutSections;
  const chevronOrientation: ChevronOrientation =
    activeTab === "about" ? "down" : "right";
  const navPadded = activeTab === "about" || workViewMode === "list";
  const homeSidebarEnabled = activeTab === "work" && workViewMode === "card";
  const homeSidebarVisible = useHomeSidebarVisibility(contentRef, {
    enabled: homeSidebarEnabled,
  });

  return (
    <div className="home-page">
      <ViewportEdgeBlur />
      <HomeSidebar
        visible={homeSidebarEnabled && homeSidebarVisible}
        sections={workSections}
      />
      <main className="home-body">
        <Header
          name={profile.name}
          bio={profile.bioByTab[activeTab]}
          avatarSrc={profile.avatarSrc}
          avatarAlt={profile.avatarAlt}
        >
          <ConnectPrompt activeTab={activeTab} />
        </Header>
        <div className="home-lower">
          <div className="home-main">
            <div
              className={`home-nav${navPadded ? " home-nav--padded" : ""}`}
            >
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                ref={contentRef}
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
                      viewMode={activeTab === "work" ? workViewMode : undefined}
                    />
                  ))}
                </TabContentMotionProvider>
              </motion.div>
            </AnimatePresence>
          </div>
          <HomeFooter />
        </div>
      </main>
    </div>
  );
}
