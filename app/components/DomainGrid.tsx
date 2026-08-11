import Sparkline from "./figures/Sparkline";
import data from "../data/domain_trajectory.json";

/**
 * DomainGrid — small multiples, one cell per research domain. Same visual
 * grammar as the per-paper grid (Sparkline), so a reader who has already
 * learned to read one reads the other for free.
 */
export default function DomainGrid() {
  return (
    <div className="multiples">
      {data.domains.map((d) => {
        const rounds = d.ours.slice(1); // V1..V5; v0_human is the starting point
        const last = rounds[rounds.length - 1];
        const delta = last - d.v0_human;
        return (
          <div className="multiple" key={d.name}>
            <div className="multiple-head">
              <span className="multiple-id">{d.name}</span>
              <span
                className="multiple-delta"
                data-dir={delta > 0 ? "up" : delta < 0 ? "down" : "flat"}
              >
                {d.v0_human.toFixed(1)} → {last.toFixed(1)}
              </span>
            </div>
            <Sparkline v0={d.v0_human} rounds={rounds} yMin={2} yMax={7.5} />
          </div>
        );
      })}
    </div>
  );
}
