import CaseNavigator from "./CaseNavigator";
import EvidenceDrawer from "./EvidenceDrawer";
import ExampleReview from "./ExampleReview";

export default function CasesChapter() {
  return (
    <section className="research-chapter cases-chapter" id="papers">
      <div className="chapter-index"><span>05</span><span>Example revision trajectories</span></div>
      <div className="chapter-body">
        <header className="chapter-head">
          <h2>Representative results for ten randomly selected papers</h2>
          <p>For each paper, we report the human reviewer average from the original submission, the number of execution- and idea-related weaknesses resolved, the score trajectory assigned by our reviewer, and the corresponding change in Stanford Reviewer score.</p>
        </header>
        <CaseNavigator />
        <EvidenceDrawer title="Example review and annotated manuscript" trigger="Read a complete generated review">
          <ExampleReview />
        </EvidenceDrawer>
      </div>
    </section>
  );
}
