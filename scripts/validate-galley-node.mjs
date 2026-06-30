import assert from "node:assert/strict";
import {
  approveDeliverable,
  buildRecordTimeline,
  createMockValidationState,
  editDeliverable,
  rejectDeliverable,
  verifyMockDraft,
} from "../lib/galley/mockValidationNode.ts";
import {
  assertApprovalBeforeScheduling,
  canScheduleDeliverable,
} from "../lib/galley/invariants.ts";

const state = createMockValidationState();

assert.equal(state.accounts.length, 4, "Expected four mock client accounts.");
assert.equal(state.playbooks.length, 4, "Expected one playbook per mock account.");
assert.equal(state.deliverables.length, 4, "Expected one generated deliverable per account.");
assert.equal(state.drafts.length, 4, "Expected one initial draft per deliverable.");

for (const draft of state.drafts) {
  const deliverable = state.deliverables.find((item) => item.id === draft.deliverableId);
  const playbook = state.playbooks.find((item) => item.accountId === deliverable?.accountId);
  assert.ok(deliverable && playbook, "Every draft must resolve to a deliverable and playbook.");
  const verification = verifyMockDraft(draft, playbook);
  assert.ok(["pass", "fail"].includes(verification.result), "Verification must return a known result.");
}

const proofReady = state.deliverables.filter((item) => item.status === "awaiting_proof");
assert.ok(proofReady.length >= 3, "Expected multiple deliverables at the human proof gate.");

const approvedResult = approveDeliverable(
  proofReady[0],
  undefined,
  "Validation reviewer",
  "2026-06-29T15:00:00.000Z",
);
assert.equal(approvedResult.deliverable.status, "approved");
assert.equal(approvedResult.approval.action, "approve");
assert.equal(approvedResult.event.type, "human.approved");

const rejectedResult = rejectDeliverable(
  proofReady[1],
  "Claim needs client confirmation.",
  undefined,
  "Validation reviewer",
  "2026-06-29T15:01:00.000Z",
);
assert.equal(rejectedResult.deliverable.status, "rejected");
assert.equal(rejectedResult.approval.action, "reject");
assert.equal(rejectedResult.event.type, "human.rejected");

const editableDraft = state.drafts.find(
  (draft) => draft.deliverableId === proofReady[2].id,
);
assert.ok(editableDraft, "Expected a draft for the editable deliverable.");
const editedResult = editDeliverable(
  proofReady[2],
  editableDraft,
  "Clarified the approved claim source.",
  `${editableDraft.content} Source note clarified.`,
  undefined,
  "Validation reviewer",
  "2026-06-29T15:02:00.000Z",
);
assert.equal(editedResult.deliverable.status, "verifying");
assert.equal(editedResult.draft.version, editableDraft.version + 1);
assert.equal(editedResult.approval.action, "edit");
assert.equal(editedResult.event.type, "human.edited");

const timeline = buildRecordTimeline(proofReady[0].id, [
  ...state.events,
  approvedResult.event,
  rejectedResult.event,
  editedResult.event,
]);
assert.equal(timeline.at(-1)?.type, "human.approved", "Approval must append to the selected record.");
assert.ok(
  timeline.every((record) => record.subjectRef === proofReady[0].id),
  "Record timeline must contain only the selected deliverable.",
);

assert.equal(
  canScheduleDeliverable(approvedResult.deliverable, [approvedResult.approval]),
  true,
  "An approved deliverable should satisfy the scheduling invariant.",
);
assert.equal(
  canScheduleDeliverable(rejectedResult.deliverable, [rejectedResult.approval]),
  false,
  "A rejection must not satisfy the scheduling invariant.",
);
assert.throws(
  () => assertApprovalBeforeScheduling(rejectedResult.deliverable, [rejectedResult.approval]),
  /recorded human approval/,
);

const lifecycleSample = [
  { ...approvedResult.deliverable, status: "scheduled" },
  rejectedResult.deliverable,
  editedResult.deliverable,
];
const approvals = [approvedResult.approval, rejectedResult.approval, editedResult.approval];
for (const deliverable of lifecycleSample) {
  if (deliverable.status === "scheduled" || deliverable.status === "published") {
    assertApprovalBeforeScheduling(deliverable, approvals);
  }
}

console.log(
  `Galley validation node passed: ${state.accounts.length} accounts, ${state.deliverables.length} deliverables, ${timeline.length} selected-record events.`,
);
