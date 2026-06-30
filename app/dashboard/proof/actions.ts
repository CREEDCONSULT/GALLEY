"use server";

import { revalidatePath } from "next/cache";
import {
  MOCK_CLIENT_NAMES,
  createMockClientAccount,
  createMockPlaybook,
  generateMockDeliverables,
  verifyMockDraft,
} from "@/lib/galley/mockValidationNode";
import {
  appendEvent,
  createApproval,
  createClientAccount,
  createDeliverable,
  createDraft,
  createPlaybook,
  createVerification,
  getAuthenticatedUserId,
  getDeliverableWithCurrentDraft,
  getLatestPlaybook,
  isSupabaseConfigured,
  listClientAccounts,
  listDeliverables,
  resetDemoValidationData,
  updateDeliverableStatus,
} from "@/lib/galley/repository";
import type { ClientAccount, Playbook } from "@/lib/galley/types";

export type GalleyActionResult = {
  ok: boolean;
  message: string;
};

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : "An unknown persistence error occurred.";
}

function revalidateValidationRoutes() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/proof");
  revalidatePath("/dashboard/records");
}

async function generateForAccount(account: ClientAccount, playbook: Playbook): Promise<number> {
  const existing = await listDeliverables({ accountId: account.id, period: "2026-06" });
  const targetCount = 2;
  if (existing.length >= targetCount) return 0;

  const generated = generateMockDeliverables([account], [playbook]);
  const templateDeliverable = generated.deliverables[0];
  const templateDraft = generated.drafts[0];
  let createdCount = 0;

  for (let index = existing.length; index < targetCount; index += 1) {
    const variant = index === 0 ? "Primary" : "Channel cutdown";
    const title = index === 0
      ? templateDeliverable.title
      : `${templateDeliverable.title} — ${variant}`;
    const content = index === 0
      ? templateDraft.content
      : `${templateDraft.content}\n\nChannel cutdown: ${account.primaryOffer}.`;

    const deliverable = await createDeliverable({
      accountId: account.id,
      period: "2026-06",
      type: templateDeliverable.type,
      channel: templateDeliverable.channel,
      title,
      status: "drafting",
    });
    await appendEvent({
      accountId: account.id,
      actorType: "system",
      actorLabel: "Galley demo seed",
      type: "deliverable.created",
      subjectRef: deliverable.id,
      payload: { period: deliverable.period, type: deliverable.type, channel: deliverable.channel },
    });
    await appendEvent({
      accountId: account.id,
      actorType: "system",
      actorLabel: "Galley",
      type: "playbook.selected",
      subjectRef: deliverable.id,
      payload: { playbookId: playbook.id, playbookVersion: playbook.version },
    });

    const draft = await createDraft({
      deliverableId: deliverable.id,
      version: 1,
      title,
      content,
      model: "mock-galley-generator-v1",
      playbookVersion: playbook.version,
    });
    await appendEvent({
      accountId: account.id,
      actorType: "generator",
      actorLabel: "Mock generator",
      type: "draft.generated",
      subjectRef: deliverable.id,
      payload: { draftId: draft.id, draftVersion: draft.version, model: draft.model },
    });
    await updateDeliverableStatus(deliverable.id, "verifying");
    await appendEvent({
      accountId: account.id,
      actorType: "system",
      actorLabel: "Galley",
      type: "deliverable.status_changed",
      subjectRef: deliverable.id,
      payload: { from: "drafting", to: "verifying" },
    });

    const mockVerification = verifyMockDraft(draft, playbook);
    const verification = await createVerification({
      draftId: draft.id,
      result: mockVerification.result,
      reasons: mockVerification.reasons,
      rubricVersion: mockVerification.rubricVersion,
    });
    await appendEvent({
      accountId: account.id,
      actorType: "verifier",
      actorLabel: "Galley verifier",
      type: verification.result === "pass" ? "verification.passed" : "verification.failed",
      subjectRef: deliverable.id,
      payload: {
        verificationId: verification.id,
        draftId: draft.id,
        result: verification.result,
        reasons: verification.reasons,
        rubricVersion: verification.rubricVersion,
      },
    });

    const finalStatus = verification.result === "pass" ? "awaiting_proof" : "escalated";
    await updateDeliverableStatus(deliverable.id, finalStatus);
    if (finalStatus === "awaiting_proof") {
      await appendEvent({
        accountId: account.id,
        actorType: "system",
        actorLabel: "Galley",
        type: "proof.awaiting",
        subjectRef: deliverable.id,
        payload: { verificationId: verification.id, status: finalStatus },
      });
    }
    await appendEvent({
      accountId: account.id,
      actorType: "system",
      actorLabel: "Galley",
      type: "deliverable.status_changed",
      subjectRef: deliverable.id,
      payload: { from: "verifying", to: finalStatus },
    });
    createdCount += 1;
  }

  return createdCount;
}

