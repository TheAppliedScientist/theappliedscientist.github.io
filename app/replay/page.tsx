import type { Metadata } from "next";
import ReplayViews from "../components/ReplayViews";
import "./replay.css";
import "./full/full-replay.css";

export const metadata: Metadata = {
  title: "Revision trajectory replay",
  description:
    "A step-by-step replay of reviewer feedback, experiments, manuscript changes, and saved revisions produced by AppliedScientist.",
};

export default function ReplayPage() {
  return <ReplayViews />;
}
