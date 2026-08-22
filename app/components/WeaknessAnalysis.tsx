"use client";

import { useRef, useState } from "react";
import examples from "../data/weakness_examples.json";

type Category = {
  name: string;
  resolved: number;
  total: number;
  rate: number;
  ci: number[];
  kind: string;
};

type Example = (typeof examples)[number];

export default function WeaknessAnalysis({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const snapshotButtonRef = useRef<HTMLButtonElement>(null);
  const example = examples[selected] as Example;

  function closeSnapshot() {
    dialogRef.current?.close();
  }

  return (
    <div className="weakness-analysis">
      <figure className="weakness-figure">
        <div className="weakness-axis" aria-hidden="true">
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
        <div className="weakness-rows" role="tablist" aria-label="Weakness categories">
          {categories.map((category, index) => {
            const selectedRow = selected === index;
            const definition = examples.find((item) => item.name === category.name)?.meaning;
            const ciLeft = category.ci[0];
            const ciWidth = category.ci[1] - category.ci[0];

            return (
              <button
                className={`weakness-row${selectedRow ? " is-selected" : ""}${category.kind === "idea" ? " is-idea" : ""}`}
                id={`weakness-tab-${index}`}
                key={category.name}
                role="tab"
                aria-selected={selectedRow}
                aria-controls="weakness-example"
                onClick={() => setSelected(index)}
                type="button"
              >
                <span className="weakness-row-label">
                  <strong>{category.name}</strong>
                  <small>{definition}</small>
                </span>
                <span className="weakness-track" aria-hidden="true">
                  <span className="weakness-fill" style={{ width: `${category.rate}%` }} />
                  <span className="weakness-ci" style={{ left: `${ciLeft}%`, width: `${ciWidth}%` }} />
                </span>
                <span className="weakness-count"><strong>{category.resolved}</strong><span>/{category.total}</span></span>
              </button>
            );
          })}
        </div>
        <figcaption className="finding-plot-caption">Resolution rate of weaknesses identified in the original venue reviews. Intervals show Wilson 95% confidence intervals. Select a category to inspect an example.</figcaption>
      </figure>

      <article
        className="weakness-example"
        id="weakness-example"
        role="tabpanel"
        aria-labelledby={`weakness-tab-${selected}`}
      >
        <p className="weakness-example-kicker">Example · {example.paper}</p>
        <h3>{example.question}</h3>
        <p className="weakness-example-definition">{example.meaning}</p>
        <dl>
          <div>
            <dt>Original venue review</dt>
            <dd>{example.review}</dd>
          </div>
          <div>
            <dt>What AppliedScientist did</dt>
            <dd>
              <ul className="weakness-actions">
                {example.actions.map((action) => <li key={action}>{action}</li>)}
              </ul>
            </dd>
          </div>
        </dl>
        {example.snapshot ? (
          <figure className="weakness-snapshot-figure">
            <button
              ref={snapshotButtonRef}
              className="weakness-snapshot"
              type="button"
              aria-label={`Enlarge evidence from ${example.paper}`}
              onClick={() => dialogRef.current?.showModal()}
            >
              <img src={example.snapshot} alt={example.snapshotAlt} />
              <span>Inspect actual revision <b aria-hidden="true">⤢</b></span>
            </button>
            <figcaption>{example.evidence}</figcaption>
          </figure>
        ) : null}
      </article>

      {example.snapshot ? (
        <dialog
          ref={dialogRef}
          className="weakness-snapshot-dialog"
          aria-label={`Evidence from ${example.paper}`}
          onClose={() => snapshotButtonRef.current?.focus()}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeSnapshot();
          }}
        >
          <button className="weakness-snapshot-close" type="button" onClick={closeSnapshot}>Close <span aria-hidden="true">×</span></button>
          <figure>
            <img src={example.snapshot} alt={example.snapshotAlt} />
            <figcaption><strong>{example.paper}</strong><span>{example.evidence}</span></figcaption>
          </figure>
        </dialog>
      ) : null}
    </div>
  );
}
