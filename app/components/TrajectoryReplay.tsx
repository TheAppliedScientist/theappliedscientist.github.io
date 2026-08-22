"use client";

import { useCallback, useEffect, useState } from "react";

type Round = {
  number: number; from: string; to: string; heading: string; guidance: string;
  feedback: string[]; responseHeading: string; response: string; actions: string[];
  evidence: Array<{ label: string; state: "done" | "partial" | "open" }>;
  unresolved?: string; score: number; scoreNote: string;
  diff: { added: number; removed: number }; source: string;
  image?: string; imageAlt?: string; caption?: string;
};

const rounds: Round[] = [
  {
    number: 1, from: "V₀", to: "V₁",
    heading: "Original venue reviews guide the first revision",
    guidance: "Four human venue reviews of the original submission",
    feedback: [
      "Generalization beyond the constrained Sokoban environment is unclear.",
      "All experiments are LLM-to-LLM; translation to human–AI interaction is unknown.",
      "The paper provides little guidance on improving vigilance mechanisms.",
    ],
    responseHeading: "Decision-point evaluation and vigilance prompting study",
    response: "AppliedScientist extends the evaluation beyond the original full-game setting and adds an intervention that directly tests whether prompting can improve resistance to malicious advice.",
    actions: [
      "Decision-point Sokoban: 8 positions × 5 repetitions.",
      "Explicit awareness improves resistance by 32.5 percentage points in this experiment.",
      "A cross-domain trivia extension and no-planner results are included.",
    ],
    evidence: [
      { label: "Experiments performed", state: "done" },
      { label: "Analysis added", state: "done" },
      { label: "Human baseline", state: "open" },
    ],
    unresolved: "The requested human baseline is not completed in this round.",
    score: 6, scoreNote: "AI Reviewer evaluation of V₁",
    diff: { added: 996, removed: 536 },
    source: "Original OpenReview reports; V₁ manuscript, Sections 5–6 and Appendix",
    image: "/replay/persuasion/figures/decision-point.png",
    imageAlt: "Decision-point assistance comparison heatmap saved with revision V1",
    caption: "Decision-point results saved with V₁.",
  },
  {
    number: 2, from: "V₁", to: "V₂",
    heading: "Fresh feedback guides the second revision",
    guidance: "AI Reviewer evaluation of V₁ · score 6/10",
    feedback: [
      "Add closely related work and reframe the novelty claim.",
      "Report correlation confidence intervals and statistical power.",
      "Run the prompting study on additional models.",
      "Include a human baseline for the decision-point variant.",
    ],
    responseHeading: "Changes in V₂",
    response: "The rebuttal attached to V₁ records six changes made in V₂. The human-baseline request remains open rather than being represented as completed.",
    actions: [
      "Related work is extended and the novelty claim is reframed.",
      "Prompting results are added for GPT-5 and Grok 4 Fast.",
      "Correlation confidence intervals are added.",
      "GPT-5 vigilance asymmetry and Claude Sonnet 4 advice are quantified.",
    ],
    evidence: [
      { label: "Additional model analysis", state: "done" },
      { label: "Statistical analysis", state: "done" },
      { label: "Human baseline", state: "open" },
    ],
    unresolved: "No human-participant experiment is added.",
    score: 6, scoreNote: "AI Reviewer evaluation of V₂",
    diff: { added: 72, removed: 12 },
    source: "V₁ reviewer report and rebuttal · ‘Changes in V2’",
  },
  {
    number: 3, from: "V₂", to: "V₃",
    heading: "The reviewer identifies a missing control",
    guidance: "AI Reviewer evaluation of V₂ · score 6/10",
    feedback: [
      "Add a random-advice baseline.",
      "Cite AREG and PMIYC and scale back first-of-its-kind language.",
      "Clarify the number of trials per condition.",
      "State the limits of statistical power with five models.",
    ],
    responseHeading: "Random-advice control and revised statistical framing",
    response: "AppliedScientist runs the requested control, corrects the sample-size description, and narrows the central claim to match the available evidence.",
    actions: [
      "Random valid suggestions form the new advice-control condition.",
      "The paper states 5 trials per puzzle, model, and condition: 250 trials per model.",
      "The abstract’s incorrect range is corrected to 32.5 percentage points.",
      "The dissociation result is presented as preliminary evidence.",
    ],
    evidence: [
      { label: "Control experiment performed", state: "done" },
      { label: "Sample size clarified", state: "done" },
      { label: "Population-level claim", state: "partial" },
    ],
    unresolved: "Five models remain insufficient for a population-level independence claim.",
    score: 7, scoreNote: "AI Reviewer evaluation of V₃",
    diff: { added: 100, removed: 10 },
    source: "V₂ reviewer report and rebuttal · ‘Changes in V3’; V₃ manuscript",
    image: "/replay/persuasion/figures/trivia-results.png",
    imageAlt: "Cross-domain trivia results included in revision V3",
    caption: "Cross-domain trivia results included in V₃.",
  },
  {
    number: 4, from: "V₃", to: "V₄",
    heading: "A 7/10 review requests a more informative intervention study",
    guidance: "AI Reviewer evaluation of V₃ · score 7/10",
    feedback: [
      "Separate the prompting intervention into distinct strategies.",
      "Add Persuasion-Balanced Training to related work.",
      "Design a targeted trivia follow-up stratified by difficulty.",
      "Present dissociation as a qualitative case comparison.",
    ],
    responseHeading: "Vigilance prompting ablation",
    response: "The revision compares a minimal baseline with four prompting strategies on the malicious decision-point task. Each strategy is evaluated on 40 trials.",
    actions: [
      "Baseline resistance: 0.100.",
      "Aware and Skeptic: 0.575.",
      "Verify and Chain-of-Thought: 0.675.",
      "The 47.5–57.5 point gains are reported relative to the minimal baseline.",
    ],
    evidence: [
      { label: "Five-strategy ablation performed", state: "done" },
      { label: "40 trials per strategy", state: "done" },
      { label: "Harder trivia follow-up", state: "open" },
    ],
    unresolved: "Cross-domain validation still relies on one smaller model.",
    score: 6, scoreNote: "AI Reviewer evaluation of V₄",
    diff: { added: 81, removed: 38 },
    source: "V₃ reviewer report; V₄ manuscript, Vigilance Prompting Ablation",
    image: "/replay/persuasion/figures/vigilance-ablation.png",
    imageAlt: "Vigilance prompting ablation across five prompting strategies",
    caption: "Resistance rate in the V₄ prompting ablation; error bars show 95% confidence intervals.",
  },
  {
    number: 5, from: "V₄", to: "V₅",
    heading: "The final round tests the reviewer’s alternative explanation",
    guidance: "AI Reviewer evaluation of V₄ · score 6/10",
    feedback: [
      "Stratify trivia questions by expected difficulty.",
      "Clarify what is new relative to the authors’ earlier preprint.",
      "Add SokoBench and PersuSafety.",
      "Clarify that prompting gains use a minimal baseline.",
    ],
    responseHeading: "Multi-difficulty trivia experiment",
    response: "AppliedScientist runs the targeted follow-up on high-confidence and deliberately obscure trivia items. The result reaches a ceiling and is reported as inconclusive for the proposed reversal.",
    actions: [
      "Claude Haiku 4.5 is correct on all 30 items despite malicious hints.",
      "The paper states that model knowledge exceeded the difficulty of the items.",
      "Prompting gains are qualified as an upper bound relative to a minimal prompt.",
      "SokoBench and PersuSafety are added; concurrent findings are acknowledged.",
    ],
    evidence: [
      { label: "Follow-up experiment performed", state: "done" },
      { label: "Hypothesis test", state: "partial" },
      { label: "Human–AI validation", state: "open" },
    ],
    unresolved: "The ceiling result does not establish where incorrect hints begin to mislead the model.",
    score: 6, scoreNote: "AI Reviewer evaluation of V₅",
    diff: { added: 52, removed: 3 },
    source: "V₄ reviewer report and rebuttal · ‘Changes in V5’; V₅ manuscript",
  },
];

