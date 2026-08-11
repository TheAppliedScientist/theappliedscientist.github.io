import Link from "next/link";
import { site } from "../site.config";

const NAV = [
  { href: "#system", label: "System" },
  { href: "#reviewer", label: "Reviewer" },
  { href: "#results", label: "Results" },
  { href: "#finding", label: "Finding" },
  { href: "#papers", label: "Papers" },
];

/**
 * Masthead — a running head: system name, section anchors, and the one
 * action a visitor is most likely here for (the PDF).
 */
export default function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link href="/" className="masthead-name">
          AppliedScientist
        </Link>
        <nav className="masthead-nav" aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="masthead-cta" href={site.links.paper}>
          Paper (PDF)
        </a>
      </div>
    </header>
  );
}
