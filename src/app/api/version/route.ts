/**
 * Reports which build is live, so open tabs can notice a new deploy (see
 * DeployWatcher). GET handlers run per request, and the response is never
 * cached, so this always reflects the current deployment.
 */
export function GET() {
  return Response.json(
    { version: process.env.SITE_VERSION },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
