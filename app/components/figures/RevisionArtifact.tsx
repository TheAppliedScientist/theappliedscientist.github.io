export default function RevisionArtifact({ delta, externalDelta, executionRate, executionResolved }: {
  delta: number;
  externalDelta: number;
  executionRate: number;
  executionResolved: string;
}) {
  const [resolved, total] = executionResolved.split("/");

  return (
    <figure className="revision-artifact" aria-labelledby="artifact-caption">
      <div className="result-focus">
        <h2>Does revision improve papers?</h2>

        <div className="primary-finding" aria-label="A mean reviewer score gain of 1.16 points, from 5.37 for the original papers to 6.53 for the best revisions">
          <div className="primary-value">
            <strong>+{delta.toFixed(2)}</strong>
            <span>score points</span>
          </div>
          <div className="primary-finding-copy">
            <h3>Mean score increase assigned by our AI Reviewer</h3>
            <p><span>5.37</span> for the original papers <i>→</i> <span>6.53</span> for their best revisions</p>
            <p className="finding-summary" id="artifact-caption">Across 30 ICLR papers, reviewer-guided revision consistently improved papers more than autonomous self-revision with a fixed prompt.</p>
          </div>
        </div>

        <div className="hero-supporting-findings">
          <div className="independent-check">
            <p className="hero-support-label">Independent evaluation</p>
            <strong>+{externalDelta.toFixed(2)}</strong>
            <h3>Stanford Reviewer</h3>
            <p className="hero-support-detail"><span>5.50</span> original <i>→</i> <span>6.15</span> best revision</p>
          </div>

          <div className="execution-check">
            <p className="hero-support-label">Resolved through revision</p>
            <strong>{executionRate.toFixed(1)}%</strong>
            <h3>execution-related weaknesses resolved</h3>
            <p className="hero-support-detail">{resolved} of {total} across the evaluation set</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
