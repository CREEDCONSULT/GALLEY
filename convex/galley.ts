import {
  mutation,
  query,
  internalMutation,
  internalQuery,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";
import { approvalAction } from "./schema";
import { verifyDraft } from "../lib/galley/verifier";
import {
  MOCK_CLIENT_NAMES,
  MOCK_TENANT,
  createMockClientAccount,
  createMockPlaybook,
  generateMockDeliverables,
} from "../lib/galley/mockValidationNode";

// Galley validation-node functions.
//
// These mutations are the ONLY write path to the domain tables. The core
// invariants live here (Convex has no DB triggers):
// 1. Human gate: `scheduled`/`published` require a recorded human `approve`.
// 2. Append-only record: events are inserted, never patched or deleted, and
//    every state change appends one.
// 3. Drafts and verifications are immutable versions.

const VALID_TRANSITIONS: Record<string, string[]> = {
  drafting: ["verifying"],
  verifying: ["awaiting_proof", "escalated"],
  awaiting_proof: ["approved", "rejected", "verifying", "escalated"],
  approved: ["scheduled"],
  scheduled: ["published"],
  published: [],
  rejected: [],
  escalated: ["awaiting_proof", "rejected"],
};

function assertTransition(from: string, to: string): void {
  if (!VALID_TRANSITIONS[from]?.includes(to)) {
    throw new Error(`Invalid deliverable transition: ${from} → ${to}`);
  }
}

type EventInput = {
  tenantId: Id<"tenants">;
  accountId: Id<"clientAccounts">;
  actorType: "system" | "generator" | "verifier" | "human";
  actorLabel: string;
  type: string;
  subjectRef: string;
  payload: unknown;
};

async function appendEvent(ctx: MutationCtx, event: EventInput): Promise<void> {
  await ctx.db.insert("events", event);
}

async function transition(
  ctx: MutationCtx,
  deliverable: Doc<"deliverables">,
  to: Doc<"deliverables">["status"],
  actorLabel = "Galley",
): Promise<void> {
  assertTransition(deliverable.status, to);
  await ctx.db.patch(deliverable._id, { status: to });
  await appendEvent(ctx, {
    tenantId: deliverable.tenantId,
    accountId: deliverable.accountId,
    actorType: "system",
    actorLabel,
    type: "deliverable.status_changed",
    subjectRef: deliverable._id,
    payload: { from: deliverable.status, to },
  });
  deliverable.status = to;
}

async function latestPlaybook(
  ctx: QueryCtx | MutationCtx,
  accountId: Id<"clientAccounts">,
): Promise<Doc<"playbooks"> | null> {
  return await ctx.db
    .query("playbooks")
    .withIndex("by_account", (q) => q.eq("accountId", accountId))
    .order("desc")
    .first();
}

async function latestDraft(
  ctx: QueryCtx | MutationCtx,
  deliverableId: Id<"deliverables">,
): Promise<Doc<"drafts"> | null> {
  return await ctx.db
    .query("drafts")
    .withIndex("by_deliverable", (q) => q.eq("deliverableId", deliverableId))
    .order("desc")
    .first();
}

/** Split a draft's verification rows into the two layers by rubric prefix. */
async function verificationLayers(
  ctx: QueryCtx | MutationCtx,
  draftId: Id<"drafts">,
): Promise<{
  deterministic: Doc<"verifications"> | null;
  llm: Doc<"verifications"> | null;
  latest: Doc<"verifications"> | null;
}> {
  const rows = await ctx.db
    .query("verifications")
    .withIndex("by_draft", (q) => q.eq("draftId", draftId))
    .collect();
  const byNewest = [...rows].sort((a, b) => b._creationTime - a._creationTime);
  const deterministic = byNewest.find((r) => r.rubricVersion.startsWith("galley-rules")) ?? null;
  const llm = byNewest.find((r) => r.rubricVersion.startsWith("galley-llm")) ?? null;
  return { deterministic, llm, latest: byNewest[0] ?? null };
}

/**
 * Resolve the signed-in reviewer and their demo-workspace membership. On first
 * call for a user, the membership is created (owner) — this is the interim
 * onboarding-to-workspace link until multi-workspace management ships.
 */
async function requireReviewer(
  ctx: MutationCtx,
): Promise<{ userId: Id<"users">; label: string; tenantId: Id<"tenants"> }> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("You must be signed in to make a proof decision.");
  const user = await ctx.db.get(userId);
  const label =
    (user?.name as string | undefined) ??
    (user?.email as string | undefined) ??
    "Reviewer";

  const tenant = await ensureDemoTenant(ctx);
  const existing = await ctx.db
    .query("memberships")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("tenantId"), tenant._id))
    .first();
  if (!existing) {
    await ctx.db.insert("memberships", { userId, tenantId: tenant._id, role: "owner" });
  }
  return { userId, label, tenantId: tenant._id };
}

