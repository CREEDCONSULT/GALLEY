import "server-only";

import { createClient } from "@/utils/supabase/server";
import { assertApprovalBeforeScheduling } from "./invariants";
import type {
  Approval,
  ApprovalAction,
  ClientAccount,
  ClientAccountStatus,
  Deliverable,
  DeliverableStatus,
  Draft,
  Event,
  EventActorType,
  GalleyEventType,
  Playbook,
  Tenant,
  Verification,
  VerificationResult,
} from "./types";

type Row = Record<string, unknown>;
type SupabaseError = { message: string; code?: string; details?: string | null; hint?: string | null };

export type ClientAccountInput = {
  name: string;
  website: string;
  industry: string;
  targetAudience: string;
  primaryOffer: string;
  status?: ClientAccountStatus;
};

export type PlaybookInput = {
  accountId: string;
  version: number;
  voice: string;
  approvedClaims: string[];
  forbiddenClaims: string[];
  channels: string[];
  reportingKpi: string;
};

export type DeliverableInput = {
  accountId: string;
  period: string;
  type: string;
  channel: string;
  title: string;
  status?: DeliverableStatus;
};

export type DeliverableFilters = {
  accountId?: string;
  period?: string;
  status?: DeliverableStatus | DeliverableStatus[];
};

export type DraftInput = {
  deliverableId: string;
  version: number;
  title: string;
  content: string;
  model: string;
  playbookVersion: number;
};

export type VerificationInput = {
  draftId: string;
  result: VerificationResult;
  reasons: string[];
  rubricVersion: string;
};

export type ApprovalInput = {
  deliverableId: string;
  action: ApprovalAction;
  editDiff?: string | null;
};

export type EventInput = {
  accountId: string;
  actorType: EventActorType;
  actorLabel: string;
  type: GalleyEventType;
  subjectRef: string;
  payload?: Record<string, unknown>;
};

