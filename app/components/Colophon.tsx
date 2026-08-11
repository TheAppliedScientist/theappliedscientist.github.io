import { site } from "../site.config";

/**
 * Colophon — a paper's back matter: how to cite, what is released, and
 * where every number on this page came from.
 */
export default function Colophon() {
  return (
    <footer className="colophon" id="citation">
      <div className="page">
        <div className="colophon-grid">
          <div>
            <h2>Citation</h2>
            <pre className="bibtex">
{`@inproceedings{appliedscientist2027,
  title     = {${site.title}},
  author    = {${site.authors.map((a) => a.name).join(" and ")}},
  booktitle = {Proceedings of the AAAI Conference on
               Artificial Intelligence},
  year      = {2027}
}`}
            </pre>
            <p className="colophon-note">
              Every figure and number on this site is taken from the
              submitted manuscript and its appendix. Review excerpts are
              quoted verbatim from reviews generated during the runs, with
              the version judged and the score it received.
            </p>
          </div>
          <div className="colophon-facts">
            <div className="colophon-fact">
              <span className="label">Paper</span>
              <p>
                <a href="/exhibits/AnonymousSubmission2027.pdf">
                  Submission (PDF)
                </a>
              </p>
            </div>
            <div className="colophon-fact">
              <span className="label">Code &amp; data</span>
              <p>Released on publication.</p>
            </div>
            <div className="colophon-fact">
              <span className="label">Authors</span>
              <p>
                {site.authors.map((a, i) => (
                  <span key={a.name}>
                    {i > 0 && ", "}
                    <a href={a.url}>{a.name}</a>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
