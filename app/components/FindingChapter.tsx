import EvidenceDrawer from "./EvidenceDrawer";
import NoveltyTable from "./NoveltyTable";
import WeaknessBars from "./figures/WeaknessBars";
import ladder from "../data/weakness_ladder.json";
import taxonomy from "../data/taxonomy.json";

export default function FindingChapter() {
  return (
    <section className="research-chapter finding-chapter" id="finding">
      <div className="chapter-index"><span>04</span><span>Results and discussion</span></div>
      <div className="chapter-body">
        <header className="chapter-head finding-head">
          <div className="finding-head-copy">
            <p className="eyebrow">What Can Revision Improve?</p>
            <h2>What kinds of reviewer criticisms can revision actually resolve?</h2>
          </div>
        </header>

        <div className="finding-plate">
          <figure>
            <WeaknessBars categories={ladder.categories} />
            <figcaption>Resolution rate of weaknesses identified in the original venue reviews. Intervals show Wilson 95% confidence intervals.</figcaption>
          </figure>
          <aside className="finding-reading">
            <p className="finding-reading-label">Weaknesses resolved</p>
            <p className="finding-reading-result">AppliedScientist resolves <strong>128 of 150</strong> execution weaknesses, but only <strong className="idea-count">2 of 18</strong> idea weaknesses.</p>
            <p className="finding-reading-main">Autonomous revision is well suited to strengthening the evidence behind an idea, but improving the idea itself requires returning to the ideation stage rather than continuing the revision loop.</p>

            <EvidenceDrawer title="Rejection reasons and novelty verification" trigger="Rejection taxonomy and novelty verification" actionLabel="View rejection analysis" tabs={[
              { label: "500-paper taxonomy", content: <div className="taxonomy-evidence"><p>We randomly sample {taxonomy.n} rejected ICLR papers and use Gemini 3.1 Pro to classify every reviewer criticism as either an execution issue or an idea issue.</p><div><strong>{taxonomy.execution}%</strong><span>execution</span><strong>{taxonomy.idea}%</strong><span>idea</span><strong>{taxonomy.both}%</strong><span>both</span></div></div> },
              { label: "Novelty objections", content: <><p className="drawer-intro">For each objection, we extracted the cited prior work, verified the references against the arXiv API, and manually inspected each cited paper to determine whether it supported the novelty claim made by the reviewer.</p><NoveltyTable /></> },
            ]} />
          </aside>
        </div>
      </div>
    </section>
  );
}