export type DeliverableWithCurrentDraft = {
  deliverable: Deliverable;
  account: ClientAccount;
  playbook: Playbook | null;
  draft: Draft | null;
  verification: Verification | null;
};

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberValue(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function mapTenant(row: Row): Tenant {
  return {
    id: stringValue(row.id),
    name: stringValue(row.name),
    createdAt: stringValue(row.created_at),
  };
}

function mapClientAccount(row: Row): ClientAccount {
  return {
    id: stringValue(row.id),
    tenantId: stringValue(row.tenant_id),
    name: stringValue(row.name),
    website: stringValue(row.website),
    industry: stringValue(row.industry),
    targetAudience: stringValue(row.target_audience),
    primaryOffer: stringValue(row.primary_offer),
    status: stringValue(row.status) as ClientAccountStatus,
    createdAt: stringValue(row.created_at),
  };
}

function mapPlaybook(row: Row): Playbook {
  return {
    id: stringValue(row.id),
    tenantId: stringValue(row.tenant_id),
    accountId: stringValue(row.account_id),
    version: numberValue(row.version),
    voice: stringValue(row.voice),
    approvedClaims: stringArray(row.approved_claims),
    forbiddenClaims: stringArray(row.forbidden_claims),
    channels: stringArray(row.channels),
    reportingKpi: stringValue(row.reporting_kpi),
    createdAt: stringValue(row.created_at),
  };
}

function mapDeliverable(row: Row): Deliverable {
  return {
    id: stringValue(row.id),
    tenantId: stringValue(row.tenant_id),
    accountId: stringValue(row.account_id),
    period: stringValue(row.period),
    type: stringValue(row.type),
    channel: stringValue(row.channel),
    title: stringValue(row.title),
    status: stringValue(row.status) as DeliverableStatus,
    createdAt: stringValue(row.created_at),
    updatedAt: stringValue(row.updated_at),
  };
}

function mapDraft(row: Row): Draft {
  return {
    id: stringValue(row.id),
    tenantId: stringValue(row.tenant_id),
    deliverableId: stringValue(row.deliverable_id),
    version: numberValue(row.version),
    title: stringValue(row.title),
    content: stringValue(row.content),
    model: stringValue(row.model),
    playbookVersion: numberValue(row.playbook_version),
    createdAt: stringValue(row.created_at),
  };
}

function mapVerification(row: Row): Verification {
  return {
    id: stringValue(row.id),
    tenantId: stringValue(row.tenant_id),
    draftId: stringValue(row.draft_id),
    result: stringValue(row.result) as VerificationResult,
    reasons: stringArray(row.reasons),
    rubricVersion: stringValue(row.rubric_version),
    createdAt: stringValue(row.created_at),
  };
}

function mapApproval(row: Row): Approval {
  return {
    id: stringValue(row.id),
    tenantId: stringValue(row.tenant_id),
    deliverableId: stringValue(row.deliverable_id),
    userId: stringValue(row.user_id),
    action: stringValue(row.action) as ApprovalAction,
    editDiff: typeof row.edit_diff === "string" ? row.edit_diff : null,
    createdAt: stringValue(row.created_at),
  };
}

function mapEvent(row: Row): Event {
  return {
    id: stringValue(row.id),
    tenantId: stringValue(row.tenant_id),
    accountId: stringValue(row.account_id),
    actorType: stringValue(row.actor_type) as EventActorType,
    actorLabel: stringValue(row.actor_label),
    type: stringValue(row.type) as GalleyEventType,
    subjectRef: stringValue(row.subject_ref),
    payload: recordValue(row.payload),
    createdAt: stringValue(row.created_at),
  };
}

function fail(context: string, error: SupabaseError | null): never {
  const message = error?.message ?? "Supabase returned no data and no diagnostic.";
  const rlsBlocked = error?.code === "42501" || /row.level security|permission denied/i.test(message);
  if (rlsBlocked) {
    throw new Error(`${context}: blocked by Supabase Row Level Security. Confirm the user owns this tenant and all Galley migrations are applied. ${message}`);
  }
  const detail = [error?.code && `code ${error.code}`, error?.details, error?.hint].filter(Boolean).join("; ");
  throw new Error(`${context}: ${message}${detail ? ` (${detail})` : ""}`);
}

function missing(entity: string, id: string): never {
  throw new Error(`${entity} not found or is not visible to the authenticated tenant: ${id}`);
}

async function authenticatedContext() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart Galley.");
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) fail("Authentication required", error);
  return { supabase, user: data.user };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getAuthenticatedUserId(): Promise<string> {
  const { user } = await authenticatedContext();
  return user.id;
}

export async function getOrCreateDefaultTenant(): Promise<Tenant> {
  const { supabase, user } = await authenticatedContext();
  const existing = await supabase
    .from("tenants")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (existing.error) fail("Failed to select the authenticated user's default tenant", existing.error);
  if (existing.data) return mapTenant(existing.data);

  const created = await supabase
    .from("tenants")
    .insert({
      owner_user_id: user.id,
      name: user.user_metadata?.workspace_name ?? "My Galley Workspace",
    })
    .select("*")
    .single();
  if (created.error || !created.data) fail("Failed to insert a default tenant", created.error);
  return mapTenant(created.data);
}

export async function createClientAccount(input: ClientAccountInput): Promise<ClientAccount> {
  const tenant = await getOrCreateDefaultTenant();
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("client_accounts")
    .insert({
      tenant_id: tenant.id,
      name: input.name,
      website: input.website,
      industry: input.industry,
      target_audience: input.targetAudience,
      primary_offer: input.primaryOffer,
      status: input.status ?? "active",
    })
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to insert client account", result.error);
  return mapClientAccount(result.data);
}

export async function listClientAccounts(): Promise<ClientAccount[]> {
  const tenant = await getOrCreateDefaultTenant();
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("client_accounts")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: true });
  if (result.error) fail("Failed to select client accounts", result.error);
  return (result.data ?? []).map(mapClientAccount);
}

export async function createPlaybook(input: PlaybookInput): Promise<Playbook> {
  const tenant = await getOrCreateDefaultTenant();
  const account = await getAccount(input.accountId);
  if (account.tenantId !== tenant.id) missing("Client account", input.accountId);
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("playbooks")
    .insert({
      tenant_id: tenant.id,
      account_id: input.accountId,
      version: input.version,
      voice: input.voice,
      approved_claims: input.approvedClaims,
      forbidden_claims: input.forbiddenClaims,
      channels: input.channels,
      reporting_kpi: input.reportingKpi,
    })
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to insert playbook", result.error);
  return mapPlaybook(result.data);
}

