"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Author = {
  readonly name: string;
  readonly url: string;
  readonly image: string;
};

export default function AuthorPreviews({ authors }: { authors: readonly Author[] }) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextFocus = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const authorRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const previewAuthor = authors[previewIndex];

  const cancelHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const showPreview = (index: number, delay = 260) => {
    cancelHover();
    hoverTimer.current = setTimeout(() => {
      setPreviewIndex(index);
      setPreviewOpen(true);
    }, delay);
  };

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
    suppressNextFocus.current = true;
    window.requestAnimationFrame(() => {
      authorRefs.current[previewIndex]?.focus();
      window.requestAnimationFrame(() => { suppressNextFocus.current = false; });
    });
  }, [previewIndex]);

  useEffect(() => {
    if (!previewOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 220);
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

  useEffect(() => () => cancelHover(), []);

  return (
    <>
      <p className="hero-authors">
        {authors.map((author, index) => (
          <span key={author.name}>
            <a
              ref={(element) => { authorRefs.current[index] = element; }}
              href={author.url}
              onMouseEnter={() => showPreview(index)}
              onMouseLeave={cancelHover}
              onFocus={() => {
                if (!suppressNextFocus.current) showPreview(index, 0);
              }}
            >
              <img
                className="author-portrait"
                src={author.image}
                alt=""
                width="72"
                height="72"
                aria-hidden="true"
              />
              <span>{author.name}</span>
            </a>
          </span>
        ))}
      </p>

      <div
        className={`author-web-preview${previewOpen ? " is-visible" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${previewAuthor.name}'s webpage preview`}
        aria-hidden={!previewOpen}
        onClick={closePreview}
      >
        <section
          className="author-web-preview-stage"
          onClick={(event) => event.stopPropagation()}
        >
          <header>
            <div>
              <span>Author webpage</span>
              <strong>{previewAuthor.name}</strong>
            </div>
            <div className="author-web-preview-actions">
              <a href={previewAuthor.url} target="_blank" rel="noreferrer">
                Open website <span aria-hidden="true">↗</span>
              </a>
              <button
                ref={closeButtonRef}
                className="author-web-preview-close"
                type="button"
                tabIndex={previewOpen ? 0 : -1}
                onClick={closePreview}
              >
                <span aria-hidden="true">×</span>
                Close
              </button>
            </div>
          </header>
          {previewOpen && (
            <iframe
              src={previewAuthor.url}
              title={`${previewAuthor.name}'s personal webpage`}
              referrerPolicy="no-referrer"
            />
          )}
        </section>
      </div>
    </>
  );
}
