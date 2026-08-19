import { site } from "../site.config";
import stats from "../data/key_stats.json";
import RevisionArtifact from "./figures/RevisionArtifact";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-copy">
        <h1 className="hero-title">{site.title}</h1>
        <p className="hero-authors">
          {site.authors.map((author) => (
            <span key={author.name}>
              <a href={author.url}>{author.name}</a>
            </span>
          ))}
        </p>
        <p className="hero-question">Can this process of scientific review and revision itself be automated?</p>
        <p className="hero-lead">We present AppliedScientist, a closed-loop system that couples an autonomous AI scientist with an AI reviewer, and evaluate it by iteratively revising rejected papers from a range of research subfields.</p>
        <div className="hero-links" aria-label="Project links">
          <a className="primary-link" href={site.links.paper}>Read the paper <span aria-hidden="true">↗</span></a>
          {site.links.code ? <a href={site.links.code}>Code</a> : <span>Code · {site.release.code}</span>}
        </div>
      </div>
      <RevisionArtifact delta={stats.delta_ours} externalDelta={stats.delta_stanford} />
    </header>
  );
}
