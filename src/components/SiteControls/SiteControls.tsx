"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { GalleryToggle } from "@/components/GalleryToggle/GalleryToggle";
import { PhotoSlideshow } from "@/components/PhotoSlideshow/PhotoSlideshow";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import "./SiteControls.css";

const SLIDESHOW_ENABLED = false;

export function SiteControls() {
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  return (
    <>
      <div className="site-controls">
        {SLIDESHOW_ENABLED ? (
          <GalleryToggle
            open={slideshowOpen}
            onToggle={() => setSlideshowOpen((open) => !open)}
          />
        ) : null}
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
