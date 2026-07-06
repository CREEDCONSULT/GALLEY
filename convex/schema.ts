import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Galley domain schema. Mirrors lib/galley/types.ts.
//
// Invariant notes (enforced in convex/galley.ts — Convex has no triggers, so
// mutations are the only write path and must stay the only write path):
// 1. `events` is append-only: no mutation may patch or delete an event.
// 2. No deliverable reaches `scheduled`/`published` without a recorded
//    human `approve` action.
// 3. Drafts and verifications are immutable versions; edits insert new rows.

export const deliverableStatus = v.union(
  v.literal("drafting"),
  v.literal("verifying"),
  v.literal("awaiting_proof"),
  v.literal("approved"),
  v.literal("scheduled"),
  v.literal("published"),
  v.literal("rejected"),
  v.literal("escalated"),
);

export const approvalAction = v.union(
  v.literal("approve"),
  v.literal("edit"),
  v.literal("reject"),
);

export const actorType = v.union(
  v.literal("system"),
  v.literal("generator"),
  v.literal("verifier"),
  v.literal("human"),
);

export default defineSchema({
  // Convex Auth tables (users, authAccounts, authSessions, …).
  ...authTables,

  tenants: defineTable({
    name: v.string(),
  }),

  // Workspace membership: which authenticated user belongs to which tenant,
  // and their role. Enforces tenant isolation once auth is live.
  memberships: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    role: v.union(v.literal("owner"), v.literal("manager"), v.literal("reviewer")),
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"]),

  clientAccounts: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    website: v.string(),
    industry: v.string(),
    targetAudience: v.string(),
    primaryOffer: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("archived"),
    ),
  }).index("by_tenant", ["tenantId"]),

  playbooks: defineTable({
    tenantId: v.id("tenants"),
    accountId: v.id("clientAccounts"),
    version: v.number(),
    voice: v.string(),
    approvedClaims: v.array(v.string()),
    forbiddenClaims: v.array(v.string()),
    channels: v.array(v.string()),
    reportingKpi: v.string(),
  })
    .index("by_account", ["accountId", "version"])
    .index("by_tenant", ["tenantId"]),

  deliverables: defineTable({
    tenantId: v.id("tenants"),
    accountId: v.id("clientAccounts"),
    period: v.string(),
    type: v.string(),
    channel: v.string(),
    title: v.string(),
    status: deliverableStatus,
  })
    .index("by_tenant_status", ["tenantId", "status"])
    .index("by_account", ["accountId"]),

  drafts: defineTable({
    tenantId: v.id("tenants"),
    deliverableId: v.id("deliverables"),
    version: v.number(),
    title: v.string(),
    content: v.string(),
    model: v.string(),
    playbookVersion: v.number(),
  }).index("by_deliverable", ["deliverableId", "version"]),

  verifications: defineTable({
    tenantId: v.id("tenants"),
    draftId: v.id("drafts"),
    result: v.union(v.literal("pass"), v.literal("fail")),
    reasons: v.array(v.string()),
    rubricVersion: v.string(),
  }).index("by_draft", ["draftId"]),

  approvals: defineTable({
    tenantId: v.id("tenants"),
    deliverableId: v.id("deliverables"),
    userId: v.string(),
    action: approvalAction,
    editDiff: v.union(v.string(), v.null()),
  }).index("by_deliverable", ["deliverableId"]),

  // Append-only chain-of-custody log. Corrections append a superseding event;
  // no code path may patch or delete rows in this table.
  events: defineTable({
    tenantId: v.id("tenants"),
    accountId: v.id("clientAccounts"),
    actorType,
    actorLabel: v.string(),
    type: v.string(),
    subjectRef: v.string(),
    payload: v.any(),
  })
    .index("by_account", ["tenantId", "accountId"])
    .index("by_subject", ["subjectRef"]),
});
