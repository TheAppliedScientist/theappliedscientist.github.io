import { site } from "../site.config";

/**
 * Colophon — a paper's back matter: how to cite, what is released, and
 * where every number on this page came from.
 */
export default function Colophon() {
  return (
    <footer className="colophon" id="citation">
      <div className="colophon-inner">
        <div className="colophon-grid">
          <div>
            <p className="eyebrow">AppliedScientist</p>
            <h2>Citation</h2>
            <pre className="bibtex">
{`@inproceedings{appliedscientist2027,
  title     = {${site.title}},
  author    = {${site.authors.map((a) => a.name).join(" and ")}},
  year      = {2027}
}`}
            </pre>
            <p className="colophon-note">
              Every figure and number on this site is taken from the submitted
              manuscript and its appendix. Review excerpts are quoted verbatim
              from reviews generated during the runs.
            </p>
          </div>
          <div className="colophon-facts">
            <div className="colophon-fact">
              <span className="label">Paper</span>
              <p>
                <a href={site.links.paper}>
                  Submission (PDF)
                </a>
              </p>
            </div>
            <div className="colophon-fact">
              <span className="label">Code &amp; data</span>
              <p>{site.release.code}.</p>
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
