import EvidenceDrawer from "./EvidenceDrawer";
import NoveltyTable from "./NoveltyTable";
import WeaknessAnalysis from "./WeaknessAnalysis";
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
          <p className="finding-head-result">AppliedScientist addresses <strong>128 of 150</strong> execution weaknesses, but resolves only <strong>2 of 18</strong> idea weaknesses.</p>
        </header>

        <WeaknessAnalysis categories={ladder.categories} />

        <div className="finding-verification">
          <div>
            <strong>How “resolved” was determined</strong>
            <p>Each weakness from the original venue reviews was checked against the saved execution trajectory and revised manuscripts. This matching is separate from the AI Reviewer, which reviews each version without access to earlier reviews.</p>
          </div>
          <div className="finding-verification-action">
            <EvidenceDrawer title="Rejection reasons and novelty verification" trigger="Rejection taxonomy and novelty verification" actionLabel="View rejection analysis" tabs={[
              { label: "500-paper taxonomy", content: <div className="taxonomy-evidence"><p>We randomly sample {taxonomy.n} rejected ICLR papers and use Gemini 3.1 Pro to classify every reviewer criticism as either an execution issue or an idea issue.</p><div><strong>{taxonomy.execution}%</strong><span>execution</span><strong>{taxonomy.idea}%</strong><span>idea</span><strong>{taxonomy.both}%</strong><span>both</span></div></div> },
              { label: "Novelty objections", content: <><p className="drawer-intro">For each objection, we extracted the cited prior work, verified the references against the arXiv API, and manually inspected each cited paper to determine whether it supported the novelty claim made by the reviewer.</p><NoveltyTable /></> },
            ]} />
          </div>
        </div>
      </div>
    </section>
  );
}
