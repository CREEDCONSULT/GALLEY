// Deterministic verifier v0 contract tests. No external deps, no network.
// Usage: npm run validate:galley:verifier

import assert from "node:assert/strict";
import { verifyDraft, RUBRIC_VERSION } from "../lib/galley/verifier.ts";

const playbook = {
  version: 3,
  voice: "Calm, evidence-first",
  approvedClaims: ["Dermatologist tested", "Fragrance free"],
  forbiddenClaims: ["cure", "guaranteed results", "clinically proven"],
  channels: ["Website", "Email"],
};

const checks = [];
const check = (name, fn) => checks.push([name, fn]);

check("clean draft passes", () => {
  const report = verifyDraft(
    {
      content:
        "A calmer approach to barrier care. The fragrance-free system is dermatologist tested and built for daily routines.",
      channel: "Website",
    },
    playbook,
  );
  assert.equal(report.result, "pass");
  assert.equal(report.rubricVersion, RUBRIC_VERSION);
  assert.ok(report.reasons.length >= 2);
});

check("verbatim forbidden claim blocks", () => {
  const report = verifyDraft(
    { content: "This cream is the cure your skin has been waiting for, applied nightly for best results.", channel: "Website" },
    playbook,
  );
  assert.equal(report.result, "fail");
  assert.ok(report.findings.some((f) => f.rule === "claims.forbidden" && f.evidence.includes("cure")));
});

check("case/punctuation/plural drift still blocks", () => {
  for (const content of [
    "Guaranteed Results for every customer, starting today — with a routine that fits your life and skin.",
    "We promise guaranteed-results within thirty days of consistent use across the entire product line.",
    "Our lab methods are Clinically-Proven and trusted by professionals around the world every single day.",
  ]) {
    const report = verifyDraft({ content, channel: "Email" }, playbook);
    assert.equal(report.result, "fail", `expected fail for: ${content}`);
  }
});

check("forbidden word inside another word does not block", () => {
  const report = verifyDraft(
    { content: "Our procurement platform keeps purchasing secure while approvals move quickly through every stage.", channel: "Website" },
    { ...playbook, forbiddenClaims: ["cure"] },
  );
  assert.equal(report.result, "pass", "'secure' must not match forbidden claim 'cure'");
});

check("unapproved channel blocks", () => {
  const report = verifyDraft(
    { content: "A long-enough body of copy that is otherwise fully compliant with the playbook rules.", channel: "TikTok" },
    playbook,
  );
  assert.equal(report.result, "fail");
  assert.ok(report.findings.some((f) => f.rule === "channel.not_in_playbook"));
});

check("trivial draft blocks", () => {
  const report = verifyDraft({ content: "Buy now.", channel: "Website" }, playbook);
  assert.equal(report.result, "fail");
  assert.ok(report.findings.some((f) => f.rule === "draft.too_short"));
});

check("risk lexicon warns without failing", () => {
  const report = verifyDraft(
    { content: "Try it risk-free for thirty days and see how the routine settles into your mornings without friction.", channel: "Email" },
    playbook,
  );
  assert.equal(report.result, "pass");
  assert.ok(report.findings.some((f) => f.rule === "claims.substantiation_risk"));
});

check("approved claims are noted as evidence", () => {
  const report = verifyDraft(
    { content: "The fragrance free formula is dermatologist tested and made for sensitive skin routines every day.", channel: "Website" },
    playbook,
  );
  assert.equal(report.result, "pass");
  assert.ok(report.findings.some((f) => f.rule === "claims.approved_present"));
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
  console.error(`\n${failed}/${checks.length} verifier checks failed`);
  process.exit(1);
}
console.log(`\nGalley verifier contract passed (${checks.length} checks, ${RUBRIC_VERSION}).`);
