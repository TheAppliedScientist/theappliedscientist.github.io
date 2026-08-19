/* ============================================================
   Site-wide configuration.
   TODO(launch): replace the withheld author block and add
   code/data URLs before going public.
   ============================================================ */

export const site = {
  name: "AppliedScientist",
  title:
    "AppliedScientist: Automated Scientific Revision Through Iterative AI Reviewing",
  url: "https://theappliedscientist.github.io",
  description:
    "A closed-loop system in which an AI scientist revises rejected papers — code, experiments, and manuscript — guided by fresh reviews from an independently benchmarked AI reviewer. Evaluated on 30 ICLR papers across five domains.",
  authors: [
    { name: "Vidushee Vats", url: "https://koookieee.github.io" },
    { name: "Karun Sharma", url: "https://anonymous-atom.github.io" },
    { name: "Shengzhi Li", url: "https://lishengzhi.com" },
    { name: "Shichao Pei", url: "https://scpei.github.io" },
  ],
  links: {
    paper: "/exhibits/AnonymousSubmission2027.pdf",
    // TODO(launch): code + data release URLs
    code: "",
    data: "",
  },
  annotatedPapers: [
    {
      role: "Headline paper",
      title:
        "Context is the Key: Backdoor Attacks for In-Context Learning with Vision Transformers",
      href: "/exhibits/annotated-context-is-the-key.pdf",
    },
    {
      role: "Persuasion and vigilance",
      title:
        "Under the Influence: Quantifying Persuasion and Vigilance in Large Language Models",
      href: "/exhibits/annotated-persuasion-and-vigilance.pdf",
    },
    {
      role: "Memorization and interpolation",
      title:
        "Memorization or Interpolation? What Perturbation Sensitivity Actually Detects in Language Models",
      href: "/exhibits/annotated-memorization-or-interpolation.pdf",
    },
  ],
  release: {
    code: "Released on publication",
    data: "Released on publication",
  },
} as const;
