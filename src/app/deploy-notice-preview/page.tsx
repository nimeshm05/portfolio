"use client";

import { useState } from "react";
import { DeployBookmark } from "@/components/DeployBookmark/DeployBookmark";

// Preview of the "new version deployed" bookmark. "Simulate a deploy" drops
// it in; "Reset" lifts it back out so the drop can be replayed.
export default function DeployNoticePreviewPage() {
  const [open, setOpen] = useState(false);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "0 var(--inset-x)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "var(--space-16)",
          maxWidth: "var(--content-width-home)",
          color: "var(--color-text-prose)",
        }}
      >
        <p>
          Deploy notice preview. Watch the icons in the top-right corner fade
          as the bookmark drops in.
        </p>
        <div style={{ display: "flex", gap: "var(--space-12)" }}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={open}
            style={{
              padding: "var(--space-8) var(--space-16)",
              borderRadius: "var(--radius-full)",
              background: "var(--color-text-primary)",
              color: "var(--color-bg-page)",
              fontWeight: 600,
              opacity: open ? 0.4 : 1,
            }}
          >
            Simulate a deploy
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              padding: "var(--space-8) var(--space-16)",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-divider)",
              color: "var(--color-text-primary)",
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <DeployBookmark open={open} />
    </main>
  );
}
