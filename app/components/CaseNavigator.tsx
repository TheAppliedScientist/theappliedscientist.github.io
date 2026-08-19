"use client";

import { useState } from "react";
import papers from "../data/papers.json";
import Sparkline from "./figures/Sparkline";

export default function CaseNavigator() {
  const [selectedId, setSelectedId] = useState(papers.papers[0].id);
  const selected = papers.papers.find((paper) => paper.id === selectedId) ?? papers.papers[0];

  return (
    <div className="case-navigator">
      <div className="case-focus">
        <header>
          <div><span>Paper {String(selected.id).padStart(2, "0")}</span><b>{selected.domain}</b></div>
          <strong>{selected.v0} → {selected.vmax}</strong>
        </header>
        <Sparkline v0={selected.v0} rounds={selected.rounds} height={54} />
        <dl>
          <div><dt>Human reviewer average</dt><dd>{selected.human_avg.toFixed(2)}</dd></div>
          <div><dt>Execution weaknesses resolved</dt><dd>{selected.exec_fixed}</dd></div>
          <div><dt>Idea weaknesses resolved</dt><dd>{selected.idea_fixed}</dd></div>
          <div><dt>Stanford Reviewer, V₀ → Vmax</dt><dd>{selected.stanford_v0.toFixed(1)} → {selected.stanford_vmax.toFixed(1)}</dd></div>
        </dl>
      </div>
      <div className="case-list" role="list" aria-label="Select a paper trajectory">
        {papers.papers.map((paper) => (
          <button type="button" role="listitem" key={paper.id}
            aria-pressed={selected.id === paper.id} onClick={() => setSelectedId(paper.id)}>
            <span>{String(paper.id).padStart(2, "0")}</span>
            <i>{paper.domain}</i>
            <b>{paper.v0} → {paper.vmax}</b>
          </button>
        ))}
      </div>
    </div>
  );
}