export async function getLatestPlaybook(accountId: string): Promise<Playbook | null> {
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("playbooks")
    .select("*")
    .eq("account_id", accountId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (result.error) fail("Failed to select latest playbook", result.error);
  return result.data ? mapPlaybook(result.data) : null;
}

export async function createDeliverable(input: DeliverableInput): Promise<Deliverable> {
  const tenant = await getOrCreateDefaultTenant();
  const account = await getAccount(input.accountId);
  if (account.tenantId !== tenant.id) missing("Client account", input.accountId);
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("deliverables")
    .insert({
      tenant_id: tenant.id,
      account_id: input.accountId,
      period: input.period,
      type: input.type,
      channel: input.channel,
      title: input.title,
      status: input.status ?? "drafting",
    })
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to insert deliverable", result.error);
  return mapDeliverable(result.data);
}

export async function listDeliverables(filters: DeliverableFilters = {}): Promise<Deliverable[]> {
  const tenant = await getOrCreateDefaultTenant();
  const { supabase } = await authenticatedContext();
  let query = supabase
    .from("deliverables")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: true });
  if (filters.accountId) query = query.eq("account_id", filters.accountId);
  if (filters.period) query = query.eq("period", filters.period);
  if (Array.isArray(filters.status)) query = query.in("status", filters.status);
  else if (filters.status) query = query.eq("status", filters.status);
  const result = await query;
  if (result.error) fail("Failed to select deliverables", result.error);
  return (result.data ?? []).map(mapDeliverable);
}

async function getDeliverable(deliverableId: string): Promise<Deliverable> {
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("deliverables")
    .select("*")
    .eq("id", deliverableId)
    .maybeSingle();
  if (result.error) fail("Failed to select deliverable", result.error);
  if (!result.data) missing("Deliverable", deliverableId);
  return mapDeliverable(result.data);
}

async function getAccount(accountId: string): Promise<ClientAccount> {
  const { supabase } = await authenticatedContext();
  const result = await supabase.from("client_accounts").select("*").eq("id", accountId).maybeSingle();
  if (result.error) fail("Failed to select client account", result.error);
  if (!result.data) missing("Client account", accountId);
  return mapClientAccount(result.data);
}

