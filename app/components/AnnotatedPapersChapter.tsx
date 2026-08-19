import { site } from "../site.config";

export default function AnnotatedPapersChapter() {
  return (
    <section className="research-chapter artifacts-chapter" id="artifacts">
      <div className="chapter-index">
        <span>05</span>
        <span>Revision outputs</span>
      </div>

      <div className="chapter-body artifacts-body">
        <header className="artifacts-head">
          <div>
            <p className="eyebrow">Annotated papers</p>
            <h2>Changes made by AppliedScientist, shown in the manuscripts</h2>
          </div>
          <p>
            The annotations highlight the changes made by AppliedScientist
            during revision.
          </p>
        </header>

        <ol className="artifact-manuscripts">
          {site.annotatedPapers.map((paper, index) => (
            <li key={paper.href} className={index === 0 ? "is-headline" : undefined}>
              <a
                className="artifact-manuscript"
                href={paper.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open annotated paper: ${paper.title}`}
              >
                <span className="artifact-page">
                  <img
                    src={paper.preview}
                    alt={`${paper.previewPage} from ${paper.title}`}
                    width="1100"
                    height="1424"
                    loading="lazy"
                  />
                  <span className="artifact-page-note">{paper.previewPage}</span>
                </span>

                <span className="artifact-caption">
                  <span className="artifact-caption-topline">
                    <span className="artifact-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="artifact-role">{paper.role}</span>
                  </span>
                  <span className="artifact-title">{paper.title}</span>
                  <span className="artifact-action">
                    Open full annotated PDF <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
