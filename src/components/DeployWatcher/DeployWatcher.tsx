"use client";

import { useEffect, useState } from "react";
import { DeployBookmark } from "@/components/DeployBookmark/DeployBookmark";

/** The build this tab loaded with (set in next.config.ts) */
const LOADED_VERSION = process.env.SITE_VERSION;

/** How often an open, visible tab asks which build is live */
const CHECK_INTERVAL_MS = 5 * 60 * 1000;
/** Coming back to the tab checks right away, but not more often than this */
const MIN_GAP_MS = 30 * 1000;

/**
 * Watches for a newer deployment while the site is open and drops the
 * deploy bookmark when one goes live. Checks every few minutes while the tab
 * is visible, and whenever the visitor comes back to it.
 */
export function DeployWatcher() {
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (isStale) return;

    let lastCheck = 0;
    let cancelled = false;

    const check = async () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastCheck < MIN_GAP_MS) return;
      lastCheck = Date.now();

      try {
        const response = await fetch("/api/version", { cache: "no-store" });
        if (!response.ok) return;
        const { version } = (await response.json()) as { version?: string };
        if (!cancelled && version && version !== LOADED_VERSION) {
          setIsStale(true);
        }
      } catch {
        // Offline or mid-deploy: try again on the next tick
      }
    };

    const interval = window.setInterval(check, CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, [isStale]);

  return <DeployBookmark open={isStale} />;
}