async function ensureDemoTenant(ctx: MutationCtx): Promise<Doc<"tenants">> {
  const tenants = await ctx.db.query("tenants").collect();
  const found = tenants.find((t) => t.name === MOCK_TENANT.name);
  if (found) return found;
  const tenantId = await ctx.db.insert("tenants", { name: MOCK_TENANT.name });
  return (await ctx.db.get(tenantId))!;
}

async function assertApprovalExists(
  ctx: MutationCtx,
  deliverableId: Id<"deliverables">,
): Promise<void> {
  const approvals = await ctx.db
    .query("approvals")
    .withIndex("by_deliverable", (q) => q.eq("deliverableId", deliverableId))
    .collect();
  if (!approvals.some((a) => a.action === "approve")) {
    throw new Error(
      `Deliverable ${deliverableId} cannot be scheduled or published without a recorded human approval.`,
    );
  }
}

/** Run the deterministic verifier, persist the result, and move the deliverable. */
async function runVerification(
  ctx: MutationCtx,
  deliverable: Doc<"deliverables">,
  draft: Doc<"drafts">,
  playbook: Doc<"playbooks">,
): Promise<Doc<"verifications">["result"]> {
  const report = verifyDraft(
    { content: draft.content, channel: deliverable.channel },
    playbook,
  );
  const verificationId = await ctx.db.insert("verifications", {
    tenantId: deliverable.tenantId,
    draftId: draft._id,
    result: report.result,
    reasons: report.reasons,
    rubricVersion: report.rubricVersion,
  });
  await appendEvent(ctx, {
    tenantId: deliverable.tenantId,
    accountId: deliverable.accountId,
    actorType: "verifier",
    actorLabel: `Galley verifier (${report.rubricVersion})`,
    type: report.result === "pass" ? "verification.passed" : "verification.failed",
    subjectRef: deliverable._id,
    payload: {
      verificationId,
      draftId: draft._id,
      result: report.result,
      reasons: report.reasons,
      findings: report.findings,
      rubricVersion: report.rubricVersion,
    },
  });
  const next = report.result === "pass" ? "awaiting_proof" : "escalated";
  await transition(ctx, deliverable, next);
  if (next === "awaiting_proof") {
    await appendEvent(ctx, {
      tenantId: deliverable.tenantId,
      accountId: deliverable.accountId,
      actorType: "system",
      actorLabel: "Galley",
      type: "proof.awaiting",
      subjectRef: deliverable._id,
      payload: { verificationId, draftId: draft._id },
    });
    // Second pass: the LLM-graded layer runs after this mutation commits and
    // may escalate a draft that passed deterministic checks but carries a
    // paraphrased forbidden claim. No-ops when ANTHROPIC_API_KEY is unset.
    await ctx.scheduler.runAfter(0, internal.verifierLlm.runLlmPass, {
      deliverableId: deliverable._id,
    });
  }
  return report.result;
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

export const createTenant = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => ctx.db.insert("tenants", { name: args.name }),
});

export const createClientAccount = mutation({
  args: {
    tenantId: v.id("tenants"),
    name: v.string(),
    website: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    primaryOffer: v.string(),
  },
  handler: async (ctx, args) => {
    const accountId = await ctx.db.insert("clientAccounts", {
      ...args,
      status: "active",
    });
    await appendEvent(ctx, {
      tenantId: args.tenantId,
      accountId,
      actorType: "human",
      actorLabel: "workspace owner",
      type: "client_account.created",
      subjectRef: accountId,
      payload: { name: args.name },
    });
    return accountId;
  },
});

