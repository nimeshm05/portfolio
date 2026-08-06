"use client";

import { useState } from "react";
import { ContentSection } from "@/components/ContentSection/ContentSection";
import { Header } from "@/components/Header/Header";
import { SegmentedControl } from "@/components/SegmentedControl/SegmentedControl";
import {
  aboutSections,
  homeTabs,
  profile,
  workSections,
  type HomeTab,
} from "@/data/home";
import "./HomePage.css";

export function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>("work");
  const sections = activeTab === "work" ? workSections : aboutSections;

  return (
    <div className="home-page">
      <main className="home-body">
        <div className="home-intro">
          <Header
            name={profile.name}
            bio={profile.bioByTab[activeTab]}
            avatarSrc={profile.avatarSrc}
            avatarAlt={profile.avatarAlt}
          />
          <div className="home-nav">
            <SegmentedControl
              tabs={homeTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>
        <div className="home-content" role="tabpanel">
          {sections.map((section, index) => (
            <ContentSection
              key={section.id}
              section={section}
              showDivider={index > 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
