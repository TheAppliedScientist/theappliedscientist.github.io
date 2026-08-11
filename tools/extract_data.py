#!/usr/bin/env python3
"""
Extract every number the website shows into typed JSON.

RULE (per project owner): values must match the paper exactly —
Paper/AnonymousSubmission2027.tex and the figures actually included in the
submission (Paper/Figures/*.pdf, verified by rendering them). Local compiled
JSONs and RAW_RESULTS.md are an older 19-paper run and are NOT used, except
fig3b_categories.json whose contents were verified identical to the
submission's weakness-resolution figure.

Outputs into website/app/data/. Re-run after any paper data change:

  python3 tools/extract_data.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PAPER = os.path.join(ROOT, "Paper")
OUT = os.path.join(ROOT, "website", "app", "data")
os.makedirs(OUT, exist_ok=True)


def load(name):
    with open(os.path.join(PAPER, "compiled", name), encoding="utf-8") as fh:
        return json.load(fh)


def dump(name, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=1, ensure_ascii=False)
    print(f"wrote {path}")


# ---------------------------------------------------------------- headline
# All values trace to Paper/AnonymousSubmission2027.tex (tagged per entry).
dump("key_stats.json", {
    "papers": 30,                    # tab:benchmark (25 rejected + 5 borderline)
    "rejected": 25,
    "borderline": 5,
    "domains": 5,
    "v0_mean_ours": 5.37,            # §Score Improvements
    "vmax_mean_ours": 6.53,
    "delta_ours": 1.16,
    "v0_mean_stanford": 5.50,
    "vmax_mean_stanford": 6.15,
    "delta_stanford": 0.65,
    "exec_resolved": "128/150",      # abstract / §What Can Revision Improve?
    "exec_rate": 85.3,
    "idea_resolved": "2/18",
    "idea_rate": 11.1,
    "ge6_v0": "12/30",               # tab:buckets
    "ge6_vmax": "30/30",
    "ge7_v0": "3/30",
    "ge7_vmax": "14/30",
    "stanford_ge6_v0": "3/30",
    "stanford_ge6_vmax": "19/30",
    "cost_per_paper_usd": 65,        # conclusion / appendix B.5
    "hours_per_round": 9,            # §Setup
    "reviewer_papers": 650,          # §Reviewer Evaluation
    "alignment_rho": 0.571,          # DeepSeek V4 Flash backbone
    "decision_agreement": 76.2,
    "arxiv_index": "~1,000,000",     # appendix A.1
    "citations_verified": "23/23",   # appendix B.4
})

# ------------------------------------------------- average score trajectory
# Main-paper figure fig:single_plot (Figures/avg_trajectory.pdf, rendered and
# verified 2026-08-05): THREE lines, rounds 0..5. Values match the figure
# generator's literals, which were re-verified against the rendered PDF.
# The self-revision line is shown exactly as the paper shows it.
dump("avg_trajectory.json", {
    "rounds": [0, 1, 2, 3, 4, 5],
    "series": [
        {"key": "human", "label": "Human-initialized (our reviewer)",
         "values": [5.37, 4.84, 5.32, 5.68, 6.00, 6.17]},
        {"key": "stanford", "label": "Stanford Reviewer (independent)",
         "values": [5.50, 5.13, 5.37, 5.55, 5.83, 5.92]},
        {"key": "self", "label": "AppliedScientist with a self-review prompt",
         "values": [None, 3.91, 4.06, 4.17, 4.30, 4.38],
         "note": "Same scientist, no reviewer feedback."},
    ],
})

# Appendix figure fig:avg (Figures/avg_trajectory_aiinit.pdf, verified): adds
# the AI-initialized condition. Text: it "converges to nearly the same final
# score as the human-initialized condition after five revision rounds."
dump("aiinit_trajectory.json", {
    "rounds": [0, 1, 2, 3, 4, 5],
    "series": [
        {"key": "human", "label": "Human-initialized",
         "values": [5.37, 4.84, 5.32, 5.68, 6.00, 6.17]},
        {"key": "ai", "label": "AI-initialized",
         "values": [None, 4.70, 5.18, 5.25, 5.68, 5.70]},
        {"key": "self", "label": "AppliedScientist with a self-review prompt",
         "values": [None, 3.91, 4.06, 4.17, 4.30, 4.38]},
    ],
})

# --------------------------------------------------- weakness ladder (E2)
# Verified identical to the submission figure Figures/weakness_resolution.pdf
# (100/94/86/71/63/11, idea 2/18 = 11.1% — matches tex §What Can Revision
# Improve?). This is the one compiled JSON whose contents match the paper.
_fig3b = load("fig3b_categories.json")
cats = _fig3b["categories"]
dump("weakness_ladder.json", {
    "categories": [
        {"name": c["name"], "resolved": c["good"], "total": c["n"],
         "rate": round(c["rate"] * 100, 1), "ci": [round(x * 100, 1) for x in c["ci"]],
         "kind": c["kind"]}
        for c in cats
    ],
    "note": _fig3b["note"],
})

# --------------------------------------------------------- score thresholds
# tab:buckets in the submission tex.
dump("thresholds.json", {
    "ours": [
        {"threshold": 5, "v0": 24, "vmax": 30},
        {"threshold": 6, "v0": 12, "vmax": 30},
        {"threshold": 7, "v0": 3, "vmax": 14},
    ],
    "stanford": [
        {"threshold": 5.0, "v0": 28, "vmax": 30},
        {"threshold": 5.75, "v0": 8, "vmax": 25},
        {"threshold": 6.0, "v0": 3, "vmax": 19},
    ],
    "n": 30,
})

# ----------------------------------------------- rejection taxonomy (500)
# §What Can Revision Improve?: Gemini 3.1 Pro classification of 500
# randomly sampled rejected ICLR papers.
dump("taxonomy.json", {
    "execution": 48, "idea": 35, "both": 17, "n": 500,
})

# --------------------------------------------- reviewer benchmark (table)
# tab:judge_comparison — pairwise win/loss (%) of our reviewer vs each
# baseline across four judged dimensions; remainder are ties.
DIMS = ["technical", "constructive", "analytical", "significance"]
def row(name, vals):
    return {"name": name, "dims": dict(zip(DIMS, [{"win": w, "loss": l} for w, l in vals]))}

dump("judge_comparison.json", {
    "n_papers": 650,
    "dimensions": ["Technical accuracy", "Constructive value",
                   "Analytical depth", "Significance assessment"],
    "groups": [
        {"group": "Fine-tuned", "rows": [
            row("CycleReviewer-8B",  [(100, 0), (100, 0), (99, 1), (100, 0)]),
            row("CycleReviewer-70B", [(99.2, 0.4), (100, 0), (100, 0), (99.6, 0.2)]),
            row("DeepReviewer-7B",   [(96.5, 2.1), (99.4, 0.4), (99.2, 0.6), (97.8, 1.1)]),
            row("DeepReviewer-14B",  [(91.2, 3.7), (96.0, 2.2), (94.7, 2.6), (97.9, 1.3)]),
        ]},
        {"group": "LLM", "rows": [
            row("Gemini 3.1 Flash",  [(60.6, 21.5), (88.2, 6.6), (75.1, 9.9), (74.2, 4.6)]),
            row("Gemini 3.1 Pro",    [(62.2, 11.7), (83.9, 6.5), (71.6, 9.0), (70.7, 5.1)]),
            row("DeepSeek V4 Flash", [(74.3, 10.9), (92.5, 7.1), (78.9, 7.4), (82.3, 3.9)]),
            row("DeepSeek V4 Pro",   [(78.6, 7.5), (96.5, 5.0), (79.2, 5.1), (80.4, 3.2)]),
        ]},
        {"group": "LLM with search", "rows": [
            row("Gemini 3.1 Flash",  [(55.8, 12.8), (85.7, 8.5), (70.5, 10.2), (72.8, 6.3)]),
            row("Gemini 3.1 Pro",    [(56.3, 14.6), (80.1, 7.6), (68.4, 8.8), (66.9, 5.8)]),
            row("DeepSeek V4 Flash", [(71.4, 15.3), (89.4, 7.0), (76.9, 7.5), (80.1, 5.0)]),
            row("DeepSeek V4 Pro",   [(72.9, 17.6), (93.1, 8.5), (73.8, 8.1), (79.7, 6.4)]),
        ]},
        {"group": "Multi-agent with search", "rows": [
            row("Agent Review (Gemini 3.1 Pro)",    [(52.1, 18.9), (89.5, 10.4), (60.7, 10.8), (65.6, 7.9)]),
            row("Agent Review (DeepSeek V4 Flash)", [(61.7, 20.5), (95.3, 11.2), (72.8, 11.6), (68.5, 8.7)]),
            row("AI Scientist v2 (Gemini 3.1 Pro)", [(50.2, 22.3), (84.5, 12.1), (58.5, 12.5), (62.2, 9.5)]),
            row("AI Scientist v2 (DeepSeek V4 Flash)", [(56.7, 24.1), (94.2, 13.2), (88.3, 13.6), (67.1, 10.3)]),
            row("DeepReviewer-v2 (StepFun 3.5 Flash)", [(63.4, 16.8), (95.6, 15.0), (91.8, 15.4), (77.3, 11.6)]),
            {"name": "Stanford Agent Reviewer",
             "note": "Evaluated on 100 papers (web-interface access only).",
             "dims": dict(zip(DIMS, [{"win": w, "loss": l} for w, l in
                            [(48.5, 24.8), (44.3, 45.7), (52.7, 14.0), (54.6, 10.8)]]))},
        ]},
    ],
})

# ------------------------------------------------------- score alignment
# fig:alignment (main) + appendix A.2 — Spearman ρ with mean human rating,
# agreement with venue accept/reject decision.
dump("alignment.json", {
    "n_papers": 650,
    "systems": [
        {"name": "Ours (DeepSeek V4 Flash)", "rho": 0.571, "agreement": 76.2, "ours": True},
        {"name": "Ours (Kimi K3)",           "rho": 0.522, "agreement": 72.8, "ours": True},
        {"name": "Stanford Reviewer",        "rho": 0.510, "agreement": 71.1, "ours": False},
        {"name": "Ours (MiniMax M2.7)",      "rho": 0.480, "agreement": 67.2, "ours": True},
    ],
})

# ------------------------------------------------- per-paper trajectories
# Appendix tab:perpaper (app:perpaper) — transcribed verbatim from
# Appendix.tex: "detailed results for ten randomly selected papers from the
# 30-paper evaluation set". Rounds are the five revision scores V1..V5.
dump("papers.json", {
    "note": "Ten randomly selected papers from the 30-paper evaluation set, as reported in Appendix B.2 of the paper.",
    "papers": [
        {"id": 1,  "domain": "NLP",   "label": "exec",  "human_avg": 4.00,
         "exec_fixed": "5/7", "idea_fixed": "0/1", "v0": 4, "rounds": [6, 6, 7, 6, 6], "vmax": 7,
         "stanford_v0": 5.2, "stanford_vmax": 5.8},
        {"id": 2,  "domain": "NLP",   "label": "mixed", "human_avg": 2.00,
         "exec_fixed": "7/8", "idea_fixed": "0/1", "v0": 5, "rounds": [5, 4, 4, 6, 5], "vmax": 6,
         "stanford_v0": 4.3, "stanford_vmax": 6.9},
        {"id": 3,  "domain": "NLP",   "label": "idea",  "human_avg": 2.00,
         "exec_fixed": "5/6", "idea_fixed": "1/3", "v0": 5, "rounds": [6, 7, 4, 6, 6], "vmax": 7,
         "stanford_v0": 5.2, "stanford_vmax": 6.3},
        {"id": 4,  "domain": "NLP",   "label": "exec",  "human_avg": 6.00,
         "exec_fixed": "4/7", "idea_fixed": "0/1", "v0": 6, "rounds": [4, 4, 6, 6, 4], "vmax": 6,
         "stanford_v0": 6.8, "stanford_vmax": 6.5},
        {"id": 5,  "domain": "CV",    "label": "idea",  "human_avg": 2.00,
         "exec_fixed": "7/7", "idea_fixed": "0/1", "v0": 5, "rounds": [4, 3, 6, 7, 6], "vmax": 7,
         "stanford_v0": 5.6, "stanford_vmax": 6.1},
        {"id": 6,  "domain": "CV",    "label": "exec",  "human_avg": 3.00,
         "exec_fixed": "4/6", "idea_fixed": "0/1", "v0": 4, "rounds": [5, 5, 6, 4, 6], "vmax": 6,
         "stanford_v0": 5.6, "stanford_vmax": 5.4},
        {"id": 7,  "domain": "Graph", "label": "mixed", "human_avg": 5.67,
         "exec_fixed": "3/5", "idea_fixed": "0/1", "v0": 6, "rounds": [6, 7, 7, 7, 6], "vmax": 7,
         "stanford_v0": 5.2, "stanford_vmax": 6.9},
        {"id": 8,  "domain": "Graph", "label": "exec",  "human_avg": 5.00,
         "exec_fixed": "8/10", "idea_fixed": "0/1", "v0": 5, "rounds": [3, 6, 4, 5, 5], "vmax": 6,
         "stanford_v0": 5.2, "stanford_vmax": 5.2},
        {"id": 9,  "domain": "TS",    "label": "mixed", "human_avg": 5.40,
         "exec_fixed": "9/9", "idea_fixed": "0/2", "v0": 7, "rounds": [5, 5, 7, 4, 7], "vmax": 7,
         "stanford_v0": 5.2, "stanford_vmax": 5.8},
        {"id": 10, "domain": "RL",    "label": "mixed", "human_avg": 4.00,
         "exec_fixed": "9/10", "idea_fixed": "0/1", "v0": 6, "rounds": [6, 4, 7, 6, 7], "vmax": 7,
         "stanford_v0": 5.2, "stanford_vmax": 6.5},
    ],
})

# ---------------------------------------------------- optimization vignette
# Verified against einsteinarena.com leaderboard (2026-08-05) and
# ai_scientist_optimization/results/CERTIFICATE_k17_S0.31807400.json.
dump("einstein.json", {
    "problem": "Uncertainty principle (upper bound), minimization",
    "our_score": 0.31807400,
    "our_rank": 3,
    "previous_best": 0.328271,
    "previous_best_by": "AlphaEvolve",
    "abs_delta_vs_previous": 0.010197,
    "rel_delta_pct": 3.1,
    "gap_to_first": 0.000002,
    "leaderboard_url": "https://einsteinarena.com/problems/uncertainty-principle",
    "certificate": "k = 17 double roots, exact-verified S = 0.31807399514546",
})