export async function seedValidationNodeDemo(): Promise<GalleyActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase environment variables are not configured." };
  }
  try {
    const existingAccounts = await listClientAccounts();
    let createdDeliverables = 0;

    for (const name of MOCK_CLIENT_NAMES) {
      const mock = createMockClientAccount(name);
      let account = existingAccounts.find((candidate) => candidate.name === name);
      if (!account) {
        account = await createClientAccount({
          name: mock.name,
          website: mock.website,
          industry: mock.industry,
          targetAudience: mock.targetAudience,
          primaryOffer: mock.primaryOffer,
        });
        await appendEvent({
          accountId: account.id,
          actorType: "system",
          actorLabel: "Galley demo seed",
          type: "client_account.created",
          subjectRef: account.id,
          payload: { name: account.name, website: account.website },
        });
        existingAccounts.push(account);
      }

      let playbook = await getLatestPlaybook(account.id);
      if (!playbook) {
        const definitionPlaybook = createMockPlaybook(mock);
        playbook = await createPlaybook({
          accountId: account.id,
          version: 1,
          voice: definitionPlaybook.voice,
          approvedClaims: definitionPlaybook.approvedClaims,
          forbiddenClaims: definitionPlaybook.forbiddenClaims,
          channels: definitionPlaybook.channels,
          reportingKpi: definitionPlaybook.reportingKpi,
        });
        await appendEvent({
          accountId: account.id,
          actorType: "system",
          actorLabel: "Galley demo seed",
          type: "playbook.created",
          subjectRef: account.id,
          payload: { playbookId: playbook.id, version: playbook.version },
        });
      }

      const accountDeliverables = await generateForAccount(account, playbook);
      createdDeliverables += accountDeliverables;
      if (accountDeliverables > 0) {
        await appendEvent({
          accountId: account.id,
          actorType: "system",
          actorLabel: "Galley demo seed",
          type: "demo.seeded",
          subjectRef: account.id,
          payload: { period: "2026-06", createdDeliverables: accountDeliverables },
        });
      }
    }

    revalidateValidationRoutes();
    return {
      ok: true,
      message: createdDeliverables > 0
        ? `Demo seeded with ${createdDeliverables} new deliverables.`
        : "Demo data is already seeded; no duplicates were created.",
    };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function generateMockDraftsForAccount(accountId: string): Promise<GalleyActionResult> {
  try {
    const account = (await listClientAccounts()).find((candidate) => candidate.id === accountId);
    if (!account) return { ok: false, message: "Client account not found." };
    const playbook = await getLatestPlaybook(account.id);
    if (!playbook) return { ok: false, message: "Create a client playbook before generating drafts." };
    const count = await generateForAccount(account, playbook);
    revalidateValidationRoutes();
    return { ok: true, message: count > 0 ? `${count} mock drafts generated and verified.` : "This account already has its demo deliverables." };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function approveDeliverableAction(deliverableId: string): Promise<GalleyActionResult> {
  try {
    const current = await getDeliverableWithCurrentDraft(deliverableId);
    if (current.deliverable.status !== "awaiting_proof" || current.verification?.result !== "pass") {
      return { ok: false, message: "Only a passed draft awaiting proof can be approved." };
    }
    const userId = await getAuthenticatedUserId();
    const approval = await createApproval({ deliverableId, action: "approve" });
    await appendEvent({
      accountId: current.deliverable.accountId,
      actorType: "human",
      actorLabel: "Authenticated reviewer",
      type: "approval.approved",
      subjectRef: deliverableId,
      payload: { approvalId: approval.id, userId, draftId: current.draft?.id },
    });
    await updateDeliverableStatus(deliverableId, "approved");
    await appendEvent({
      accountId: current.deliverable.accountId,
      actorType: "system",
      actorLabel: "Galley",
      type: "deliverable.status_changed",
      subjectRef: deliverableId,
      payload: { from: "awaiting_proof", to: "approved", approvalId: approval.id },
    });
    revalidateValidationRoutes();
    return { ok: true, message: "Human approval recorded. The deliverable is approved, not published." };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function editDeliverableAction(
  deliverableId: string,
  editContent: string,
): Promise<GalleyActionResult> {
  try {
    const content = editContent.trim();
    if (!content) return { ok: false, message: "Edited content cannot be empty." };
    const current = await getDeliverableWithCurrentDraft(deliverableId);
    if (current.deliverable.status !== "awaiting_proof" || !current.draft || !current.playbook) {
      return { ok: false, message: "Only a draft awaiting proof can be edited." };
    }
    const approval = await createApproval({
      deliverableId,
      action: "edit",
      editDiff: "Reviewer replaced the draft content at the proof gate.",
    });
    const draft = await createDraft({
      deliverableId,
      version: current.draft.version + 1,
      title: current.draft.title,
      content,
      model: "human-edit",
      playbookVersion: current.playbook.version,
    });
    await appendEvent({
      accountId: current.deliverable.accountId,
      actorType: "human",
      actorLabel: "Authenticated reviewer",
      type: "approval.edited",
      subjectRef: deliverableId,
      payload: { approvalId: approval.id, draftId: draft.id, draftVersion: draft.version, editDiff: approval.editDiff },
    });
    await updateDeliverableStatus(deliverableId, "verifying");

    const mockVerification = verifyMockDraft(draft, current.playbook);
    const verification = await createVerification({
      draftId: draft.id,
      result: mockVerification.result,
      reasons: mockVerification.reasons,
      rubricVersion: mockVerification.rubricVersion,
    });
    await appendEvent({
      accountId: current.deliverable.accountId,
      actorType: "verifier",
      actorLabel: "Galley verifier",
      type: verification.result === "pass" ? "verification.passed" : "verification.failed",
      subjectRef: deliverableId,
      payload: { verificationId: verification.id, draftId: draft.id, reasons: verification.reasons },
    });
    const finalStatus = verification.result === "pass" ? "awaiting_proof" : "escalated";
    await updateDeliverableStatus(deliverableId, finalStatus);
    if (finalStatus === "awaiting_proof") {
      await appendEvent({
        accountId: current.deliverable.accountId,
        actorType: "system",
        actorLabel: "Galley",
        type: "proof.awaiting",
        subjectRef: deliverableId,
        payload: { draftId: draft.id, verificationId: verification.id },
      });
    }
    await appendEvent({
      accountId: current.deliverable.accountId,
      actorType: "system",
      actorLabel: "Galley",
      type: "deliverable.status_changed",
      subjectRef: deliverableId,
      payload: { from: "verifying", to: finalStatus, draftId: draft.id },
    });
    revalidateValidationRoutes();
    return { ok: true, message: finalStatus === "awaiting_proof" ? "Edit and verifier result recorded. Draft v2 is awaiting proof." : "Edit recorded. The verifier escalated Draft v2." };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function rejectDeliverableAction(deliverableId: string): Promise<GalleyActionResult> {
  try {
    const current = await getDeliverableWithCurrentDraft(deliverableId);
    if (current.deliverable.status !== "awaiting_proof") {
      return { ok: false, message: "Only a draft awaiting proof can be rejected." };
    }
    const approval = await createApproval({
      deliverableId,
      action: "reject",
      editDiff: "Reviewer rejected this version at the proof gate.",
    });
    await appendEvent({
      accountId: current.deliverable.accountId,
      actorType: "human",
      actorLabel: "Authenticated reviewer",
      type: "approval.rejected",
      subjectRef: deliverableId,
      payload: { approvalId: approval.id, reason: approval.editDiff, draftId: current.draft?.id },
    });
    await updateDeliverableStatus(deliverableId, "rejected");
    await appendEvent({
      accountId: current.deliverable.accountId,
      actorType: "system",
      actorLabel: "Galley",
      type: "deliverable.status_changed",
      subjectRef: deliverableId,
      payload: { from: "awaiting_proof", to: "rejected", approvalId: approval.id },
    });
    revalidateValidationRoutes();
    return { ok: true, message: "Human rejection recorded. This deliverable will not move forward." };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function resetValidationNodeDemo(): Promise<GalleyActionResult> {
  try {
    await resetDemoValidationData();
    revalidateValidationRoutes();
    return { ok: true, message: "Generated demo work was reset. Append-only history was preserved." };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}
