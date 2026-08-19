import EvidenceDrawer from "./EvidenceDrawer";

export default function SystemChapter() {
  return (
    <section className="research-chapter system-chapter" id="system">
      <div className="system-folio" aria-hidden="true">01</div>
      <div className="system-layout">
        <header className="system-intro">
          <p className="system-index"><span>01</span> Methodology</p>
          <h2>AppliedScientist consists of two components</h2>
          <p>A scientist that revises the implementation, experiments, and manuscript, and an AI reviewer that independently reviews each revision and provides feedback for the next iteration.</p>

          <EvidenceDrawer title="Experimental setup" trigger="Experiment protocol">
            <div className="evidence-prose">
              <p>The scientist retains its previous code, results, manuscripts, and feedback so that revisions accumulate and the reviewer retains no history, preventing earlier judgments or scores from biasing its assessment of the current version.</p>
              <p>Given a rejected paper, its source repository, and current feedback, the scientist is instructed to address every reviewer concern while determining how each should be resolved. Depending on the feedback, this may require inspecting the repository and manuscript, searching the literature, editing implementation, reproducing results, adding baselines and presenting ablations, executing new experiments and analyzing the results and updating the manuscript.</p>
              <p>The central research contribution is treated as fixed; if addressing a concern would require changing that contribution, the scientist records it as unresolved rather than reframing the work as a different project.</p>
              <h3>Revision conditions</h3>
              <div className="drawer-conditions">
                <div><strong>Human-initialized</strong><p>Original written venue reviews guide the first round; a fresh AI review guides each later revision.</p></div>
                <div><strong>AI-initialized</strong><p>A fresh, independent AI review supplies the initial feedback and guides each later revision.</p></div>
                <div><strong>Autonomous self-revision</strong><p>The scientist receives the same fixed self-review prompt in every round.</p></div>
              </div>
              <dl className="protocol-facts">
                <div><dt>Evaluation set</dt><dd>25 rejected and 5 borderline-accepted ICLR papers</dd></div>
                <div><dt>Revision rounds</dt><dd>V₀ original; V₁–V₅ successive revisions</dd></div>
                <div><dt>Compute</dt><dd>Approximately 9 hours per round on a 96 GB VRAM GPU</dd></div>
                <div><dt>External evaluation</dt><dd>Stanford Reviewer scores the human-initialized trajectory only</dd></div>
              </dl>
            </div>
          </EvidenceDrawer>
        </header>

        <figure className="paper-system-figure">
          <img src="/img/figure-1-system.svg" alt="Figure 1. AppliedScientist revision loop and phase-structured AI Reviewer." />
          <figcaption><strong>Figure 1.</strong> The scientist iteratively verifies reviewer suggestions, runs experiments, analyzes results, and updates the manuscript. The review component independently reads each revision, searches the literature, assesses its technical quality and significance, and returns structured feedback for the next round.</figcaption>
        </figure>
      </div>
    </section>
  );
}
