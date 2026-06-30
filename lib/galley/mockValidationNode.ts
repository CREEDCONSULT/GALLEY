import type {
  Approval,
  ClientAccount,
  Deliverable,
  Draft,
  Event,
  MockValidationState,
  Playbook,
  Tenant,
  Verification,
} from "./types.ts";

export type MockClientName =
  | "Glow Skincare"
  | "Northshore Fitness"
  | "Acme Corp"
  | "Day One";

type MockClientDefinition = {
  slug: string;
  website: string;
  industry: string;
  targetAudience: string;
  primaryOffer: string;
  voice: string;
  approvedClaims: string[];
  forbiddenClaims: string[];
  channels: string[];
  reportingKpi: string;
  deliverable: {
    type: string;
    channel: string;
    title: string;
    content: string;
  };
};

const CREATED_AT = "2026-06-29T13:00:00.000Z";
const MOCK_REVIEWER_ID = "00000000-0000-4000-8000-000000000101";

export const MOCK_TENANT: Tenant = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Northline Studio",
  createdAt: CREATED_AT,
};

const definitions: Record<MockClientName, MockClientDefinition> = {
  "Glow Skincare": {
    slug: "glow",
    website: "https://glowskincare.example",
    industry: "Skincare and personal care",
    targetAudience: "Ingredient-aware customers with sensitive skin",
    primaryOffer: "A barrier-support skincare system for sensitive skin",
    voice: "Precise, warm, ingredient-literate, and never breathless.",
    approvedClaims: ["Dermatologist tested", "Fragrance free"],
    forbiddenClaims: ["cure", "guaranteed results", "cleanest"],
    channels: ["Website", "Email", "Instagram"],
    reportingKpi: "Qualified product-page visits",
    deliverable: {
      type: "Landing page",
      channel: "Website",
      title: "Barrier care launch page",
      content:
        "A calmer approach to barrier care, built around what sensitive skin needs—and nothing it does not. The fragrance-free system is dermatologist tested and designed for a consistent daily ritual.",
    },
  },
  "Northshore Fitness": {
    slug: "northshore",
    website: "https://northshorefitness.example",
    industry: "Fitness and coaching",
    targetAudience: "Busy professionals rebuilding consistent training habits",
    primaryOffer: "Coach-led monthly training memberships",
    voice: "Direct, encouraging, practical, and free of transformation hype.",
    approvedClaims: ["Coach-led programming", "Flexible monthly plan"],
    forbiddenClaims: ["instant transformation", "guaranteed weight loss"],
    channels: ["Email", "Website", "LinkedIn"],
    reportingKpi: "Membership renewals",
    deliverable: {
      type: "Lifecycle email",
      channel: "Email",
      title: "June member retention email",
      content:
        "Your next month starts before the calendar turns. Your coach has prepared a flexible monthly plan for the weeks ahead, with clear sessions and room for real life.",
    },
  },
  "Acme Corp": {
    slug: "acme",
    website: "https://acme.example",
    industry: "B2B operations software",
    targetAudience: "Operations leaders at growing mid-market companies",
    primaryOffer: "A governed procurement operations platform",
    voice: "Operational, exact, informed, and concise.",
    approvedClaims: ["Role-based controls", "Configurable approval paths"],
    forbiddenClaims: ["eliminates all risk", "fully autonomous procurement"],
    channels: ["Resource center", "LinkedIn", "Email"],
    reportingKpi: "Qualified demo requests",
    deliverable: {
      type: "Article",
      channel: "Resource center",
      title: "Procurement operations guide",
      content:
        "A practical operating model for teams that need role-based procurement controls without slowing every purchasing decision. Start with ownership, thresholds, and configurable approval paths.",
    },
  },
  "Day One": {
    slug: "day-one",
    website: "https://dayone.example",
    industry: "Productivity and planning",
    targetAudience: "Independent operators building sustainable work routines",
    primaryOffer: "A guided daily planning system",
    voice: "Clear, grounded, optimistic, and never absolute.",
    approvedClaims: ["Guided daily planning", "Reusable weekly review"],
    forbiddenClaims: ["guaranteed", "the only system", "change your life overnight"],
    channels: ["LinkedIn", "Instagram", "Email"],
    reportingKpi: "Trial starts",
    deliverable: {
      type: "Paid social",
      channel: "Instagram",
      title: "Summer launch paid social",
      content:
        "The only system you will ever need—guaranteed to change how you work from the first week. Start Day One today.",
    },
  },
};

export const MOCK_CLIENT_NAMES = Object.keys(definitions) as MockClientName[];

function atMinute(offset: number): string {
  return new Date(Date.parse(CREATED_AT) + offset * 60_000).toISOString();
}

