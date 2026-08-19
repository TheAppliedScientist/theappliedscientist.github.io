"use client";

import { useEffect, useState } from "react";
import { site } from "../site.config";

const NAV = [
  { href: "#system", label: "Revision loop", short: "Loop" },
  { href: "#reviewer", label: "Reviewer evaluation", short: "Reviewer" },
  { href: "#results", label: "Results", short: "Results" },
  { href: "#finding", label: "What revision improves", short: "Limits" },
  { href: "#artifacts", label: "Annotated papers", short: "Papers" },
];

/**
 * Masthead — a running head: system name, section anchors, and the one
 * action a visitor is most likely here for (the PDF).
 */
export default function Masthead() {
  const [activeSection, setActiveSection] = useState("");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const sections = NAV.map((item) => document.querySelector<HTMLElement>(item.href)).filter(Boolean) as HTMLElement[];
    let frame = 0;
    const update = () => {
      frame = 0;
      const readingLine = window.scrollY + window.innerHeight * 0.28;
      const current = [...sections].reverse().find((section) => section.offsetTop <= readingLine);
      setActiveSection(current?.id ?? "");
      const hero = document.querySelector<HTMLElement>("#top");
      const header = document.querySelector<HTMLElement>(".masthead");
      setPastHero(Boolean(hero && hero.getBoundingClientRect().bottom <= (header?.offsetHeight ?? 0)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`masthead${pastHero ? " is-detached" : ""}`}>
      <div className="masthead-inner">
        <a href="#top" className="masthead-name" aria-label="AppliedScientist, back to top">
          <span className="masthead-mark" aria-hidden="true">A/S</span>
          <span>AppliedScientist</span>
        </a>
        <nav className="masthead-visible-nav" aria-label="Sections">
          {NAV.map((item, index) => {
            const active = activeSection === item.href.slice(1);
            return (
              <a key={item.href} href={item.href} className={active ? "is-active" : undefined}
                aria-current={active ? "location" : undefined}>
                <span className="masthead-nav-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="masthead-nav-full">{item.label}</span>
                <span className="masthead-nav-short">{item.short}</span>
              </a>
            );
          })}
        </nav>
        <a className="masthead-paper" href={site.links.paper}>Read paper <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
