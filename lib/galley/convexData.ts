import "server-only";

import { ConvexHttpClient } from "convex/browser";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type {
  ApprovalAction,
  ClientAccount,
  Deliverable,
  Draft,
  Event,
  EventActorType,
  GalleyEventType,
  Playbook,
  Verification,
} from "./types";

// Server-side facade over the Convex backend (feat/convex trial).
// Maps Convex documents (_id/_creationTime) onto the canonical lib/galley
// types the UI already consumes.

export function isBackendConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}

function client(): ConvexHttpClient {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  return new ConvexHttpClient(url);
}

/** Convex client carrying the signed-in user's token, for authenticated mutations. */
async function authedClient(): Promise<ConvexHttpClient> {
  const instance = client();
  const token = await convexAuthNextjsToken();
  if (token) instance.setAuth(token);
  return instance;
}

const toIso = (ms: number) => new Date(ms).toISOString();

export interface QueueRow {
  deliverable: Deliverable;
  account: ClientAccount;
  playbook: Playbook | null;
  draft: Draft | null;
  verification: Verification | null;
  deterministicVerification: Verification | null;
  llmVerification: Verification | null;
  eventCount: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapDeliverable(doc: any): Deliverable {
  return {
    id: doc._id,
    tenantId: doc.tenantId,
    accountId: doc.accountId,
    period: doc.period,
    type: doc.type,
    channel: doc.channel,
    title: doc.title,
    status: doc.status,
    createdAt: toIso(doc._creationTime),
    updatedAt: toIso(doc._creationTime),
  };
}

function mapAccount(doc: any): ClientAccount {
  return {
    id: doc._id,
    tenantId: doc.tenantId,
    name: doc.name,
    website: doc.website,
    industry: doc.industry,
    targetAudience: doc.targetAudience,
    primaryOffer: doc.primaryOffer,
    status: doc.status,
    createdAt: toIso(doc._creationTime),
  };
}

function mapPlaybook(doc: any): Playbook {
  return {
    id: doc._id,
    tenantId: doc.tenantId,
    accountId: doc.accountId,
    version: doc.version,
    voice: doc.voice,
    approvedClaims: doc.approvedClaims,
    forbiddenClaims: doc.forbiddenClaims,
    channels: doc.channels,
    reportingKpi: doc.reportingKpi,
    createdAt: toIso(doc._creationTime),
  };
}

function mapDraft(doc: any): Draft {
  return {
    id: doc._id,
    tenantId: doc.tenantId,
    deliverableId: doc.deliverableId,
    version: doc.version,
    title: doc.title,
    content: doc.content,
    model: doc.model,
    playbookVersion: doc.playbookVersion,
    createdAt: toIso(doc._creationTime),
  };
}

function mapVerification(doc: any): Verification {
  return {
    id: doc._id,
    tenantId: doc.tenantId,
    draftId: doc.draftId,
    result: doc.result,
    reasons: doc.reasons,
    rubricVersion: doc.rubricVersion,
    createdAt: toIso(doc._creationTime),
  };
}

function mapEvent(doc: any): Event {
  return {
    id: doc._id,
    tenantId: doc.tenantId,
    accountId: doc.accountId,
    actorType: doc.actorType as EventActorType,
    actorLabel: doc.actorLabel,
    type: doc.type as GalleyEventType,
    subjectRef: doc.subjectRef,
    payload: doc.payload ?? {},
    createdAt: toIso(doc._creationTime),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getQueueDetails(): Promise<QueueRow[]> {
  const rows = await (await authedClient()).query(api.galley.getQueue, {});
  return rows
    .filter((row) => row.account)
    .map((row) => ({
      deliverable: mapDeliverable(row.deliverable),
      account: mapAccount(row.account),
      playbook: row.playbook ? mapPlaybook(row.playbook) : null,
      draft: row.draft ? mapDraft(row.draft) : null,
      verification: row.verification ? mapVerification(row.verification) : null,
      deterministicVerification: row.deterministicVerification
        ? mapVerification(row.deterministicVerification)
        : null,
      llmVerification: row.llmVerification ? mapVerification(row.llmVerification) : null,
      eventCount: row.eventCount as number,
    }));
}

export async function listEventsForDeliverable(deliverableId: string): Promise<Event[]> {
  const rows = await (await authedClient()).query(api.galley.getEventsForDeliverable, {
    deliverableId: deliverableId as Id<"deliverables">,
  });
  return rows.map(mapEvent);
}

export async function seedDemo(): Promise<{ created: number }> {
  return await (await authedClient()).mutation(api.galley.seedDemo, {});
}

export async function resetDemo(): Promise<{ removed: number }> {
  return await (await authedClient()).mutation(api.galley.resetDemo, {});
}

export async function listAccountsWithPlaybooks(): Promise<
  Array<{ account: ClientAccount; playbook: Playbook | null }>
> {
  const rows = await (await authedClient()).query(api.galley.listAccounts, {});
  return rows.map((row) => ({
    account: mapAccount(row.account),
    playbook: row.playbook ? mapPlaybook(row.playbook) : null,
  }));
}

export async function intakeDraft(input: {
  accountId: string;
  title: string;
  type: string;
  channel: string;
  period: string;
  content: string;
  source: string;
}): Promise<{ deliverableId: string; result: "pass" | "fail" }> {
  return await (await authedClient()).mutation(api.galley.intakeDraft, {
    ...input,
    accountId: input.accountId as Id<"clientAccounts">,
  });
}

export async function createClientWithPlaybook(input: {
  name: string;
  website: string;
  industry: string;
  targetAudience: string;
  primaryOffer: string;
  voice: string;
  approvedClaims: string[];
  forbiddenClaims: string[];
  channels: string[];
  reportingKpi: string;
}): Promise<{ accountId: string; playbookId: string; version: number }> {
  return await (await authedClient()).mutation(api.galley.createClientWithPlaybook, input);
}

export async function recordProofDecision(input: {
  deliverableId: string;
  action: ApprovalAction;
  editContent?: string;
  note?: string;
}): Promise<{ status: string; draftVersion?: number; result?: "pass" | "fail" }> {
  const convex = await authedClient();
  return await convex.mutation(api.galley.recordProofDecision, {
    ...input,
    deliverableId: input.deliverableId as Id<"deliverables">,
  });
}

/** The signed-in reviewer's display identity, or null if unauthenticated. */
export async function getCurrentReviewer(): Promise<{ name: string; email: string } | null> {
  const convex = await authedClient();
  const user = await convex.query(api.galley.currentUser, {});
  if (!user) return null;
  return { name: user.name ?? user.email ?? "Reviewer", email: user.email ?? "" };
}
