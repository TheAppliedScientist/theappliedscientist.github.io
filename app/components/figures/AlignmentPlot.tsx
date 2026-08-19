"use client";

type Sys = { name: string; rho: number; agreement: number; ours: boolean };

/**
 * AlignmentPlot — Spearman ρ against decision agreement, one point per
 * reviewer configuration. A scatter rather than two bar charts, because
 * the question is whether the two measures agree, and a scatter answers
 * that in one read.
 */
export default function AlignmentPlot({ systems }: { systems: Sys[] }) {
  // wide panel: fills a full column width without becoming too tall to
  // sit beside a table, so the plot area is wider than tall (~1.5:1).
  const W = 460;
  const ML = 52, MR = 24, MT = 18, MB = 46;
  const iw = W - ML - MR, ih = Math.round(iw * 0.66);
  const H = MT + ih + MB;

  const xMin = 0.45, xMax = 0.60;
  const yMin = 65, yMax = 78;
  const x = (v: number) => ML + ((v - xMin) / (xMax - xMin)) * iw;
  const y = (v: number) => MT + ih - ((v - yMin) / (yMax - yMin)) * ih;

  return (
    <div className="figure-interactive figure-wide" data-size="large">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label="Spearman correlation against decision agreement for each reviewer">
        {[65, 70, 75].map((v) => (
          <g key={v}>
            <line x1={ML} x2={ML + iw} y1={y(v)} y2={y(v)} stroke="var(--rule)" />
            <text className="ax-tick" x={ML - 8} y={y(v) + 3.5} textAnchor="end">{v}%</text>
          </g>
        ))}
        {[0.48, 0.52, 0.56, 0.60].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={MT} y2={MT + ih} stroke="var(--rule)" />
            <text className="ax-tick" x={x(v)} y={MT + ih + 16} textAnchor="middle">
              {v.toFixed(2)}
            </text>
          </g>
        ))}
        <line x1={ML} x2={ML} y1={MT} y2={MT + ih} stroke="var(--ink-soft)" strokeWidth={1.25} />
        <line x1={ML} x2={ML + iw} y1={MT + ih} y2={MT + ih} stroke="var(--ink-soft)" strokeWidth={1.25} />
        <text className="ax-title" x={ML + iw / 2} y={H - 6} textAnchor="middle">
          Spearman ρ with mean human rating
        </text>
        <text className="ax-title" transform={`rotate(-90 14 ${MT + ih / 2})`}
          x={14} y={MT + ih / 2} textAnchor="middle">
          Accept/reject agreement
        </text>

        {systems.map((s) => {
          const c = s.ours ? "var(--s-human)" : "var(--s-stanford)";
          // "Ours (DeepSeek V4 Flash)" -> "our harness — DeepSeek V4 Flash":
          // the backbone is a detail of our reviewer, not a separate system.
          const backbone = s.name.replace("Ours (", "").replace(")", "");
          const label = s.ours ? `our reviewer (${backbone})` : s.name;
          const below = backbone === "MiniMax M2.7";
          // a point near the right edge has no room for a label to its right
          const flip = x(s.rho) > ML + iw * 0.68;
          return (
            <g key={s.name}>
              {s.ours ? (
                <circle cx={x(s.rho)} cy={y(s.agreement)} r={4.5} fill={c} />
              ) : (
                <rect x={x(s.rho) - 4} y={y(s.agreement) - 4} width={8} height={8}
                  fill="none" stroke={c} strokeWidth={1.5} />
              )}
              <text className="pt-label" x={x(s.rho) + (flip ? -8 : 8)}
                y={y(s.agreement) + (below ? 14 : 0)}
                textAnchor={flip ? "end" : "start"} fill="var(--ink-soft)">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="fig-key">
        <span className="key-glyph key-ours" aria-hidden="true" /> our reviewer,
        run on three backbone models
        <span className="key-glyph key-other" aria-hidden="true" /> Stanford
        Reviewer
      </p>
    </div>
  );
}
