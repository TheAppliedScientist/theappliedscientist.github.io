import Sparkline from "./figures/Sparkline";
import papers from "../data/papers.json";

// order matches the domains actually present in papers.json (papers.json
// uses short codes: CV, Graph, NLP, RL, TS)
const DOMAIN_ORDER = ["NLP", "CV", "Graph", "TS", "RL"];

/**
 * PaperGrid — small multiples, one cell per paper. Same axes in every
 * cell, so the cells can be compared by eye without reading a number.
 * Caption lives with the caller (this is placed inside a <Figure>).
 */
export default function PaperGrid() {
  const rows = [...papers.papers].sort(
    (a, b) =>
      DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain) ||
      a.id - b.id
  );

  return (
    <div className="multiples">
      {rows.map((p) => {
        const delta = p.vmax - p.v0;
        const last = p.rounds[p.rounds.length - 1];
        return (
          <div className="multiple" key={p.id}>
            <div className="multiple-head">
              <span className="multiple-id">
                {String(p.id).padStart(2, "0")} · {p.domain}
              </span>
              <span
                className="multiple-delta"
                data-dir={delta > 0 ? "up" : delta < 0 ? "down" : "flat"}
              >
                {p.v0} → {p.vmax}
              </span>
            </div>
            <Sparkline v0={p.v0} rounds={p.rounds} />
            <div className="multiple-foot">
              <span className="multiple-domain">
                {p.label === "exec" ? "execution" : p.label === "idea" ? "idea" : "both"}
              </span>
              <span className="multiple-domain">
                exec {p.exec_fixed} · idea {p.idea_fixed}
              </span>
            </div>
            {last < p.v0 && <span className="multiple-flag">final round below V₀</span>}
          </div>
        );
      })}
    </div>
  );
}
