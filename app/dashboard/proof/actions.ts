"use server";

import { revalidatePath } from "next/cache";
import {
  isBackendConfigured,
  recordProofDecision,
  resetDemo,
  seedDemo,
} from "@/lib/galley/convexData";
import { RUBRIC_VERSION } from "@/lib/galley/verifier";

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

export async function seedValidationNodeDemo(): Promise<GalleyActionResult> {
  if (!isBackendConfigured()) {
    return { ok: false, message: "Convex environment variables are not configured." };
  }
  try {
    const { created } = await seedDemo();
    revalidateValidationRoutes();
    return {
      ok: true,
      message:
        created > 0
          ? `Demo seeded with ${created} new deliverables, verified by ${RUBRIC_VERSION}.`
          : "Demo data is already seeded; no duplicates were created.",
    };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function resetValidationNodeDemo(): Promise<GalleyActionResult> {
  try {
    await resetDemo();
    revalidateValidationRoutes();
    return { ok: true, message: "Generated demo work was reset. Append-only history was preserved." };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function approveDeliverableAction(deliverableId: string): Promise<GalleyActionResult> {
  try {
    await recordProofDecision({ deliverableId, action: "approve" });
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
    const outcome = await recordProofDecision({
      deliverableId,
      action: "edit",
      editContent: content,
    });
    revalidateValidationRoutes();
    return {
      ok: true,
      message:
        outcome.status === "awaiting_proof"
          ? `Edit recorded. Draft v${outcome.draftVersion} passed verification and is awaiting proof.`
          : `Edit recorded. The verifier escalated draft v${outcome.draftVersion}.`,
    };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}

export async function rejectDeliverableAction(deliverableId: string): Promise<GalleyActionResult> {
  try {
    await recordProofDecision({ deliverableId, action: "reject" });
    revalidateValidationRoutes();
    return { ok: true, message: "Human rejection recorded. This deliverable will not move forward." };
  } catch (error) {
    return { ok: false, message: messageFrom(error) };
  }
}