export const createPlaybook = mutation({
  args: {
    tenantId: v.id("tenants"),
    accountId: v.id("clientAccounts"),
    voice: v.string(),
    approvedClaims: v.array(v.string()),
    forbiddenClaims: v.array(v.string()),
    channels: v.array(v.string()),
    reportingKpi: v.string(),
  },
  handler: async (ctx, args) => {
    const latest = await latestPlaybook(ctx, args.accountId);
    const version = (latest?.version ?? 0) + 1;
    const playbookId = await ctx.db.insert("playbooks", { ...args, version });
    await appendEvent(ctx, {
      tenantId: args.tenantId,
      accountId: args.accountId,
      actorType: "human",
      actorLabel: "workspace owner",
      type: "playbook.created",
      subjectRef: playbookId,
      payload: { version },
    });
    return playbookId;
  },
});

// ---------------------------------------------------------------------------
// Produce → Verify
// ---------------------------------------------------------------------------

export const createDeliverable = mutation({
  args: {
    tenantId: v.id("tenants"),
    accountId: v.id("clientAccounts"),
    period: v.string(),
    type: v.string(),
    channel: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const deliverableId = await ctx.db.insert("deliverables", {
      ...args,
      status: "drafting",
    });
    await appendEvent(ctx, {
      tenantId: args.tenantId,
      accountId: args.accountId,
      actorType: "system",
      actorLabel: "Galley",
      type: "deliverable.created",
      subjectRef: deliverableId,
      payload: { title: args.title, channel: args.channel },
    });
    return deliverableId;
  },
});

export const addDraft = mutation({
  args: {
    deliverableId: v.id("deliverables"),
    title: v.string(),
    content: v.string(),
    model: v.string(),
    playbookVersion: v.number(),
  },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) throw new Error("Deliverable not found");
    const previous = await latestDraft(ctx, args.deliverableId);
    const version = (previous?.version ?? 0) + 1;
    const draftId = await ctx.db.insert("drafts", {
      tenantId: deliverable.tenantId,
      deliverableId: args.deliverableId,
      version,
      title: args.title,
      content: args.content,
      model: args.model,
      playbookVersion: args.playbookVersion,
    });
    await transition(ctx, deliverable, "verifying");
    await appendEvent(ctx, {
      tenantId: deliverable.tenantId,
      accountId: deliverable.accountId,
      actorType: "generator",
      actorLabel: args.model,
      type: "draft.generated",
      subjectRef: args.deliverableId,
      payload: { draftId, draftVersion: version, model: args.model },
    });
    return draftId;
  },
});

/** Verify the latest draft of a deliverable with the deterministic rubric. */
export const verifyDeliverable = mutation({
  args: { deliverableId: v.id("deliverables") },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) throw new Error("Deliverable not found");
    const draft = await latestDraft(ctx, args.deliverableId);
    if (!draft) throw new Error("No draft to verify");
    const playbook = await latestPlaybook(ctx, deliverable.accountId);
    if (!playbook) throw new Error("No playbook for this client account");
    return await runVerification(ctx, deliverable, draft, playbook);
  },
});

// Retained for API compatibility: record an externally produced verification.
export const recordVerification = mutation({
  args: {
    draftId: v.id("drafts"),
    result: v.union(v.literal("pass"), v.literal("fail")),
    reasons: v.array(v.string()),
    rubricVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Draft not found");
    const deliverable = await ctx.db.get(draft.deliverableId);
    if (!deliverable) throw new Error("Deliverable not found");
    const verificationId = await ctx.db.insert("verifications", {
      tenantId: draft.tenantId,
      draftId: args.draftId,
      result: args.result,
      reasons: args.reasons,
      rubricVersion: args.rubricVersion,
    });
    await appendEvent(ctx, {
      tenantId: draft.tenantId,
      accountId: deliverable.accountId,
      actorType: "verifier",
      actorLabel: `rubric ${args.rubricVersion}`,
      type: args.result === "pass" ? "verification.passed" : "verification.failed",
      subjectRef: deliverable._id,
      payload: { verificationId, draftId: args.draftId, reasons: args.reasons },
    });
    await transition(
      ctx,
      deliverable,
      args.result === "pass" ? "awaiting_proof" : "escalated",
    );
    return verificationId;
  },
});

