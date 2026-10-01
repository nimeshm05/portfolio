"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon/Icon";
import { ScrollToTop } from "@/components/ScrollToTop/ScrollToTop";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import "./SiteControls.css";

export function SiteControls() {
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
        <ScrollToTop />
        <ThemeToggle />
      </div>
    </>
  );
}
