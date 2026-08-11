/**
 * Sparkline — one paper's trajectory at reading size. V0 is drawn as an
 * open marker on the left, the five revisions as a line; the V0 level is
 * carried across as a hairline so a reader sees at a glance whether the
 * paper ever fell below where it started.
 */
export default function Sparkline({
  v0,
  rounds,
  height = 100,
  yMin = 2.5,
  yMax = 8.5,
}: {
  v0: number;
  rounds: number[];
  height?: number;
  yMin?: number;
  yMax?: number;
}) {
  const W = 180;
  const H = height;
  const ML = 8, MR = 18, MT = 8, MB = 18;
  const iw = W - ML - MR, ih = H - MT - MB;
  const all = [v0, ...rounds];
  const last = rounds[rounds.length - 1];
  const x = (i: number) => ML + (i / (all.length - 1)) * iw;
  const y = (v: number) => MT + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const d = all.map((v, i) => `${i ? "L" : "M"}${x(i)} ${y(v)}`).join(" ");
  const belowStart = rounds.some((v) => v < v0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label={`Trajectory from ${v0} through ${rounds.join(", ")}`}>
      <line x1={ML} x2={ML + iw} y1={y(v0)} y2={y(v0)}
        stroke="var(--rule-mid)" strokeWidth={1} strokeDasharray="2 3" />
      <path d={d} fill="none" stroke="var(--s-human)" strokeWidth={1.5}
        strokeLinejoin="round" />
      {all.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === 0 ? 2.4 : 2}
          fill={i === 0 ? "var(--page)" : belowStart && v < v0 ? "var(--s-flag)" : "var(--s-human)"}
          stroke={i === 0 ? "var(--s-human)" : "none"} strokeWidth={1.2} />
      ))}
      <text x={x(all.length - 1)} y={y(last) - 7} className="spark-end" textAnchor="middle">
        {last}
      </text>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <text key={i} x={x(i)} y={H - 3} className="spark-tick" textAnchor="middle">
          {i === 0 ? "V₀" : `V${i}`}
        </text>
      ))}
    </svg>
  );
}