// ---------------------------------------------------------------------------
// Proof (the human gate)
// ---------------------------------------------------------------------------

export const recordProofDecision = mutation({
  args: {
    deliverableId: v.id("deliverables"),
    action: approvalAction,
    editContent: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Invariant: proof decisions require an authenticated, attributable actor.
    const reviewer = await requireReviewer(ctx);
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) throw new Error("Deliverable not found");
    if (deliverable.status !== "awaiting_proof") {
      throw new Error(
        `Proof decisions are only valid while awaiting proof (current: ${deliverable.status}).`,
      );
    }

    const editDiff =
      args.action === "edit"
        ? (args.note ?? "Reviewer replaced the draft content at the proof gate.")
        : args.action === "reject"
          ? (args.note ?? "Reviewer rejected this version at the proof gate.")
          : null;

    const approvalId = await ctx.db.insert("approvals", {
      tenantId: deliverable.tenantId,
      deliverableId: args.deliverableId,
      userId: reviewer.userId,
      action: args.action,
      editDiff,
    });
    await appendEvent(ctx, {
      tenantId: deliverable.tenantId,
      accountId: deliverable.accountId,
      actorType: "human",
      actorLabel: reviewer.label,
      type: `approval.${args.action === "approve" ? "approved" : args.action === "reject" ? "rejected" : "edited"}`,
      subjectRef: args.deliverableId,
      payload: { approvalId, userId: reviewer.userId, editDiff, note: args.note ?? null },
    });

    if (args.action === "approve") {
      await transition(ctx, deliverable, "approved");
      return { status: "approved" as const };
    }
    if (args.action === "reject") {
      await transition(ctx, deliverable, "rejected");
      return { status: "rejected" as const };
    }

    // Edit: new immutable draft version, then re-verify with the real rubric.
    const content = args.editContent?.trim();
    if (!content) throw new Error("Edited content cannot be empty.");
    const previous = await latestDraft(ctx, args.deliverableId);
    if (!previous) throw new Error("No draft to edit");
    const playbook = await latestPlaybook(ctx, deliverable.accountId);
    if (!playbook) throw new Error("No playbook for this client account");

    const draftId = await ctx.db.insert("drafts", {
      tenantId: deliverable.tenantId,
      deliverableId: args.deliverableId,
      version: previous.version + 1,
      title: previous.title,
      content,
      model: "human-edit",
      playbookVersion: playbook.version,
    });
    await transition(ctx, deliverable, "verifying");
    const draft = await ctx.db.get(draftId);
    const result = await runVerification(ctx, deliverable, draft!, playbook);
    return { status: deliverable.status, draftVersion: previous.version + 1, result };
  },
});

export const scheduleDeliverable = mutation({
  args: { deliverableId: v.id("deliverables"), actorLabel: v.string() },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) throw new Error("Deliverable not found");
    // Invariant: no scheduling without a recorded human approval.
    await assertApprovalExists(ctx, args.deliverableId);
    await transition(ctx, deliverable, "scheduled", args.actorLabel);
  },
});

/**
 * Draft intake: bring an externally produced draft into the governed loop.
 * Creates the deliverable, attaches the immutable draft, and verifies it
 * against the client playbook — one transaction, no bypass path.
 */
