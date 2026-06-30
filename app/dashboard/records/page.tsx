"use client";

import {
  Check,
  CircleAlert,
  FileText,
  Fingerprint,
  PencilLine,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useGalleyValidation } from "@/components/galley/GalleyValidationProvider";
import { buildRecordTimeline } from "@/lib/galley/mockValidationNode";
import type { DeliverableStatus, Event } from "@/lib/galley/types";

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

function eventKind(type: Event["type"]): string {
  if (type.startsWith("playbook")) return "Source";
  if (type.startsWith("draft")) return "Draft";
  if (type.startsWith("verification")) return "Check";
  if (type.startsWith("human")) return "Decision";
  return "State";
}

function eventTitle(type: Event["type"]): string {
  return type
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).replaceAll("_", " "))
    .join(" · ");
}

function eventSummary(record: Event): string {
  if (record.type === "playbook.selected") {
    return `Playbook v${String(record.payload.playbookVersion ?? "—")} selected as the source of brand truth.`;
  }
  if (record.type === "draft.generated") {
    return `Draft v${String(record.payload.draftVersion ?? "—")} created by ${record.actorLabel}.`;
  }
  if (record.type === "verification.passed") {
    return "Voice, claims, channel, and playbook guardrails passed verification.";
  }
  if (record.type === "verification.failed") {
    const reasons = Array.isArray(record.payload.reasons) ? record.payload.reasons : [];
    return String(reasons[0] ?? "The verifier found a playbook violation.");
  }
  if (record.type === "deliverable.awaiting_proof") {
    return "Verification passed. This version entered the human approval gate.";
  }
  if (record.type === "human.approved") {
    return "A named reviewer approved this version for a future scheduling step.";
  }
  if (record.type === "human.edited") {
    return String(record.payload.editDiff ?? "A named reviewer edited the draft and returned it to verification.");
  }
  if (record.type === "human.rejected") {
    return String(record.payload.reason ?? "A named reviewer rejected this version.");
  }
  return "Lifecycle state recorded.";
}

function EventIcon({ record }: { record: Event }) {
  if (record.type.startsWith("verification")) {
    return record.type === "verification.passed" ? <ShieldCheck size={12} /> : <CircleAlert size={12} />;
  }
  if (record.type === "human.approved") return <Check size={12} />;
  if (record.type === "human.edited") return <PencilLine size={12} />;
  if (record.type === "human.rejected") return <CircleAlert size={12} />;
  if (record.type.startsWith("human")) return <UserCheck size={12} />;
  return <FileText size={12} />;
}

