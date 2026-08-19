"use client";

import { useEffect, useState } from "react";
import { site } from "../site.config";

export default function AnnotatedPapersChapter() {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewPaper = site.annotatedPapers[previewIndex];

  const showPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  useEffect(() => {
    if (!previewOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [previewOpen]);

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
                <span
                  className="artifact-page"
                  onMouseEnter={() => showPreview(index)}
                >
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

        <div
          className={`artifact-lightbox${previewOpen ? " is-visible" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={`Annotated paper preview: ${previewPaper.title}`}
          aria-hidden={!previewOpen}
          onClick={() => setPreviewOpen(false)}
        >
          <button
            className="artifact-lightbox-close"
            type="button"
            tabIndex={previewOpen ? 0 : -1}
            onClick={() => setPreviewOpen(false)}
          >
            <span aria-hidden="true">×</span>
            Close preview
          </button>
          <img
            className="artifact-lightbox-lamp"
            src="/img/research-lightbox-pendant.webp"
            alt=""
            width="900"
            height="600"
          />
          <span className="artifact-lightbox-beam" />
          <figure
            className="artifact-lightbox-stage"
            onClick={(event) => event.stopPropagation()}
          >
            <a
              className="artifact-lightbox-document"
              href={previewPaper.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open full annotated PDF: ${previewPaper.title}`}
            >
              <img
                src={previewPaper.detail}
                alt=""
                width="2000"
                height="2589"
              />
            </a>
            <figcaption>
              <span>{previewPaper.role}</span>
              {previewPaper.title}
              <a href={previewPaper.href} target="_blank" rel="noreferrer">
                Open full PDF <span aria-hidden="true">↗</span>
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
