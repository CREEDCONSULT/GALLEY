// Measures how much of the deterministic verifier's paraphrase/voice gap the
// LLM layer closes, by running the LLM-gap subset of the golden set through the
// live llmVerifyDraft action. Requires NEXT_PUBLIC_CONVEX_URL and an
// ANTHROPIC_API_KEY set on the deployment. NOT a CI gate (CI has no key) — this
// is a manual measurement. Usage: npm run eval:galley:llm

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { GOLDEN_SET } from "../lib/galley/eval/goldenSet.ts";
import { readFileSync } from "node:fs";

function loadEnv(name) {
  if (process.env[name]) return process.env[name];
  try {
    const line = readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((l) => l.startsWith(`${name}=`));
    if (line) return line.slice(name.length + 1).trim();
  } catch {}
  return undefined;
}

const url = loadEnv("NEXT_PUBLIC_CONVEX_URL");
if (!url) {
  console.error("NEXT_PUBLIC_CONVEX_URL missing; run `npx convex dev --once` first.");
  process.exit(1);
}
const client = new ConvexHttpClient(url);

const gap = GOLDEN_SET.filter((c) => c.detectableBy === "llm" && c.expected === "fail");
console.log(`\nLLM gap-closure eval — ${gap.length} cases the deterministic layer cannot catch\n`);

let closed = 0;
let inactive = false;
for (const c of gap) {
  const res = await client.action(api.verifierLlm.llmVerifyDraft, {
    content: c.draft.content,
    channel: c.draft.channel,
    voice: c.playbook.voice,
    approvedClaims: c.playbook.approvedClaims,
    forbiddenClaims: c.playbook.forbiddenClaims,
  });
  if (!res.active) {
    inactive = true;
    console.log(`  ${c.id}: LLM inactive (no ANTHROPIC_API_KEY)`);
    continue;
  }
  const blocked = res.findings.some((f) => f.severity === "block");
  const flagged = res.findings.length > 0;
  // A paraphrase case is "closed" when it produces a block; a voice case is
  // closed when it produces any finding (voice is warn-level).
  const isClosed = c.category === "voice" ? flagged : blocked;
  if (isClosed) closed += 1;
  console.log(
    `  ${isClosed ? "✔" : "✘"} ${c.id} (${c.category}): ${res.findings.map((f) => f.rule).join(", ") || "no findings"}`,
  );
}

if (inactive) {
  console.log("\nLLM layer is inactive; set ANTHROPIC_API_KEY on the deployment to measure closure.");
  process.exit(0);
}

const pct = ((closed / gap.length) * 100).toFixed(1);
console.log(`\nLLM closes ${closed}/${gap.length} of the deterministic gap (${pct}%).`);
console.log(
  "Combined verifier accuracy on the full golden set is now the deterministic pass rate plus these.",
);
