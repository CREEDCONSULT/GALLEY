// Galley verifier eval harness. Runs the deterministic verifier against the
// golden set and reports precision / recall / false-block against the PRD §7
// gate (>=90% forbidden-claim recall, <=10% false-block).
//
// Cases labelled detectableBy: "llm" (paraphrase / voice) are the known gap the
// LLM-graded layer must close; they are reported separately and do NOT fail the
// deterministic gate. Usage: npm run eval:galley:verifier

import { verifyDraft, RUBRIC_VERSION } from "../lib/galley/verifier.ts";
import { GOLDEN_SET } from "../lib/galley/eval/goldenSet.ts";

const DETERMINISTIC_RECALL_GATE = 0.9; // PRD §7
const FALSE_BLOCK_GATE = 0.1; // PRD §7

const results = GOLDEN_SET.map((testCase) => {
  const report = verifyDraft(testCase.draft, testCase.playbook);
  const predicted = report.result; // "pass" | "fail"
  return {
    ...testCase,
    predicted,
    correct: predicted === testCase.expected,
    blockedRules: report.findings.filter((f) => f.severity === "block").map((f) => f.rule),
  };
});

const deterministic = results.filter((r) => r.detectableBy === "deterministic");
const llm = results.filter((r) => r.detectableBy === "llm");

// Deterministic subset metrics.
const detFail = deterministic.filter((r) => r.expected === "fail");
const detPass = deterministic.filter((r) => r.expected === "pass");
const caught = detFail.filter((r) => r.predicted === "fail");
const falseBlocks = detPass.filter((r) => r.predicted === "fail");

const recall = detFail.length ? caught.length / detFail.length : 1;
const falseBlockRate = detPass.length ? falseBlocks.length / detPass.length : 0;
const precisionDenom = results.filter((r) => r.predicted === "fail").length;
const truePositives = results.filter((r) => r.predicted === "fail" && r.expected === "fail").length;
const precision = precisionDenom ? truePositives / precisionDenom : 1;

// LLM gap: violations the deterministic layer cannot catch.
const llmFail = llm.filter((r) => r.expected === "fail");
const llmCaught = llmFail.filter((r) => r.predicted === "fail");

const pct = (n) => `${(n * 100).toFixed(1)}%`;

console.log(`\nGalley verifier eval — rubric ${RUBRIC_VERSION}`);
console.log(`Golden set: ${GOLDEN_SET.length} cases (${deterministic.length} deterministic, ${llm.length} LLM-gap)\n`);

console.log("Deterministic subset (the gate):");
console.log(`  Forbidden/channel/length/substance recall : ${pct(recall)} (${caught.length}/${detFail.length})  [gate >= ${pct(DETERMINISTIC_RECALL_GATE)}]`);
console.log(`  False-block rate on clean drafts          : ${pct(falseBlockRate)} (${falseBlocks.length}/${detPass.length})  [gate <= ${pct(FALSE_BLOCK_GATE)}]`);
console.log(`  Precision (all predicted blocks)          : ${pct(precision)}`);

if (falseBlocks.length) {
  console.log("\n  Clean drafts wrongly blocked:");
  for (const r of falseBlocks) console.log(`    - ${r.id}: blocked by [${r.blockedRules.join(", ")}]`);
}
if (caught.length < detFail.length) {
  console.log("\n  Deterministic violations MISSED:");
  for (const r of detFail.filter((x) => x.predicted !== "fail")) console.log(`    - ${r.id} (${r.category})`);
}

console.log("\nLLM gap (paraphrase / voice — deterministic cannot catch these):");
console.log(`  Caught by deterministic today : ${llmCaught.length}/${llmFail.length} (expected low until the LLM layer is active)`);
for (const r of llmFail) {
  console.log(`    - ${r.id} (${r.category}): ${r.predicted === "fail" ? "caught" : "MISSED — needs LLM"}`);
}

const overallCorrect = results.filter((r) => r.correct).length;
console.log(`\nOverall accuracy (incl. LLM gap): ${pct(overallCorrect / results.length)} (${overallCorrect}/${results.length})`);

// Gate on the deterministic subset only.
const failures = [];
if (recall < DETERMINISTIC_RECALL_GATE) failures.push(`deterministic recall ${pct(recall)} < ${pct(DETERMINISTIC_RECALL_GATE)}`);
if (falseBlockRate > FALSE_BLOCK_GATE) failures.push(`false-block rate ${pct(falseBlockRate)} > ${pct(FALSE_BLOCK_GATE)}`);

if (failures.length) {
  console.error(`\nEVAL GATE FAILED: ${failures.join("; ")}`);
  process.exit(1);
}
console.log(`\n✔ Eval gate passed. The ${llmFail.length - llmCaught.length}-case paraphrase/voice gap is closed by the LLM layer — measure it with \`npm run eval:galley:llm\`.`);