export const intakeDraft = mutation({
  args: {
    accountId: v.id("clientAccounts"),
    title: v.string(),
    type: v.string(),
    channel: v.string(),
    period: v.string(),
    content: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.accountId);
    if (!account) throw new Error("Client account not found");
    const playbook = await latestPlaybook(ctx, args.accountId);
    if (!playbook) throw new Error("Create a playbook for this client before submitting drafts.");

    const deliverableId = await ctx.db.insert("deliverables", {
      tenantId: account.tenantId,
      accountId: args.accountId,
      period: args.period,
      type: args.type,
      channel: args.channel,
      title: args.title,
      status: "drafting",
    });
    const deliverable = (await ctx.db.get(deliverableId))!;
    await appendEvent(ctx, {
      tenantId: account.tenantId,
      accountId: args.accountId,
      actorType: "human",
      actorLabel: args.source,
      type: "deliverable.created",
      subjectRef: deliverableId,
      payload: { title: args.title, channel: args.channel, intake: true },
    });
    await appendEvent(ctx, {
      tenantId: account.tenantId,
      accountId: args.accountId,
      actorType: "system",
      actorLabel: "Galley",
      type: "playbook.selected",
      subjectRef: deliverableId,
      payload: { playbookId: playbook._id, playbookVersion: playbook.version },
    });

    const draftId = await ctx.db.insert("drafts", {
      tenantId: account.tenantId,
      deliverableId,
      version: 1,
      title: args.title,
      content: args.content,
      model: args.source,
      playbookVersion: playbook.version,
    });
    await appendEvent(ctx, {
      tenantId: account.tenantId,
      accountId: args.accountId,
      actorType: "human",
      actorLabel: args.source,
      type: "draft.generated",
      subjectRef: deliverableId,
      payload: { draftId, draftVersion: 1, model: args.source, intake: true },
    });
    await transition(ctx, deliverable, "verifying");
    const draft = (await ctx.db.get(draftId))!;
    const result = await runVerification(ctx, deliverable, draft, playbook);
    return { deliverableId, result };
  },
});

