import type { ReplayView } from "./ReplayViews";

export default function ReplayHeader({ view, onChange }: { view: ReplayView; onChange: (view: ReplayView) => void }) {
  return (
    <header className="replay-shared-header">
      <a href="/" className="replay-back">← Research overview</a>
      <div className="replay-view-switch" role="group" aria-label="Replay view">
        <span className="replay-view-label">View</span>
        <button type="button" className={view === "rounds" ? "is-active" : ""} aria-pressed={view === "rounds"} onClick={() => onChange("rounds")}>Round overview</button>
        <button type="button" className={view === "execution" ? "is-active" : ""} aria-pressed={view === "execution"} onClick={() => onChange("execution")}>Execution replay</button>
      </div>
      <a href="/exhibits/annotated-persuasion-and-vigilance.pdf" className="replay-annotated" target="_blank" rel="noreferrer">Annotated paper <span aria-hidden="true">↗</span></a>
    </header>
  );
}
