export default function RevisionArtifact({ delta, externalDelta, executionRate, executionResolved }: {
  delta: number;
  externalDelta: number;
  executionRate: number;
  executionResolved: string;
}) {
  const [resolved, total] = executionResolved.split("/");

  return (
    <figure className="revision-artifact revision-sculpture" aria-labelledby="artifact-caption">
      <img className="revision-sculpture-object" src="/img/revision-trajectory-v4.webp" alt="" aria-hidden="true" />

      <div className="sculpture-register">
        <span>AI Reviewer-guided revision on 30 ICLR papers</span>
      </div>

      <div className="sculpture-primary">
        <h2>Mean score increase assigned by our AI Reviewer</h2>
        <div className="sculpture-gain"><strong>+{delta.toFixed(2)}</strong><span>score points</span></div>
        <div className="sculpture-score-change">
          <span><strong>5.37</strong> original</span>
          <i aria-hidden="true">→</i>
          <span><strong>6.53</strong> best revision</span>
        </div>
        <p id="artifact-caption">Across 30 ICLR papers, reviewer-guided revision consistently improved papers more than autonomous self-revision with a fixed prompt.</p>
      </div>

      <div className="sculpture-result sculpture-independent">
        <p>Independent evaluation</p>
        <div><strong>+{externalDelta.toFixed(2)}</strong><span>score points</span></div>
        <h3>Stanford Reviewer</h3>
        <small><b>5.50</b> original <i>→</i> <b>6.15</b> best revision</small>
      </div>

      <div className="sculpture-result sculpture-execution">
        <p>Resolved through revision</p>
        <strong>{executionRate.toFixed(1)}%</strong>
        <h3>execution-related weaknesses resolved</h3>
        <small>{resolved} of {total} across the evaluation set</small>
      </div>
    </figure>
  );
}
