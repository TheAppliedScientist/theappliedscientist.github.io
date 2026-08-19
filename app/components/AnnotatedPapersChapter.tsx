"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "../site.config";

export default function AnnotatedPapersChapter() {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previewPaper = site.annotatedPapers[previewIndex];

  const showPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    window.requestAnimationFrame(() => {
      triggerRefs.current[previewIndex]?.focus();
    });
  }, [previewIndex]);

  useEffect(() => {
    if (!previewOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 240);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [closePreview, previewOpen]);

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
              <div className="artifact-manuscript">
                <span className="artifact-page">
                  <img
                    src={paper.preview}
                    alt={`${paper.previewPage} from ${paper.title}`}
                    width="1100"
                    height="1424"
                    loading="lazy"
                  />
                  <span className="artifact-page-note">{paper.previewPage}</span>
                  <button
                    ref={(element) => {
                      triggerRefs.current[index] = element;
                    }}
                    className="artifact-enlarge"
                    type="button"
                    onClick={() => showPreview(index)}
                    aria-label={`Enlarge ${paper.previewPage} from ${paper.title}`}
                  >
                    <span className="artifact-enlarge-icon" aria-hidden="true">⤢</span>
                    Enlarge page
                  </button>
                </span>

                <span className="artifact-caption">
                  <span className="artifact-caption-topline">
                    <span className="artifact-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="artifact-role">{paper.role}</span>
                  </span>
                  <span className="artifact-title">{paper.title}</span>
                  <a
                    className="artifact-action"
                    href={paper.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open full annotated PDF <span aria-hidden="true">↗</span>
                  </a>
                </span>
              </div>
            </li>
          ))}
        </ol>

        <div
          className={`artifact-lightbox${previewOpen ? " is-visible" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={`Annotated paper preview: ${previewPaper.title}`}
          aria-hidden={!previewOpen}
          onClick={closePreview}
        >
          <button
            ref={closeButtonRef}
            className="artifact-lightbox-close"
            type="button"
            tabIndex={previewOpen ? 0 : -1}
            onClick={closePreview}
          >
            <span aria-hidden="true">×</span>
            Close preview
          </button>
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
              tabIndex={previewOpen ? 0 : -1}
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
              <a
                href={previewPaper.href}
                target="_blank"
                rel="noreferrer"
                tabIndex={previewOpen ? 0 : -1}
              >
                Open full PDF <span aria-hidden="true">↗</span>
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