function event(
  deliverable: Deliverable,
  type: Event["type"],
  actorType: Event["actorType"],
  actorLabel: string,
  createdAt: string,
  payload: Record<string, unknown>,
): Event {
  return {
    id: `evt-${deliverable.id}-${type}-${createdAt}`,
    tenantId: deliverable.tenantId,
    accountId: deliverable.accountId,
    actorType,
    actorLabel,
    type,
    subjectRef: deliverable.id,
    payload: { deliverableId: deliverable.id, ...payload },
    createdAt,
  };
}

export function createMockClientAccount(
  name: MockClientName = "Glow Skincare",
  tenantId = MOCK_TENANT.id,
): ClientAccount {
  const definition = definitions[name];
  return {
    id: `account-${definition.slug}`,
    tenantId,
    name,
    website: definition.website,
    industry: definition.industry,
    targetAudience: definition.targetAudience,
    primaryOffer: definition.primaryOffer,
    status: "active",
    createdAt: CREATED_AT,
  };
}

export function createMockPlaybook(account: ClientAccount): Playbook {
  const name = account.name as MockClientName;
  const definition = definitions[name];
  if (!definition) {
    throw new Error(`No mock playbook definition exists for ${account.name}.`);
  }

  return {
    id: `playbook-${definition.slug}-v1`,
    tenantId: account.tenantId,
    accountId: account.id,
    version: 1,
    voice: definition.voice,
    approvedClaims: definition.approvedClaims,
    forbiddenClaims: definition.forbiddenClaims,
    channels: definition.channels,
    reportingKpi: definition.reportingKpi,
    createdAt: CREATED_AT,
  };
}

export function verifyMockDraft(
  draft: Draft,
  playbook: Playbook,
  createdAt = atMinute(3),
): Verification {
  const content = draft.content.toLowerCase();
  const violations = playbook.forbiddenClaims.filter((claim) =>
    content.includes(claim.toLowerCase()),
  );
  const result = violations.length === 0 ? "pass" : "fail";

  return {
    id: `verification-${draft.id}-r1`,
    tenantId: draft.tenantId,
    draftId: draft.id,
    result,
    reasons:
      result === "pass"
        ? [
            "Voice matches the selected playbook.",
            "No forbidden claims were found.",
            "Channel and offer context are present.",
          ]
        : violations.map(
            (claim) => `Forbidden claim detected: “${claim}”.`,
          ),
    rubricVersion: "galley-validation-v1",
    createdAt,
  };
}

export function generateMockDeliverables(
  accounts: ClientAccount[] = MOCK_CLIENT_NAMES.map((name) =>
    createMockClientAccount(name),
  ),
  playbooks: Playbook[] = accounts.map(createMockPlaybook),
): Pick<MockValidationState, "deliverables" | "drafts" | "verifications" | "events"> {
  const deliverables: Deliverable[] = [];
  const drafts: Draft[] = [];
  const verifications: Verification[] = [];
  const events: Event[] = [];

  accounts.forEach((account, index) => {
    const definition = definitions[account.name as MockClientName];
    const playbook = playbooks.find((candidate) => candidate.accountId === account.id);
    if (!definition || !playbook) {
      throw new Error(`Mock generation is missing a definition or playbook for ${account.name}.`);
    }

    const offset = index * 10;
    const initialDeliverable: Deliverable = {
      id: `deliverable-${definition.slug}-001`,
      tenantId: account.tenantId,
      accountId: account.id,
      period: "2026-06",
      type: definition.deliverable.type,
      channel: definition.deliverable.channel,
      title: definition.deliverable.title,
      status: "verifying",
      createdAt: atMinute(offset),
      updatedAt: atMinute(offset + 2),
    };
    const draft: Draft = {
      id: `draft-${definition.slug}-v1`,
      tenantId: account.tenantId,
      deliverableId: initialDeliverable.id,
      version: 1,
      title: definition.deliverable.title,
      content: definition.deliverable.content,
      model: "mock-galley-generator-v1",
      playbookVersion: playbook.version,
      createdAt: atMinute(offset + 1),
    };
    const verification = verifyMockDraft(
      draft,
      playbook,
      atMinute(offset + 2),
    );
    const deliverable: Deliverable = {
      ...initialDeliverable,
      status: verification.result === "pass" ? "awaiting_proof" : "escalated",
      updatedAt: atMinute(offset + 3),
    };

    deliverables.push(deliverable);
    drafts.push(draft);
    verifications.push(verification);
    events.push(
      event(
        deliverable,
        "playbook.selected",
        "system",
        "Galley",
        atMinute(offset),
        { playbookId: playbook.id, playbookVersion: playbook.version },
      ),
      event(
        deliverable,
        "draft.generated",
        "generator",
        "Mock generator",
        atMinute(offset + 1),
        { draftId: draft.id, draftVersion: draft.version, model: draft.model },
      ),
      event(
        deliverable,
        verification.result === "pass"
          ? "verification.passed"
          : "verification.failed",
        "verifier",
        "Galley verifier",
        atMinute(offset + 2),
        {
          verificationId: verification.id,
          result: verification.result,
          reasons: verification.reasons,
          rubricVersion: verification.rubricVersion,
        },
      ),
    );

    if (verification.result === "pass") {
      events.push(
        event(
          deliverable,
          "deliverable.awaiting_proof",
          "system",
          "Galley",
          atMinute(offset + 3),
          { status: "awaiting_proof" },
        ),
      );
    }
  });

  return { deliverables, drafts, verifications, events };
}

