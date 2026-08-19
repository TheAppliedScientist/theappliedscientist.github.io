export default function RevisionArtifact({ delta, externalDelta }: {
  delta: number; externalDelta: number;
}) {
  return (
    <figure className="revision-artifact" aria-labelledby="artifact-caption">
      <div className="result-focus">
        <h2>Does revision improve papers?</h2>

        <div className="primary-finding" aria-label="A mean reviewer score gain of 1.16 points, from 5.37 for the original papers to 6.53 for the best revisions">
          <strong>+{delta.toFixed(2)}</strong>
          <div>
            <h3>Mean reviewer-score gain</h3>
            <p><span>5.37</span> original <i>→</i> <span>6.53</span> best revision</p>
          </div>
        </div>

        <p className="finding-summary" id="artifact-caption">Across 30 ICLR papers, reviewer-guided revision consistently improved papers more than autonomous self-revision with a fixed prompt.</p>

        <div className="independent-check">
          <div>
            <p>Independent check</p>
            <h3>Stanford Reviewer</h3>
          </div>
          <div>
            <strong>+{externalDelta.toFixed(2)}</strong>
            <p><span>5.50</span> original <i>→</i> <span>6.15</span> best revision</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
