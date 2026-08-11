import { site } from "../site.config";
import stats from "../data/key_stats.json";

/**
 * Hero — how the paper opens: venue, title, the question the work turns
 * on, and the three numbers that are the result. Nothing decorative.
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
        improvement in the paper. We tested that directly: an AI scientist
        revised {stats.papers} rejected and borderline ICLR papers &mdash;
        code, experiments, and manuscript &mdash; guided at each round by a
        fresh review from an AI reviewer we benchmarked first.
      </p>

      <div className="hero-links">
        <a href={site.links.paper}>Paper (PDF)</a>
        <a href="/exhibits/idea09_full_annotated.pdf">Annotated revision</a>
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
          <span className="stat-label">execution weaknesses resolved</span>
          <span className="stat-sub">{stats.exec_resolved}</span>
        </div>
        <div className="stat" data-flag="true">
          <span className="stat-value">{stats.idea_rate}%</span>
          <span className="stat-label">idea weaknesses resolved</span>
          <span className="stat-sub">{stats.idea_resolved}</span>
        </div>
      </div>
    </div>
  );
}
