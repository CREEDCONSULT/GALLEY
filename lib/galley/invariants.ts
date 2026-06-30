import type { Approval, Deliverable } from "./types.ts";

export function canScheduleDeliverable(
  deliverable: Deliverable,
  approvals: Approval[],
): boolean {
  return approvals.some(
    (approval) =>
      approval.deliverableId === deliverable.id &&
      approval.action === "approve",
  );
}

export function assertApprovalBeforeScheduling(
  deliverable: Deliverable,
  approvals: Approval[],
): void {
  if (!canScheduleDeliverable(deliverable, approvals)) {
    throw new Error(
      `Deliverable ${deliverable.id} cannot be scheduled or published without a recorded human approval.`,
    );
  }
}
