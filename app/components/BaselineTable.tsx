import judge from "../data/judge_comparison.json";

type Cell = { win: number; loss: number };
const DIMS = ["technical", "constructive", "analytical", "significance"] as const;

const fmt = (v: number) => (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1));

/**
 * BaselineTable — Table 3 of the paper, set as a booktabs table.
 * Win and loss share a cell as "win / loss"; ties are the remainder and
 * are stated in the caption rather than given a column that repeats it.
 */
export default function BaselineTable() {
  return (
    <div className="tbl-scroll">
      <table className="tbl">
        <caption>
          <span className="cap-num">Table 1. </span>
          Pairwise preference evaluation of our AI Reviewer against existing
          automated reviewers on {judge.n_papers} ICLR papers from 2020&ndash;26.
          A search-enabled LLM judge compares anonymized review pairs using the
          evaluation rubric of Xu et al. Each cell gives the percentage of
          comparisons won by our reviewer and lost to the baseline; the
          remainder are ties.
        </caption>
        <thead>
          <tr>
            <th scope="col">Baseline</th>
            {judge.dimensions.map((d) => (
              <th scope="col" key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        {judge.groups.map((g) => (
          <tbody key={g.group}>
            <tr className="group-top">
              <th scope="rowgroup" className="group-name" colSpan={5}>
                {g.group}
              </th>
            </tr>
            {g.rows.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                {DIMS.map((d) => {
                  const c = (r.dims as Record<string, Cell>)[d];
                  return (
                    <td className="num" key={d}>
                      <span className="win">{fmt(c.win)}</span>
                      <span className="wl-sep"> / </span>
                      <span className="loss">{fmt(c.loss)}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
