"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Check,
  CircleAlert,
  CircleX,
  Clock3,
  Eye,
  FileCheck2,
  PencilLine,
  ShieldCheck,
} from "lucide-react";

type Status = "Awaiting proof" | "Verifying" | "Approved" | "Scheduled" | "Rejected";
type Filter = "All" | Status;

type Deliverable = {
  id: string;
  title: string;
  client: string;
  type: string;
  channel: string;
  excerpt: string;
  verifier: string;
  verifierTone: "pass" | "running" | "flag";
  status: Status;
  received: string;
};

const filters: Filter[] = ["All", "Awaiting proof", "Verifying", "Approved", "Scheduled", "Rejected"];

const deliverables: Deliverable[] = [
  {
    id: "GLY-0218",
    title: "Barrier care launch page",
    client: "Glow Skincare",
    type: "Landing page",
    channel: "Website",
    excerpt: "A calmer approach to barrier care, built around what sensitive skin needs—and nothing it does not.",
    verifier: "Passed with 1 source note",
    verifierTone: "pass",
    status: "Awaiting proof",
    received: "09:42",
  },
  {
    id: "GLY-0219",
    title: "June member retention email",
    client: "Northshore Fitness",
    type: "Lifecycle email",
    channel: "Email",
    excerpt: "Your next month starts before the calendar turns. Here is the plan your coach prepared for the weeks ahead.",
    verifier: "Running 8 playbook checks",
    verifierTone: "running",
    status: "Verifying",
    received: "10:06",
  },
  {
    id: "GLY-0220",
    title: "Procurement operations guide",
    client: "Acme Corp",
    type: "Article",
    channel: "Resource center",
    excerpt: "A practical operating model for teams that need procurement controls without slowing every purchasing decision.",
    verifier: "Passed all playbook checks",
    verifierTone: "pass",
    status: "Approved",
    received: "10:18",
  },
  {
    id: "GLY-0221",
    title: "Founder story cutdown",
    client: "Day One",
    type: "Social post",
    channel: "LinkedIn",
    excerpt: "Day One began with a simple observation: the best routines are the ones people can actually keep.",
    verifier: "Passed all playbook checks",
    verifierTone: "pass",
    status: "Scheduled",
    received: "10:31",
  },
  {
    id: "GLY-0222",
    title: "Summer launch paid social",
    client: "Day One",
    type: "Paid social",
    channel: "Instagram",
    excerpt: "The only daily system you will ever need—guaranteed to change how you work from the first week.",
    verifier: "Blocked: forbidden absolute claim",
    verifierTone: "flag",
    status: "Rejected",
    received: "10:44",
  },
];

const statusStyles: Record<Status, string> = {
  "Awaiting proof": "border-status-awaiting-proof/40 bg-status-awaiting-proof/5 text-status-awaiting-proof",
  Verifying: "border-status-verifying/40 bg-status-verifying/5 text-status-verifying",
  Approved: "border-status-approved/40 bg-status-approved/5 text-status-approved",
  Scheduled: "border-status-scheduled/40 bg-status-scheduled/5 text-status-scheduled",
  Rejected: "border-status-rejected/40 bg-status-rejected/5 text-status-rejected",
};

const verifierStyles = {
  pass: "text-success",
  running: "text-proof-blue",
  flag: "text-danger",
};