export async function getDeliverableWithCurrentDraft(
  deliverableId: string,
): Promise<DeliverableWithCurrentDraft> {
  const deliverable = await getDeliverable(deliverableId);
  const { supabase } = await authenticatedContext();
  const [accountResult, draftResult, playbook] = await Promise.all([
    supabase.from("client_accounts").select("*").eq("id", deliverable.accountId).maybeSingle(),
    supabase.from("drafts").select("*").eq("deliverable_id", deliverable.id).order("version", { ascending: false }).limit(1).maybeSingle(),
    getLatestPlaybook(deliverable.accountId),
  ]);
  if (accountResult.error) fail("Failed to select deliverable account", accountResult.error);
  if (!accountResult.data) missing("Client account", deliverable.accountId);
  if (draftResult.error) fail("Failed to select current draft", draftResult.error);
  const draft = draftResult.data ? mapDraft(draftResult.data) : null;
  let verification: Verification | null = null;
  if (draft) {
    const verificationResult = await supabase
      .from("verifications")
      .select("*")
      .eq("draft_id", draft.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (verificationResult.error) fail("Failed to select current draft verification", verificationResult.error);
    verification = verificationResult.data ? mapVerification(verificationResult.data) : null;
  }
  return {
    deliverable,
    account: mapClientAccount(accountResult.data),
    playbook,
    draft,
    verification,
  };
}

export async function createDraft(input: DraftInput): Promise<Draft> {
  const deliverable = await getDeliverable(input.deliverableId);
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("drafts")
    .insert({
      tenant_id: deliverable.tenantId,
      deliverable_id: deliverable.id,
      version: input.version,
      title: input.title,
      content: input.content,
      model: input.model,
      playbook_version: input.playbookVersion,
    })
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to insert draft", result.error);
  return mapDraft(result.data);
}

export async function createVerification(input: VerificationInput): Promise<Verification> {
  const { supabase } = await authenticatedContext();
  const draftResult = await supabase.from("drafts").select("tenant_id").eq("id", input.draftId).single();
  if (draftResult.error || !draftResult.data) fail("Failed to select the draft for verification", draftResult.error);
  const result = await supabase
    .from("verifications")
    .insert({
      tenant_id: draftResult.data.tenant_id,
      draft_id: input.draftId,
      result: input.result,
      reasons: input.reasons,
      rubric_version: input.rubricVersion,
    })
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to insert verification", result.error);
  return mapVerification(result.data);
}

export async function createApproval(input: ApprovalInput): Promise<Approval> {
  const deliverable = await getDeliverable(input.deliverableId);
  const { supabase, user } = await authenticatedContext();
  const result = await supabase
    .from("approvals")
    .insert({
      tenant_id: deliverable.tenantId,
      deliverable_id: deliverable.id,
      user_id: user.id,
      action: input.action,
      edit_diff: input.editDiff ?? null,
    })
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to insert human approval decision", result.error);
  return mapApproval(result.data);
}

export async function appendEvent(input: EventInput): Promise<Event> {
  const tenant = await getOrCreateDefaultTenant();
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("events")
    .insert({
      tenant_id: tenant.id,
      account_id: input.accountId,
      actor_type: input.actorType,
      actor_label: input.actorLabel,
      type: input.type,
      subject_ref: input.subjectRef,
      payload: input.payload ?? {},
    })
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to append chain-of-custody event", result.error);
  return mapEvent(result.data);
}

export async function listEventsForAccount(accountId: string): Promise<Event[]> {
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("events")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: true });
  if (result.error) fail("Failed to select account events", result.error);
  return (result.data ?? []).map(mapEvent);
}

export async function listEventsForDeliverable(deliverableId: string): Promise<Event[]> {
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("events")
    .select("*")
    .eq("subject_ref", deliverableId)
    .order("created_at", { ascending: true });
  if (result.error) fail("Failed to select deliverable events", result.error);
  return (result.data ?? []).map(mapEvent);
}

async function listApprovalsForDeliverable(deliverableId: string): Promise<Approval[]> {
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("approvals")
    .select("*")
    .eq("deliverable_id", deliverableId)
    .order("created_at", { ascending: true });
  if (result.error) fail("Failed to select deliverable approvals", result.error);
  return (result.data ?? []).map(mapApproval);
}

export async function updateDeliverableStatus(
  deliverableId: string,
  status: DeliverableStatus,
): Promise<Deliverable> {
  const deliverable = await getDeliverable(deliverableId);
  if (status === "approved" || status === "scheduled" || status === "published") {
    const approvals = await listApprovalsForDeliverable(deliverableId);
    assertApprovalBeforeScheduling(deliverable, approvals);
  }
  const { supabase } = await authenticatedContext();
  const result = await supabase
    .from("deliverables")
    .update({ status })
    .eq("id", deliverableId)
    .select("*")
    .single();
  if (result.error || !result.data) fail("Failed to update deliverable status", result.error);
  return mapDeliverable(result.data);
}

export async function resetDemoValidationData(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo reset is disabled in production.");
  }
  const tenant = await getOrCreateDefaultTenant();
  const accounts = await listClientAccounts();
  const { supabase, user } = await authenticatedContext();

  if (accounts.length > 0) {
    const resetEvents = accounts.map((account) => ({
      tenant_id: tenant.id,
      account_id: account.id,
      actor_type: "human",
      actor_label: user.email ?? "Local demo operator",
      type: "demo.reset",
      subject_ref: account.id,
      payload: { scope: "generated validation data", preservedEvents: true },
    }));
    const eventResult = await supabase.from("events").insert(resetEvents);
    if (eventResult.error) fail("Unable to append demo reset events", eventResult.error);
  }

  for (const table of ["approvals", "verifications", "drafts", "deliverables"] as const) {
    const result = await supabase.from(table).delete().eq("tenant_id", tenant.id);
    if (result.error) fail(`Unable to reset ${table}`, result.error);
  }
}
