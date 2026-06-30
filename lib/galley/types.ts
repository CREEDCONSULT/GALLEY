export type DeliverableStatus =
  | "drafting"
  | "verifying"
  | "awaiting_proof"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "escalated";

export type ApprovalAction = "approve" | "edit" | "reject";
export type VerificationResult = "pass" | "fail";
export type ClientAccountStatus = "active" | "paused" | "archived";
export type EventActorType = "system" | "generator" | "verifier" | "human";

export type GalleyEventType =
  | "playbook.selected"
  | "draft.generated"
  | "verification.passed"
  | "verification.failed"
  | "deliverable.awaiting_proof"
  | "human.approved"
  | "human.edited"
  | "human.rejected"
  | "deliverable.scheduled"
  | "deliverable.published";

export interface Tenant {
  id: string;
  name: string;
  createdAt: string;
}

export interface ClientAccount {
  id: string;
  tenantId: string;
  name: string;
  website: string;
  industry: string;
  targetAudience: string;
  primaryOffer: string;
  status: ClientAccountStatus;
  createdAt: string;
}

export interface Playbook {
  id: string;
  tenantId: string;
  accountId: string;
  version: number;
  voice: string;
  approvedClaims: string[];
  forbiddenClaims: string[];
  channels: string[];
  reportingKpi: string;
  createdAt: string;
}

export interface Deliverable {
  id: string;
  tenantId: string;
  accountId: string;
  period: string;
  type: string;
  channel: string;
  title: string;
  status: DeliverableStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Draft {
  id: string;
  tenantId: string;
  deliverableId: string;
  version: number;
  title: string;
  content: string;
  model: string;
  playbookVersion: number;
  createdAt: string;
}

export interface Verification {
  id: string;
  tenantId: string;
  draftId: string;
  result: VerificationResult;
  reasons: string[];
  rubricVersion: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  tenantId: string;
  deliverableId: string;
  userId: string;
  action: ApprovalAction;
  editDiff: string | null;
  createdAt: string;
}

export interface Event {
  id: string;
  tenantId: string;
  accountId: string;
  actorType: EventActorType;
  actorLabel: string;
  type: GalleyEventType;
  subjectRef: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface MockValidationState {
  tenant: Tenant;
  accounts: ClientAccount[];
  playbooks: Playbook[];
  deliverables: Deliverable[];
  drafts: Draft[];
  verifications: Verification[];
  approvals: Approval[];
  events: Event[];
}