export default function ProofQueuePage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Awaiting proof");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, Status>>({});
  const [notice, setNotice] = useState("");

  const rows = useMemo(
    () => deliverables
      .map((item) => ({ ...item, status: statusOverrides[item.id] ?? item.status }))
      .filter((item) => activeFilter === "All" || item.status === activeFilter),
    [activeFilter, statusOverrides],
  );

  const decide = (item: Deliverable, status: Status, message: string) => {
    setStatusOverrides((current) => ({ ...current, [item.id]: status }));
    setNotice(`${item.title}: ${message}`);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="border-b border-border pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Human approval gate</p>
            <h1 className="editorial-display mt-4 text-5xl md:text-6xl">Proof Queue</h1>
            <p className="mt-4 max-w-2xl leading-7 text-muted">Drafts checked against the client playbook. A human decision is required before anything advances.</p>
          </div>
          <div className="flex items-center gap-3 border border-success/30 bg-success/5 px-4 py-3 text-xs text-success">
            <ShieldCheck size={15} /> Nothing publishes without approval
          </div>
        </div>

        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-border" aria-label="Proof queue filters">
          {filters.map((filter) => {
            const active = filter === activeFilter;
            const count = filter === "All"
              ? deliverables.length
              : deliverables.filter((item) => (statusOverrides[item.id] ?? item.status) === filter).length;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={active}
                className={`shrink-0 border-b-2 px-4 py-3 text-xs transition-colors ${active ? "border-primary text-foreground" : "border-transparent text-slate hover:text-ink-soft"}`}
              >
                {filter} <span className="ml-1 font-mono text-[9px]">{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      <p role="status" aria-live="polite" className={`mt-5 min-h-5 text-xs ${notice ? "text-primary-strong" : "text-transparent"}`}>
        {notice || "No action taken"}
      </p>

      <div className="mt-2 border border-border bg-surface">
        <div className="hidden grid-cols-[1.35fr_0.8fr_0.9fr_0.82fr_auto] gap-5 border-b border-border bg-[#0d0d0c] px-6 py-3 font-mono text-[9px] uppercase tracking-wider text-slate lg:grid">
          <span>Deliverable</span><span>Client</span><span>Verifier</span><span>Status</span><span className="text-right">Actions</span>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <FileCheck2 size={24} className="mx-auto text-primary" />
            <h2 className="mt-5 text-lg font-semibold">No drafts awaiting proof.</h2>
            <p className="mt-2 text-sm text-muted">When a draft passes verification, it will appear here for human approval.</p>
          </div>
        ) : rows.map((item) => {
          const canApprove = item.status === "Awaiting proof";
          return (
            <article key={item.id} className="grid gap-5 border-b border-border px-6 py-6 last:border-0 lg:grid-cols-[1.35fr_0.8fr_0.9fr_0.82fr_auto] lg:items-center">
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate">{item.id} · {item.received}</p>
                <h2 className="mt-2 font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-xs text-muted">{item.type} · {item.channel}</p>
                <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-slate">“{item.excerpt}”</p>
              </div>

              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-slate lg:hidden">Client</p>
                <p className="text-sm font-medium text-ink-soft">{item.client}</p>
              </div>

              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-slate lg:hidden">Verifier</p>
                <p className={`flex items-start gap-2 text-xs leading-5 ${verifierStyles[item.verifierTone]}`}>
                  {item.verifierTone === "pass" ? <Check size={14} className="mt-0.5 shrink-0" /> : item.verifierTone === "running" ? <Clock3 size={14} className="mt-0.5 shrink-0" /> : <CircleAlert size={14} className="mt-0.5 shrink-0" />}
                  {item.verifier}
                </p>
              </div>

              <div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-slate lg:hidden">Status</p>
                <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider ${statusStyles[item.status]}`}>
                  {item.status === "Awaiting proof" && <Eye size={11} />}
                  {item.status === "Verifying" && <Clock3 size={11} />}
                  {item.status === "Approved" && <Check size={11} />}
                  {item.status === "Scheduled" && <CalendarClock size={11} />}
                  {item.status === "Rejected" && <CircleX size={11} />}
                  {item.status}
                </span>
              </div>

              <div className="lg:w-52">
                {canApprove ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => decide(item, "Approved", "approved for the next stage")} className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 bg-foreground px-3 py-2 text-xs font-semibold text-background transition-colors hover:bg-primary-strong"><Check size={14} /> Approve draft</button>
                    <button type="button" onClick={() => decide(item, "Awaiting proof", "edit requested")} className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-border px-3 py-2 text-[11px] text-muted transition-colors hover:border-proof-blue/50 hover:text-foreground"><PencilLine size={13} /> Edit</button>
                    <button type="button" onClick={() => decide(item, "Rejected", "rejected by reviewer")} className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-border px-3 py-2 text-[11px] text-muted transition-colors hover:border-danger/50 hover:text-danger"><CircleX size={13} /> Reject</button>
                    <Link href="/dashboard/records" className="col-span-2 inline-flex min-h-9 items-center justify-center gap-1.5 border border-border px-3 py-2 text-[11px] font-medium text-proof-blue transition-colors hover:border-proof-blue/50 hover:text-foreground"><Eye size={13} /> View record</Link>
                  </div>
                ) : (
                  <div className="border-l border-border pl-4 lg:text-right">
                    <p className="text-xs leading-5 text-slate">
                      {item.status === "Verifying" && "Verification must finish before proof."}
                      {item.status === "Approved" && "Human decision recorded."}
                      {item.status === "Scheduled" && "Cleared by proof and queued in the prototype."}
                      {item.status === "Rejected" && "Stopped by a recorded reviewer decision."}
                    </p>
                    <Link href="/dashboard/records" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-proof-blue hover:text-foreground"><Eye size={13} /> View record</Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 border-t border-border pt-6 text-xs leading-5 text-slate">Static prototype data. Actions update this browser session only and do not generate, schedule, or publish content.</p>
    </div>
  );
}
