import data from "../data/novelty_verification.json";

/**
 * NoveltyTable — Appendix §B.4: every idea-related objection that survived
 * to the final review, and the prior work the reviewer cited to justify
 * it, checked against the arXiv API. Answers a specific worry about
 * claim 4: are the reviewer's novelty objections grounded, or invented?
 */
export default function NoveltyTable() {
  return (
    <div className="tbl-scroll">
      <table className="tbl">
        <caption>
          <span className="cap-num">Table 3. </span>
          Prior work cited by the {data.n_objections_examined} idea-related
          objections that survived every revision round, across{" "}
          {data.n_papers} papers. All {data.n_citations_verified} citations
          exist on arXiv and were manually confirmed relevant.
        </caption>
        <thead>
          <tr>
            <th scope="col">Paper</th>
            <th scope="col">Cited prior work</th>
            <th scope="col">Verified</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i}>
              <td>{r.id}</td>
              <td>{r.cited}</td>
              <td className="num">
                {r.verified === true ? "yes" : r.verified === false ? "no" : "n/a"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="detail-note">{data.unverifiable_reasons}</p>
    </div>
  );
}
