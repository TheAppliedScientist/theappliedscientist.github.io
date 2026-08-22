"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import replay from "../data/persuasion-full-replay.json";

type EventKind = "brief" | "task" | "inspect" | "command" | "edit" | "experiment" | "figure" | "manuscript" | "review";
type ReplayEvent = {
  id: string;
  rawStep: number;
  phase: string;
  kind: EventKind;
  tool?: string;
  title: string;
  summary?: string;
  detail?: string;
  repeated?: number;
  score?: number;
  artifact?: { type: "image" | "pdf"; src: string; label: string };
};

const events = replay.events as ReplayEvent[];
const kindLabels: Record<EventKind, string> = {
  brief: "Research brief",
  task: "Plan",
  inspect: "Read",
  command: "Command",
  edit: "Edit",
  experiment: "Experiment",
  figure: "Figure",
  manuscript: "Manuscript",
  review: "Review",
};

const filters = [
  { id: "all", label: "All actions" },
  { id: "experiment", label: "Experiments", kinds: ["experiment", "figure"] },
  { id: "manuscript", label: "Paper changes", kinds: ["manuscript", "edit"] },
  { id: "review", label: "Reviews", kinds: ["review"] },
] as const;

function compactPath(value: string) {
  return value.replaceAll("/app/", "").replaceAll("/home/researcher/", "~/");
}

