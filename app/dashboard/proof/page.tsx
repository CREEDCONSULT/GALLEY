"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  CircleAlert,
  CircleX,
  Clock3,
  Eye,
  FileCheck2,
  PencilLine,
  ShieldCheck,
} from "lucide-react";
import { useGalleyValidation } from "@/components/galley/GalleyValidationProvider";
import type { Deliverable, DeliverableStatus } from "@/lib/galley/types";

type Filter = "all" | DeliverableStatus;

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "awaiting_proof", label: "Awaiting proof" },
  { value: "verifying", label: "Verifying" },
  { value: "approved", label: "Approved" },
  { value: "escalated", label: "Escalated" },
  { value: "rejected", label: "Rejected" },
];

const statusLabels: Record<DeliverableStatus, string> = {
  drafting: "Drafting",
  verifying: "Verifying",
  awaiting_proof: "Awaiting proof",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  rejected: "Rejected",
  escalated: "Escalated",
};

const statusStyles: Record<DeliverableStatus, string> = {
  drafting: "border-status-drafting/40 bg-status-drafting/5 text-status-drafting",
  verifying: "border-status-verifying/40 bg-status-verifying/5 text-status-verifying",
  awaiting_proof: "border-status-awaiting-proof/40 bg-status-awaiting-proof/5 text-status-awaiting-proof",
  approved: "border-status-approved/40 bg-status-approved/5 text-status-approved",
  scheduled: "border-status-scheduled/40 bg-status-scheduled/5 text-status-scheduled",
  published: "border-status-published/40 bg-status-published/5 text-status-published",
  rejected: "border-status-rejected/40 bg-status-rejected/5 text-status-rejected",
  escalated: "border-status-escalated/40 bg-status-escalated/5 text-status-escalated",
};

function timeLabel(isoDate: string): string {
  return isoDate.slice(11, 16);
}

function StatusIcon({ status }: { status: DeliverableStatus }) {
  if (status === "awaiting_proof") return <Eye size={11} />;
  if (status === "verifying" || status === "drafting") return <Clock3 size={11} />;
  if (status === "approved" || status === "scheduled" || status === "published") return <Check size={11} />;
  return <CircleX size={11} />;
}

