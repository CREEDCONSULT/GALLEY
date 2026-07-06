"use server";

import { revalidatePath } from "next/cache";
import { intakeDraft } from "@/lib/galley/convexData";

export type IntakeResult = {
  ok: boolean;
  message: string;
  deliverableId?: string;
};

export async function submitDraftAction(input: {
  accountId: string;
  title: string;
  type: string;
  channel: string;
  content: string;
}): Promise<IntakeResult> {
  const title = input.title.trim();
  const content = input.content.trim();
  if (!input.accountId) return { ok: false, message: "Choose a client account." };
  if (!title) return { ok: false, message: "Give the deliverable a title." };
  if (!content) return { ok: false, message: "Paste the draft content." };

  try {
    const { deliverableId, result } = await intakeDraft({
      accountId: input.accountId,
      title,
      type: input.type || "Draft",
      channel: input.channel,
      period: "2026-07",
      content,
      source: "External intake",
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/proof");
    revalidatePath("/dashboard/records");
    return {
      ok: true,
      deliverableId,
      message:
        result === "pass"
          ? "Verification passed. The draft is in the proof queue awaiting a human decision."
          : "The verifier found playbook violations and escalated this draft. See the record for evidence.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "The draft could not be submitted.",
    };
  }
}
