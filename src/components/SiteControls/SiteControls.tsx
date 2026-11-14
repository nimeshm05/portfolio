"use client";

import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import "./SiteControls.css";

/** Corner controls; flip either to show or hide it */
const SHOW_THEME_TOGGLE = false;
const SHOW_SCROLL_TO_TOP = false;

export function SiteControls() {
  if (!SHOW_THEME_TOGGLE && !SHOW_SCROLL_TO_TOP) return null;

  return (
    <div className="site-controls">
      {SHOW_SCROLL_TO_TOP ? <ScrollToTop /> : null}
      {SHOW_THEME_TOGGLE ? <ThemeToggle /> : null}
    </div>
  );
}
