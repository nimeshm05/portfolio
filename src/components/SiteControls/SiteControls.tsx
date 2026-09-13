"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { GalleryToggle } from "@/components/GalleryToggle/GalleryToggle";
import { Icon } from "@/components/Icon/Icon";
import { PhotoSlideshow } from "@/components/PhotoSlideshow/PhotoSlideshow";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import "./SiteControls.css";

const SLIDESHOW_ENABLED = false;

export function SiteControls() {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const pathname = usePathname();
  const showProjectBack = pathname.startsWith("/work/");

  return (
    <>
      {showProjectBack ? (
        <Link className="project-back-mobile" href="/">
          <span className="project-back-mobile-icon" aria-hidden="true">
            <Icon name="chevron-left" size={16} />
          </span>
          <span>Back</span>
        </Link>
      ) : null}
      <div className="site-controls">
        {SLIDESHOW_ENABLED ? (
          <GalleryToggle
            open={slideshowOpen}
            onToggle={() => setSlideshowOpen((open) => !open)}
          />
        ) : null}
        <ScrollToTop />
        <ThemeToggle />
      </div>
      <AnimatePresence>
        {SLIDESHOW_ENABLED && slideshowOpen ? (
          <PhotoSlideshow
            key="photo-slideshow"
            onClose={() => setSlideshowOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
