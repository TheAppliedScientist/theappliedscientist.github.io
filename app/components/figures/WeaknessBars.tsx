"use client";

type Cat = {
  name: string;
  resolved: number;
  total: number;
  rate: number;
  ci: number[];
  kind: string;
};

/** split a category name into two balanced lines for the x-axis */
function twoLines(name: string): [string, string] {
  const words = name.split(" ");
  if (words.length === 1) return [name, ""];
  let best: [string, string] = [name, ""];
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const score = Math.abs(a.length - b.length);
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best;
}

/**
 * WeaknessBars — resolution rate by weakness category, with Wilson 95%
 * intervals. Vertical columns on a labelled percent axis: the question is
 * "how tall is each bar against 100%", and a standard column chart answers
 * that at a glance.
 *
 * The idea/novelty column is the paper's negative result — the only red
 * element on the site.
 */
export default function WeaknessBars({ categories }: { categories: Cat[] }) {
  const W = 560;
  const ML = 52, MR = 18, MT = 26, MB = 58;
  const iw = W - ML - MR; // 490
  const ih = 306;
  const H = MT + ih + MB;

  const slot = iw / categories.length;
  const barW = Math.min(44, slot * 0.58);
  const y = (p: number) => MT + ih - (p / 100) * ih;

  return (
    <div className="figure-interactive" data-size="medium">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label="Resolution rate of reviewer-identified weaknesses by category">
        {/* percent gridlines + y ticks */}
        {[0, 25, 50, 75, 100].map((p) => (
          <g key={p}>
            <line x1={ML} x2={ML + iw} y1={y(p)} y2={y(p)}
              stroke={p === 0 ? "none" : "var(--rule)"} strokeWidth={1} />
            <text className="ax-tick" x={ML - 9} y={y(p) + 4} textAnchor="end">{p}%</text>
          </g>
        ))}

        {/* axes, drawn dark so the frame of the chart is unmissable */}
        <line x1={ML} x2={ML} y1={MT - 6} y2={MT + ih} stroke="var(--ink-soft)" strokeWidth={1.25} />
        <line x1={ML} x2={ML + iw} y1={MT + ih} y2={MT + ih} stroke="var(--ink-soft)" strokeWidth={1.25} />

        {categories.map((c, i) => {
          const cx = ML + slot * i + slot / 2;
          const isIdea = c.kind === "idea";
          const color = isIdea ? "var(--s-flag)" : "var(--s-human)";
          const [l1, l2] = twoLines(c.name);
          return (
            <g key={c.name}>
              {/* column */}
              <rect x={cx - barW / 2} y={y(c.rate)} width={barW}
                height={Math.max(1.5, ih - (y(c.rate) - MT))}
                fill={color} opacity={isIdea ? 1 : 0.85} />
              {/* Wilson interval */}
              <line x1={cx} x2={cx} y1={y(c.ci[1])} y2={y(c.ci[0])}
                stroke="var(--ink)" strokeWidth={1.25} opacity={0.6} />
              <line x1={cx - 5} x2={cx + 5} y1={y(c.ci[1])} y2={y(c.ci[1])}
                stroke="var(--ink)" strokeWidth={1.25} opacity={0.6} />
              <line x1={cx - 5} x2={cx + 5} y1={y(c.ci[0])} y2={y(c.ci[0])}
                stroke="var(--ink)" strokeWidth={1.25} opacity={0.6} />
              {/* the count, not the rate: n is part of the claim */}
              <text className="bar-value" x={cx} y={y(c.ci[1]) - 8} textAnchor="middle"
                fill={isIdea ? "var(--s-flag)" : "var(--ink)"}>
                {c.resolved}/{c.total}
              </text>
              {/* category name, two balanced lines under the axis */}
              <text className="cat-name" x={cx} y={MT + ih + 20} textAnchor="middle"
                fill={isIdea ? "var(--s-flag)" : "var(--ink-soft)"}>
                {l1}
              </text>
              {l2 && (
                <text className="cat-name" x={cx} y={MT + ih + 36} textAnchor="middle"
                  fill={isIdea ? "var(--s-flag)" : "var(--ink-soft)"}>
                  {l2}
                </text>
              )}
            </g>
          );
        })}

        <text className="ax-title" transform={`rotate(-90 13 ${MT + ih / 2})`}
          x={13} y={MT + ih / 2} textAnchor="middle">
          Resolved (Wilson 95% interval)
        </text>
      </svg>
    </div>
  );
}
