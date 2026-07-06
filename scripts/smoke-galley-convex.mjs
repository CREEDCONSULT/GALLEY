// Live smoke test against the Convex dev deployment.
// Exercises the full validation-node loop and proves the human-gate invariant.
// Usage: npm run smoke:galley:convex (requires NEXT_PUBLIC_CONVEX_URL in .env.local)

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
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
const failures = [];
const check = (name, ok) => {
  console.log(`${ok ? "✔" : "✘"} ${name}`);
  if (!ok) failures.push(name);
};

const tenantId = await client.mutation(api.galley.createTenant, {
  name: `smoke-${Date.now()}`,
});
const accountId = await client.mutation(api.galley.createClientAccount, {
  tenantId,
  name: "Smoke Test Client",
  website: "https://example.com",
  industry: "wellness",
  targetAudience: "health-conscious adults",
  primaryOffer: "supplements",
});
await client.mutation(api.galley.createPlaybook, {
  tenantId,
  accountId,
  voice: "calm, evidence-first",
  approvedClaims: ["supports daily wellness routines"],
  forbiddenClaims: ["clinically proven", "cures"],
  channels: ["blog"],
  reportingKpi: "organic sessions",
});
const deliverableId = await client.mutation(api.galley.createDeliverable, {
  tenantId,
  accountId,
  period: "2026-07",
  type: "blog_post",
  channel: "blog",
  title: "Smoke test deliverable",
});
const draftId = await client.mutation(api.galley.addDraft, {
  deliverableId,
  title: "Smoke draft",
  content: "Body copy without forbidden claims.",
  model: "placeholder",
  playbookVersion: 1,
});
await client.mutation(api.galley.recordVerification, {
  draftId,
  result: "pass",
  reasons: ["no forbidden claims detected"],
  rubricVersion: "smoke-0",
});

// Invariant: scheduling before human approval must throw.
let blocked = false;
try {
  await client.mutation(api.galley.scheduleDeliverable, {
    deliverableId,
    actorLabel: "smoke",
  });
} catch {
  blocked = true;
}
check("human gate blocks scheduling without approval", blocked);

await client.mutation(api.galley.recordProofDecision, {
  deliverableId,
  userId: "smoke-user",
  actorLabel: "Smoke Reviewer",
  action: "approve",
});
await client.mutation(api.galley.scheduleDeliverable, {
  deliverableId,
  actorLabel: "Smoke Reviewer",
});

const proof = await client.query(api.galley.getProofContext, { deliverableId });
check("deliverable reached scheduled after approval", proof.deliverable.status === "scheduled");
check("approval recorded", proof.approvals.some((a) => a.action === "approve"));
check("verification recorded", proof.verifications.length === 1);

const record = await client.query(api.galley.getRecord, { subjectRef: deliverableId });
const types = record.map((e) => e.type);
check(
  "record captured creation, decision, and state-change events",
  types.includes("deliverable.created") &&
    types.includes("approval.approved") &&
    types.includes("deliverable.status_changed"),
);

if (failures.length) {
  console.error(`\nFAILED: ${failures.length} check(s):`, failures.join("; "));
  process.exit(1);
}
console.log("\nGalley Convex smoke test passed against", url);
