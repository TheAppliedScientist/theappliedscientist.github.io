"use client";

import { useState } from "react";
import { site } from "../site.config";

export default function AnnotatedPapersChapter() {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewPaper = site.annotatedPapers[previewIndex];

  const showPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

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
                onMouseEnter={() => showPreview(index)}
                onMouseLeave={() => setPreviewOpen(false)}
                onFocus={() => showPreview(index)}
                onBlur={() => setPreviewOpen(false)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setPreviewOpen(false);
                }}
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

        <div
          className={`artifact-lightbox${previewOpen ? " is-visible" : ""}`}
          aria-hidden="true"
        >
          <span className="artifact-lightbox-lamp" />
          <span className="artifact-lightbox-beam" />
          <figure className="artifact-lightbox-stage">
            <img
              src={previewPaper.detail}
              alt=""
              width="2000"
              height="2589"
            />
            <figcaption>
              <span>{previewPaper.role}</span>
              {previewPaper.title}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