export default function RecordsPage() {
  const {
    accounts,
    playbooks,
    deliverables,
    drafts,
    verifications,
    approvals,
    events,
    selectedDeliverableId,
    selectDeliverable,
  } = useGalleyValidation();

  const selected = deliverables.find((item) => item.id === selectedDeliverableId) ?? deliverables[0];
  if (!selected) return null;

  const account = accounts.find((candidate) => candidate.id === selected.accountId);
  const playbook = playbooks.find((candidate) => candidate.accountId === selected.accountId);
  const selectedDrafts = drafts
    .filter((draft) => draft.deliverableId === selected.id)
    .sort((left, right) => right.version - left.version);
  const latestDraft = selectedDrafts[0];
  const verification = latestDraft
    ? verifications.find((candidate) => candidate.draftId === latestDraft.id)
    : undefined;
  const selectedApprovals = approvals.filter((approval) => approval.deliverableId === selected.id);
  const latestApproval = [...selectedApprovals].sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  )[0];
  const timeline = buildRecordTimeline(selected.id, events);

  const custody = [
    { label: "Source", value: `Playbook v${playbook?.version ?? "—"}` },
    { label: "Check", value: verification ? `Verifier ${verification.result}` : "Re-verification required" },
    { label: "Decision", value: latestApproval ? latestApproval.action : "Awaiting human" },
    { label: "Destination", value: "Not scheduled" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Append-only evidence</p>
        <h1 className="editorial-display mt-4 text-5xl md:text-6xl">Records</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">The event log is the source of truth. Every generated draft, verifier result, and human decision stays attached to its deliverable.</p>
      </header>

      <nav aria-label="Deliverable records" className="mt-7 flex gap-2 overflow-x-auto pb-1">
        {deliverables.map((deliverable) => {
          const deliverableAccount = accounts.find((candidate) => candidate.id === deliverable.accountId);
          const active = deliverable.id === selected.id;
          return (
            <button
              key={deliverable.id}
              type="button"
              onClick={() => selectDeliverable(deliverable.id)}
              aria-pressed={active}
              className={`min-w-48 shrink-0 border p-3 text-left transition-colors ${active ? "border-primary bg-primary/5" : "border-border bg-surface/40 hover:border-border-strong"}`}
            >
              <span className="block text-xs font-medium text-ink-soft">{deliverableAccount?.name ?? "Unknown account"}</span>
              <span className="mt-1 block truncate text-[11px] text-slate">{deliverable.title}</span>
            </button>
          );
        })}
      </nav>

      <section aria-label="Record custody summary" className="mt-6 grid grid-cols-2 border-l border-t border-border lg:grid-cols-4">
        {custody.map((item) => (
          <div key={item.label} className="border-b border-r border-border bg-surface/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate">{item.label}</p>
            <p className="mt-2 text-sm font-medium capitalize text-ink-soft">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
        <aside className="h-fit border border-border bg-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <Fingerprint size={20} className="text-primary" />
            <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${statusStyles[selected.status]}`}>{statusLabels[selected.status]}</span>
          </div>
          <p className="mt-6 font-mono text-[9px] uppercase tracking-wider text-slate">{selected.id}</p>
          <h2 className="mt-2 text-xl font-semibold">{account?.name ?? "Unknown account"}</h2>
          <p className="mt-1 text-sm text-muted">{selected.title}</p>
          <dl className="mt-7 space-y-4 border-t border-border pt-5 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate">Draft version</dt><dd className="text-ink-soft">v{latestDraft?.version ?? "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Playbook</dt><dd className="text-ink-soft">v{playbook?.version ?? "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Channel</dt><dd className="text-ink-soft">{selected.channel}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Events</dt><dd className="text-ink-soft">{timeline.length}</dd></div>
          </dl>
          <div className="mt-6 flex gap-3 border border-primary/30 bg-primary/5 p-4 text-xs leading-5 text-ink-soft">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
            Local Phase 2 state. Events append during this dashboard session and are not yet persisted to Supabase.
          </div>
        </aside>

        <section className="border border-border bg-[#0d0d0c] p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div><p className="eyebrow">Event timeline</p><h2 className="mt-2 text-lg font-semibold">{timeline.length} recorded events</h2></div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate">Subject / {selected.id}</span>
          </div>
          <ol className="mt-7">
            {timeline.map((record, index) => {
              const isDecision = record.type.startsWith("human");
              const isFailure = record.type === "verification.failed" || record.type === "human.rejected";
              return (
                <li key={record.id} className="grid grid-cols-[3rem_1.5rem_1fr] gap-3">
                  <span className="pt-1 font-mono text-[9px] text-slate">{record.createdAt.slice(11, 16)}</span>
                  <span className="flex flex-col items-center">
                    <span className={`flex h-6 w-6 items-center justify-center border ${isFailure ? "border-danger bg-danger/10 text-danger" : isDecision ? "border-success bg-success/10 text-success" : "border-border-strong text-primary"}`}><EventIcon record={record} /></span>
                    {index < timeline.length - 1 && <span className="min-h-20 w-px flex-1 bg-border" />}
                  </span>
                  <div className="pb-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-primary">{eventKind(record.type)}</p>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-slate">{record.actorType} · {record.actorLabel}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-ink-soft">{eventTitle(record.type)}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{eventSummary(record)}</p>
                    <p className="mt-2 break-all font-mono text-[8px] uppercase tracking-wider text-slate">Subject ref · {record.subjectRef}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
