import { mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { approvalAction, deliverableStatus } from "./schema";

// Galley validation-node functions.
//
// These mutations are the ONLY write path to the domain tables. The two core
// invariants live here (Convex has no DB triggers):
// 1. Human gate: `scheduled`/`published` require a recorded human `approve`.
// 2. Append-only record: events are inserted, never patched or deleted, and
//    every state change appends one.

const VALID_TRANSITIONS: Record<string, string[]> = {
  drafting: ["verifying"],
  verifying: ["awaiting_proof", "escalated"],
  awaiting_proof: ["approved", "rejected", "drafting", "escalated"],
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

async function appendEvent(
  ctx: MutationCtx,
  event: {
    tenantId: Id<"tenants">;
    accountId: Id<"clientAccounts">;
    actorType: "system" | "generator" | "verifier" | "human";
    actorLabel: string;
    type: string;
    subjectRef: string;
    payload: unknown;
  },
): Promise<void> {
  await ctx.db.insert("events", event);
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
    // Playbooks are versioned: a new playbook for an account supersedes by
    // version number; prior versions are never mutated.
    const latest = await ctx.db
      .query("playbooks")
      .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
      .order("desc")
      .first();
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
      actorLabel: "galley",
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
    const latest = await ctx.db
      .query("drafts")
      .withIndex("by_deliverable", (q) =>
        q.eq("deliverableId", args.deliverableId),
      )
      .order("desc")
      .first();
    const version = (latest?.version ?? 0) + 1;
    const draftId = await ctx.db.insert("drafts", {
      tenantId: deliverable.tenantId,
      deliverableId: args.deliverableId,
      version,
      title: args.title,
      content: args.content,
      model: args.model,
      playbookVersion: args.playbookVersion,
    });
    assertTransition(deliverable.status, "verifying");
    await ctx.db.patch(args.deliverableId, { status: "verifying" });
    await appendEvent(ctx, {
      tenantId: deliverable.tenantId,
      accountId: deliverable.accountId,
      actorType: "generator",
      actorLabel: args.model,
      type: "draft.generated",
      subjectRef: draftId,
      payload: { version, deliverableId: args.deliverableId },
    });
    return draftId;
  },
});

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
    assertTransition(deliverable.status, "awaiting_proof");
    await ctx.db.patch(draft.deliverableId, { status: "awaiting_proof" });
    await appendEvent(ctx, {
      tenantId: draft.tenantId,
      accountId: deliverable.accountId,
      actorType: "verifier",
      actorLabel: `rubric ${args.rubricVersion}`,
      type: args.result === "pass" ? "verification.passed" : "verification.failed",
      subjectRef: verificationId,
      payload: { draftId: args.draftId, reasons: args.reasons },
    });
    return verificationId;
  },
});

// ---------------------------------------------------------------------------
// Proof (the human gate)
// ---------------------------------------------------------------------------

export const recordProofDecision = mutation({
  args: {
    deliverableId: v.id("deliverables"),
    userId: v.string(),
    actorLabel: v.string(),
    action: approvalAction,
    editDiff: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) throw new Error("Deliverable not found");
    if (deliverable.status !== "awaiting_proof") {
      throw new Error(
        `Proof decisions are only valid while awaiting proof (current: ${deliverable.status}).`,
      );
    }

    await ctx.db.insert("approvals", {
      tenantId: deliverable.tenantId,
      deliverableId: args.deliverableId,
      userId: args.userId,
      action: args.action,
      editDiff: args.editDiff ?? null,
    });

    const nextStatus =
      args.action === "approve"
        ? "approved"
        : args.action === "reject"
          ? "rejected"
          : "drafting"; // edit → changes requested → back to drafting
    assertTransition(deliverable.status, nextStatus);
    await ctx.db.patch(args.deliverableId, { status: nextStatus });

    await appendEvent(ctx, {
      tenantId: deliverable.tenantId,
      accountId: deliverable.accountId,
      actorType: "human",
      actorLabel: args.actorLabel,
      type: `human.${args.action === "approve" ? "approved" : args.action === "reject" ? "rejected" : "edited"}`,
      subjectRef: args.deliverableId,
      payload: { note: args.note ?? null, userId: args.userId },
    });
  },
});

export const scheduleDeliverable = mutation({
  args: { deliverableId: v.id("deliverables"), actorLabel: v.string() },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) throw new Error("Deliverable not found");
    // Invariant: no scheduling without a recorded human approval.
    await assertApprovalExists(ctx, args.deliverableId);
    assertTransition(deliverable.status, "scheduled");
    await ctx.db.patch(args.deliverableId, { status: "scheduled" });
    await appendEvent(ctx, {
      tenantId: deliverable.tenantId,
      accountId: deliverable.accountId,
      actorType: "human",
      actorLabel: args.actorLabel,
      type: "deliverable.scheduled",
      subjectRef: args.deliverableId,
      payload: {},
    });
  },
});

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const listDeliverables = query({
  args: {
    tenantId: v.id("tenants"),
    status: v.optional(deliverableStatus),
  },
  handler: async (ctx, args): Promise<Doc<"deliverables">[]> => {
    if (args.status !== undefined) {
      const status = args.status;
      return await ctx.db
        .query("deliverables")
        .withIndex("by_tenant_status", (q) =>
          q.eq("tenantId", args.tenantId).eq("status", status),
        )
        .collect();
    }
    return await ctx.db
      .query("deliverables")
      .withIndex("by_tenant_status", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});

export const getProofContext = query({
  args: { deliverableId: v.id("deliverables") },
  handler: async (ctx, args) => {
    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) return null;
    const drafts = await ctx.db
      .query("drafts")
      .withIndex("by_deliverable", (q) =>
        q.eq("deliverableId", args.deliverableId),
      )
      .collect();
    const latestDraft = drafts.at(-1) ?? null;
    const verifications = latestDraft
      ? await ctx.db
          .query("verifications")
          .withIndex("by_draft", (q) => q.eq("draftId", latestDraft._id))
          .collect()
      : [];
    const approvals = await ctx.db
      .query("approvals")
      .withIndex("by_deliverable", (q) =>
        q.eq("deliverableId", args.deliverableId),
      )
      .collect();
    return { deliverable, latestDraft, verifications, approvals };
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

export const listAccountEvents = query({
  args: {
    tenantId: v.id("tenants"),
    accountId: v.id("clientAccounts"),
  },
  handler: async (ctx, args) =>
    ctx.db
      .query("events")
      .withIndex("by_account", (q) =>
        q.eq("tenantId", args.tenantId).eq("accountId", args.accountId),
      )
      .collect(),
});
