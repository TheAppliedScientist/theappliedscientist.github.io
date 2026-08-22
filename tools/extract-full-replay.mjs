#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const source = process.argv[2];
const destination = process.argv[3] ?? "app/data/persuasion-full-replay.json";

if (!source) {
  console.error("Usage: node tools/extract-full-replay.mjs <trajectory.json> [output.json]");
  process.exit(1);
}

const trajectory = JSON.parse(fs.readFileSync(source, "utf8"));

const phases = [
  { id: "orient", label: "Read the rejected paper", short: "Orient", from: 1, to: 40 },
  { id: "build", label: "Build the evaluation", short: "Build", from: 41, to: 96 },
  { id: "experiment", label: "Run experiments", short: "Experiment", from: 97, to: 321 },
  { id: "v1", label: "Write and review V₁", short: "V₁", from: 322, to: 354 },
  { id: "v2", label: "Respond and review V₂", short: "V₂", from: 355, to: 435 },
  { id: "v3", label: "Add controls; review V₃", short: "V₃", from: 436, to: 496 },
  { id: "v4", label: "Run ablations; review V₄", short: "V₄", from: 497, to: 566 },
  { id: "v5", label: "Run follow-up; review V₅", short: "V₅", from: 567, to: 610 },
];

const phaseFor = (step) => phases.find((phase) => step >= phase.from && step <= phase.to)?.id ?? "orient";

const clean = (value = "") => String(value)
  .replace(/sk-[^\s'\"]+/g, "[redacted]")
  .replace(/^(OPENAI|ANTHROPIC|GEMINI|S2|HF):.*$/gim, "$1: [redacted]")
  .replace(/https?:\/\/[^\s'\"]*(?:pincc|api\.)[^\s'\"]*/gi, "[API URL redacted]")
  .replace(/\b(?:ANTHROPIC|OPENAI|GEMINI|S2|HF)_(?:API_KEY|TOKEN|BASE_URL)\b/g, "[credential variable redacted]")
  .replace(/\b((?:api[_-]?key|token|password))\s*=\s*['\"]?[^\s'\"]+/gi, "$1=[redacted]")
  .replace(/\/home\/[^/\s]+/g, "/home/researcher")
  .replace(/\[metadata\][\s\S]*$/i, "")
  .replace(/\n\[stdout\][\s\S]*$/i, "")
  .trim();

const truncate = (value, limit) => {
  const text = clean(value);
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}\n…` : text;
};

const classify = (tool, description, command) => {
  const haystack = `${description} ${command}`.toLowerCase();
  if (/submit.*review|reviewer_communications|read .*scores/.test(haystack)) return "review";
  if (/figure|plot|matplotlib|pdftoppm/.test(haystack)) return "figure";
  if (/experiment|result|metric|ablation|trivia|sokoban/.test(haystack)) return "experiment";
  if (/compile|latex|template\.tex|paper|manuscript|rebuttal|citation|related work/.test(haystack)) return "manuscript";
  if (tool === "Write" || tool === "Edit") return "edit";
  if (tool === "Read") return "inspect";
  if (tool.startsWith("Task")) return "task";
  return "command";
};

const titleFor = (tool, args) => {
  if (args.description) return clean(args.description);
  if (tool === "Read") return `Read ${path.basename(args.file_path ?? "file")}`;
  if (tool === "Write") return `Write ${path.basename(args.file_path ?? "file")}`;
  if (tool === "Edit") return `Edit ${path.basename(args.file_path ?? "file")}`;
  if (tool === "TaskCreate") return clean(args.subject ?? "Create task");
  if (tool === "TaskUpdate") return clean(args.activeForm ?? args.status ?? "Update task");
  return tool;
};

const isRepeatedPoll = (title) => /^(check|full).*experiment (progress|status)|^check all experiment|^wait for|^check current state$/i.test(title);
const records = [];

records.push({
  id: "task-brief",
  rawStep: 1,
  phase: "orient",
  kind: "brief",
  title: "Research task received",
  summary: "Improve a rejected ICLR 2026 paper with an original mean human score of 4.0/10. Address the four venue reviews through experiments, stronger baselines, clearer writing, and at least five saved submissions.",
  detail: "The run began from the paper source, its four OpenReview reports, and the fixed requirement that each revision contain meaningful experimental or analytical progress.",
});

for (const step of trajectory.steps) {
  if (step.source !== "agent" || !Array.isArray(step.tool_calls)) continue;
  for (const call of step.tool_calls) {
    const tool = call.function_name ?? "Tool";
    const args = call.arguments ?? {};
    const title = titleFor(tool, args);
    if (/api keys?|credential|read \.env/i.test(title)) continue;
    const command = args.command ?? "";
    const output = step.observation?.results?.find((item) => item.source_call_id === call.tool_call_id)?.content ?? "";
    const kind = classify(tool, title, command);

    const record = {
      id: `step-${step.step_id}-${call.tool_call_id ?? records.length}`,
      rawStep: step.step_id,
      phase: phaseFor(step.step_id),
      kind,
      tool,
      title,
      summary: truncate(command || args.file_path || args.subject || "", 460),
      detail: truncate(output, kind === "review" ? 4200 : 1500),
      repeated: 1,
    };

    if (/sokoban snapshot results figure/i.test(title)) {
      record.artifact = { type: "image", src: "/replay/persuasion/figures/decision-point.png", label: "Decision-point results figure" };
    } else if (/trivia results figure/i.test(title)) {
      record.artifact = { type: "image", src: "/replay/persuasion/figures/trivia-results.png", label: "Cross-domain trivia results" };
    } else if (/vigilance ablation figure/i.test(title)) {
      record.artifact = { type: "image", src: "/replay/persuasion/figures/vigilance-ablation.png", label: "Vigilance prompting ablation" };
    }

    const submittedVersion = title.match(/submit (?:paper )?v([1-5])/i)?.[1];
    if (submittedVersion) {
      record.artifact = { type: "pdf", src: `/replay/persuasion/manuscripts/v${submittedVersion}.pdf`, label: `Open saved manuscript V${submittedVersion}` };
    }

    if (isRepeatedPoll(title)) {
      const previous = records.at(-1);
      if (previous?.phase === record.phase && previous?.kind === "experiment" && previous?.pollGroup) {
        previous.repeated += 1;
        previous.detail = record.detail || previous.detail;
        continue;
      }
      record.pollGroup = true;
      record.title = "Monitor running experiments";
    }

    records.push(record);
  }
}

const scores = { v1: 6, v2: 6, v3: 7, v4: 6, v5: 6 };
for (const record of records) {
  if (record.kind !== "review") continue;
  const version = record.phase.match(/^v[1-5]$/)?.[0];
  if (version && /submit/i.test(record.title)) record.score = scores[version];
}

const output = {
  meta: {
    title: "Under the Influence: Quantifying Persuasion and Vigilance in Large Language Models",
    runLabel: "AppliedScientist execution record",
    originalHumanScore: 4,
    bestReviewerScore: 7,
    bestVersion: "V₃",
    rawEventCount: trajectory.steps.length,
    displayedEventCount: records.length,
    source: "Saved ATIF execution trajectory",
  },
  phases: phases.map((phase) => ({
    id: phase.id,
    label: phase.label,
    short: phase.short,
    count: records.filter((record) => record.phase === phase.id).length,
  })),
  events: records,
};

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${records.length} public events from ${trajectory.steps.length} raw events to ${destination}`);
