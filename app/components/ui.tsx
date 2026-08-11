import type { ReactNode } from "react";

/**
 * Section — one numbered movement of the argument. The header pattern is
 * always the same: kicker (number + name), title, optional lede. Sections
 * are separated by whitespace, so the eye always knows where it is.
 */
export function Section({
  id,
  no,
  name,
  title,
  lede,
  children,
}: {
  id: string;
  no: string;
  name: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="section" id={id}>
      <header className="sec-head">
        <p className="sec-kicker">
          <span className="sec-no">{no}</span> {name}
        </p>
        <h2 className="sec-title">{title}</h2>
        {lede && <p className="sec-lede">{lede}</p>}
      </header>
      {children}
    </section>
  );
}

/** A figure with a paper-style numbered caption. */
export function Figure({
  n,
  caption,
  children,
}: {
  n: string;
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="fig">
      {children}
      <figcaption className="caption">
        <span className="cap-num">{n}. </span>
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * Detail — an optional deep-dive, closed by default. For material that
 * rewards a click (full tables, ablations), not for facts that belong in
 * the section itself.
 */
export function Detail({
  summary,
  count,
  children,
}: {
  summary: string;
  count?: string;
  children: ReactNode;
}) {
  return (
    <details className="detail">
      <summary>
        <span className="detail-mark" aria-hidden="true">+</span>
        <span>{summary}</span>
        {count && <span className="detail-count">{count}</span>}
      </summary>
      <div className="detail-body">{children}</div>
    </details>
  );
}
