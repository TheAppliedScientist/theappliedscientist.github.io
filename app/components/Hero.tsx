import { site } from "../site.config";
import stats from "../data/key_stats.json";

/**
 * Hero — how the paper opens: title, authors, the abstract's own words as
 * the lead, and the three numbers that are the result.
 */
export default function Hero() {
  return (
    <div className="hero">
      <h1 className="hero-title">
        AppliedScientist: Automated Scientific Revision Through Iterative
        AI Reviewing
      </h1>

      <p className="hero-authors">
        {site.authors.map((a, i) => (
          <span key={a.name}>
            {i > 0 && <span className="author-sep">, </span>}
            <a href={a.url}>{a.name}</a>
          </span>
        ))}
      </p>

      <p className="hero-lead">
        A review is only useful if acting on it leads to a measurable
        improvement in the paper. We present AppliedScientist, a closed-loop
        system that couples an autonomous AI scientist with an AI reviewer,
        and evaluate it by iteratively revising rejected papers from a range
        of research subfields.
      </p>

      <div className="hero-links">
        <a href={site.links.paper}>Paper (PDF)</a>
        <a href="/exhibits/idea09_full_annotated.pdf">Annotated manuscript</a>
        <span className="soon">Code &amp; data released on publication</span>
      </div>

      <div className="hero-stats">
        <div className="stat">
          <span className="stat-value">
            {stats.v0_mean_ours} &rarr; {stats.vmax_mean_ours}
          </span>
          <span className="stat-label">
            mean reviewer score, original &rarr; best revision
          </span>
          <span className="stat-sub">{stats.papers} papers &middot; 5 rounds</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.exec_rate}%</span>
          <span className="stat-label">execution-related weaknesses resolved</span>
          <span className="stat-sub">{stats.exec_resolved}</span>
        </div>
        <div className="stat" data-flag="true">
          <span className="stat-value">{stats.idea_rate}%</span>
          <span className="stat-label">idea-related weaknesses resolved</span>
          <span className="stat-sub">{stats.idea_resolved}</span>
        </div>
      </div>

      <div className="abstract-block">
        <span className="label">Abstract</span>
        <p>
          Automated reviewing systems are increasingly evaluated based on the
          quality of the reviews they produce. Yet a review is only useful if
          acting on it leads to a measurable improvement in the paper. We
          compare three revision settings: one initialized with the original
          venue reviews, one initialized with AI-generated reviews, and
          autonomous self-revision using the same fixed prompt in every
          round. Because the reviewer both guides and evaluates the revision,
          we also assess the human-initialized revisions using Stanford
          Reviewer as an independent evaluator. Reviewer-guided revision
          consistently improves more than fixed-prompt self-revision, and
          Stanford Reviewer also assigns higher scores to later revisions.
          AppliedScientist resolves 128 of 150 execution-related weaknesses
          (85.3%), but only 2 of 18 idea-related weaknesses (11.1%),
          suggesting that iterative revision is effective at improving
          experiments and implementation, but rarely changes concerns about
          novelty or significance.
        </p>
      </div>
    </div>
  );
}
