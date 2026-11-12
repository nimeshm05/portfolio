"use client";

import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import "./SiteControls.css";

/** Theme toggle and back-to-top are hidden for now; flip to bring them back */
const SHOW_CORNER_CONTROLS = false;

export function SiteControls() {
  return (
    <>
      {SHOW_CORNER_CONTROLS ? (
        <div className="site-controls">
          <ScrollToTop />
          <ThemeToggle />
        </div>
      ) : null}
    </>
  );
}
