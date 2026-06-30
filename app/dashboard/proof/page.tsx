import Link from "next/link";
import { Check, CircleAlert, Clock3, Eye, FileCheck2, ShieldCheck } from "lucide-react";
import { DemoControls } from "@/components/galley/DemoControls";
import { ProofActions } from "@/components/galley/ProofActions";
import { getDeliverableWithCurrentDraft, isSupabaseConfigured, listDeliverables } from "@/lib/galley/repository";
import type { DeliverableStatus } from "@/lib/galley/types";

export const dynamic = "force-dynamic";
type Filter = "all" | DeliverableStatus;
const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" }, { value: "awaiting_proof", label: "Awaiting proof" },
  { value: "verifying", label: "Verifying" }, { value: "approved", label: "Approved" },
  { value: "escalated", label: "Escalated" }, { value: "rejected", label: "Rejected" },
];
const labels: Record<DeliverableStatus, string> = { drafting: "Drafting", verifying: "Verifying", awaiting_proof: "Awaiting proof", approved: "Approved", scheduled: "Scheduled", published: "Published", rejected: "Rejected", escalated: "Escalated" };
const styles: Record<DeliverableStatus, string> = { drafting: "text-slate", verifying: "text-proof-blue", awaiting_proof: "text-warning", approved: "text-success", scheduled: "text-proof-blue", published: "text-success", rejected: "text-danger", escalated: "text-danger" };

export default async function ProofQueuePage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const configured = isSupabaseConfigured();
  const requested = (await searchParams).status ?? "awaiting_proof";
  const active: Filter = filters.some((item) => item.value === requested) ? requested as Filter : "awaiting_proof";
  let error = "";
  let all = [] as Awaited<ReturnType<typeof listDeliverables>>;
  if (configured) try { all = await listDeliverables(); } catch (cause) { error = cause instanceof Error ? cause.message : "Unable to load the proof queue."; }
  const rows = all.filter((item) => active === "all" || item.status === active);
  const details = await Promise.all(rows.map((item) => getDeliverableWithCurrentDraft(item.id)));

  return <div className="mx-auto max-w-7xl">
    <header className="border-b border-border pb-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="eyebrow">Human approval gate</p><h1 className="editorial-display mt-4 text-5xl md:text-6xl">Proof Queue</h1><p className="mt-4 max-w-2xl leading-7 text-muted">Drafts that passed verification and are awaiting human approval. Nothing advances autonomously.</p></div>
        <div className="flex items-center gap-3 border border-success/30 bg-success/5 px-4 py-3 text-xs text-success"><ShieldCheck size={15} /> Human decision required</div>
      </div>
      <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-border" aria-label="Proof queue filters">
        {filters.map((filter) => <Link key={filter.value} href={filter.value === "awaiting_proof" ? "/dashboard/proof" : `/dashboard/proof?status=${filter.value}`} className={`shrink-0 border-b-2 px-4 py-3 text-xs ${active === filter.value ? "border-primary text-foreground" : "border-transparent text-slate"}`}>{filter.label} <span className="ml-1 font-mono text-[9px]">{filter.value === "all" ? all.length : all.filter((item) => item.status === filter.value).length}</span></Link>)}
      </nav>
    </header>

    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_18rem]"><div>
      {(!configured || error) && <section className="border border-warning/30 bg-warning/5 p-6"><h2 className="font-semibold">Persistence setup required</h2><p className="mt-2 text-sm leading-6 text-muted">{error || "Add the public Supabase URL and anonymous key, apply the Galley migrations, then sign in to load persisted work."}</p></section>}
      {configured && !error && rows.length === 0 && <section className="border border-border bg-surface px-6 py-20 text-center"><FileCheck2 size={24} className="mx-auto text-primary" /><h2 className="mt-5 text-lg font-semibold">No deliverables in this state.</h2><p className="mt-2 text-sm text-muted">Seed the local demo or choose another queue state.</p></section>}
      {details.length > 0 && <div className="border border-border bg-surface"><div className="hidden grid-cols-[1.2fr_.7fr_1fr_.65fr_auto] gap-5 border-b border-border px-6 py-3 font-mono text-[9px] uppercase tracking-wider text-slate lg:grid"><span>Deliverable</span><span>Client</span><span>Verifier evidence</span><span>Status</span><span>Human action</span></div>
        {details.map(({ deliverable, account, playbook, draft, verification }) => { const canProof = deliverable.status === "awaiting_proof" && verification?.result === "pass"; return <article key={deliverable.id} className="grid gap-5 border-b border-border px-6 py-6 last:border-0 lg:grid-cols-[1.2fr_.7fr_1fr_.65fr_auto] lg:items-center">
          <div className="min-w-0"><p className="font-mono text-[9px] uppercase tracking-wider text-slate">Draft v{draft?.version ?? 0} · {deliverable.channel}</p><h2 className="mt-2 font-semibold">{deliverable.title}</h2><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate">“{draft?.content ?? "Draft unavailable."}”</p></div>
          <div><p className="text-sm font-medium text-ink-soft">{account.name}</p><p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-slate">Playbook v{playbook?.version ?? "—"}</p></div>
          <div><p className={`flex items-center gap-2 text-xs font-medium ${verification?.result === "pass" ? "text-success" : verification?.result === "fail" ? "text-danger" : "text-proof-blue"}`}>{verification?.result === "pass" ? <Check size={14}/> : verification?.result === "fail" ? <CircleAlert size={14}/> : <Clock3 size={14}/>} {verification?.result === "pass" ? "Passed" : verification?.result === "fail" ? "Failed" : "Pending"}</p><ul className="mt-2 space-y-1 text-[11px] leading-4 text-slate">{(verification?.reasons ?? ["No result attached."]).slice(0,2).map((reason) => <li key={reason}>— {reason}</li>)}</ul></div>
          <span className={`w-fit border border-current/30 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider ${styles[deliverable.status]}`}>{labels[deliverable.status]}</span>
          <div>{canProof ? <ProofActions deliverableId={deliverable.id} draftContent={draft?.content ?? ""}/> : <p className="max-w-48 text-xs leading-5 text-slate">{deliverable.status === "escalated" ? "Verifier failure needs attention." : "The recorded state does not permit a proof decision."}</p>}<Link href={`/dashboard/records?deliverable=${deliverable.id}`} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-proof-blue"><Eye size={13}/> View record</Link></div>
        </article>; })}
      </div>}
    </div><DemoControls enabled={configured && !error}/></div>
    <p className="mt-6 border-t border-border pt-6 text-xs leading-5 text-slate">Persisted validation-node foundation. Mock production and verification only; scheduling and publishing remain unavailable.</p>
  </div>;
}
