import Hero from "./components/Hero";
import { Section, Figure, Detail } from "./components/ui";
import LoopDiagram from "./components/figures/LoopDiagram";
import Trajectory from "./components/figures/Trajectory";
import WeaknessBars from "./components/figures/WeaknessBars";
import ThresholdSlope from "./components/figures/ThresholdSlope";
import AlignmentPlot from "./components/figures/AlignmentPlot";
import BaselineTable from "./components/BaselineTable";
import AgenticJudgeTable from "./components/AgenticJudgeTable";
import PaperGrid from "./components/PaperGrid";
import RunRecords from "./components/RunRecords";
import DomainGrid from "./components/DomainGrid";
import NoveltyTable from "./components/NoveltyTable";

import avg from "./data/avg_trajectory.json";
import aiinit from "./data/aiinit_trajectory.json";
import ladder from "./data/weakness_ladder.json";
import thresholds from "./data/thresholds.json";
import taxonomy from "./data/taxonomy.json";
import alignment from "./data/alignment.json";
import stats from "./data/key_stats.json";

const stanfordSeries = { key: "stanford", label: "Stanford Reviewer, evaluation-only",
  values: avg.series.find((s) => s.key === "stanford")!.values };
const aiSeries = { key: "ai", label: "Initialized with AI review",
  values: aiinit.series.find((s) => s.key === "ai")!.values };
const humanSelf = avg.series.filter((s) => s.key !== "stanford");