export default function FullTrajectoryReplay() {
  const [filter, setFilter] = useState("all");
  const visibleEvents = useMemo(() => {
    const selected = filters.find((item) => item.id === filter);
    if (!selected || !("kinds" in selected)) return events;
    return events.filter((event) => (selected.kinds as readonly string[]).includes(event.kind));
  }, [filter]);
  const [activeId, setActiveId] = useState(events[0].id);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [follow, setFollow] = useState(true);
  const activeIndex = Math.max(0, visibleEvents.findIndex((event) => event.id === activeId));
  const active = visibleEvents[activeIndex] ?? visibleEvents[0];
  const eventRefs = useRef(new Map<string, HTMLButtonElement>());

  const choose = useCallback((event: ReplayEvent, shouldFollow = false) => {
    setActiveId(event.id);
    setPlaying(false);
    setFollow(shouldFollow);
  }, []);

  const move = useCallback((offset: number) => {
    const next = Math.max(0, Math.min(visibleEvents.length - 1, activeIndex + offset));
    setActiveId(visibleEvents[next].id);
  }, [activeIndex, visibleEvents]);

  useEffect(() => {
    if (!visibleEvents.some((event) => event.id === activeId)) setActiveId(visibleEvents[0]?.id ?? events[0].id);
  }, [activeId, visibleEvents]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (activeIndex >= visibleEvents.length - 1) {
        setPlaying(false);
        return;
      }
      setActiveId(visibleEvents[activeIndex + 1].id);
    }, 1500 / speed);
    return () => window.clearInterval(timer);
  }, [activeIndex, playing, speed, visibleEvents]);

  useEffect(() => {
    if (follow || playing) eventRefs.current.get(active?.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [active?.id, follow, playing]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === " ") { event.preventDefault(); setPlaying((value) => !value); setFollow(true); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [move]);

  const jumpToPhase = (phaseId: string) => {
    const match = visibleEvents.find((event) => event.phase === phaseId) ?? events.find((event) => event.phase === phaseId);
    if (match) choose(match, true);
  };

  const activePhaseIndex = replay.phases.findIndex((phase) => phase.id === active?.phase);

  return (
    <main className="full-replay" id="replay-main">
      <section className="run-context">
        <div className="run-context-copy">
          <p>Recorded AppliedScientist run</p>
          <h1>{replay.meta.title}</h1>
          <span>This is the execution record behind the five-round summary: the actual tool actions, experiment outputs, manuscript changes, and reviews in chronological order.</span>
        </div>
        <dl>
          <div><dt>Original human score</dt><dd>4.0<small>/10</small></dd></div>
          <div><dt>Best saved revision</dt><dd>V₃ <strong className="best-revision-score">7<span>/10</span></strong></dd></div>
          <div><dt>Recorded events</dt><dd>{replay.meta.rawEventCount}</dd></div>
          <div><dt>Saved revisions</dt><dd>5</dd></div>
        </dl>
      </section>

      <section className="replay-workspace" aria-label="Execution replay">
        <aside className="phase-rail">
          <div className="phase-rail-heading"><span>Run map</span><strong>{activePhaseIndex + 1} / {replay.phases.length}</strong></div>
          <nav aria-label="Run phases">
            {replay.phases.map((phase, index) => (
              <button key={phase.id} type="button" onClick={() => jumpToPhase(phase.id)} className={phase.id === active?.phase ? "is-active" : index < activePhaseIndex ? "is-complete" : ""}>
                <i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
                <span><strong>{phase.label}</strong><small>{phase.count} recorded actions</small></span>
              </button>
            ))}
          </nav>
          <p className="provenance"><strong>Source</strong>{replay.meta.source}. Internal reasoning and credentials are not published; repeated status checks are condensed.</p>
        </aside>

        <section className="event-stream" aria-label="Chronological event stream">
          <header className="stream-head">
            <div><span>Chronological stream</span><strong>{visibleEvents.length} displayed actions</strong></div>
            <div className="stream-filters" role="group" aria-label="Filter events">
              {filters.map((item) => <button type="button" key={item.id} className={filter === item.id ? "is-active" : ""} onClick={() => { setFilter(item.id); setPlaying(false); }}>{item.label}</button>)}
            </div>
          </header>

          <div className="stream-list" onWheel={() => setFollow(false)} onTouchMove={() => setFollow(false)}>
            {visibleEvents.map((event, index) => (
              <button
                type="button"
                key={event.id}
                ref={(node) => { if (node) eventRefs.current.set(event.id, node); }}
                className={`stream-event kind-${event.kind}${event.id === active?.id ? " is-active" : ""}`}
                onClick={() => choose(event)}
                aria-current={event.id === active?.id ? "step" : undefined}
              >
                <span className="event-position"><i aria-hidden="true" /><b>{String(index + 1).padStart(3, "0")}</b></span>
                <span className="event-copy">
                  <span className="event-meta"><b>{kindLabels[event.kind]}</b>{event.repeated && event.repeated > 1 ? <em>{event.repeated} checks condensed</em> : null}</span>
                  <strong>{event.title}</strong>
                  {event.summary ? <small>{compactPath(event.summary).split("\n")[0]}</small> : null}
                </span>
                {event.score ? <span className="event-score">{event.score}<small>/10</small></span> : <span className="event-open" aria-hidden="true">›</span>}
              </button>
            ))}
          </div>
        </section>

        <aside className={`event-evidence kind-${active?.kind}`} aria-live="polite">
          <header>
            <div><span>{active ? kindLabels[active.kind] : "Action"}</span></div>
            <h2>{active?.title}</h2>
            <p>Raw trajectory step {active?.rawStep} of {replay.meta.rawEventCount}</p>
          </header>
          <div className="evidence-body">
            {active?.artifact?.type === "image" ? <figure className="event-artifact"><img src={active.artifact.src} alt={active.artifact.label} /><figcaption>{active.artifact.label}</figcaption></figure> : null}
            {active?.artifact?.type === "pdf" ? <a className="event-document" href={active.artifact.src} target="_blank" rel="noreferrer">{active.artifact.label} <span aria-hidden="true">↗</span></a> : null}
            {active?.summary ? <section><h3>{active.tool === "Bash" ? "Command issued" : "Action"}</h3><pre>{compactPath(active.summary)}</pre></section> : null}
            {active?.detail ? <section><h3>{active.kind === "review" ? "Recorded review output" : "Recorded result"}</h3><pre>{compactPath(active.detail)}</pre></section> : <p className="no-output">This action did not return a visible output.</p>}
          </div>
          <footer>
            <span>{replay.phases.find((phase) => phase.id === active?.phase)?.label}</span>
            <strong>{activeIndex + 1} / {visibleEvents.length}</strong>
          </footer>
        </aside>
      </section>

      <div className="full-transport" aria-label="Replay controls">
        <button type="button" onClick={() => move(-1)} disabled={activeIndex === 0} aria-label="Previous action">←</button>
        <button type="button" className="transport-play" onClick={() => { setPlaying((value) => !value); setFollow(true); }}>{playing ? "Pause" : "Play execution"}</button>
        <button type="button" onClick={() => move(1)} disabled={activeIndex === visibleEvents.length - 1} aria-label="Next action">→</button>
        <input aria-label="Replay position" type="range" min="0" max={Math.max(0, visibleEvents.length - 1)} value={activeIndex} onChange={(event) => { setActiveId(visibleEvents[Number(event.target.value)].id); setPlaying(false); setFollow(true); }} />
        <span>{String(activeIndex + 1).padStart(3, "0")} / {String(visibleEvents.length).padStart(3, "0")}</span>
        <button type="button" className="speed-control" onClick={() => setSpeed((current) => current === 1 ? 2 : 1)}>{speed}×</button>
        {!follow && <button type="button" className="resume-follow" onClick={() => setFollow(true)}>Follow current action</button>}
      </div>
    </main>
  );
}
