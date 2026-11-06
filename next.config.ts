import type { NextConfig } from "next";

/**
 * Identifies this build so open tabs can tell when a newer one is live (see
 * DeployWatcher). Vercel provides the commit SHA at build time; a redeploy of
 * the same commit keeps the same version, so visitors aren't nudged for
 * nothing. Local builds report "dev".
 */
const siteVersion =
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.VERCEL_DEPLOYMENT_ID ?? "dev";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Inlined into both the client bundle and the server, so a tab carries the
  // version it loaded with while /api/version reports the live one
  env: {
    SITE_VERSION: siteVersion,
  },
};

export default nextConfig;
