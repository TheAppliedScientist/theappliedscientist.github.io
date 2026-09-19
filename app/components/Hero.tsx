import { site } from "../site.config";
import stats from "../data/key_stats.json";
import AuthorPreviews from "./AuthorPreviews";
import RevisionArtifact from "./figures/RevisionArtifact";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-copy">
        <h1 className="hero-title">{site.title}</h1>
        <AuthorPreviews authors={site.authors} />
        <p className="hero-question">Can this process of scientific review and revision itself be automated?</p>
        <p className="hero-lead">We present AppliedScientist, a closed-loop system that couples an autonomous AI scientist with an AI reviewer, and evaluate it by iteratively revising rejected papers from a range of research subfields.</p>
        <div className="hero-links" aria-label="Project links">
          <a className="primary-link" href={site.links.paper}>Read the paper <span aria-hidden="true">↗</span></a>
          <a className="github-link" href={site.links.code}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
            </svg>
            Code
          </a>
        </div>
      </div>
      <RevisionArtifact
        delta={stats.delta_ours}
        externalDelta={stats.delta_stanford}
        executionRate={stats.exec_rate}
        executionResolved={stats.exec_resolved}
      />
    </header>
  );
}