/** Client accounts in the demo workspace with their latest playbook. */
export const listAccounts = query({
  args: {},
  handler: async (ctx) => {
    const tenants = await ctx.db.query("tenants").collect();
    const tenant = tenants.find((t) => t.name === MOCK_TENANT.name);
    if (!tenant) return [];
    const accounts = await ctx.db
      .query("clientAccounts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
      .collect();
    return await Promise.all(
      accounts.map(async (account) => ({
        account,
        playbook: await latestPlaybook(ctx, account._id),
      })),
    );
  },
});

/**
 * Onboarding: create (or extend) a client account with a versioned playbook
 * in the demo workspace tenant. Returns ids and the playbook version.
 */
export const createClientWithPlaybook = mutation({
  args: {
    name: v.string(),
    website: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    primaryOffer: v.string(),
    voice: v.string(),
    approvedClaims: v.array(v.string()),
    forbiddenClaims: v.array(v.string()),
    channels: v.array(v.string()),
    reportingKpi: v.string(),
  },
  handler: async (ctx, args) => {
    const tenants = await ctx.db.query("tenants").collect();
    let tenant = tenants.find((t) => t.name === MOCK_TENANT.name);
    if (!tenant) {
      const tenantId = await ctx.db.insert("tenants", { name: MOCK_TENANT.name });
      tenant = (await ctx.db.get(tenantId))!;
    }

    const accounts = await ctx.db
      .query("clientAccounts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
      .collect();
    let account = accounts.find(
      (a) => a.name.toLowerCase() === args.name.toLowerCase(),
    );
    if (!account) {
      const accountId = await ctx.db.insert("clientAccounts", {
        tenantId: tenant._id,
        name: args.name,
        website: args.website,
        industry: args.industry,
        targetAudience: args.targetAudience,
        primaryOffer: args.primaryOffer,
        status: "active",
      });
      account = (await ctx.db.get(accountId))!;
      await appendEvent(ctx, {
        tenantId: tenant._id,
        accountId: account._id,
        actorType: "human",
        actorLabel: "Workspace owner",
        type: "client_account.created",
        subjectRef: account._id,
        payload: { name: args.name, website: args.website },
      });
    }

    const previous = await latestPlaybook(ctx, account._id);
    const version = (previous?.version ?? 0) + 1;
    const playbookId = await ctx.db.insert("playbooks", {
      tenantId: tenant._id,
      accountId: account._id,
      version,
      voice: args.voice,
      approvedClaims: args.approvedClaims,
      forbiddenClaims: args.forbiddenClaims,
      channels: args.channels,
      reportingKpi: args.reportingKpi,
    });
    await appendEvent(ctx, {
      tenantId: tenant._id,
      accountId: account._id,
      actorType: "human",
      actorLabel: "Workspace owner",
      type: "playbook.created",
      subjectRef: account._id,
      payload: { playbookId, version },
    });
    return { accountId: account._id, playbookId, version };
  },
});

// ---------------------------------------------------------------------------
// Demo seed / reset (validation-node prototype)
// ---------------------------------------------------------------------------

export const seedDemo = mutation({
  args: {},
  handler: async (ctx) => {
    const tenants = await ctx.db.query("tenants").collect();
    let tenant = tenants.find((t) => t.name === MOCK_TENANT.name);
    if (!tenant) {
      const tenantId = await ctx.db.insert("tenants", { name: MOCK_TENANT.name });
      tenant = (await ctx.db.get(tenantId))!;
    }

    const accounts = await ctx.db
      .query("clientAccounts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
      .collect();
    let created = 0;

    for (const name of MOCK_CLIENT_NAMES) {
      const mock = createMockClientAccount(name);
      let account = accounts.find((a) => a.name === name);
      if (!account) {
        const accountId = await ctx.db.insert("clientAccounts", {
          tenantId: tenant._id,
          name: mock.name,
          website: mock.website,
          industry: mock.industry,
          targetAudience: mock.targetAudience,
          primaryOffer: mock.primaryOffer,
          status: "active",
        });
        account = (await ctx.db.get(accountId))!;
        await appendEvent(ctx, {
          tenantId: tenant._id,
          accountId: account._id,
          actorType: "system",
          actorLabel: "Galley demo seed",
          type: "client_account.created",
          subjectRef: account._id,
          payload: { name: mock.name, website: mock.website },
        });
      }

      let playbook = await latestPlaybook(ctx, account._id);
      if (!playbook) {
        const definition = createMockPlaybook(mock);
        const playbookId = await ctx.db.insert("playbooks", {
          tenantId: tenant._id,
          accountId: account._id,
          version: 1,
          voice: definition.voice,
          approvedClaims: definition.approvedClaims,
          forbiddenClaims: definition.forbiddenClaims,
          channels: definition.channels,
          reportingKpi: definition.reportingKpi,
        });
        playbook = (await ctx.db.get(playbookId))!;
        await appendEvent(ctx, {
          tenantId: tenant._id,
          accountId: account._id,
          actorType: "system",
          actorLabel: "Galley demo seed",
          type: "playbook.created",
          subjectRef: account._id,
          payload: { playbookId: playbook._id, version: 1 },
        });
      }

      const existing = await ctx.db
        .query("deliverables")
        .withIndex("by_account", (q) => q.eq("accountId", account._id))
        .collect();
      const target = 2;
      if (existing.length >= target) continue;

      const template = generateMockDeliverables([mock], [createMockPlaybook(mock)]);
      const templateDeliverable = template.deliverables[0];
      const templateDraft = template.drafts[0];

      for (let index = existing.length; index < target; index += 1) {
        const title =
          index === 0
            ? templateDeliverable.title
            : `${templateDeliverable.title} — Channel cutdown`;
        const content =
          index === 0
            ? templateDraft.content
            : `${templateDraft.content}\n\nChannel cutdown: ${mock.primaryOffer}.`;

        const deliverableId = await ctx.db.insert("deliverables", {
          tenantId: tenant._id,
          accountId: account._id,
          period: templateDeliverable.period,
          type: templateDeliverable.type,
          channel: templateDeliverable.channel,
          title,
          status: "drafting",
        });
        const deliverable = (await ctx.db.get(deliverableId))!;
        await appendEvent(ctx, {
          tenantId: tenant._id,
          accountId: account._id,
          actorType: "system",
          actorLabel: "Galley demo seed",
          type: "deliverable.created",
          subjectRef: deliverableId,
          payload: { period: deliverable.period, type: deliverable.type, channel: deliverable.channel },
        });
        await appendEvent(ctx, {
          tenantId: tenant._id,
          accountId: account._id,
          actorType: "system",
          actorLabel: "Galley",
          type: "playbook.selected",
          subjectRef: deliverableId,
          payload: { playbookId: playbook._id, playbookVersion: playbook.version },
        });

        const draftId = await ctx.db.insert("drafts", {
          tenantId: tenant._id,
          deliverableId,
          version: 1,
          title,
          content,
          model: "mock-galley-generator-v1",
          playbookVersion: playbook.version,
        });
        await appendEvent(ctx, {
          tenantId: tenant._id,
          accountId: account._id,
          actorType: "generator",
          actorLabel: "Mock generator",
          type: "draft.generated",
          subjectRef: deliverableId,
          payload: { draftId, draftVersion: 1, model: "mock-galley-generator-v1" },
        });
        await transition(ctx, deliverable, "verifying");
        const draft = (await ctx.db.get(draftId))!;
        await runVerification(ctx, deliverable, draft, playbook);
        created += 1;
      }

      await appendEvent(ctx, {
        tenantId: tenant._id,
        accountId: account._id,
        actorType: "system",
        actorLabel: "Galley demo seed",
        type: "demo.seeded",
        subjectRef: account._id,
        payload: { period: "2026-06", createdDeliverables: created },
      });
    }

    return { created };
  },
});

export const resetDemo = mutation({
  args: {},
  handler: async (ctx) => {
    // Removes generated demo work. Events are never deleted — the append-only
    // history is the product.
    const tenants = await ctx.db.query("tenants").collect();
    const tenant = tenants.find((t) => t.name === MOCK_TENANT.name);
    if (!tenant) return { removed: 0 };
    let removed = 0;
    const accounts = await ctx.db
      .query("clientAccounts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenant._id))
      .collect();
    for (const account of accounts) {
      const deliverables = await ctx.db
        .query("deliverables")
        .withIndex("by_account", (q) => q.eq("accountId", account._id))
        .collect();
      for (const deliverable of deliverables) {
        const drafts = await ctx.db
          .query("drafts")
          .withIndex("by_deliverable", (q) => q.eq("deliverableId", deliverable._id))
          .collect();
        for (const draft of drafts) {
          const verifications = await ctx.db
            .query("verifications")
            .withIndex("by_draft", (q) => q.eq("draftId", draft._id))
            .collect();
          for (const verification of verifications) await ctx.db.delete(verification._id);
          await ctx.db.delete(draft._id);
        }
        const approvals = await ctx.db
          .query("approvals")
          .withIndex("by_deliverable", (q) => q.eq("deliverableId", deliverable._id))
          .collect();
        for (const approval of approvals) await ctx.db.delete(approval._id);
        await ctx.db.delete(deliverable._id);
        removed += 1;
      }
      await appendEvent(ctx, {
        tenantId: tenant._id,
        accountId: account._id,
        actorType: "human",
        actorLabel: "Demo reset",
        type: "demo.reset",
        subjectRef: account._id,
        payload: { removedDeliverables: removed },
      });
    }
    return { removed };
  },
});

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const getQueue = query({
  args: {},
  handler: async (ctx) => {
    // Interim tenant scoping: until authentication and workspace membership
    // land, the app operates inside the demo workspace tenant. Never widen
    // this back to a cross-tenant scan (invariant: tenant isolation).
    const tenants = await ctx.db.query("tenants").collect();
    const tenant = tenants.find((t) => t.name === MOCK_TENANT.name);
    if (!tenant) return [];
    const deliverables = await ctx.db
      .query("deliverables")
      .withIndex("by_tenant_status", (q) => q.eq("tenantId", tenant._id))
      .order("desc")
      .collect();
    return await Promise.all(
      deliverables.map(async (deliverable) => {
        const account = await ctx.db.get(deliverable.accountId);
        const playbook = await latestPlaybook(ctx, deliverable.accountId);
        const draft = await latestDraft(ctx, deliverable._id);
        const layers = draft
          ? await verificationLayers(ctx, draft._id)
          : { deterministic: null, llm: null, latest: null };
        const events = await ctx.db
          .query("events")
          .withIndex("by_subject", (q) => q.eq("subjectRef", deliverable._id))
          .collect();
        return {
          deliverable,
          account,
          playbook,
          draft,
          // `verification` stays for back-compat; `deterministic`/`llm` expose
          // the two-layer verification distinctly for the proof surface.
          verification: layers.latest,
          deterministicVerification: layers.deterministic,
          llmVerification: layers.llm,
          eventCount: events.length,
        };
      }),
    );
  },
});

export const getEventsForDeliverable = query({
  args: { deliverableId: v.id("deliverables") },
  handler: async (ctx, args) =>
    ctx.db
      .query("events")
      .withIndex("by_subject", (q) => q.eq("subjectRef", args.deliverableId))
      .collect(),
});

export const getProofContext = query({
  args: { deliverableId: v.id("deliverables") },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) return null;
    const draft = await latestDraft(ctx, args.deliverableId);
    const verifications = draft
      ? await ctx.db
          .query("verifications")
          .withIndex("by_draft", (q) => q.eq("draftId", draft._id))
          .collect()
      : [];
    const approvals = await ctx.db
      .query("approvals")
      .withIndex("by_deliverable", (q) => q.eq("deliverableId", args.deliverableId))
      .collect();
    return { deliverable, latestDraft: draft, verifications, approvals };
  },
});

export const getRecord = query({
  args: { subjectRef: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("events")
      .withIndex("by_subject", (q) => q.eq("subjectRef", args.subjectRef))
      .collect(),
});

/** The signed-in user's public identity, or null when unauthenticated. */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return { name: user.name ?? null, email: user.email ?? null };
  },
});

