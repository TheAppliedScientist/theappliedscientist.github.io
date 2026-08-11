"use client";

type Row = { threshold: number; v0: number; vmax: number };

/**
 * ThresholdSlope — papers at or above each score threshold, before revision
 * against each paper's best revision. Grouped bars, because the quantity
 * that matters is "how many of 30 papers clear this bar, before and after"
 * — two columns per threshold answer that with no chart-reading tax.
 *
 * (Kept the component name so callers don't change; it is no longer a
 * slope chart.)
 */
export default function ThresholdSlope({
  rows,
  n,
  color = "var(--s-human)",
}: {
  rows: Row[];
  n: number;
  color?: string;
  labels?: [string, string] | string[];
}) {
  const W = 400;
  const ML = 30, MR = 8, MT = 26, MB = 66;
  const iw = W - ML - MR;
  const ih = 240;
  const H = MT + ih + MB;

  const y = (count: number) => MT + ih - (count / n) * ih;
  const group = iw / rows.length;
  const barW = Math.min(40, group * 0.32);
  const gap = 8;

  const fmtT = (t: number) => `≥ ${t % 1 === 0 ? t : t.toFixed(2)}`;
  const yTicks: number[] = [];
  for (let v = 0; v <= n; v += 10) yTicks.push(v);

  return (
    <div className="figure-interactive" data-size="small">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label={`Papers at or above each score threshold, out of ${n}`}>
        {/* y gridlines + ticks */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={ML} x2={ML + iw} y1={y(v)} y2={y(v)}
              stroke={v === 0 ? "none" : "var(--rule)"} strokeWidth={1} />
            <text className="ax-tick" x={ML - 7} y={y(v) + 4} textAnchor="end">{v}</text>
          </g>
        ))}

        {/* axes */}
        <line x1={ML} x2={ML} y1={MT - 6} y2={MT + ih} stroke="var(--ink-soft)" strokeWidth={1.25} />
        <line x1={ML} x2={ML + iw} y1={MT + ih} y2={MT + ih} stroke="var(--ink-soft)" strokeWidth={1.25} />

        {rows.map((r, i) => {
          const gx = ML + group * i + group / 2;
          const x0 = gx - barW - gap / 2;
          const x1 = gx + gap / 2;
          return (
            <g key={r.threshold}>
              {/* before */}
              <rect x={x0} y={y(r.v0)} width={barW} height={Math.max(1, ih - (y(r.v0) - MT))}
                fill="var(--rule-mid)" />
              <text className="bar-pct" x={x0 + barW / 2} y={y(r.v0) - 6} textAnchor="middle"
                fill="var(--ink-faint)">
                {r.v0}
              </text>
              {/* best revision */}
              <rect x={x1} y={y(r.vmax)} width={barW} height={Math.max(1, ih - (y(r.vmax) - MT))}
                fill={color} />
              <text className="bar-value" x={x1 + barW / 2} y={y(r.vmax) - 6} textAnchor="middle"
                fill="var(--ink)">
                {r.vmax}
              </text>
              {/* threshold label */}
              <text className="cat-name" x={gx} y={MT + ih + 21} textAnchor="middle"
                fill="var(--ink-soft)">
                {fmtT(r.threshold)}
              </text>
            </g>
          );
        })}

        <text className="ax-title" x={ML + iw / 2} y={MT + ih + 42} textAnchor="middle">
          Reviewer score threshold
        </text>

        {/* legend */}
        <g>
          <rect x={ML} y={H - 14} width={10} height={10} fill="var(--rule-mid)" />
          <text className="slope-label" x={ML + 15} y={H - 5} fill="var(--ink-soft)">
            Original (V₀)
          </text>
          <rect x={ML + 110} y={H - 14} width={10} height={10} fill={color} />
          <text className="slope-label" x={ML + 125} y={H - 5} fill="var(--ink-soft)">
            Best revision
          </text>
        </g>
      </svg>
    </div>
  );
}
