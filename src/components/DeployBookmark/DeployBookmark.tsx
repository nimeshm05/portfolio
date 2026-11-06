"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Postmark } from "@/components/WorkStamps/WorkStamps";
import "./DeployBookmark.css";

/** Set on <html> while the bookmark hangs, so the top-right icons step aside */
const ATTRIBUTE = "data-deploy-bookmark";

type DeployBookmarkProps = {
  /** True once a newer deployment is live than the one on screen */
  open: boolean;
  /** Defaults to a full page reload */
  onReload?: () => void;
};

/**
 * A stamp-like bookmark that drops in from the top-right corner when a new
 * version of the site is deployed. It hangs until the visitor reloads.
 */
export function DeployBookmark({ open, onReload }: DeployBookmarkProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute(ATTRIBUTE, open);
    return () => root.removeAttribute(ATTRIBUTE);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          className="deploy-bookmark"
          role="status"
          aria-live="polite"
          aria-label="New version deployed"
          style={{ transformOrigin: "50% 0%" }}
          initial={reduceMotion ? { opacity: 0 } : { y: "-110%", rotate: -6 }}
          animate={
            reduceMotion
              ? { opacity: 1 }
              : {
                  y: 0,
                  // Swings on its top edge and settles, like a ribbon let go
                  rotate: [-6, 4, -2, 1, 0],
                  transition: {
                    y: { type: "spring", stiffness: 260, damping: 18, mass: 0.9 },
                    rotate: { duration: 1.4, ease: "easeOut", times: [0, 0.3, 0.55, 0.8, 1] },
                  },
                }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { y: "-110%", transition: { duration: 0.35, ease: "easeIn" } }
          }
        >
          <div className="deploy-bookmark-ribbon">
            <Postmark
              className="deploy-bookmark-postmark"
              label="JUST SHIPPED"
              year="NEW"
              location="SEATTLE · WA"
              rotate={-14}
              seed={7}
            />
            <p className="deploy-bookmark-eyebrow">New version deployed</p>
            <p className="deploy-bookmark-line">
              You’re reading the vintage edition.
            </p>
            <button
              type="button"
              className="deploy-bookmark-button"
              onClick={onReload ?? (() => window.location.reload())}
              onPointerMove={(event) => {
                // Feeds the glare's position (see .deploy-bookmark-button::before)
                const rect = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty(
                  "--glare-x",
                  `${event.clientX - rect.left}px`,
                );
                event.currentTarget.style.setProperty(
                  "--glare-y",
                  `${event.clientY - rect.top}px`,
                );
              }}
            >
              Get the new edition
            </button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
