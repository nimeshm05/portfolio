import type { Metadata } from "next";
import { WorkStamps } from "@/components/WorkStamps/WorkStamps";
import { workStamps } from "@/data/home";
import "./page.css";

export const metadata: Metadata = {
  title: "Work stamps · Nimesh Mohanakrishnan",
};

/* The work stamps on their own, centred, following the site theme. */
export default function WorkStampsPage() {
  return (
    <main className="work-stamps-page-standalone">
      <div className="work-stamps-page-standalone-inner">
        <WorkStamps stamps={workStamps} />
      </div>
    </main>
  );
}