export default function ProofQueuePage() {
  const {
    accounts,
    playbooks,
    deliverables,
    drafts,
    verifications,
    approve,
    edit,
    reject,
    selectDeliverable,
  } = useGalleyValidation();
  const [activeFilter, setActiveFilter] = useState<Filter>("awaiting_proof");
  const [notice, setNotice] = useState("");

  const rows = useMemo(
    () => deliverables.filter(
      (deliverable) => activeFilter === "all" || deliverable.status === activeFilter,
    ),
    [activeFilter, deliverables],
  );

  const countFor = (filter: Filter) =>
    filter === "all"
      ? deliverables.length
      : deliverables.filter((deliverable) => deliverable.status === filter).length;

  const latestDraftFor = (deliverableId: string) =>
    drafts
      .filter((draft) => draft.deliverableId === deliverableId)
      .sort((left, right) => right.version - left.version)[0];

  const takeAction = (
    deliverable: Deliverable,
    action: "approve" | "edit" | "reject",
  ) => {
    selectDeliverable(deliverable.id);
    if (action === "approve") {
      approve(deliverable.id);
      setNotice(`${deliverable.title}: human approval recorded. The version is cleared for a future scheduling step.`);
    } else if (action === "edit") {
      edit(deliverable.id);
      setNotice(`${deliverable.title}: edit recorded. Draft v2 returned to verification.`);
    } else {
      reject(deliverable.id);
      setNotice(`${deliverable.title}: rejection recorded. The deliverable will not move forward.`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="border-b border-border pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Human approval gate</p>
            <h1 className="editorial-display mt-4 text-5xl md:text-6xl">Proof Queue</h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted">Drafts checked against the active client playbook. A recorded human decision is required before anything advances.</p>
          </div>
          <div className="flex items-center gap-3 border border-success/30 bg-success/5 px-4 py-3 text-xs text-success">
            <ShieldCheck size={15} /> Nothing publishes without approval
          </div>
        </div>

        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-border" aria-label="Proof queue filters">
          {filters.map((filter) => {
            const active = filter.value === activeFilter;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={active}
                className={`shrink-0 border-b-2 px-4 py-3 text-xs transition-colors ${active ? "border-primary text-foreground" : "border-transparent text-slate hover:text-ink-soft"}`}
              >
                {filter.label} <span className="ml-1 font-mono text-[9px]">{countFor(filter.value)}</span>
              </button>
            );
          })}
        </div>
      </header>

      <p role="status" aria-live="polite" className={`mt-5 min-h-5 text-xs ${notice ? "text-primary-strong" : "text-transparent"}`}>
        {notice || "No proof action taken"}
      </p>

      <div className="mt-2 border border-border bg-surface">
        <div className="hidden grid-cols-[1.25fr_0.72fr_1.05fr_0.72fr_auto] gap-5 border-b border-border bg-[#0d0d0c] px-6 py-3 font-mono text-[9px] uppercase tracking-wider text-slate lg:grid">
          <span>Deliverable</span><span>Client</span><span>Verifier evidence</span><span>Status</span><span className="text-right">Human action</span>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <FileCheck2 size={24} className="mx-auto text-primary" />
            <h2 className="mt-5 text-lg font-semibold">No deliverables in this state.</h2>
            <p className="mt-2 text-sm text-muted">The queue updates as mock drafts are verified and human decisions are recorded.</p>
          </div>
        ) : rows.map((deliverable) => {
          const account = accounts.find((candidate) => candidate.id === deliverable.accountId);
          const playbook = playbooks.find((candidate) => candidate.accountId === deliverable.accountId);
          const draft = latestDraftFor(deliverable.id);
          const verification = draft
            ? verifications.find((candidate) => candidate.draftId === draft.id)
            : undefined;
          const canProof = deliverable.status === "awaiting_proof" && verification?.result === "pass";
          const verificationReasons = verification?.reasons ?? [
            deliverable.status === "verifying"
              ? "Human edit recorded; this version needs a new verifier run."
              : "No verifier result is attached to the latest draft.",
          ];

          return (
            <article key={deliverable.id} className="grid gap-5 border-b border-border px-6 py-6 last:border-0 lg:grid-cols-[1.25fr_0.72fr_1.05fr_0.72fr_auto] lg:items-center">
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate">{deliverable.id} · {timeLabel(deliverable.updatedAt)}</p>
                <h2 className="mt-2 font-semibold text-foreground">{deliverable.title}</h2>
                <p className="mt-1 text-xs text-muted">{deliverable.type} · {deliverable.channel} · Draft v{draft?.version ?? 0}</p>
                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-slate">“{draft?.content ?? "Draft unavailable."}”</p>
              </div>

              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-slate lg:hidden">Client</p>
                <p className="text-sm font-medium text-ink-soft">{account?.name ?? "Unknown account"}</p>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-slate">Playbook v{playbook?.version ?? "—"}</p>
              </div>

              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-slate lg:hidden">Verifier evidence</p>
                <p className={`flex items-center gap-2 text-xs font-medium ${verification?.result === "pass" ? "text-success" : verification?.result === "fail" ? "text-danger" : "text-proof-blue"}`}>
                  {verification?.result === "pass" ? <Check size={14} /> : verification?.result === "fail" ? <CircleAlert size={14} /> : <Clock3 size={14} />}
                  {verification?.result === "pass" ? "Passed" : verification?.result === "fail" ? "Failed" : "Re-verification required"}
                </p>
                <ul className="mt-2 space-y-1 text-[11px] leading-4 text-slate">
                  {verificationReasons.slice(0, 2).map((reason) => <li key={reason}>— {reason}</li>)}
                </ul>
              </div>

              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-slate lg:hidden">Status</p>
                <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider ${statusStyles[deliverable.status]}`}>
                  <StatusIcon status={deliverable.status} />
                  {statusLabels[deliverable.status]}
                </span>
              </div>

              <div className="lg:w-52">
                {canProof ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => takeAction(deliverable, "approve")} className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 bg-foreground px-3 py-2 text-xs font-semibold text-background transition-colors hover:bg-primary-strong"><Check size={14} /> Approve draft</button>
                    <button type="button" onClick={() => takeAction(deliverable, "edit")} className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-border px-3 py-2 text-[11px] text-muted transition-colors hover:border-proof-blue/50 hover:text-foreground"><PencilLine size={13} /> Edit</button>
                    <button type="button" onClick={() => takeAction(deliverable, "reject")} className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-border px-3 py-2 text-[11px] text-muted transition-colors hover:border-danger/50 hover:text-danger"><CircleX size={13} /> Reject</button>
                    <Link href="/dashboard/records" onClick={() => selectDeliverable(deliverable.id)} className="col-span-2 inline-flex min-h-9 items-center justify-center gap-1.5 border border-border px-3 py-2 text-[11px] font-medium text-proof-blue transition-colors hover:border-proof-blue/50 hover:text-foreground"><Eye size={13} /> View record</Link>
                  </div>
                ) : (
                  <div className="border-l border-border pl-4 lg:text-right">
                    <p className="text-xs leading-5 text-slate">
                      {deliverable.status === "verifying" && "Verification must finish before proof."}
                      {deliverable.status === "approved" && "Human approval is in the record."}
                      {deliverable.status === "rejected" && "Stopped by a human rejection."}
                      {deliverable.status === "escalated" && "Verifier failure requires human attention."}
                      {deliverable.status === "drafting" && "Draft production is still in progress."}
                      {deliverable.status === "scheduled" && "Scheduling is not implemented in Phase 2."}
                      {deliverable.status === "published" && "Publishing is not implemented in Phase 2."}
                    </p>
                    <Link href="/dashboard/records" onClick={() => selectDeliverable(deliverable.id)} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-proof-blue hover:text-foreground"><Eye size={13} /> View record</Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 border-t border-border pt-6 text-xs leading-5 text-slate">Local Phase 2 state only. Mock generation, verification, proof decisions, and events are connected; scheduling and publishing remain unavailable.</p>
    </div>
  );
}
