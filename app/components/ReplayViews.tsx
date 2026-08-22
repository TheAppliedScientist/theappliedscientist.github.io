"use client";

import { useState } from "react";
import FullTrajectoryReplay from "./FullTrajectoryReplay";
import ReplayHeader from "./ReplayHeader";
import TrajectoryReplay from "./TrajectoryReplay";

export type ReplayView = "execution" | "rounds";

export default function ReplayViews() {
  const [view, setView] = useState<ReplayView>("rounds");
  return (
    <div className="replay-view-root">
      <ReplayHeader view={view} onChange={setView} />
      {view === "execution" ? <FullTrajectoryReplay /> : <TrajectoryReplay />}
    </div>
  );
}
