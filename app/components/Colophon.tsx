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
  booktitle = {Proceedings of the AAAI Conference on
               Artificial Intelligence},
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
            <section
              className="annotated-papers"
              aria-labelledby="annotated-papers-title"
            >
              <p className="label">Revision artifacts</p>
              <h3 id="annotated-papers-title">Annotated papers</h3>
              <ol className="annotated-paper-list">
                {site.annotatedPapers.map((paper, index) => (
                  <li key={paper.href}>
                    <a
                      className="annotated-paper-link"
                      href={paper.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="annotated-paper-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="annotated-paper-copy">
                        <span className="annotated-paper-role">{paper.role}</span>
                        <span className="annotated-paper-title">{paper.title}</span>
                      </span>
                      <span className="annotated-paper-action">
                        Open PDF <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>
            <div className="colophon-fact">
              <span className="label">Paper</span>
              <p>
                <a href={site.links.paper}>
                  Submission (PDF)
                </a>
              </p>
            </div>
            <div className="colophon-fact">
              <span className="label">Example revision artifacts</span>
              <p className="artifact-links">
                <a href="/exhibits/idea09_original_score4.pdf">Original manuscript</a>
                <span aria-hidden="true"> · </span>
                <a href="/exhibits/idea09_revised.pdf">Revised manuscript</a>
                <span aria-hidden="true"> · </span>
                <a href="/exhibits/idea09_full_annotated.pdf">Annotated manuscript</a>
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
