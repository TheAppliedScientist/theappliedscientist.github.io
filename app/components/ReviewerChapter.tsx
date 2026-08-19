import AlignmentPlot from "./figures/AlignmentPlot";
import BaselineTable from "./BaselineTable";
import AgenticJudgeTable from "./AgenticJudgeTable";
import EvidenceDrawer from "./EvidenceDrawer";
import alignment from "../data/alignment.json";

export default function ReviewerChapter() {
  return (
    <section className="research-chapter reviewer-chapter chapter-dark" id="reviewer">
      <div className="chapter-index"><span>02</span><span>Reviewer evaluation</span></div>
      <div className="chapter-body">
        <header className="chapter-head">
          <h2>Reviewer validity is a prerequisite for interpreting downstream improvements</h2>
          <p>The reviewer has two roles: it guides the next revision and scores its outcome. We therefore evaluate the reviewer before using its scores to assess whether papers improve.</p>
        </header>

        <div className="reviewer-plate">
          <figure>
            <AlignmentPlot systems={alignment.systems} />
            <figcaption>Score alignment with venue reviews on a set of 650 ICLR 2020–26 papers.</figcaption>
          </figure>
          <div className="reviewer-reading">
            <p className="reviewer-reading-label">What the comparison shows</p>
            <p className="reviewer-reading-main">Our Reviewer with DeepSeek V4 Flash shows the strongest alignment with venue reviews on both measures.</p>
            <p className="reviewer-reading-note">The Stanford Reviewer falls between the strongest and weakest backbones. Systems farther toward the upper right align more closely with venue ratings and decisions.</p>

            <EvidenceDrawer title="Reviewer evaluation" trigger="Explore the reviewer evaluation" tabs={[
              { label: "Pairwise evaluation", content: <BaselineTable /> },
              { label: "AgenticJudge", content: <AgenticJudgeTable /> },
              { label: "Human alignment", content: <div className="evidence-prose"><p>We randomly sample a set of 100 papers from the evaluation set, and four human experts are asked to annotate across our three main discriminative metrics, following the same setup and input as AgenticJudge.</p><p>AgenticJudge achieves Spearman&apos;s rank correlation of ρ = 0.84 against human annotation, a raw inter-reviewer agreement of 92% and a Cohen&apos;s κ of 0.81.</p></div> },
            ]} />
          </div>
        </div>
      </div>
    </section>
  );
}
