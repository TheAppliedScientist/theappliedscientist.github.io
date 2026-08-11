import Sparkline from "./figures/Sparkline";

/**
 * RunRecords — two runs with the reviewer text that drove them. Quoted as
 * written, with the version judged and the score assigned, so a reader can
 * see what content received what score.
 */
export default function RunRecords() {
  return (
    <div className="runs">
      {/* -------- run 1 -------- */}
      <article className="run">
        <header className="run-head">
          <h3 className="run-title">Backdoor attacks on ICL vision transformers</h3>
          <span className="run-meta">Security · V₀ 4 → best 7</span>
        </header>
        <div className="run-spark">
          <Sparkline v0={4} rounds={[4, 5, 6, 7, 7]} />
        </div>
        <p>
          Rejected on the strength of the evidence rather than the claim. Our
          reviewer named the sample size behind the defense results:
        </p>
        <blockquote className="review">
          <p>
            &ldquo;CCS, STRIP, activation clustering, and spectral signatures all
            report AUC/accuracy 1.00 on the compromised model, but on only 15
            held-out LoL test queries. An AUC computed over ordered pairs of 15
            queries cannot distinguish 1.00 from, say, 0.99.&rdquo;
          </p>
          <cite>Our reviewer, on the revised manuscript</cite>
        </blockquote>
        <p>
          The scientist re-ran the evaluation on the native task pipelines the
          reviews named, corrected a metric that had conflated the attack with the
          trigger&rsquo;s occlusion, and rewrote the measurement section around
          the corrected numbers.
        </p>
        <blockquote className="review">
          <p>
            &ldquo;The occlusion-confounder analysis is the strongest part… The
            paper explicitly corrects its own earlier evaluation, which is rare
            and commendable.&rdquo;
          </p>
          <cite>
            Our reviewer, on the revised manuscript · overall 6/10, decision:
            accept
          </cite>
        </blockquote>
        <p className="run-links">
          <a href="/exhibits/idea09_original_score4.pdf">Original, score 4</a>
          <a href="/exhibits/idea09_revised.pdf">Revised, score 7</a>
          <a href="/exhibits/idea09_full_annotated.pdf">Annotated manuscript</a>
        </p>
      </article>

      {/* -------- run 2 -------- */}
      <article className="run">
        <header className="run-head">
          <h3 className="run-title">Per-sample scaling for time-series forecasting</h3>
          <span className="run-meta">Time series · V₄ 7 → V₅ 4</span>
        </header>
        <div className="run-spark">
          <Sparkline v0={5} rounds={[5, 6, 7, 7, 4]} />
        </div>
        <p>
          The run rose to 7 over four rounds. Then the reviewer caught a number
          that had never been computed:
        </p>
        <blockquote className="review">
          <p>
            &ldquo;The reported improvement is stated against a baseline whose
            value appears in the text but in none of the result files. It is a
            placeholder, and every comparison that depends on it is
            unsupported.&rdquo;
          </p>
          <cite>Our reviewer, on V₄</cite>
        </blockquote>
        <p>
          The scientist ran the missing control. It showed the gains largely
          survived without the paper&rsquo;s proposed mechanism — evidence against
          the paper&rsquo;s own explanation of its results. The final version
          reported that finding instead of removing it, and the score fell to 4.
        </p>
        <blockquote className="review">
          <p>
            &ldquo;An unflinching presentation of negative results. The paper is
            now accurate and its central contribution is substantially
            weaker.&rdquo;
          </p>
          <cite>Our reviewer, on V₅ · overall 7/10 on presentation</cite>
        </blockquote>
        <p className="detail-note">
          We report this run because a scientist that reports a disconfirming
          control loses score for doing so. Both behaviours are visible in one
          trajectory.
        </p>
      </article>
    </div>
  );
}
