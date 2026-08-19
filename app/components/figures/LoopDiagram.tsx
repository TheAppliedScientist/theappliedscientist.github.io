/**
 * LoopDiagram — the closed loop, drawn the way the paper's Figure 1
 * draws it: labelled boxes, hairline strokes, arrows with the quantity
 * that travels along them. The one asymmetry that defines the design
 * (scientist accumulates, reviewer does not) is annotated in place.
 */
export default function LoopDiagram() {
  const W = 900, H = 300;
  return (
    <div className="figure-interactive" data-size="large">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label="The revision loop: scientist revises, reviewer independently reviews each version">
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 1 L9 5 L0 9 z" fill="var(--ink-soft)" />
          </marker>
          <marker id="ar-r" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 1 L9 5 L0 9 z" fill="var(--s-human)" />
          </marker>
        </defs>

        {/* V0 */}
        <g>
          <rect x={8} y={112} width={116} height={54} fill="none"
            stroke="var(--rule-mid)" strokeWidth={1} />
          <text className="dg-title" x={66} y={134} textAnchor="middle">V₀</text>
          <text className="dg-sub" x={66} y={152} textAnchor="middle">rejected paper</text>
        </g>
        <text className="dg-meta" x={66} y={182} textAnchor="middle">
          code · results · reviews
        </text>

        <line x1={124} y1={139} x2={186} y2={139} stroke="var(--ink-soft)"
          strokeWidth={1} markerEnd="url(#ar)" />

        {/* scientist */}
        <g>
          <rect x={188} y={92} width={214} height={94} fill="none"
            stroke="var(--ink)" strokeWidth={1.5} />
          <text className="dg-title" x={295} y={120} textAnchor="middle">AI Scientist</text>
          <text className="dg-sub" x={295} y={140} textAnchor="middle">
            revises code, runs experiments,
          </text>
          <text className="dg-sub" x={295} y={155} textAnchor="middle">
            analyses results, edits manuscript
          </text>
          <text className="dg-note" x={295} y={175} textAnchor="middle">
            retains all previous versions
          </text>
        </g>

        <line x1={402} y1={139} x2={470} y2={139} stroke="var(--ink-soft)"
          strokeWidth={1} markerEnd="url(#ar)" />
        <text className="dg-edge" x={436} y={130} textAnchor="middle">Vₜ</text>

        {/* reviewer */}
        <g>
          <rect x={472} y={92} width={214} height={94} fill="none"
            stroke="var(--s-human)" strokeWidth={1.5} />
          <text className="dg-title" x={579} y={120} textAnchor="middle">AI Reviewer</text>
          <text className="dg-sub" x={579} y={140} textAnchor="middle">
            reads only Vₜ, searches the
          </text>
          <text className="dg-sub" x={579} y={155} textAnchor="middle">
            literature, scores and critiques
          </text>
          <text className="dg-note" x={579} y={175} textAnchor="middle"
            fill="var(--s-human)">
            no memory of earlier rounds
          </text>
        </g>

        {/* feedback path */}
        <path d="M686 139 L724 139 L724 232 L295 232 L295 188"
          fill="none" stroke="var(--s-human)" strokeWidth={1.5}
          strokeDasharray="5 3" markerEnd="url(#ar-r)" />
        <text className="dg-edge" x={510} y={225} textAnchor="middle"
          fill="var(--s-human)">
          review Rₜ guides Vₜ₊₁
        </text>

        {/* evaluation-only branch */}
        <line x1={686} y1={120} x2={772} y2={120} stroke="var(--ink-ghost)"
          strokeWidth={1} markerEnd="url(#ar)" />
        <text className="dg-sub" x={776} y={112} fill="var(--ink-faint)">score</text>
        <text className="dg-sub" x={776} y={128} fill="var(--ink-faint)">1–10</text>

        {/* round counter */}
        <text className="dg-meta" x={8} y={38}>
          five rounds · ≈9 h per paper · single 96 GB GPU
        </text>
        <line x1={8} y1={50} x2={892} y2={50} stroke="var(--rule)" strokeWidth={1} />
      </svg>
    </div>
  );
}