// ---------------------------------------------------------------------------
// LLM-graded second pass (internal; driven by the scheduler + a Convex action)
// ---------------------------------------------------------------------------

/** Latest-draft + playbook context the LLM pass needs. Internal only. */
export const getVerificationInput = internalQuery({
  args: { deliverableId: v.id("deliverables") },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) return null;
    const draft = await latestDraft(ctx, args.deliverableId);
    const playbook = await latestPlaybook(ctx, deliverable.accountId);
    if (!draft || !playbook) return null;
    return {
      draftId: draft._id,
      content: draft.content,
      channel: deliverable.channel,
      voice: playbook.voice,
      approvedClaims: playbook.approvedClaims,
      forbiddenClaims: playbook.forbiddenClaims,
    };
  },
});

/**
 * Persist an LLM verification result as a second verification row and, if it
 * found a forbidden-claim paraphrase (a block finding), escalate the
 * deliverable out of the proof queue for a human. Internal only — invoked by
 * verifierLlm.runLlmPass after the deterministic pass commits.
 */
export const applyLlmVerification = internalMutation({
  args: {
    deliverableId: v.id("deliverables"),
    draftId: v.id("drafts"),
    findings: v.array(
      v.object({
        rule: v.string(),
        severity: v.string(),
        evidence: v.string(),
        constraint: v.string(),
      }),
    ),
    rubricVersion: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) return;
    // The draft may have been superseded (a new version verified) between the
    // schedule and this run; only apply to the still-current draft.
    const current = await latestDraft(ctx, args.deliverableId);
    if (!current || current._id !== args.draftId) return;

    const blocks = args.findings.filter((f) => f.severity === "block");
    const result = blocks.length > 0 ? "fail" : "pass";
    const reasons =
      args.findings.length > 0
        ? args.findings.map((f) => `${f.rule}: ${f.evidence}`)
        : ["LLM pass found no paraphrase or voice violations."];

    const verificationId = await ctx.db.insert("verifications", {
      tenantId: deliverable.tenantId,
      draftId: args.draftId,
      result,
      reasons,
      rubricVersion: args.rubricVersion,
    });
    await appendEvent(ctx, {
      tenantId: deliverable.tenantId,
      accountId: deliverable.accountId,
      actorType: "verifier",
      actorLabel: `Galley LLM verifier (${args.model})`,
      type: result === "pass" ? "verification.passed" : "verification.failed",
      subjectRef: args.deliverableId,
      payload: { verificationId, layer: "llm", findings: args.findings },
    });

    if (result === "fail" && deliverable.status === "awaiting_proof") {
      await transition(ctx, deliverable, "escalated", "Galley LLM verifier");
    }
  },
});
