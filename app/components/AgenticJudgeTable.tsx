import data from "../data/agentic_judge.json";

const fmt = (v: number) => v.toFixed(2);

/**
 * AgenticJudgeTable — Appendix Figure (fig:agenticJudge): our reviewer
 * against 19 baselines on a second, independent evaluation (AgenticJudge,
 * not the pairwise-preference judge used in Table 1), scored on overlap,
 * fabrication, and calibration.
 */
export default function AgenticJudgeTable() {
  const groups = Array.from(new Set(data.rows.map((r) => r.group)));
  return (
    <div className="tbl-scroll">
      <table className="tbl">
        <caption>
          <span className="cap-num">Table 2. </span>
          Different review baselines scored by AgenticJudge (Gemini 3.1 Pro)
          on {data.n_papers} papers, across three discriminative criteria.
          Reward is their mean.
        </caption>
        <thead>
          <tr>
            <th scope="col">System</th>
            <th scope="col">Overlap</th>
            <th scope="col">Fabrication</th>
            <th scope="col">Calibration</th>
            <th scope="col">Reward</th>
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g}>
            <tr className="group-top">
              <th scope="rowgroup" className="group-name" colSpan={5}>
                {g}
              </th>
            </tr>
            {data.rows
              .filter((r) => r.group === g)
              .map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td className="num">{fmt(r.overlap)}</td>
                  <td className="num">{fmt(r.fabrication)}</td>
                  <td className="num">{fmt(r.calibration)}</td>
                  <td className={`num ${r.group === "Ours" ? "best" : ""}`}>
                    {fmt(r.reward_mean)}
                  </td>
                </tr>
              ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