export default function Home() {
  return (
    <main className="page">
      <Hero />

      {/* ---------------- 01 · the system ---------------- */}
      <Section
        id="system"
        no="01"
        name="The system"
        title="A scientist and a reviewer, in a closed loop"
        lede={
          <>
            The scientist revises the implementation, runs experiments, and
            updates the manuscript. The reviewer reads only the current
            version, searches the literature, and returns the feedback that
            guides the next round.
          </>
        }
      >
        <Figure
          n="Figure 1"
          caption={
            <>
              The revision loop. The scientist retains every previous version
              so revisions accumulate; the reviewer retains nothing, so
              earlier scores cannot bias a fresh review. Five rounds per
              paper, ≈{stats.hours_per_round}&nbsp;h per round, on a single
              96&nbsp;GB GPU.
            </>
          }
        >
          <LoopDiagram />
        </Figure>

        <div className="conditions">
          <div className="condition">
            <p className="condition-name">Human-initialized</p>
            <p>
              The written venue reviews guide the first revision; our
              reviewer guides the four rounds after.
            </p>
          </div>
          <div className="condition">
            <p className="condition-name">AI-initialized</p>
            <p>
              Our reviewer also supplies the first-round feedback, in place
              of the venue reviews.
            </p>
          </div>
          <div className="condition">
            <p className="condition-name">Autonomous self-revision</p>
            <p>
              AppliedScientist receives the same fixed self-review prompt in
              every round &mdash; no reviewer guidance at all.
            </p>
          </div>
        </div>

        <div className="prose" style={{ marginTop: "2.2rem" }}>
          <p>
            The scientist has the same research capabilities in all three
            conditions, isolating the effect of the guidance it receives. The
            central research contribution of each paper is held fixed
            throughout &mdash; this is revision, not replacement.
          </p>
        </div>
      </Section>

      {/* ---------------- 02 · the reviewer ---------------- */}
      <Section
        id="reviewer"
        no="02"
        name="The reviewer"
        title="The reviewer is benchmarked before it is trusted"
        lede={
          <>
            In a closed loop the reviewer is not just an evaluator &mdash; it
            is the feedback signal the scientist optimizes toward. An
            unreliable reviewer points the scientist at the wrong target, so
            we measured it first: {alignment.n_papers} ICLR 2020&ndash;26
            papers, 18 baseline reviewers, and a second independent
            benchmark.
          </>
        }
      >
        <Figure
          n="Figure 2"
          caption={
            <>
              Spearman correlation with the mean human rating against
              agreement within one point. Our reviewer, run on three backbone
              models, brackets Stanford Reviewer on both axes.
            </>
          }
        >
          <AlignmentPlot systems={alignment.systems} />
        </Figure>

        <Detail summary="Two benchmarks against baselines, and three ablations" count="Tables 1–2">
          <p className="detail-kicker">Pairwise preference, 650 papers</p>
          <BaselineTable />
          <p className="detail-note">
            On constructive value &mdash; the dimension the loop consumes
            &mdash; the margin over Stanford Reviewer is the narrowest of the
            four: close, not decisive.
          </p>

          <p className="detail-kicker">AgenticJudge reward, 115 papers</p>
          <AgenticJudgeTable />
          <p className="detail-note">
            A second, independent judge (Gemini 3.1 Pro) scoring issue
            overlap with human reviewers, fabrication, and calibration
            &mdash; not the pairwise-preference judge above.
          </p>

          <p className="detail-kicker">Ablations</p>
          <p className="detail-note" style={{ marginTop: 0, marginBottom: "0.4rem" }}>
            Three checks on the reviewer itself. Higher is better in every
            row; each compares our design choice against the alternative.
          </p>
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">What we checked</th>
                  <th scope="col">How</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AgenticJudge agrees with human experts</td>
                  <td>4 expert annotators scored 100 papers</td>
                  <td className="num best">ρ = 0.84, κ = 0.81</td>
                </tr>
                <tr>
                  <td>Structured review process helps</td>
                  <td>structured vs. fully autonomous review</td>
                  <td className="num best">reward 0.85 vs. 0.51</td>
                </tr>
                <tr>
                  <td>Paper input format matters</td>
                  <td>OCR markdown vs. pandoc-from-LaTeX</td>
                  <td className="num best">
                    fabrication reward {stats.ocr_reward} vs. {stats.pandoc_reward}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Detail>
      </Section>

      {/* ---------------- 03 · results ---------------- */}
      <Section
        id="results"
        no="03"
        name="Results"
        title="Reviewer-guided revision measurably improves papers"
        lede={
          <>
            Scores rise steadily across five rounds in both reviewer-guided
            conditions, and an evaluator that never guided the revisions
            &mdash; Stanford Reviewer &mdash; sees the same upward
            trajectory. AppliedScientist with only a fixed self-review
            prompt barely moves.
          </>
        }
      >
        <div className="fact-row">
          <div className="fact">
            <span className="fact-value">
              {stats.v0_mean_ours} <span className="arr">→</span> {stats.vmax_mean_ours}
            </span>
            <span className="fact-label">our reviewer, original → best revision</span>
          </div>
          <div className="fact">
            <span className="fact-value">
              {stats.v0_mean_stanford.toFixed(2)} <span className="arr">→</span> {stats.vmax_mean_stanford}
            </span>
            <span className="fact-label">Stanford Reviewer, evaluation-only</span>
          </div>
          <div className="fact">
            <span className="fact-value">4.38</span>
            <span className="fact-label">AppliedScientist with a self-review prompt, final round</span>
          </div>
          <div className="fact">
            <span className="fact-value">{stats.ge6_vmax}</span>
            <span className="fact-label">
              papers scoring ≥ 6 at their best revision, vs. {stats.ge6_v0} before
            </span>
          </div>
        </div>

        <Figure
          n="Figure 3"
          caption={
            <>
              Mean reviewer score by revision round. The human-initialized
              and self-review-prompt runs are always scored by our reviewer;
              switch the third line to compare against Stanford Reviewer or
              against starting from an AI-generated first review.
            </>
          }
        >
          <Trajectory
            rounds={avg.rounds}
            series={humanSelf}
            compareOptions={[
              { key: "stanford", label: "vs. Stanford Reviewer", series: stanfordSeries },
              { key: "ai", label: "vs. AI-initialized", series: aiSeries },
            ]}
          />
        </Figure>

        <Detail summary="Score thresholds, per-domain results, and cost" count="Figs. 3–7">
          <div className="slope-pair">
            <Figure n="Figure 4a" caption="Papers clearing each score threshold, original (gray) vs. best revision (blue) — our reviewer. Out of 30.">
              <ThresholdSlope rows={thresholds.ours} n={thresholds.n} />
            </Figure>
            <Figure n="Figure 4b" caption="The same thresholds under Stanford Reviewer (green). Out of 30.">
              <ThresholdSlope rows={thresholds.stanford} n={thresholds.n}
                color="var(--s-stanford)" />
            </Figure>
          </div>

          <p className="detail-kicker">By research domain</p>
          <DomainGrid />
          <p className="detail-note">
            Human-initialized condition, our reviewer, by domain. The upward
            pattern holds in every domain, not just on average.
          </p>

          <p className="detail-kicker">Computation cost</p>
          <p className="detail-note">
            ≈{stats.hours_per_round}h and ${stats.cost_per_paper_usd} per
            paper. The full 30-paper evaluation cost ≈$
            {stats.total_cost_usd} and {stats.total_gpu_hours} GPU-hours
            &mdash; the limiting factor on evaluation size. The same
            protocol on 100 papers would cost ≈${stats.cost_100papers_usd}{" "}
            and {stats.gpu_hours_100papers} GPU-hours.
          </p>
        </Detail>
      </Section>

      {/* ---------------- 04 · the finding ---------------- */}
      <Section
        id="finding"
        no="04"
        name="The finding"
        title="Revision fixes the execution. It does not fix the idea."
        lede={
          <>
            Across {stats.papers} papers, AppliedScientist resolved{" "}
            <b>{stats.exec_resolved}</b> execution-related weaknesses (
            {stats.exec_rate}%) &mdash; missing baselines, weak evidence,
            unclear writing &mdash; but only <b>{stats.idea_resolved}</b>{" "}
            idea-related weaknesses ({stats.idea_rate}%).
          </>
        }
      >
        <Figure
          n="Figure 5"
          caption="Resolution rate by weakness category, out of the number raised in each. Wilson 95% intervals; counts include partial resolutions."
        >
          <WeaknessBars categories={ladder.categories} />
        </Figure>

        <p className="finding">
          Once a contribution is judged to lack novelty, additional evidence
          seldom changes the outcome. Revision strengthens the case for an
          idea; <em>it does not replace the idea</em> &mdash; improving the
          idea itself requires returning to the ideation stage.
        </p>

        <div className="prose">
          <p>
            The split mirrors why papers are rejected at all. Across{" "}
            {taxonomy.n} randomly sampled rejected ICLR papers, execution
            issues account for {taxonomy.execution}% of rejections,
            idea-related issues for {taxonomy.idea}%, and {taxonomy.both}%
            involve both.
          </p>
        </div>

        <Detail summary="Are the novelty objections grounded, or invented?" count="1 check">
          <p className="detail-kicker">Checking the reviewer&rsquo;s citations</p>
          <NoveltyTable />
          <p className="detail-note">
            Every prior-work citation the reviewer used to justify a novelty
            objection was checked by hand against the cited paper.
          </p>
        </Detail>
      </Section>

      {/* ---------------- 05 · individual papers ---------------- */}
      <Section
        id="papers"
        no="05"
        name="Individual papers"
        title="Every paper, including the failures"
        lede={
          <>
            All ten papers with full trajectories end at or above their
            starting score once each keeps its best revision. Two never
            improve; eight reach a higher score and stay there.
          </>
        }
      >
        <Figure
          n="Figure 6"
          caption="Per-paper trajectories reported in the appendix. Open marker = original version V₀, dashed line = starting level."
        >
          <PaperGrid />
        </Figure>

        <h3 className="subhead" style={{ marginTop: "3rem" }}>
          Two runs in full, with the reviews that drove them
        </h3>
        <RunRecords />
      </Section>
    </main>
  );
}
