import { notFound } from "next/navigation";
import { DeployNoticePreview } from "./DeployNoticePreview";

// Design preview for the deploy bookmark; local development only
export default function DeployNoticePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DeployNoticePreview />;
}
