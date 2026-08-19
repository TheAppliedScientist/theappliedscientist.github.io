import EvidenceDrawer from "./EvidenceDrawer";
import DomainGrid from "./DomainGrid";
import Trajectory from "./figures/Trajectory";
import ThresholdSlope from "./figures/ThresholdSlope";
import avg from "../data/avg_trajectory.json";
import aiinit from "../data/aiinit_trajectory.json";
import thresholds from "../data/thresholds.json";

export default function ResultsChapter() {
  const guided = avg.series.filter((series) => series.key !== "stanford");
  const stanford = avg.series.find((series) => series.key === "stanford")!;
  const ai = aiinit.series.find((series) => series.key === "ai")!;

  return (
    <section className="research-chapter results-chapter" id="results">
      <div className="chapter-index"><span>03</span><span>Results and discussion</span></div>
      <div className="chapter-body">
        <header className="chapter-head">
          <div className="results-head-copy">
            <p className="eyebrow">Does Reviewer Guidance Improve Papers?</p>
            <h2>Reviewer scores improve steadily across successive rounds</h2>
          </div>
          <p>In the human-initialized condition, the original venue reviews guide V₁ and fresh feedback from our reviewer guides each later revision. Autonomous self-revision receives the same fixed prompt in every round.</p>
        </header>

        <div className="results-plate">
          <figure className="trajectory-main">
            <Trajectory rounds={avg.rounds} series={guided} compareOptions={[
              { key: "stanford", label: "Stanford evaluation", series: stanford },
              { key: "ai", label: "AI-initialized condition", series: ai },
            ]} />
            <figcaption>Mean score by saved manuscript version. V₀ is the original manuscript; V₁–V₅ are successive revisions.</figcaption>
          </figure>
          <aside className="results-reading" aria-label="How the revision results were produced and evaluated">
            <section className="results-reading-guided">
              <p className="results-role">Our AI Reviewer</p>
              <h3>Guides V₂–V₅ and scores each version</h3>
              <div className="results-score">
                <strong>5.37 <i>→</i> 6.53</strong>
                <span>Original to best revision · +1.16</span>
              </div>
              <div className="results-threshold">
                <strong>12/30 <i>→</i> 30/30</strong>
                <span>Papers scoring at least 6</span>
              </div>
            </section>

            <section className="results-reading-external">
              <p className="results-role">Stanford Reviewer</p>
              <h3>Independent evaluation only</h3>
              <p className="results-role-note">Its reviews and scores are never shown to the scientist.</p>
              <div className="results-score">
                <strong>5.50 <i>→</i> 6.15</strong>
                <span>Original to best revision · +0.65</span>
              </div>
            </section>
          </aside>
        </div>

        <EvidenceDrawer title="Results across domains and score thresholds" trigger="Per-domain trajectories and threshold counts" tabs={[
          { label: "Five domains", content: <><p className="drawer-intro">The upward pattern appears in every represented domain rather than being confined to one research area.</p><DomainGrid /></> },
          { label: "Our reviewer", content: <ThresholdSlope rows={thresholds.ours} n={thresholds.n} /> },
          { label: "Stanford Reviewer", content: <ThresholdSlope rows={thresholds.stanford} n={thresholds.n} color="var(--s-stanford)" /> },
        ]} />
      </div>
    </section>
  );
}
