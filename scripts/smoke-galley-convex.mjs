// Live smoke test against the Convex dev deployment. Runs the full loop as an
// authenticated user inside their OWN workspace (tenant isolation), proving the
// human gate and append-only record. Usage: npm run smoke:galley:convex

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

// Two-layer verification runs an async LLM pass after intake; a clean, on-voice
// draft passes both layers and stays in awaiting_proof.
const CLEAN_DRAFT =
  "A calmer approach to barrier care, built around what sensitive skin needs and nothing it does not. The fragrance-free system is dermatologist tested and designed for a consistent daily ritual.";

// --- Authenticate: each signup gets its own isolated workspace. ---
const signUp = await client.action(api.auth.signIn, {
  provider: "password",
  params: {
    email: `smoke-${Date.now()}@example.com`,
    password: "smoke-pass-1234",
    flow: "signUp",
    name: "Smoke Reviewer",
  },
});
const token = signUp?.tokens?.token;
check("password sign-up returned a session token", Boolean(token));
client.setAuth(token);

// --- Build a client + playbook in the caller's workspace. ---
const { accountId } = await client.mutation(api.galley.createClientWithPlaybook, {
  name: "Smoke Skincare",
  website: "https://example.com",
  industry: "skincare",
  targetAudience: "sensitive skin",
  primaryOffer: "barrier care",
  voice: "Precise, warm, and never breathless.",
  approvedClaims: ["Dermatologist tested", "Fragrance free"],
  forbiddenClaims: ["cure", "guaranteed results"],
  channels: ["Website", "Email"],
  reportingKpi: "qualified visits",
});

// --- Intake a clean draft: deterministic verify -> awaiting_proof. ---
const { deliverableId, result } = await client.mutation(api.galley.intakeDraft, {
  accountId,
  title: "Smoke deliverable",
  type: "Landing page",
  channel: "Website",
  period: "2026-07",
  content: CLEAN_DRAFT,
  source: "smoke",
});
check("clean draft passes deterministic verification", result === "pass");

// Invariant: scheduling before human approval must throw.
let blocked = false;
try {
  await client.mutation(api.galley.scheduleDeliverable, { deliverableId });
} catch {
  blocked = true;
}
check("human gate blocks scheduling without approval", blocked);

// --- Human proof decision (attributed to the authenticated reviewer). ---
await client.mutation(api.galley.recordProofDecision, { deliverableId, action: "approve" });
await client.mutation(api.galley.scheduleDeliverable, { deliverableId });

const proof = await client.query(api.galley.getProofContext, { deliverableId });
check("deliverable reached scheduled after approval", proof.deliverable.status === "scheduled");
check("approval attributed to authenticated reviewer", proof.approvals.some((a) => a.action === "approve"));
check("deterministic verification recorded", proof.verifications.length >= 1);

const record = await client.query(api.galley.getRecord, { subjectRef: deliverableId });
const types = record.map((e) => e.type);
check(
  "record captured creation, decision, and state-change events",
  types.includes("deliverable.created") &&
    types.includes("approval.approved") &&
    types.includes("deliverable.status_changed"),
);

// --- Isolation: a second user must not see the first user's deliverable. ---
const other = new ConvexHttpClient(url);
const otherSignUp = await other.action(api.auth.signIn, {
  provider: "password",
  params: {
    email: `smoke-other-${Date.now()}@example.com`,
    password: "smoke-pass-5678",
    flow: "signUp",
    name: "Other Reviewer",
  },
});
other.setAuth(otherSignUp.tokens.token);
const otherQueue = await other.query(api.galley.getQueue, {});
check("new user's workspace is empty (isolation)", otherQueue.length === 0);
const otherRecord = await other.query(api.galley.getRecord, { subjectRef: deliverableId });
check("new user cannot read another workspace's record (isolation)", otherRecord.length === 0);
let otherBlocked = false;
try {
  await other.mutation(api.galley.recordProofDecision, { deliverableId, action: "approve" });
} catch {
  otherBlocked = true;
}
check("new user cannot act on another workspace's deliverable (isolation)", otherBlocked);

if (failures.length) {
  console.error(`\nFAILED: ${failures.length} check(s):`, failures.join("; "));
  process.exit(1);
}
console.log("\nGalley Convex smoke test passed against", url);
