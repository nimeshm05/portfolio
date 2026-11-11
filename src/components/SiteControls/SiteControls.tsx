"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon/Icon";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { useExitToHome } from "@/motion/pageExit";
import "./SiteControls.css";

/** Theme toggle and back-to-top are hidden for now; flip to bring them back */
const SHOW_CORNER_CONTROLS = false;

export function SiteControls() {
  const pathname = usePathname();
  const exitToHome = useExitToHome();
  const showProjectBack = pathname.startsWith("/work/");

  return (
    <>
      {showProjectBack ? (
        <Link
          className="project-back-mobile"
          href="/"
          onClick={exitToHome}
          aria-label="Back"
        >
          <span className="project-back-mobile-icon" aria-hidden="true">
            <Icon name="chevron-left" size={20} />
          </span>
        </Link>
      ) : null}
      {SHOW_CORNER_CONTROLS ? (
        <div className="site-controls">
          <ScrollToTop />
          <ThemeToggle />
        </div>
      ) : null}
    </>
  );
}
