import Hero from "./components/Hero";
import { Section, Figure, Detail } from "./components/ui";
import ExampleReview from "./components/ExampleReview";
import LoopDiagram from "./components/figures/LoopDiagram";
import Trajectory from "./components/figures/Trajectory";
import WeaknessBars from "./components/figures/WeaknessBars";
import ThresholdSlope from "./components/figures/ThresholdSlope";
import AlignmentPlot from "./components/figures/AlignmentPlot";
import BaselineTable from "./components/BaselineTable";
import AgenticJudgeTable from "./components/AgenticJudgeTable";
import PaperGrid from "./components/PaperGrid";
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
            Given a rejected paper, its source repository, and current
            feedback, the scientist is instructed to address every reviewer
            concern while determining how each should be resolved. The
            central research contribution is treated as fixed; if addressing
            a concern would require changing that contribution, the scientist
            records it as unresolved rather than reframing the work as a
            different project.
          </>
        }
      >
        <div className="prose">
          <p>
            Revising an existing scientific paper differs fundamentally from
            generating one from a new research idea. During research
            generation, the problem formulation, methodology, and
            experimental design may all evolve as the work develops. Revision
            instead begins with an established contribution, implementation,
            and manuscript, where the goal is to address reviewer concerns
            without replacing the central research idea. AppliedScientist is
            designed for this constrained setting.
          </p>
        </div>

        <Figure
          n="Figure 1"
          caption={
            <>
              Overview of AppliedScientist. The scientist iteratively verifies
              reviewer suggestions, runs experiments, analyzes results, and
              updates the manuscript. The review component independently reads
              each revision, searches the literature, assesses its technical
              quality and significance, and returns structured feedback for the
              next round.
            </>
          }
        >
          <LoopDiagram />
        </Figure>

        <div className="prose" style={{ marginTop: "1.8rem" }}>
          <p>
            The scientist retains its previous code, results, manuscripts, and
            feedback so that revisions accumulate and the reviewer retains no
            history, preventing earlier judgments or scores from biasing its
            assessment of the current version.
          </p>
        </div>

        <div className="conditions">
          <div className="condition">
            <p className="condition-name">Human-initialized</p>
            <p>
              Written venue reviews guide the first round and the AI Reviewer
              guides subsequent rounds.
            </p>
          </div>
          <div className="condition">
            <p className="condition-name">AI-initialized</p>
            <p>
              The AI Reviewer also supplies the first-round feedback, in place
              of the venue reviews.
            </p>
          </div>
          <div className="condition">
            <p className="condition-name">Autonomous self-revision</p>
            <p>
              The scientist instead receives the same fixed self-review prompt
              in every round.
            </p>
          </div>
        </div>

        <div className="prose" style={{ marginTop: "1.8rem" }}>
          <p>
            The scientist has the same research capabilities in all three
            conditions, isolating the effect of the guidance it receives.
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
            In a closed revision loop, the reviewer serves both as an
            evaluator and as the feedback signal that guides the
            scientist&rsquo;s next action. Reviewer validity is therefore a
            prerequisite for interpreting downstream improvements: a stronger
            scientist does not make the loop reliable if its reviewer
            consistently rewards the wrong changes.
          </>
        }
      >
        <Figure
          n="Figure 2"
          caption={
            <>
              Score alignment with venue reviews on a set of 650 ICLR
              2020&ndash;26 papers. Left: Spearman correlation with the mean
              human rating. Right: agreement with the venue&rsquo;s
              accept/reject decision.
            </>
          }
        >
          <AlignmentPlot systems={alignment.systems} />
        </Figure>

        <div className="prose" style={{ marginTop: "1.5rem" }}>
          <p>
            Across these papers, our Reviewer correlates with mean human
            ratings at &rho; = 0.571 with DeepSeek V4 Flash and matches the
            venue&rsquo;s decision 76.2% of the time, against &rho; = 0.48 and
            67.2% with MiniMax M2.7. The Stanford Reviewer falls between the
            two, at &rho; = 0.51 and 71.1%.
          </p>
        </div>

        <Detail summary="Benchmarks against baselines, and the ablations behind them" count="Tables 1–2">
          <p className="detail-kicker">
            Pairwise preference evaluation on 650 ICLR papers
          </p>
          <BaselineTable />
          <p className="detail-note">
            On Constructive Value, however, it achieves performance comparable
            to Stanford Agent Reviewer (44.3% vs. 45.7% win rate), with the
            remaining 10% of comparisons resulting in ties.
          </p>

          <p className="detail-kicker">
            AgenticJudge for review evaluation
          </p>
          <AgenticJudgeTable />
          <p className="detail-note">
            AgenticJudge evaluates reviews across five criteria, of which
            three contribute to the final reward score: Issue Overlap,
            Fabrication, and Calibration. Comprehension and Substance are
            retained as sanity checks but excluded from the aggregate reward
            because they saturate across frontier models.
          </p>

          <p className="detail-kicker">Human alignment with the judge</p>
          <p className="detail-note">
            We randomly sample a set of 100 papers from the eval set, and four
            human experts are asked to annotate across our three main
            discriminative metrics. AgenticJudge achieves Spearman&rsquo;s
            rank correlation of &rho; = 0.84 against human annotation, a raw
            inter-reviewer agreement of 92% and a Cohen&rsquo;s &kappa; of
            0.81.
          </p>

          <p className="detail-kicker">Structured vs. autonomous review</p>
          <p className="detail-note">
            We compare our structured AI Reviewer with an autonomous variant
            that has access to the same tools but is free to decide its own
            execution strategy with the stages randomly shuffled. In practice,
            the autonomous agent often skips important evaluation steps or
            performs them out of order, resulting in weaker reviews. Despite
            using the same set of tools, the structured reviewer consistently
            outperforms the autonomous variant.
          </p>

          <p className="detail-kicker">Input representation: LaTeX vs. PDF</p>
          <p className="detail-note">
            To ensure the reviewing agent accurately interprets tables and
            mathematical notation, our reviewer performs OCR on the PDF rather
            than using bloated raw LaTeX source which gives poor performance
            and leads to fabrication.
          </p>
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Input format</th>
                  <th scope="col">Reward</th>
                  <th scope="col">Δ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LaTeX &rarr; pandoc</td>
                  <td className="num">{stats.pandoc_reward}</td>
                  <td className="num">baseline</td>
                </tr>
                <tr>
                  <td>OCR markdown (olmOCR)</td>
                  <td className="num best">{stats.ocr_reward}</td>
                  <td className="num best">+{stats.ocr_delta}</td>
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
        title="Reviewer-guided revision improves papers"
        lede={
          <>
            We first evaluate the human-initialized condition, in which the
            original written venue reviews guide V1 and fresh feedback from
            our reviewer guides each later revision. Reviewer scores improve
            steadily across successive rounds.
          </>
        }
      >
        <div className="prose">
          <p>
            We compare this condition with autonomous self-revision, in which
            the scientist receives the same fixed self-review prompt in every
            round and no reviewer-generated feedback. Although the scientist
            retains the same literature search, code execution, experiment
            design, analysis, and manuscript-editing capabilities, removing
            iterative reviewer feedback substantially reduces improvement. This
            suggests that the gains arise from the iterative scientist-reviewer
            process rather than from the scientist alone.
          </p>
        </div>

        <Figure
          n="Figure 3"
          caption={
            <>
              Under our reviewer, the human-initialized condition improves
              substantially more than autonomous self-revision with a fixed
              prompt. Stanford Reviewer, applied only to the human-initialized
              trajectory, also assigns higher scores to later revisions.
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

        <div className="prose" style={{ marginTop: "1.8rem" }}>
          <p>
            In the human-initialized condition, our reviewer scores the
            original papers at 5.37 on average and the best revision for each
            paper at 6.53, a gain of +1.16 points. Under the same best-revision
            aggregation, Stanford Reviewer increases from 5.50 to 6.15, a gain
            of +0.65 points. At their best revision, all 30 papers score at
            least 6 under our reviewer, compared with only 12 at V0.
          </p>
          <p>
            We also evaluate the AI-initialized condition, in which our
            reviewer generates the initial feedback on V0 instead of using the
            venue reviews. This condition consistently outperforms autonomous
            self-revision and converges to nearly the same final score as the
            human-initialized condition after five revision rounds.
          </p>
          <p>
            To test whether the improvements in our main human-initialized
            condition are specific to our reviewer, we separately evaluate
            every saved version from that condition using Stanford Reviewer.
            We do not run Stanford Reviewer on the AI-initialized or autonomous
            self-revision conditions, and its evaluation-only reviews are never
            provided to the scientist. Although Stanford Reviewer assigns
            different absolute scores, it observes the same upward trajectory
            across the human-initialized revisions, indicating that the
            improvements produced by the AppliedScientist with AI Reviewer
            reflect genuine gains in paper quality rather than optimization
            towards a single reviewer.
          </p>
        </div>

        <Detail summary="Score thresholds, per-domain results, and cost" count="Figs. 3–7">
          <div className="slope-pair">
            <Figure n="Figure 4a" caption="Number of papers scoring at or above each threshold, before revision (V0) and at each paper's best revision (Vmax), out of 30 papers — our reviewer.">
              <ThresholdSlope rows={thresholds.ours} n={thresholds.n} />
            </Figure>
            <Figure n="Figure 4b" caption="The same thresholds under Stanford Reviewer, out of 30 papers.">
              <ThresholdSlope rows={thresholds.stanford} n={thresholds.n}
                color="var(--s-stanford)" />
            </Figure>
          </div>

          <p className="detail-kicker">Per-domain results</p>
          <DomainGrid />
          <p className="detail-note">
            The upward pattern appears in every represented domain rather than
            being confined to one research area.
          </p>

          <p className="detail-kicker">Computation cost</p>
          <p className="detail-note">
            Each revision run for a paper takes approximately 9 hours on a
            single RTX Pro 6000 (96 GB GPU) and includes five rounds of
            reviewer feedback, scientist tool use, experiment execution, and
            literature search. The total cost is approximately ${stats.cost_per_paper_usd} per
            paper, with most of the expense arising from the LLM API used
            during scientist&rsquo;s execution and experimentation rather than
            review generation. Evaluating the full benchmark of 30 papers
            required roughly ${stats.total_cost_usd} and {stats.total_gpu_hours} GPU-hours.
            This computational budget was the primary factor limiting the size
            of our evaluation set. Running the same protocol on 100 papers
            would require approximately ${stats.cost_100papers_usd} and {stats.gpu_hours_100papers} GPU-hours,
            which was beyond the resources available for this study.
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
            To better understand the limits of autonomous revision, we ask a
            simple question: What kinds of reviewer criticisms can revision
            actually resolve?
          </>
        }
      >
        <div className="prose">
          <p>
            To answer this, we first analyse why papers are rejected. We
            randomly sample {taxonomy.n} rejected ICLR papers and use Gemini
            3.1 Pro to classify every reviewer criticism as either an
            execution issue (e.g., missing baselines, weak evidence,
            unsupported claims, or unclear writing) or an idea issue (e.g.,
            insufficient novelty or significance). Execution issues account for
            {taxonomy.execution}% of rejections, idea-related issues for
            {taxonomy.idea}%, and the remaining {taxonomy.both}% involve both.
          </p>
          <p>
            On our evaluation set, AppliedScientist resolves {stats.exec_resolved} execution
            weaknesses ({stats.exec_rate}%), but only {stats.idea_resolved} idea
            weaknesses ({stats.idea_rate}%). Revision consistently succeeds on
            suggestions that require stronger evidence via additional
            experiments, baselines, ablations, or clearer presentation, but
            rarely changes reviewer judgements about novelty or significance.
          </p>
        </div>

        <Figure
          n="Figure 5"
          caption={
            <>
              Resolution rate of AI-suggested weaknesses by AppliedScientist.
              Most empirical weaknesses are resolved, whereas only 2 of 18
              idea-related weaknesses (11.1%) are addressed, suggesting that
              iterative revision is more effective at improving research
              execution than altering the core scientific idea.
            </>
          }
        >
          <WeaknessBars categories={ladder.categories} />
        </Figure>

        <p className="finding">
          Our reviewer retains novelty-related objections until the final
          round, often citing prior work to justify them. Once the contribution
          itself is judged to lack novelty, additional evidence seldom changes
          the outcome. Our results therefore suggest that autonomous revision
          is well suited to strengthening the evidence behind an idea, but
          improving the idea itself requires returning to the ideation stage
          rather than continuing the revision loop.
        </p>

        <Detail summary="Verifying the novelty objections" count="1 check">
          <p className="detail-kicker">Are the objections grounded?</p>
          <p className="detail-note">
            The low idea-resolution rate raises the possibility that some
            novelty-related objections arise from unsupported or hallucinated
            comparisons rather than genuine prior work. To investigate this, we
            examined every idea-related objection that remained in the final
            review (17 objections across 13 papers). For each objection, we
            extracted the cited prior work, verified the references against the
            arXiv API, and manually inspected each cited paper to determine
            whether it was relevant to the submitted work and whether it
            supported the novelty claim made by the reviewer.
          </p>
          <NoveltyTable />
          <p className="detail-note">
            Across the 14 verifiable objections, all 23 cited papers were found
            on arXiv, and our manual inspection confirmed that the cited works
            were relevant to the corresponding submissions and supported the
            reviewer&rsquo;s novelty objection.
          </p>
        </Detail>
      </Section>

      {/* ---------------- 05 · individual papers ---------------- */}
      <Section
        id="papers"
        no="05"
        name="Individual papers"
        title="Ten papers, in detail"
        lede={
          <>
            The appendix reports detailed results for ten randomly selected
            papers from the 30-paper evaluation set. For each paper, we report
            the human reviewer average from the original submission, the number
            of execution- and idea-related weaknesses resolved, the score
            trajectory assigned by our reviewer across revision rounds, the
            best score achieved during revision, and the corresponding change
            in Stanford Reviewer score.
          </>
        }
      >
        <Figure
          n="Figure 6"
          caption="Representative results for ten randomly selected papers."
        >
          <PaperGrid />
        </Figure>

        <h3 className="subhead" style={{ marginTop: "3rem" }}>
          Example review and annotated manuscript
        </h3>
        <ExampleReview />
      </Section>
    </main>
  );
}
