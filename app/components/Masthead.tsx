import { site } from "../site.config";

const NAV = [
  { href: "#system", label: "Revision loop" },
  { href: "#reviewer", label: "Reviewer evaluation" },
  { href: "#results", label: "Results" },
  { href: "#finding", label: "What revision improves" },
  { href: "#papers", label: "Examples" },
];

/**
 * Masthead — a running head: system name, section anchors, and the one
 * action a visitor is most likely here for (the PDF).
 */
export default function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <a href="#top" className="masthead-name" aria-label="AppliedScientist, back to top">
          <span className="masthead-mark" aria-hidden="true">A/S</span>
          <span>AppliedScientist</span>
        </a>
        <nav className="masthead-nav" aria-label="Sections">
          {NAV.map((n, index) => (
            <a key={n.href} href={n.href}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="masthead-actions">
          {site.links.code ? <a href={site.links.code}>Code</a> : <span title={site.release.code}>Code</span>}
          <a className="masthead-paper" href={site.links.paper}>Paper <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </header>
  );
}