export function approveDeliverable(
  deliverable: Deliverable,
  userId = MOCK_REVIEWER_ID,
  actorLabel = "Oliver Grant",
  createdAt = new Date().toISOString(),
): { deliverable: Deliverable; approval: Approval; event: Event } {
  const updated: Deliverable = {
    ...deliverable,
    status: "approved",
    updatedAt: createdAt,
  };
  const approval: Approval = {
    id: `approval-${deliverable.id}-approve-${createdAt}`,
    tenantId: deliverable.tenantId,
    deliverableId: deliverable.id,
    userId,
    action: "approve",
    editDiff: null,
    createdAt,
  };

  return {
    deliverable: updated,
    approval,
    event: event(
      updated,
      "human.approved",
      "human",
      actorLabel,
      createdAt,
      { approvalId: approval.id, action: approval.action, status: updated.status },
    ),
  };
}

export function editDeliverable(
  deliverable: Deliverable,
  draft: Draft,
  editDiff = "Reviewer requested a claims and source correction.",
  updatedContent = draft.content,
  userId = MOCK_REVIEWER_ID,
  actorLabel = "Oliver Grant",
  createdAt = new Date().toISOString(),
): { deliverable: Deliverable; draft: Draft; approval: Approval; event: Event } {
  const updatedDeliverable: Deliverable = {
    ...deliverable,
    status: "verifying",
    updatedAt: createdAt,
  };
  const updatedDraft: Draft = {
    ...draft,
    id: `${draft.id.replace(/-v\d+$/, "")}-v${draft.version + 1}`,
    version: draft.version + 1,
    content: updatedContent,
    createdAt,
  };
  const approval: Approval = {
    id: `approval-${deliverable.id}-edit-${createdAt}`,
    tenantId: deliverable.tenantId,
    deliverableId: deliverable.id,
    userId,
    action: "edit",
    editDiff,
    createdAt,
  };

  return {
    deliverable: updatedDeliverable,
    draft: updatedDraft,
    approval,
    event: event(
      updatedDeliverable,
      "human.edited",
      "human",
      actorLabel,
      createdAt,
      {
        approvalId: approval.id,
        action: approval.action,
        editDiff,
        draftId: updatedDraft.id,
        draftVersion: updatedDraft.version,
        status: updatedDeliverable.status,
      },
    ),
  };
}

export function rejectDeliverable(
  deliverable: Deliverable,
  reason = "Reviewer rejected this version at the proof gate.",
  userId = MOCK_REVIEWER_ID,
  actorLabel = "Oliver Grant",
  createdAt = new Date().toISOString(),
): { deliverable: Deliverable; approval: Approval; event: Event } {
  const updated: Deliverable = {
    ...deliverable,
    status: "rejected",
    updatedAt: createdAt,
  };
  const approval: Approval = {
    id: `approval-${deliverable.id}-reject-${createdAt}`,
    tenantId: deliverable.tenantId,
    deliverableId: deliverable.id,
    userId,
    action: "reject",
    editDiff: reason,
    createdAt,
  };

  return {
    deliverable: updated,
    approval,
    event: event(
      updated,
      "human.rejected",
      "human",
      actorLabel,
      createdAt,
      { approvalId: approval.id, action: approval.action, reason, status: updated.status },
    ),
  };
}

export function buildRecordTimeline(
  deliverableId: string,
  events: Event[],
): Event[] {
  return events
    .filter((candidate) => candidate.subjectRef === deliverableId)
    .sort((left, right) => {
      const timeDifference = Date.parse(left.createdAt) - Date.parse(right.createdAt);
      return timeDifference === 0 ? left.id.localeCompare(right.id) : timeDifference;
    });
}

export function createMockValidationState(): MockValidationState {
  const accounts = MOCK_CLIENT_NAMES.map((name) => createMockClientAccount(name));
  const playbooks = accounts.map(createMockPlaybook);
  const generated = generateMockDeliverables(accounts, playbooks);

  return {
    tenant: MOCK_TENANT,
    accounts,
    playbooks,
    approvals: [],
    ...generated,
  };
}
