// Contract tests for the pure LLM-verifier helpers (no network, no API key).
// Proves prompt construction and that response parsing is strict about shape
// and tolerant of formatting. Usage: npm run validate:galley:llm

import assert from "node:assert/strict";
import {
  buildVerificationPrompt,
  parseVerificationResponse,
} from "../lib/galley/llmVerifier.ts";

const checks = [];
const check = (name, fn) => checks.push([name, fn]);

check("prompt includes playbook rules and the draft", () => {
  const { system, user } = buildVerificationPrompt({
    content: "Cures everything overnight.",
    channel: "Email",
    voice: "Calm, evidence-first",
    approvedClaims: ["Dermatologist tested"],
    forbiddenClaims: ["cure", "guaranteed results"],
  });
  assert.ok(system.length > 0);
  assert.ok(user.includes("cure"));
  assert.ok(user.includes("Dermatologist tested"));
  assert.ok(user.includes("Cures everything overnight."));
  assert.ok(user.includes("forbidden_paraphrase"));
});

check("parses a clean JSON object", () => {
  const findings = parseVerificationResponse(
    '{"findings":[{"rule":"claims.forbidden_paraphrase","severity":"block","evidence":"heals permanently","constraint":"forbids cure"}]}',
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "claims.forbidden_paraphrase");
  assert.equal(findings[0].severity, "block");
});

check("tolerates code fences and surrounding prose", () => {
  const findings = parseVerificationResponse(
    'Here is the result:\n```json\n{"findings":[{"rule":"voice.mismatch","severity":"warn","evidence":"ALL CAPS HYPE","constraint":"never breathless"}]}\n```\nDone.',
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "voice.mismatch");
});

check("returns empty array for a compliant draft", () => {
  const findings = parseVerificationResponse('{"findings":[]}');
  assert.deepEqual(findings, []);
});

check("drops findings with unknown rule or bad severity", () => {
  const findings = parseVerificationResponse(
    '{"findings":[{"rule":"made.up.rule","severity":"block","evidence":"x","constraint":"y"},{"rule":"voice.mismatch","severity":"catastrophic","evidence":"x","constraint":"y"}]}',
  );
  assert.deepEqual(findings, []);
});

check("returns null on unparseable text (LLM treated as unavailable)", () => {
  assert.equal(parseVerificationResponse("I could not comply."), null);
  assert.equal(parseVerificationResponse(""), null);
  assert.equal(parseVerificationResponse("{not valid json"), null);
});

let failed = 0;
for (const [name, fn] of checks) {
  try {
    fn();
    console.log(`✔ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`✘ ${name}\n  ${error.message}`);
  }
}
if (failed) {
  console.error(`\n${failed}/${checks.length} LLM-verifier checks failed`);
  process.exit(1);
}
console.log(`\nGalley LLM-verifier helper contract passed (${checks.length} checks).`);