const finalAudit = [
  { label: "Resolved", text: "Missing related work and limited guidance on improving vigilance." },
  { label: "Partial", text: "Generalization beyond Sokoban and metric presentation." },
  { label: "Unresolved", text: "Human–AI validation and setup-dependence of the dissociation claim." },
];

export default function TrajectoryReplay() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const round = rounds[index];
  const go = useCallback((next: number) => setIndex(Math.max(0, Math.min(rounds.length - 1, next))), []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((current) => {
      if (current === rounds.length - 1) { setPlaying(false); return current; }
      return current + 1;
    }), 9000);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === " ") { event.preventDefault(); setPlaying((value) => !value); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, index]);

  return (
    <main className="replay-shell" id="replay-main">
      <section className="replay-intro" aria-labelledby="replay-title">
        <div>
          <p className="replay-kicker">Example paper revised by AppliedScientist</p>
          <h1 id="replay-title"><span className="replay-paper-label">Paper title</span>Under the Influence: Quantifying Persuasion and Vigilance in Large Language Models</h1>
        </div>
        <div className="replay-intro-side">
          <dl className="replay-run-facts">
            <div><dt>Original submission · human venue reviewers</dt><dd>4.0<small>/10</small></dd></div>
            <div><dt>Best revision V₃ · AI Reviewer</dt><dd>7<small>/10</small></dd></div>
          </dl>
          <p>At each round, the scientist receives the previous manuscript, its accumulated history, and reviewer guidance. It updates the implementation, performs required experiments, and produces a revision. The reviewer then evaluates only that version.</p>
        </div>
      </section>

      <nav className="round-selector" aria-label="Revision rounds">
        {rounds.map((item, itemIndex) => (
          <button type="button" key={item.number}
            className={itemIndex === index ? "is-current" : itemIndex < index ? "is-past" : ""}
            onClick={() => go(itemIndex)} aria-current={itemIndex === index ? "step" : undefined}>
            <span>Round {item.number}</span><strong>{item.from} → {item.to}</strong>
          </button>
        ))}
      </nav>

      <article className="round-stage" aria-live="polite">
        <header className="round-stage-head">
          <div><p>Revision round {round.number} of {rounds.length}</p><h2>{round.heading}</h2></div>
          <div className="version-change" aria-label={`${round.from} to ${round.to}`}><span>{round.from}</span><b aria-hidden="true">→</b><strong>{round.to}</strong></div>
        </header>

        <div className="round-story">
          <section className="feedback-column" aria-labelledby="feedback-heading">
            <p className="story-step"><span aria-hidden="true">01</span><strong>Feedback received</strong></p>
            <h3 id="feedback-heading">What entered this round</h3>
            <p className="guidance-source">{round.guidance}</p>
            <ul>{round.feedback.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section className="response-column" aria-labelledby="response-heading">
            <p className="story-step"><span aria-hidden="true">02</span><strong>AppliedScientist response</strong></p>
            <h3 id="response-heading">{round.responseHeading}</h3>
            {round.image && <figure><img src={round.image} alt={round.imageAlt ?? ""} /><figcaption>{round.caption}</figcaption></figure>}
            <p className="response-summary">{round.response}</p>
            <ul>{round.actions.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>

        <section className="round-result" aria-labelledby="result-heading">
          <div className="result-evidence">
            <p className="story-step"><span aria-hidden="true">03</span><strong>Resulting evidence</strong></p>
            <h3 id="result-heading">What was completed—and what was not</h3>
            <div className="evidence-states">{round.evidence.map((item) => <span key={item.label} className={`state-${item.state}`}><i aria-hidden="true" />{item.label}</span>)}</div>
            {round.unresolved && <p className="unresolved-note"><strong>Still open:</strong> {round.unresolved}</p>}
          </div>
          <div className="result-review"><span>Resulting review</span><strong>{round.score}<small>/10</small></strong><p>{round.scoreNote}</p></div>
          <div className="result-record"><span>Saved record</span><p><b>TeX diff</b> +{round.diff.added} / −{round.diff.removed}</p><a href={`/replay/persuasion/manuscripts/v${round.number}.pdf`} target="_blank" rel="noreferrer">Open manuscript {round.to} <span aria-hidden="true">↗</span></a></div>
        </section>
        <footer className="round-source"><strong>Recorded source</strong><span>{round.source}</span></footer>
      </article>

      {index === rounds.length - 1 && <aside className="final-audit" aria-label="Final weakness resolution audit">
        <div><p>After V₅</p><h2>Final weakness-resolution audit</h2></div>
        {finalAudit.map((item) => <p key={item.label}><strong>{item.label}</strong>{item.text}</p>)}
      </aside>}

      <div className="replay-transport" aria-label="Replay controls">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0}>← Previous round</button>
        <div className="transport-progress" aria-label={`Round ${round.number} of ${rounds.length}`}>{rounds.map((item, itemIndex) => <i key={item.number} className={itemIndex <= index ? "is-filled" : ""} />)}</div>
        <button type="button" className="replay-play" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause replay" : "Play round by round"}</button>
        <button type="button" onClick={() => go(index + 1)} disabled={index === rounds.length - 1}>Next round →</button>
      </div>
    </main>
  );
}
