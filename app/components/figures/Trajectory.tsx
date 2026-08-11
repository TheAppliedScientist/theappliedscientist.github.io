"use client";

import { useId, useState } from "react";

type Series = { key: string; label: string; values: (number | null)[]; note?: string };

const COLOR: Record<string, string> = {
  human: "var(--s-human)",
  stanford: "var(--s-stanford)",
  self: "var(--s-self)",
  ai: "var(--s-aiinit)",
};

/**
 * Trajectory — mean reviewer score by revision round.
 *
 * human and self are always drawn: they are the paper's core comparison
 * (reviewer-guided vs. no reviewer). A third series is swappable via
 * `compare`, so "does an outside reviewer agree" (Stanford) and "does the
 * source of the first review matter" (AI-init) read as one instrument with
 * two questions, instead of two charts that look like they disagree.
 */
export default function Trajectory({
  rounds,
  series,
  compareOptions,
}: {
  rounds: number[];
  series: Series[];
  compareOptions?: { key: string; label: string; series: Series }[];
  height?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const [hoverRound, setHoverRound] = useState<number | null>(null);
  const [only, setOnly] = useState<string | null>(null);
  const [compare, setCompare] = useState(compareOptions?.[0]?.key ?? null);

  const activeExtra = compareOptions?.find((c) => c.key === compare)?.series;
  const allSeries = activeExtra ? [...series, activeExtra] : series;

  // square panel: the frame is as tall as it is wide, so the slope reads
  // without being exaggerated by a wide letterbox
  const W = 560;
  const ML = 42, MR = 150, MT = 14, MB = 38;
  const iw = W - ML - MR;
  const ih = iw;
  const H = MT + ih + MB;
  const yMin = 3.5, yMax = 6.75;

  const x = (r: number) => ML + (r / (rounds.length - 1)) * iw;
  const y = (v: number) => MT + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const yTicks: number[] = [];
  for (let v = Math.ceil(yMin * 2) / 2; v <= yMax; v += 0.5) yTicks.push(v);

  const visible = allSeries.filter((s) => !only || s.key === only);

  const MIN_GAP = 26;
  const ends = visible
    .map((s) => {
      const vals = s.values.filter((v) => v !== null) as number[];
      return { key: s.key, v: vals[vals.length - 1] };
    })
    .sort((a, b) => b.v - a.v);
  const labelY: Record<string, number> = {};
  let prev = -Infinity;
  ends.forEach((e) => {
    const wanted = y(e.v);
    const placed = Math.max(wanted, prev + MIN_GAP);
    labelY[e.key] = placed;
    prev = placed;
  });

  return (
    <div className="figure-interactive" data-size="medium">
      {compareOptions && (
        <div className="compare-switch" role="tablist" aria-label="Compare against">
          {compareOptions.map((c) => (
            <button key={c.key} type="button" role="tab"
              aria-selected={compare === c.key}
              onClick={() => setCompare(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label="Mean reviewer score by revision round for each condition"
        onMouseLeave={() => setHoverRound(null)}
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={ML} x2={ML + iw} y1={y(v)} y2={y(v)}
              stroke="var(--rule)" strokeWidth={1} />
            <text className="ax-tick" x={ML - 9} y={y(v) + 3.5} textAnchor="end">
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        <line x1={ML} x2={ML} y1={MT} y2={MT + ih} stroke="var(--ink-soft)" strokeWidth={1.25} />
        <line x1={ML} x2={ML + iw} y1={MT + ih} y2={MT + ih}
          stroke="var(--ink-soft)" strokeWidth={1.25} />

        {rounds.map((r) => (
          <g key={r}>
            <line x1={x(r)} x2={x(r)} y1={MT + ih} y2={MT + ih + 4}
              stroke="var(--ink-ghost)" strokeWidth={1} />
            <text className="ax-tick" x={x(r)} y={MT + ih + 17} textAnchor="middle">
              V{r}
            </text>
          </g>
        ))}
        <text className="ax-title" x={ML + iw / 2} y={H - 4} textAnchor="middle">
          Revision round
        </text>
        <text className="ax-title" transform={`rotate(-90 12 ${MT + ih / 2})`}
          x={12} y={MT + ih / 2} textAnchor="middle">
          Mean score
        </text>

        {hoverRound !== null && (
          <line x1={x(hoverRound)} x2={x(hoverRound)} y1={MT} y2={MT + ih}
            stroke="var(--ink-ghost)" strokeWidth={1} strokeDasharray="2 3" />
        )}

        {visible.map((s) => {
          const pts = s.values
            .map((v, i) => (v === null ? null : { x: x(rounds[i]), y: y(v), v, r: rounds[i] }))
            .filter(Boolean) as { x: number; y: number; v: number; r: number }[];
          if (!pts.length) return null;
          const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
          const dashed = s.key === "self";
          const last = pts[pts.length - 1];
          return (
            <g key={s.key}>
              <path d={d} fill="none" stroke={COLOR[s.key] ?? "var(--ink)"}
                strokeWidth={s.key === "human" ? 2 : 1.5}
                strokeDasharray={dashed ? "5 3" : undefined}
                strokeLinejoin="round" />
              {pts.map((p) => (
                <circle key={p.r} cx={p.x} cy={p.y} r={hoverRound === p.r ? 4 : 2.6}
                  fill={hoverRound === p.r ? COLOR[s.key] : "var(--page)"}
                  stroke={COLOR[s.key] ?? "var(--ink)"} strokeWidth={1.5} />
              ))}
              {labelY[s.key] - last.y > 3 && (
                <line x1={last.x + 4} y1={last.y} x2={last.x + 8}
                  y2={labelY[s.key] - 3} stroke={COLOR[s.key]}
                  strokeWidth={0.75} opacity={0.5} />
              )}
              <text className="ser-label" x={last.x + 9} y={(labelY[s.key] ?? last.y) + 3.5}
                fill={COLOR[s.key]}>
                {last.v.toFixed(2)}
              </text>
              <text className="ser-name" x={last.x + 9} y={(labelY[s.key] ?? last.y) + 16}
                fill="var(--ink-faint)">
                {s.key === "human" ? "human-init." :
                 s.key === "stanford" ? "Stanford" :
                 s.key === "ai" ? "AI-init." : "self-review prompt"}
              </text>
            </g>
          );
        })}

        {rounds.map((r) => (
          <rect key={`h${r}`} x={x(r) - iw / (rounds.length - 1) / 2} y={MT}
            width={iw / (rounds.length - 1)} height={ih}
            fill="transparent" onMouseEnter={() => setHoverRound(r)} />
        ))}
      </svg>

      <div className="fig-readout" aria-live="polite">
        {hoverRound === null ? (
          <span className="fig-readout-idle">Hover the plot for values at each round.</span>
        ) : (
          <>
            <span className="fig-readout-round">V{hoverRound}</span>
            {allSeries.map((s) => {
              const v = s.values[rounds.indexOf(hoverRound)];
              if (v === null || v === undefined) return null;
              return (
                <span key={s.key} className="fig-readout-item">
                  <i style={{ background: COLOR[s.key] }} />
                  {s.label} <b className="num">{v.toFixed(2)}</b>
                </span>
              );
            })}
          </>
        )}
      </div>

      <div className="fig-legend">
        {allSeries.map((s) => (
          <button key={s.key} type="button" className="legend-btn"
            aria-pressed={only === s.key}
            onClick={() => setOnly(only === s.key ? null : s.key)}>
            <svg width="22" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="22" y2="4" stroke={COLOR[s.key]} strokeWidth="2"
                strokeDasharray={s.key === "self" ? "5 3" : undefined} />
            </svg>
            {s.label}
          </button>
        ))}
        {only && (
          <button type="button" className="legend-btn legend-reset" onClick={() => setOnly(null)}>
            show all
          </button>
        )}
      </div>
      <span hidden id={`${uid}-desc`} />
    </div>
  );
}
